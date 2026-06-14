# Padrões de Código

## Visão Geral

Este documento descreve os padrões técnicos concretos adotados no projeto **api-napi-abelhas** para garantir consistência entre todos os módulos.

---

## 1. TypeScript

- O projeto usa TypeScript com configuração estrita (`tsconfig.json`).
- **Evite `any` explícito** — a regra `@typescript-eslint/no-explicit-any` está desativada para casos legítimos, mas evite usá-la como atalho.
- Prefira `unknown` + type narrowing em vez de `any` quando o tipo não for conhecido.
- Use `type` para aliases de tipos e `interface` apenas quando extensão/herança for necessária.
- Importe tipos com `import type` para deixar explícito que é apenas uma importação de tipagem:

```typescript
import type { CreateProducerDto } from './dto/create-producer.dto';
```

---

## 2. DTOs com Zod

Cada DTO exporta um **schema Zod** e um **tipo TypeScript** inferido. Nunca use classes com decorators (`class-validator`) — o projeto usa exclusivamente Zod.

```typescript
// create-producer.dto.ts
import { z } from 'zod';

export const createProducerSchema = z.object({
  nome: z.string().min(1),
  cidadeId: z.string().optional(),
});

export type CreateProducerDto = z.infer<typeof createProducerSchema>;
```

O schema de atualização deve usar `.partial()` no schema de criação sempre que possível:

```typescript
// update-producer.dto.ts
import { createProducerSchema } from './create-producer.dto';

export const updateProducerSchema = createProducerSchema.partial();
export type UpdateProducerDto = z.infer<typeof updateProducerSchema>;
```

A validação é aplicada nos controllers via `ZodValidationPipe`:

```typescript
@Post()
create(
  @Body(new ZodValidationPipe(createProducerSchema)) dto: CreateProducerDto,
) {
  return this.producersService.create(dto);
}
```

---

## 3. Validação de Ambiente

As variáveis de ambiente são validadas na inicialização via Zod em `src/config/env.schema.ts`. Toda nova variável de ambiente **deve** ser declarada no schema antes de ser usada:

```typescript
export const envSchema = z.object({
  DATABASE_URL: z.string(),
  REDIS_HOST: z.string().default('localhost'),
  // ... adicione novas variáveis aqui
});

export type EnvConfig = z.infer<typeof envSchema>;
```

Para acessar variáveis de ambiente nos serviços, injete o `ConfigService`:

```typescript
constructor(private configService: ConfigService) {}

const valor = this.configService.get<string>('MINHA_VARIAVEL', 'default');
```

---

## 4. Padrão de Controller

```typescript
@Controller('recurso')
@UseGuards(ClerkAuthGuard)          // autenticação obrigatória no nível da classe
export class RecursoController {
  constructor(private readonly recursoService: RecursoService) {}

  @Post()
  create(@Body(new ZodValidationPipe(createRecursoSchema)) dto: CreateRecursoDto) {
    return this.recursoService.create(dto);
  }

  @Get()
  findAll() {
    return this.recursoService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.recursoService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body(new ZodValidationPipe(updateRecursoSchema)) dto: UpdateRecursoDto,
  ) {
    return this.recursoService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.recursoService.remove(id);
  }
}
```

---

## 5. Padrão de Service

```typescript
@Injectable()
export class RecursoService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateRecursoDto) {
    return this.prisma.recurso.create({ data: dto });
  }

  async findAll() {
    return this.prisma.recurso.findMany();
  }

  async findOne(id: string) {
    const recurso = await this.prisma.recurso.findUnique({ where: { id } });
    if (!recurso) {
      throw new NotFoundException(`Recurso with id ${id} not found`);
    }
    return recurso;
  }

  async update(id: string, dto: UpdateRecursoDto) {
    await this.findOne(id);
    return this.prisma.recurso.update({ where: { id }, data: dto });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.recurso.delete({ where: { id } });
  }
}
```

---

## 6. Padrão de Module

```typescript
@Module({
  controllers: [RecursoController],
  providers: [RecursoService],
  // exports: [RecursoService]  // apenas se outros módulos precisarem
})
export class RecursoModule {}
```

O `PrismaModule` é global e não precisa ser importado individualmente.

---

## 7. Autenticação e Autorização

### Autenticação (Clerk JWT)

Toda rota protegida usa `ClerkAuthGuard`:

```typescript
@UseGuards(ClerkAuthGuard)
```

O guard valida o JWT emitido pelo Clerk usando a chave pública obtida via JWKS. O JWKS é cacheado em memória por 1 hora (`JWKS_CACHE_TTL_MS = 3_600_000`).

### Autorização por Roles

Para restringir rotas a papéis específicos, combine `RolesGuard` com o decorator `@Roles`:

```typescript
@UseGuards(ClerkAuthGuard, RolesGuard)
@Roles('admin')
@Delete(':id')
remove(@Param('id') id: string) { ... }
```

O campo `role` é lido diretamente do payload JWT (`request.user.role`).

---

## 8. Storage (Arquivos)

O upload/download de arquivos **não é feito diretamente** pela API. O fluxo usa URLs pré-assinadas (presigned URLs) do MinIO/S3:

1. O cliente solicita uma presigned URL via `StorageService`.
2. O cliente faz o upload diretamente para o MinIO usando a URL assinada.
3. Para download, o cliente solicita outra presigned URL de leitura.

Chaves de arquivo geradas com `randomBytes` do módulo `crypto` nativo do Node.js para garantir unicidade sem colisões previsíveis.

---

## 9. Cache

O `CacheModule` é registrado globalmente em `AppModule` com TTL de 60 segundos. Para cachear respostas de um controller inteiro ou método específico, use o decorator `@CacheKey` / `@CacheInterceptor` do `@nestjs/cache-manager`.

---

## 10. Formatação e Estilo

- **Indentação**: 2 espaços (configurado pelo Prettier).
- **Semicolons**: obrigatórios.
- **Aspas**: simples para strings TypeScript.
- **Trailing comma**: habilitado.
- **End of line**: `auto` (compatível com Windows e Unix).
- **Max line length**: padrão Prettier (80 caracteres).
