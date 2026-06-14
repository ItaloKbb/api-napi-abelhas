# Normas de Desenvolvimento

## Visão Geral

Este documento estabelece as normas que todos os colaboradores do projeto **api-napi-abelhas** devem seguir para garantir consistência, manutenibilidade e qualidade do código.

O projeto adota os princípios **Clean Architecture**, **DRY**, **SOLID** e **Modular**. Para a descrição completa da arquitetura e das camadas (Controller, Service, DTO e Repository), consulte [06-arquitetura.md](./06-arquitetura.md).

---

## 1. Estrutura de Módulos

O projeto segue a arquitetura modular do NestJS, combinada com princípios Clean e SOLID. Cada domínio de negócio é encapsulado em um módulo próprio com quatro camadas bem definidas:

```
src/<nome-do-modulo>/
  <nome>.controller.ts   # Controller — rotas HTTP e validação de entrada
  <nome>.service.ts      # Service — regras de negócio
  <nome>.module.ts       # Module — declaração NestJS (providers + controllers)
  dto/
    create-<nome>.dto.ts  # DTO — schema Zod + tipo TypeScript para criação
    update-<nome>.dto.ts  # DTO — schema Zod + tipo TypeScript para atualização
```

O acesso ao banco de dados (Repository) é feito via `PrismaService`, um módulo global que não precisa ser importado individualmente.

Exemplos existentes: `producers`, `samples`, `analysis`, `abelhas`, `pontos-coleta`.

---

## 2. Nomenclatura

| Elemento               | Convenção               | Exemplo                        |
|------------------------|-------------------------|--------------------------------|
| Arquivos               | `kebab-case`            | `pontos-coleta.service.ts`     |
| Classes                | `PascalCase`            | `PontosColetaService`          |
| Variáveis e funções    | `camelCase`             | `findAll`, `createProdutor`    |
| Constantes globais     | `UPPER_SNAKE_CASE`      | `ROLES_KEY`, `JWKS_CACHE_TTL_MS` |
| Campos do Prisma/DB    | `camelCase`             | `nomeCientifico`, `cidadeId`   |
| Enums (Prisma)         | `UPPER_SNAKE_CASE`      | `CENTRO_OESTE`, `MATA_ATLANTICA` |

---

## 3. Rotas e Controllers

Os Controllers são a **camada de entrada HTTP** (Clean Architecture). Devem apenas mapear rotas para o Service, sem conter lógica de negócio.

- O decorator `@Controller()` deve receber o nome do recurso no plural e em inglês quando possível (ex.: `@Controller('producers')`, `@Controller('samples')`).
- Rotas seguem REST padrão:
  - `GET /recurso` → listar todos
  - `GET /recurso/:id` → buscar por ID
  - `POST /recurso` → criar
  - `PATCH /recurso/:id` → atualizar parcialmente
  - `DELETE /recurso/:id` → remover
- Todo controller que manipula dados sensíveis deve aplicar `@UseGuards(ClerkAuthGuard)` no nível da classe.

---

## 4. Serviços (Service) e Lógica de Negócio

Os Services são a **camada de regras de negócio** (Clean Architecture). Recebem dependências via injeção (SOLID — DIP) e nunca acessam detalhes de HTTP.

- A injeção do `PrismaService` (Repository) deve ser feita pelo construtor (`constructor(private prisma: PrismaService)`).
- Antes de qualquer operação de `update` ou `remove`, o serviço **deve** chamar `findOne(id)` para garantir que o recurso existe e lançar `NotFoundException` se não for encontrado.
- Métodos de serviço devem ser `async` e retornar diretamente o resultado do Prisma (sem wrappers desnecessários).

```typescript
// Padrão obrigatório para update/remove
async update(id: string, dto: UpdateFooDto) {
  await this.findOne(id); // garante existência antes de operar
  return this.prisma.foo.update({ where: { id }, data: dto });
}
```

---

## 5. Tratamento de Erros

- Use as exceções HTTP nativas do NestJS (`NotFoundException`, `BadRequestException`, `ForbiddenException`, etc.) nos serviços.
- O `AllExceptionsFilter` global (registrado no `main.ts`) captura **todas** as exceções:
  - **`HttpException`** → retorna o status code e body da exceção.
  - **`PrismaClientKnownRequestError`** → mapeado por código Prisma:
    - `P2002` → 409 Conflict (violação de unique)
    - `P2003` → 400 Bad Request (violação de foreign key)
    - `P2025` → 404 Not Found (registro não encontrado)
    - `P2014` → 400 Bad Request (violação de relação obrigatória)
    - `P2018` → 404 Not Found (registro relacionado não encontrado)
    - `P2000` → 400 Bad Request (valor longo demais para coluna)
  - **`PrismaClientValidationError`** → 400 Bad Request.
  - **`PrismaClientInitializationError`** → 503 Service Unavailable.
  - **Qualquer outra exceção** → retorna `500 Internal server error`, sem vazar stack trace ou detalhes internos.
- Erros 5xx são logados como `error` (com stack trace) e erros 4xx como `warn` via Pino.
- Formato padronizado de resposta de erro:

```json
{
  "statusCode": 404,
  "timestamp": "2026-03-19T12:00:00.000Z",
  "path": "/producers/123",
  "message": "Producer with id 123 not found"
}
```

- Nunca lance `Error` genérico em serviços — sempre use as classes de exceção do `@nestjs/common`.

---

## 5.1 Documentação da API (Swagger / OpenAPI)

A API conta com documentação interativa gerada automaticamente pelo `@nestjs/swagger`.

- **URL local**: `http://localhost:3000/api/docs`
- Configurada no `main.ts` via `DocumentBuilder` + `SwaggerModule`.
- O `addBearerAuth()` documenta a autenticação JWT nos endpoints protegidos.
- Para enriquecer a documentação, use decorators do Swagger nos Controllers:
  - `@ApiTags('producers')` — agrupa rotas.
  - `@ApiOperation({ summary: '...' })` — descreve a operação.
  - `@ApiBearerAuth()` — marca a rota como autenticada.
  - `@ApiResponse({ status: 200, description: '...' })` — documenta respostas.
- Em produção, considere desabilitar o Swagger com base em `NODE_ENV`.

---

## 6. Commits e Versionamento

- Use mensagens de commit em português ou inglês, curtas e descritivas.
- Prefixos recomendados seguindo Conventional Commits:
  - `feat:` — nova funcionalidade
  - `fix:` — correção de bug
  - `chore:` — tarefas de manutenção (deps, config)
  - `refactor:` — refatoração sem mudança de comportamento
  - `test:` — adição ou correção de testes
  - `docs:` — alterações em documentação

---

## 7. Testes

- Arquivos de teste unitário ficam junto ao arquivo testado: `*.spec.ts`.
- Testes E2E ficam em `test/` com sufixo `*.e2e-spec.ts`.
- Para rodar os testes:
  ```bash
  # Unitários
  npm test

  # Com cobertura
  npm run test:cov

  # E2E
  npm run test:e2e
  ```
- Cobertura mínima esperada: serviços (`*.service.ts`) devem ter testes unitários cobrindo os cenários de sucesso e `NotFoundException`.

---

## 8. Linting e Formatação

- Antes de qualquer push, execute:
  ```bash
  npm run lint    # ESLint com auto-fix
  npm run format  # Prettier
  ```
- O pipeline não aceita código com erros de lint.
- A configuração de lint está em `eslint.config.mjs` e a de formatação segue as regras do Prettier integrado ao ESLint (`eslint-plugin-prettier`).
