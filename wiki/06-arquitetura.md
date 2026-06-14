# Arquitetura

## Visão Geral

O projeto **api-napi-abelhas** adota uma arquitetura **Clean**, **DRY**, **SOLID** e **Modular**, implementada sobre o framework NestJS. Cada módulo de domínio é autocontido e segue uma separação clara de responsabilidades em quatro camadas: **Controller**, **Service**, **DTO** e **Repository** (via `PrismaService`).

```
┌─────────────────────────────────────────────────────────┐
│                       HTTP Request                      │
└─────────────────────┬───────────────────────────────────┘
                      ▼
┌─────────────────────────────────────────────────────────┐
│  Controller          (entrada HTTP, validação via DTO)  │
└─────────────────────┬───────────────────────────────────┘
                      ▼
┌─────────────────────────────────────────────────────────┐
│  Service             (regras de negócio)                │
└─────────────────────┬───────────────────────────────────┘
                      ▼
┌─────────────────────────────────────────────────────────┐
│  Repository          (acesso a dados via PrismaService) │
└─────────────────────────────────────────────────────────┘
```

---

## 1. Princípios Arquiteturais

### 1.1 Clean Architecture

A arquitetura limpa garante que cada camada possua uma responsabilidade clara e que as dependências fluam de fora para dentro:

| Camada | Responsabilidade | Exemplo no Projeto |
|--------|------------------|--------------------|
| **Controller** | Receber requisições HTTP, aplicar validação de entrada e delegar ao Service | `ProducersController` |
| **Service** | Executar regras de negócio, validar existência de recursos e orquestrar operações | `ProducersService` |
| **DTO** | Definir e validar a forma dos dados de entrada/saída | `CreateProducerDto` (Zod) |
| **Repository** | Abstrair o acesso ao banco de dados | `PrismaService` (global) |

O Controller nunca acessa o banco diretamente. O Service nunca conhece detalhes de HTTP (headers, status codes). Cada camada depende apenas da camada imediatamente abaixo.

### 1.2 DRY (Don't Repeat Yourself)

O princípio DRY é aplicado de forma consistente:

| Aplicação | Como é implementado |
|-----------|---------------------|
| DTOs de atualização | Reutilizam o schema de criação via `.partial()` do Zod, eliminando duplicação de definições |
| `PrismaService` global | Um único módulo global de acesso a dados, compartilhado por todos os serviços |
| `ZodValidationPipe` | Pipe reutilizável que valida qualquer schema Zod, sem necessidade de pipes específicos por módulo |
| `HttpExceptionFilter` | Filtro global que padroniza todas as respostas de erro em um único lugar |
| Padrão CRUD nos Services | Todos os serviços seguem o mesmo contrato (`create`, `findAll`, `findOne`, `update`, `remove`) |

**Exemplo — reuso de schema no DTO de atualização:**
```typescript
// update-producer.dto.ts
import { createProducerSchema } from './create-producer.dto';

export const updateProducerSchema = createProducerSchema.partial();
export type UpdateProducerDto = z.infer<typeof updateProducerSchema>;
```

### 1.3 SOLID

Os cinco princípios SOLID orientam o design de classes e módulos:

#### S — Single Responsibility Principle (Responsabilidade Única)

Cada classe tem exatamente uma razão para mudar:

| Classe | Responsabilidade única |
|--------|------------------------|
| `ProducersController` | Mapear rotas HTTP para operações do service |
| `ProducersService` | Implementar regras de negócio de produtores |
| `PrismaService` | Gerenciar a conexão e o ciclo de vida do banco de dados |
| `ZodValidationPipe` | Validar payloads contra schemas Zod |
| `HttpExceptionFilter` | Formatar respostas de erro HTTP |

#### O — Open/Closed Principle (Aberto para Extensão, Fechado para Modificação)

Novos módulos de domínio são adicionados sem modificar os módulos existentes. Para adicionar um novo recurso (ex.: `laudos`), basta criar o módulo `laudos/` com seus respectivos Controller, Service e DTOs e registrá-lo no `AppModule`.

