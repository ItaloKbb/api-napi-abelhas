# Produção x Desenvolvimento

## Visão Geral

Este documento detalha as diferenças de comportamento, configuração e práticas entre os ambientes de **desenvolvimento** e **produção** no projeto **api-napi-abelhas**.

---

## 1. Variável `NODE_ENV`

O comportamento do projeto é controlado pela variável `NODE_ENV`, que aceita três valores:

| Valor           | Uso                                              |
|-----------------|--------------------------------------------------|
| `development`   | Desenvolvimento local com hot reload             |
| `production`    | Servidor de produção                             |
| `test`          | Execução de testes automatizados (Jest)          |

---

## 2. Scripts de Execução

| Ambiente      | Comando              | Descrição                                          |
|---------------|----------------------|----------------------------------------------------|
| Desenvolvimento | `npm run start:dev` | NestJS com `--watch` (hot reload automático)       |
| Debug          | `npm run start:debug`| Hot reload + inspector Node.js na porta padrão     |
| Produção       | `npm run start:prod` | Executa o bundle compilado `dist/main.js`          |
| Build          | `npm run build`      | Compila TypeScript para JavaScript em `dist/`      |

Em produção, **sempre** use o build compilado:
```bash
npm run build
npm run start:prod
# equivale a: node dist/main
```

---

## 3. Banco de Dados

| Aspecto              | Desenvolvimento                        | Produção                                  |
|----------------------|----------------------------------------|-------------------------------------------|
| Migrations           | `prisma migrate dev`                   | `prisma migrate deploy`                   |
| Reset do banco       | Permitido (`prisma migrate reset`)     | **Nunca fazer** |
| Prisma Studio        | Uso livre (`npx prisma studio`)        | Não expor publicamente                    |
| Credenciais          | `postgres:postgres` (docker-compose)   | Credenciais fortes via variável de ambiente |
| SSL na conexão       | Não obrigatório                        | Obrigatório (`?sslmode=require` na URL)   |

O comando `prisma migrate dev` cria o histórico de migrações e pode fazer reset. O comando `prisma migrate deploy` apenas aplica migrações pendentes sem risco de perda de dados — **use somente este em produção e CI/CD**.

---

## 4. Redis (Cache)

| Aspecto              | Desenvolvimento                        | Produção                                  |
|----------------------|----------------------------------------|-------------------------------------------|
| Instância            | Docker local (`localhost:6379`)        | Redis gerenciado (ex.: ElastiCache, Upstash) |
| Autenticação         | Nenhuma                                | Senha via `REDIS_HOST` com auth           |
| TTL do cache         | 60 segundos (padrão do `CacheModule`)  | Ajustar conforme carga esperada           |

---

## 5. MinIO / Object Storage

| Aspecto              | Desenvolvimento                        | Produção                                  |
|----------------------|----------------------------------------|-------------------------------------------|
| Serviço              | MinIO local via Docker                 | MinIO auto-hospedado com SSL **ou** AWS S3 |
| SSL                  | `MINIO_USE_SSL=false`                  | `MINIO_USE_SSL=true`                      |
| Credenciais          | `minioadmin`/`minioadmin`              | Credenciais fortes geradas aleatoriamente |
| Bucket               | Criado automaticamente pelo Docker     | Criar manualmente com políticas de acesso |
| Endpoint             | `localhost:9000`                       | Endpoint do serviço gerenciado/próprio    |

O `StorageService` é agnóstico ao serviço — usa a SDK da AWS (`@aws-sdk/client-s3`) com `forcePathStyle: true`, sendo compatível com qualquer endpoint S3-compatível (MinIO, Cloudflare R2, etc.).

---

## 6. Autenticação Clerk

| Aspecto              | Desenvolvimento                        | Produção                                  |
|----------------------|----------------------------------------|-------------------------------------------|
| Chaves               | `pk_test_...` / `sk_test_...`          | `pk_live_...` / `sk_live_...`             |
| JWKS URI             | `https://api.clerk.com/v1/jwks` (padrão) | Pode ser personalizado por instância Clerk |
| Webhook Secret       | Secret do ambiente de teste            | Secret do ambiente de produção            |
| Cache de JWKS        | 1 hora em memória                      | 1 hora em memória (mesmo comportamento)   |

> **Atenção**: Nunca use chaves de produção (`pk_live_`/`sk_live_`) em ambiente de desenvolvimento.

---

## 7. Logging e Monitoramento

O projeto usa **Pino** (via `nestjs-pino`) como logger estruturado, substituíndo o console padrão do NestJS.

| Aspecto              | Desenvolvimento                                        | Produção                                            |
|----------------------|--------------------------------------------------------|----------------------------------------------------|
| Formato de log       | `pino-pretty` — colorido, single-line, timestamps legíveis | JSON puro (NDJSON) em stdout                       |
| Transporte           | Console local                                          | stdout → Docker → Loki/Grafana, ELK, CloudWatch    |
| Nível (default)       | `info` (configurável via `LOG_LEVEL`)                   | `info` (configurável via `LOG_LEVEL`)               |
| Headers sensíveis    | Censurados (`authorization`, `cookie`, `set-cookie`)   | Censurados (redact do Pino)                        |
| Erros não tratados   | Stack trace visível no console (colorido)               | Stack trace logado em JSON, **não** exposto na resposta HTTP |
| Erros 4xx            | Logados como `warn`                                    | Logados como `warn`                                |
| Erros 5xx            | Logados como `error` (com stack trace)                 | Logados como `error` (com stack trace)             |

### Variáveis de ambiente

| Variável    | Valores                                              | Default |
|-------------|------------------------------------------------------|---------|
| `LOG_LEVEL` | `fatal`, `error`, `warn`, `info`, `debug`, `trace`  | `info`  |

### Exemplo de saída em produção (NDJSON)

```json
{"level":30,"time":1711036800000,"pid":1,"hostname":"container-id","req":{"method":"GET","url":"/api/v1/health"},"res":{"statusCode":200},"responseTime":12,"msg":"request completed"}
```

Esse formato é consumido diretamente por coletores como **Promtail** (Grafana Loki), **Fluentd/Fluent Bit** (ELK), ou **CloudWatch Logs Agent** (AWS).

O `AllExceptionsFilter` integra com o Pino para garantir que todo erro HTTP (4xx/5xx) é logado estruturadamente com contexto (path, status code, stack trace).

---

## 8. Build e Deploy

### Pipeline recomendado (CI/CD)

```bash
# 1. Instalar dependências de produção
npm ci --omit=dev

# 2. Compilar TypeScript
npm run build

# 3. Aplicar migrações (sem risco de reset)
npx prisma migrate deploy

# 4. Iniciar a aplicação
npm run start:prod
```

### Dockerfile (referência)

```dockerfile
FROM node:22-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:22-alpine
WORKDIR /app
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/prisma ./prisma
COPY package.json ./
ENV NODE_ENV=production
CMD ["node", "dist/main"]
```

---

## 9. Checklist de Produção

Antes de fazer deploy em produção, verifique:

- [ ] `NODE_ENV=production` configurado
- [ ] `DATABASE_URL` aponta para banco de produção com SSL
- [ ] Credenciais do MinIO/S3 são únicas e fortes
- [ ] Chaves do Clerk são do ambiente `live`
- [ ] `CLERK_WEBHOOK_SECRET` configurado corretamente
- [ ] `.env` não está commitado no repositório
- [ ] `prisma migrate deploy` executado (não `migrate dev`)
- [ ] Build compilado (`npm run build`) antes de iniciar
- [ ] Volumes de dados (PostgreSQL, Redis, MinIO) têm backup configurado
