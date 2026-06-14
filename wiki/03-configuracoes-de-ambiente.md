# Configurações de Ambiente

## Visão Geral

Este documento descreve todas as variáveis de ambiente do projeto **api-napi-abelhas**, como configurar os serviços de infraestrutura localmente e as considerações de segurança para cada configuração.

---

## 1. Arquivo `.env`

Crie um arquivo `.env` na raiz do projeto (nunca comite este arquivo). Use `.env.example` como modelo de referência. O projeto valida todas as variáveis na inicialização via Zod — a aplicação **não sobe** se uma variável obrigatória estiver ausente.

```env
# ─── Banco de Dados ──────────────────────────────────────────────────────────
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/napi_abelhas

# ─── Redis ────────────────────────────────────────────────────────────────────
REDIS_HOST=localhost
REDIS_PORT=6379

# ─── MinIO (Object Storage) ───────────────────────────────────────────────────
MINIO_ENDPOINT=localhost
MINIO_PORT=9000
MINIO_ACCESS_KEY=minioadmin
MINIO_SECRET_KEY=minioadmin
MINIO_BUCKET=napi-abelhas
MINIO_USE_SSL=false

# ─── Clerk (Autenticação) ─────────────────────────────────────────────────────
CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
CLERK_WEBHOOK_SECRET=whsec_...
CLERK_JWKS_URI=https://api.clerk.com/v1/jwks

# ─── Aplicação ────────────────────────────────────────────────────────────────
PORT=3000
NODE_ENV=developmentLOG_LEVEL=info```

---

## 2. Referência Completa das Variáveis

| Variável              | Obrigatória | Padrão                              | Descrição                                              |
|-----------------------|-------------|-------------------------------------|--------------------------------------------------------|
| `DATABASE_URL`        | Sim         | —                                   | String de conexão PostgreSQL (formato Prisma)          |
| `REDIS_HOST`          | Não         | `localhost`                         | Host do servidor Redis                                 |
| `REDIS_PORT`          | Não         | `6379`                              | Porta do servidor Redis                                |
| `MINIO_ENDPOINT`      | Não         | `localhost`                         | Host do MinIO                                          |
| `MINIO_PORT`          | Não         | `9000`                              | Porta da API do MinIO                                  |
| `MINIO_ACCESS_KEY`    | Não         | `minioadmin`                        | Chave de acesso do MinIO                               |
| `MINIO_SECRET_KEY`    | Não         | `minioadmin`                        | Chave secreta do MinIO                                 |
| `MINIO_BUCKET`        | Não         | `napi-abelhas`                      | Nome do bucket padrão                                  |
| `MINIO_USE_SSL`       | Não         | `false`                             | Habilitar HTTPS na conexão com MinIO (`"true"/"false"`) |
| `CLERK_PUBLISHABLE_KEY` | Não       | —                                   | Chave pública do Clerk (frontend)                      |
| `CLERK_SECRET_KEY`    | Não         | —                                   | Chave secreta do Clerk (usada no webhook)              |
| `CLERK_WEBHOOK_SECRET`| Não         | —                                   | Secret para verificar webhooks do Clerk (svix)         |
| `CLERK_JWKS_URI`      | Não         | `https://api.clerk.com/v1/jwks`     | URI do JWKS para validação dos JWTs                    |
| `PORT`                | Não         | `3000`                              | Porta em que a API escuta                              |
| `NODE_ENV`            | Não         | `development`                       | Ambiente: `development`, `production` ou `test`        |
| `LOG_LEVEL`           | Não         | `info`                              | Nível de log do Pino: `fatal`, `error`, `warn`, `info`, `debug`, `trace` |

---

## 3. Subindo a Infraestrutura Local com Docker

O arquivo `docker-compose.yml` sobe todos os serviços de infraestrutura necessários:

```bash
docker compose up -d
```

Serviços provisionados:

| Serviço              | Imagem                  | Porta(s)        | Credenciais padrão          |
|----------------------|-------------------------|-----------------|-----------------------------|
| PostgreSQL 16        | `postgres:16-alpine`    | `5432`          | user: `postgres` / pw: `postgres` |
| Redis 7              | `redis:7-alpine`        | `6379`          | sem autenticação            |
| MinIO                | `minio/minio:latest`    | `9000`, `9001`  | user: `minioadmin` / pw: `minioadmin` |
| MinIO Init (bucket)  | `minio/mc:latest`       | —               | cria o bucket automaticamente |

O MinIO Console (interface web) fica disponível em `http://localhost:9001`.

Para derrubar os serviços e preservar os volumes:
```bash
docker compose down
```

Para derrubar **incluindo** os volumes (apaga os dados):
```bash
docker compose down -v
```

---

## 4. Banco de Dados — Prisma

### Aplicar migrações
```bash
npx prisma migrate dev         # cria e aplica novas migrações (desenvolvimento)
npx prisma migrate deploy      # aplica migrações existentes (produção/CI)
```

### Gerar o client após mudanças no schema
```bash
npx prisma generate
```

### Visualizar o banco
```bash
npx prisma studio              # abre em http://localhost:5555
```

### Reset completo (apenas desenvolvimento)
```bash
npx prisma migrate reset       # apaga o banco, reaplica migrações e seeds
```

---

## 5. Variáveis Sensíveis — Boas Práticas

- **Nunca** comite arquivos `.env` com credenciais reais.
- Adicione `.env` ao `.gitignore`.
- Em produção, use variáveis de ambiente do servidor ou um gerenciador de segredos (ex.: AWS Secrets Manager, Vault).
- As chaves do Clerk (`CLERK_SECRET_KEY`, `CLERK_WEBHOOK_SECRET`) são críticas — rotacione-as imediatamente em caso de vazamento.
- As credenciais padrão do MinIO (`minioadmin`/`minioadmin`) são apenas para desenvolvimento local. Em produção, use credenciais fortes e habilite SSL (`MINIO_USE_SSL=true`).

---

## 6. Inicialização da Aplicação

```bash
# Instalar dependências
npm install

# Subir infraestrutura
docker compose up -d

# Aplicar migrações
npx prisma migrate dev

# Iniciar em modo desenvolvimento (hot reload)
npm run start:dev

# Build de produção e iniciar
npm run build
npm run start:prod
```
