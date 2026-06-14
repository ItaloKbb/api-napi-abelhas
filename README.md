# api-napi-abelhas

API RESTful desenvolvida com **NestJS + TypeScript** para a plataforma de gerenciamento de amostras laboratoriais do **NAPI Abelhas** (mel, pólen, própolis).

## 🏗️ Arquitetura

O projeto segue uma arquitetura **Clean**, **DRY**, **SOLID** e **Modular**, com separação clara de responsabilidades em quatro camadas:

| Camada | Responsabilidade | Princípios |
|--------|------------------|------------|
| **Controller** | Entrada HTTP, validação de payload via DTOs e delegação ao Service | SRP, Clean |
| **Service** | Regras de negócio, validação de existência e orquestração de operações | SRP, DIP, Clean |
| **DTO** | Definição e validação da forma dos dados com Zod (schema + tipo inferido) | ISP, DRY |
| **Repository** | Acesso ao banco de dados via `PrismaService` (módulo global) | SRP, DIP, DRY |

> 📖 Documentação completa: [wiki/06-arquitetura.md](./wiki/06-arquitetura.md)

## 🛠️ Stack Tecnológica

| Tecnologia | Papel |
|---|---|
| [NestJS](https://nestjs.com/) (TypeScript + Express) | Framework principal |
| [Prisma ORM](https://www.prisma.io/) | Acesso ao banco de dados com type-safety |
| [PostgreSQL 16](https://www.postgresql.org/) | Banco de dados relacional |
| [Redis 7](https://redis.io/) | Cache de alta performance |
| [MinIO](https://min.io/) | Object storage (S3-compatível) para laudos |
| [Clerk](https://clerk.com/) | Autenticação e IAM via JWT Guards |
| [Zod](https://zod.dev/) | Validação de payloads via Custom Pipes |
| [Pino](https://getpino.io/) + [nestjs-pino](https://github.com/iamolegga/nestjs-pino) | Logging estruturado JSON (NDJSON) — compatível com Docker, Loki/Grafana, ELK |
| [Swagger / OpenAPI](https://swagger.io/) | Documentação interativa da API em `/api/docs` |
| [Docker Compose](https://docs.docker.com/compose/) | Orquestração dos serviços de infraestrutura |

## 📦 Módulos

```
src/
├── auth/               # Autenticação (Clerk JWT + Webhooks)
│   ├── guards/         # ClerkAuthGuard, RolesGuard
│   ├── strategies/     # ClerkJwtStrategy (passport-jwt + JWKS)
│   └── decorators/     # @CurrentUser(), @Roles()
├── users/              # Gestão de usuários
├── producers/          # Produtores e apiários (com geolocalização)
├── samples/            # Amostras laboratoriais (check-in + rastreabilidade)
├── analysis/           # Análises e exames
├── storage/            # Pre-signed URLs para upload/download (MinIO)
├── prisma/             # PrismaService (módulo global)
├── config/             # Validação de variáveis de ambiente com Zod
└── common/
    ├── pipes/          # ZodValidationPipe
    └── filters/        # AllExceptionsFilter (erros HTTP + Prisma + logging)
```

## 🚀 Início Rápido

### Pré-requisitos

- Node.js >= 20.x (tested with 20.x / 24.x)
- Docker e Docker Compose

### 1. Configure as variáveis de ambiente

```bash
cp .env.example .env
# Edite .env com suas configurações do Clerk
```

### 2. Suba a infraestrutura com Docker

```bash
docker compose up -d
```

Isso sobe automaticamente:
- PostgreSQL na porta `5432`
- Redis na porta `6379`
- MinIO nas portas `9000` (API) e `9001` (Console)
- Container `createbuckets` que cria o bucket `napi-abelhas` automaticamente

### 3. Instale as dependências e execute as migrações

```bash
npm install
npx prisma migrate dev --name init
```

### 4. Inicie o servidor

```bash
# Desenvolvimento (hot-reload)
npm run start:dev

# Produção
npm run build
npm run start:prod
```

A API estará disponível em: `http://localhost:3000/api/v1`

## 🔐 Autenticação

A API usa **Clerk** como provedor de identidade. Todas as rotas protegidas exigem um token JWT válido no header:

```
Authorization: Bearer <clerk-jwt-token>
```

O Guard valida automaticamente a assinatura do JWT buscando as chaves públicas do endpoint JWKS do Clerk (com cache de 1h).

### Roles

| Role | Acesso |
|---|---|
| `ADMIN` | Acesso total |
| `TECHNICIAN` | CRUD de amostras e análises |
| `RESEARCHER` | Leitura |

### Webhook do Clerk

Configure o webhook no dashboard do Clerk apontando para:
```
POST /api/v1/webhook/clerk
```

Eventos suportados: `user.created`, `user.updated`, `user.deleted`

## 📡 Endpoints Principais

### Produtores
```
GET    /api/v1/producers        # Listar todos
POST   /api/v1/producers        # Criar
GET    /api/v1/producers/:id    # Buscar por id
PATCH  /api/v1/producers/:id    # Atualizar
DELETE /api/v1/producers/:id    # Remover
```

### Amostras
```
GET    /api/v1/samples          # Listar todas
POST   /api/v1/samples          # Check-in (gera código NAPI-YYYY-XXXXXX)
GET    /api/v1/samples/:id      # Buscar por id
PATCH  /api/v1/samples/:id      # Atualizar status
DELETE /api/v1/samples/:id      # Remover
```

### Análises
```
GET    /api/v1/analysis         # Listar todas
POST   /api/v1/analysis         # Criar análise
GET    /api/v1/analysis/:id     # Buscar por id
PATCH  /api/v1/analysis/:id     # Atualizar
DELETE /api/v1/analysis/:id     # Remover
```

### Storage (Pre-signed URLs)
```
POST   /api/v1/storage/upload-url    # Gerar URL para upload direto
POST   /api/v1/storage/download-url  # Gerar URL para download
```

### Usuários
```
GET    /api/v1/users            # Listar todos
GET    /api/v1/users/:id        # Buscar por id
PATCH  /api/v1/users/:id        # Atualizar
```

## 🗄️ Modelos de Dados

```
User          - Usuários sincronizados via Clerk webhooks
Producer      - Apicultores/Meliponicultores com dados georreferenciados
Apiary        - Apiários dos produtores
Sample        - Amostras laboratoriais (código NAPI-YYYY-XXXXXX)
Analysis      - Análises vinculadas às amostras
Report        - Laudos armazenados no MinIO
```

## 🧪 Testes

```bash
# Unit tests
npm test

# Watch mode
npm run test:watch

# Coverage
npm run test:cov
```

## � Documentação Interativa (Swagger)

Com o servidor rodando, acesse a documentação interativa da API em:

```
http://localhost:3000/api/docs
```

A documentação é gerada automaticamente pelo `@nestjs/swagger` e inclui autenticação JWT via `Bearer` token.

## 📋 Logging Estruturado (Pino)

O projeto usa **Pino** via `nestjs-pino` para logging estruturado em JSON (NDJSON).

| Ambiente | Formato | Transporte |
|---|---|---|
| `development` | Colorido e legível (`pino-pretty`) | Console |
| `production` | JSON puro (NDJSON) | stdout → Docker → Loki/Grafana, ELK, CloudWatch |

Variáveis de ambiente:

| Variável | Valores | Default |
|---|---|---|
| `LOG_LEVEL` | `fatal`, `error`, `warn`, `info`, `debug`, `trace` | `info` |

Headers sensíveis (`authorization`, `cookie`, `set-cookie`) são automaticamente censurados nos logs.

Exemplo de saída em produção (NDJSON):
```json
{"level":30,"time":1711036800000,"pid":1,"hostname":"container-id","req":{"method":"GET","url":"/api/v1/health"},"res":{"statusCode":200},"responseTime":12,"msg":"request completed"}
```

## ⚠️ Tratamento de Erros

O `AllExceptionsFilter` global captura **todas** as exceções e retorna respostas padronizadas:

| Tipo de Exceção | Status | Exemplo |
|---|---|---|
| `HttpException` do NestJS | Status da exceção | `NotFoundException` → 404 |
| `PrismaClientKnownRequestError` | Mapeado por código | `P2002` → 409 Conflict, `P2025` → 404 |
| `PrismaClientValidationError` | 400 | Dados inválidos no Prisma |
| `PrismaClientInitializationError` | 503 | Banco indisponível |
| Qualquer outra exceção | 500 | Sem vazamento de detalhes internos |

Formato padronizado:
```json
{
  "statusCode": 404,
  "timestamp": "2026-03-19T12:00:00.000Z",
  "path": "/api/v1/producers/123",
  "message": "Producer with id 123 not found"
}
```

Erros 5xx são logados como `error` (com stack trace) e erros 4xx como `warn` via Pino.

## �🐳 MinIO Console

Acesse o console do MinIO em `http://localhost:9001` com:
- **Usuário:** `minioadmin`
- **Senha:** `minioadmin`