#### L — Liskov Substitution Principle (Substituição de Liskov)

Todos os serviços de domínio seguem o mesmo contrato de métodos (`create`, `findAll`, `findOne`, `update`, `remove`), garantindo comportamento previsível e substituível.

#### I — Interface Segregation Principle (Segregação de Interface)

Os DTOs são segregados por operação (`CreateProducerDto` para criação, `UpdateProducerDto` para atualização), cada um com apenas os campos necessários para aquela operação específica.

#### D — Dependency Inversion Principle (Inversão de Dependência)

Os serviços recebem suas dependências via **injeção de dependência** do NestJS (construtor), nunca instanciando diretamente. O `PrismaService` é injetado nos serviços, permitindo fácil substituição por mocks em testes.

```typescript
@Injectable()
export class ProducersService {
  constructor(private prisma: PrismaService) {} // dependência injetada
}
```

### 1.4 Modular

Cada domínio de negócio é encapsulado em um **módulo NestJS** autocontido:

```
src/<modulo>/
  <modulo>.module.ts        # Declaração do módulo (controllers + providers)
  <modulo>.controller.ts    # Camada de entrada HTTP
  <modulo>.service.ts       # Camada de regras de negócio
  dto/
    create-<modulo>.dto.ts  # Schema Zod + tipo para criação
    update-<modulo>.dto.ts  # Schema Zod + tipo para atualização
```

Módulos existentes: `producers`, `samples`, `analysis`, `abelhas`, `pontos-coleta`, `responsaveis`, `cidades-ibge`, `tipos-amostra`, `tipos-analise`, `storage`, `auth`.

Cada módulo pode ser desenvolvido, testado e mantido de forma independente.

---

## 2. Camadas em Detalhe

### 2.1 Controller

O Controller é a porta de entrada HTTP. Sua responsabilidade se limita a:

- Mapear rotas REST para métodos do Service
- Aplicar validação de entrada via `ZodValidationPipe`
- Aplicar autenticação e autorização via Guards (`ClerkAuthGuard`, `RolesGuard`)
- Delegar toda a lógica ao Service

**O Controller nunca deve:**
- Acessar o banco de dados diretamente
- Conter regras de negócio
- Manipular exceções (isso é feito pelo `HttpExceptionFilter` global)

```typescript
@Controller('producers')
@UseGuards(ClerkAuthGuard)
export class ProducersController {
  constructor(private readonly producersService: ProducersService) {}

  @Post()
  create(
    @Body(new ZodValidationPipe(createProducerSchema)) dto: CreateProducerDto,
  ) {
    return this.producersService.create(dto);
  }

  @Get()
  findAll() {
    return this.producersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.producersService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body(new ZodValidationPipe(updateProducerSchema)) dto: UpdateProducerDto,
  ) {
    return this.producersService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.producersService.remove(id);
  }
}
```

### 2.2 Service

O Service contém as **regras de negócio** do módulo. Sua responsabilidade inclui:

- Implementar a lógica de criação, leitura, atualização e remoção
- Validar a existência de recursos antes de operar (`findOne` antes de `update`/`remove`)
- Lançar exceções HTTP apropriadas (`NotFoundException`, `BadRequestException`)
- Acessar o banco de dados via `PrismaService` (camada de Repository)

**O Service nunca deve:**
- Conhecer detalhes de HTTP (headers, status codes, request/response)
- Validar schemas de entrada (isso é feito pelo DTO + Pipe no Controller)

```typescript
@Injectable()
export class ProducersService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateProducerDto) {
    return this.prisma.produtor.create({ data: dto });
  }

  async findAll() {
    return this.prisma.produtor.findMany();
  }

  async findOne(id: string) {
    const producer = await this.prisma.produtor.findUnique({ where: { id } });
    if (!producer) {
      throw new NotFoundException(`Produtor with id ${id} not found`);
    }
    return producer;
  }

  async update(id: string, dto: UpdateProducerDto) {
    await this.findOne(id);
    return this.prisma.produtor.update({ where: { id }, data: dto });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.produtor.delete({ where: { id } });
  }
}
```

