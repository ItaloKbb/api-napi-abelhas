# Wiki — api-napi-abelhas

Documentação técnica do projeto **api-napi-abelhas**, uma API REST para gerenciamento de amostras de abelhas, análises laboratoriais e produtores, desenvolvida com NestJS e TypeScript.

---

## Módulos da Wiki

| # | Documento | Conteúdo |
|---|-----------|----------|
| 1 | [Normas de Desenvolvimento](./01-normas-de-desenvolvimento.md) | Estrutura de módulos, nomenclatura, padrões de commits, testes e linting |
| 2 | [Padrões de Código](./02-padroes-de-codigo.md) | DTOs com Zod, padrões de controller/service/module, autenticação, cache e formatação |
| 3 | [Configurações de Ambiente](./03-configuracoes-de-ambiente.md) | Variáveis de ambiente, Docker Compose, Prisma e boas práticas de segurança |
| 4 | [Produção x Desenvolvimento](./04-producao-x-desenvolvimento.md) | Diferenças entre ambientes, scripts, banco, storage, checklist de deploy |
| 5 | [Justificativas de Ferramentas](./05-justificativas-de-ferramentas.md) | Por que NestJS, Prisma, Zod, Clerk, PostgreSQL, Redis, MinIO, Jest e mais |
| 6 | [Arquitetura](./06-arquitetura.md) | Princípios Clean, DRY, SOLID e Modular — definição das camadas Controller, Service, DTO e Repository |

---

## Stack Tecnológica

```
API           NestJS 11 + TypeScript 5
ORM           Prisma 7 (PostgreSQL 16)
Validação     Zod 4
Auth          Clerk (JWT / JWKS) + Passport
Cache         Redis 7 + @nestjs/cache-manager
Storage       MinIO (S3-compatível) + @aws-sdk/client-s3
Logger        Pino (nestjs-pino) — NDJSON estruturado
Docs API      Swagger / OpenAPI (@nestjs/swagger)
Infra local   Docker Compose
Testes        Jest + ts-jest + Supertest
Lint/Format   ESLint 9 + Prettier 3 + typescript-eslint
```

---

## Estrutura do Projeto

```
src/
├── app.module.ts              # Módulo raiz — registra todos os módulos
├── app.controller.ts          # Health check (GET /api/v1/health)
├── main.ts                    # Bootstrap da aplicação
├── config/
│   └── env.schema.ts          # Validação de variáveis de ambiente (Zod)
├── prisma/
│   └── prisma.service.ts      # Wrapper global do PrismaClient
├── common/                    # Compartilhado globalmente
│   ├── decorators/            # @CurrentUser(), @Roles()
│   ├── guards/                # ClerkAuthGuard, RolesGuard
│   ├── filters/               # AllExceptionsFilter — erros HTTP + Prisma + logging estruturado (Pino)
│   └── pipes/                 # ZodValidationPipe — validação de DTOs
├── auth/                      # Estratégia JWT Clerk + webhook
│   └── strategies/            # ClerkJwtStrategy (passport-jwt + JWKS)
├── storage/                   # Presigned URLs (MinIO/S3)
└── modules/                   # Módulos de domínio (futuro)
    ├── producers/             # CRUD de produtores
    ├── samples/               # CRUD de amostras
    ├── analysis/              # CRUD de análises
    └── ...                    # demais módulos
prisma/
└── schema.prisma              # Schema do banco de dados
docker-compose.yml             # PostgreSQL + Redis + MinIO
```

---

## Comandos Rápidos

```bash
# Desenvolvimento
npm run start:dev         # hot reload
npm run lint              # lint + fix
npm run format            # prettier
npm test                  # testes unitários
npm run test:cov          # cobertura

# Infraestrutura
docker compose up -d      # sobe PostgreSQL, Redis, MinIO
npx prisma migrate dev    # aplica migrações (dev)
npx prisma studio         # UI do banco

# Produção
npm run build
npm run start:prod
npx prisma migrate deploy
```