### 2.3 DTO (Data Transfer Object)

Os DTOs definem a **forma dos dados** que entram e saem do sistema. No projeto, cada DTO exporta:

1. Um **schema Zod** — responsável pela validação em runtime
2. Um **tipo TypeScript** inferido — responsável pela segurança de tipos em compilação

**Responsabilidades do DTO:**
- Definir os campos obrigatórios e opcionais de cada operação
- Aplicar validações de formato (`.min()`, `.email()`, `.uuid()`, etc.)
- Servir como contrato entre Controller e Service

**O DTO nunca deve:**
- Conter lógica de negócio
- Acessar serviços ou o banco de dados

```typescript
// create-producer.dto.ts — schema de criação
import { z } from 'zod';

export const createProducerSchema = z.object({
  nome: z.string().min(1),
  cidadeId: z.string().optional(),
});

export type CreateProducerDto = z.infer<typeof createProducerSchema>;

// update-producer.dto.ts — reuso via .partial() (DRY)
import { createProducerSchema } from './create-producer.dto';

export const updateProducerSchema = createProducerSchema.partial();
export type UpdateProducerDto = z.infer<typeof updateProducerSchema>;
```

### 2.4 Repository (PrismaService)

O `PrismaService` atua como a **camada de Repository**, abstraindo todo o acesso ao banco de dados. Ele é um módulo global registrado uma única vez e injetado em todos os serviços.

**Responsabilidades:**
- Gerenciar a conexão com o PostgreSQL (connect/disconnect via lifecycle hooks)
- Expor os modelos do Prisma para queries type-safe
- Servir como ponto único de abstração do banco de dados

**O Repository nunca deve:**
- Conter regras de negócio
- Conhecer detalhes de HTTP ou validação de entrada

```typescript
@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  async onModuleInit() {
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
```

Ao injetar `PrismaService` nos serviços, o projeto aplica o princípio de **Inversão de Dependência** — os serviços dependem de uma abstração injetada, não de uma instância concreta criada diretamente.

---

## 3. Fluxo de uma Requisição

O diagrama abaixo mostra o percurso completo de uma requisição `POST /api/v1/producers`:

```
Cliente HTTP
   │
   ▼
Global Prefix (/api/v1)
   │
   ▼
ClerkAuthGuard         → Valida JWT (rejeita se inválido)
   │
   ▼
ProducersController
   │  @Body(ZodValidationPipe(createProducerSchema))
   │  → Valida o payload (rejeita se inválido)
   │
   ▼
ProducersService.create(dto)
   │  → Aplica regras de negócio
   │
   ▼
PrismaService (Repository)
   │  → prisma.produtor.create({ data: dto })
   │
   ▼
PostgreSQL
   │
   ▼
Resposta HTTP (201 Created)
```

Em caso de erro em qualquer etapa, o `AllExceptionsFilter` global intercepta a exceção, loga via Pino (5xx como `error`, 4xx como `warn`) e retorna uma resposta padronizada.

---

## 4. Resumo dos Princípios por Camada

| Camada | Clean | DRY | SOLID | Modular |
|--------|-------|-----|-------|---------|
| **Controller** | Só lida com HTTP | `ZodValidationPipe` reutilizável | SRP: apenas entrada HTTP | Declarado no módulo |
| **Service** | Só lida com negócio | Padrão CRUD consistente | SRP: regras de negócio; DIP: dependências injetadas | Declarado no módulo |
| **DTO** | Só define formato de dados | `.partial()` reutiliza schema | ISP: DTOs específicos por operação | Colocado dentro do módulo |
| **Repository** | Só lida com dados | `PrismaService` global compartilhado | SRP: acesso a dados; DIP: injetado nos serviços | Módulo global |
