# Justificativas de Ferramentas

## Visão Geral

Este documento justifica as escolhas tecnológicas do projeto **api-napi-abelhas**, explicando por que cada ferramenta foi selecionada em detrimento de alternativas.

---

## 1. NestJS (Framework Principal)

**Por que NestJS?**

NestJS é um framework Node.js com arquitetura fortemente inspirada no Angular, baseada em módulos, injeção de dependência e decorators.

| Vantagem | Detalhe |
|----------|---------|
| Arquitetura modular | Cada domínio (producers, samples, analysis...) é um módulo isolado e reutilizável |
| Injeção de dependência nativa | Facilita testes unitários com mocks sem configuração extra |
| TypeScript first | Todo o framework foi escrito em TypeScript, sem adaptadores |
| Ecossistema rico | Integrações oficiais com Prisma, Passport, Cache Manager, etc. |
| Padrões bem definidos | Reduz decisões de arquitetura e facilita onboarding |

**Alternativas consideradas:**
- **Express puro**: Mais flexível, mas sem estrutura — cada projeto evolui de forma diferente, dificultando manutenção.
- **Fastify**: Alta performance, mas ecosistema menor e curva de aprendizado maior para equipes acostumadas com Express/NestJS.
- **Hono / Elysia**: Soluções modernas e rápidas, mas com ecossistema menos maduro para projetos acadêmicos/empresariais.

---

## 2. TypeScript

**Por que TypeScript?**

TypeScript adiciona tipagem estática ao JavaScript, capturando erros em tempo de compilação e melhorando a experiência de desenvolvimento.

| Vantagem | Detalhe |
|----------|---------|
| Segurança de tipos | Erros detectados antes de rodar o código |
| IntelliSense aprimorado | Autocompletar preciso em todos os IDEs |
| Refatoração segura | Mudanças no schema Prisma propagam erros de tipo em toda a codebase |
| Padrão da indústria | Adotado amplamente em projetos Node.js modernos |

A configuração `strict` do TypeScript está habilitada, garantindo o máximo de segurança de tipos.

---

## 3. Prisma ORM

**Por que Prisma?**

| Vantagem | Detalhe |
|----------|---------|
| Schema declarativo | `schema.prisma` é a fonte única de verdade para o banco |
| Type-safe queries | Todas as queries retornam tipos TypeScript inferidos automaticamente |
| Migrations automáticas | `prisma migrate dev` gera e aplica migrações a partir das mudanças no schema |
| Prisma Client | API fluente e auto-completável para todas as operações |
| Prisma Studio | Interface visual para inspecionar o banco em desenvolvimento |

**Alternativas consideradas:**
- **TypeORM**: Mais antigo, amplamente usado com NestJS, mas o sistema de migrações é mais frágil e os erros em tempo de execução são mais comuns.
- **Drizzle ORM**: Alternativa moderna e leve, mas com ecossistema menor e menos maturidade para projetos complexos.
- **Knex (query builder)**: Mais controle sobre as queries, mas sem type-safety automático e exige mais boilerplate.

---

## 4. Zod (Validação de Schemas)

**Por que Zod?**

| Vantagem | Detalhe |
|----------|---------|
| TypeScript-first | O tipo TypeScript é inferido diretamente do schema (`z.infer<typeof schema>`) |
| Single source of truth | Schema e tipo definidos em um único lugar (sem duplicação) |
| Erros descritivos | Mensagens de erro detalhadas por campo, prontas para retornar ao cliente |
| Validação de env | Usado tanto para DTOs quanto para validação das variáveis de ambiente |
| Composição | `.partial()`, `.extend()`, `.pick()` permitem reutilizar schemas facilmente |

**Alternativas consideradas:**
- **class-validator + class-transformer**: A abordagem tradicional do NestJS. Requer duplicar a definição (classe + decorators), e a integração com TypeScript é menos direta.
- **Joi**: Maduro e robusto, mas sem inferência nativa de tipos TypeScript.
- **Valibot**: Alternativa mais leve ao Zod, mas com ecossistema menor.

---

## 5. Clerk (Autenticação)

**Por que Clerk?**

| Vantagem | Detalhe |
|----------|---------|
| Auth completo como serviço | Gerencia registro, login, MFA, sessões — sem implementar do zero |
| JWT com JWKS | Tokens validados localmente com chaves públicas (sem chamada ao Clerk a cada request) |
| Webhook com verificação | Eventos de usuário (criação, atualização) entregues com assinatura verificável via `svix` |
| Roles e permissões | Claims de role no JWT, prontos para uso com o `RolesGuard` |
| SDK agnóstico | A estratégia `clerk-jwt` usa `passport-jwt` padrão, sem lock-in no SDK do Clerk |

**Alternativas consideradas:**
- **Auth0**: Similar ao Clerk, mas com UX de configuração mais complexa e nível gratuito mais limitado.
- **Keycloak**: Open source e self-hosted, mas com overhead operacional significativo para equipes pequenas.
- **Implementação própria (JWT manual)**: Controle total, mas exige implementar segurança sensível corretamente (rotação de chaves, revogação, etc.).

---

## 6. PostgreSQL

**Por que PostgreSQL?**

| Vantagem | Detalhe |
|----------|---------|
| ACID compliant | Transações confiáveis para dados críticos de análises e amostras |
| Suporte a enums nativos | Os enums `Estado`, `Regiao`, `Bioma` do schema Prisma mapeiam diretamente |
| Extensibilidade | Suporte a JSON, arrays, full-text search e extensões geográficas |
| Referência acadêmica | Amplamente usado e documentado em contextos acadêmicos |

**Alternativas consideradas:**
- **MySQL/MariaDB**: Boa alternativa, mas com suporte a tipos e extensões menos completo.
- **SQLite**: Ideal para protótipos, mas sem suporte a conexões concorrentes robustas.
- **MongoDB**: Adequado para dados não relacionais, mas o domínio (amostras, análises, produtores) é inerentemente relacional.

---

## 7. Redis

**Por que Redis?**

| Vantagem | Detalhe |
|----------|---------|
| Cache em memória | Latência sub-milissegundo para respostas cacheadas |
| Integração com NestJS | `@nestjs/cache-manager` com `ioredis` funciona out-of-the-box |
| Versatilidade | Pode ser usado para cache, filas (Bull) e pub/sub no futuro |

O cache está configurado com TTL de 60 segundos no `CacheModule` global, podendo ser ajustado por rota.

---

## 8. MinIO (Object Storage)

**Por que MinIO?**

| Vantagem | Detalhe |
|----------|---------|
| S3-compatível | Mesma API da AWS S3 — troca por S3 real sem mudança de código |
| Self-hosted | Custo zero em desenvolvimento local |
| Docker-friendly | Imagem oficial leve, configurável via variáveis de ambiente |
| Presigned URLs | Suporte nativo — cliente faz upload direto sem passar pela API |

O `StorageService` usa o `@aws-sdk/client-s3` (SDK da AWS) com `forcePathStyle: true`, garantindo compatibilidade com MinIO e qualquer serviço S3-compatível. Trocar de MinIO para AWS S3 real em produção requer apenas mudar as variáveis de ambiente.

---

## 9. Docker Compose (Infraestrutura Local)

**Por que Docker Compose?**

| Vantagem | Detalhe |
|----------|---------|
| Reprodutibilidade | Mesmo ambiente em qualquer máquina do time |
| Isolamento | Serviços não conflitam com instalações locais |
| Facilidade de onboarding | Um comando (`docker compose up -d`) sobe toda a infraestrutura |
| Inicialização automática | O container `createbuckets` cria o bucket do MinIO automaticamente |

---

## 10. ESLint + Prettier

**Por que ambos?**

| Ferramenta | Responsabilidade |
|------------|-----------------|
| **ESLint** | Qualidade de código — detecta padrões problemáticos, uso incorreto de tipos, promises não tratadas |
| **Prettier** | Formatação — indentação, aspas, vírgulas, quebras de linha. Integrado via `eslint-plugin-prettier` |

Usar os dois integrados (via `eslint-config-prettier` + `eslint-plugin-prettier`) permite um único comando (`npm run lint`) para corrigir estilo e problemas de código ao mesmo tempo, sem conflitos entre as ferramentas.

**Configurações relevantes:**
- `@typescript-eslint/no-floating-promises: warn` — alerta para promises sem `await` ou `.catch()`.
- `prettier/prettier: [error, { endOfLine: auto }]` — compatibilidade de fim de linha entre Windows e Unix.
- `typescript-eslint/recommendedTypeChecked` — regras com análise de tipos (mais poderosas que as regras sem tipo).

---

## 11. Pino / nestjs-pino (Logging Estruturado)

**Por que Pino?**

| Vantagem | Detalhe |
|----------|--------|
| Performance | Um dos loggers mais rápidos do ecossistema Node.js (low overhead) |
| NDJSON nativo | Saída JSON estruturada por linha — consumível diretamente por Loki, ELK, CloudWatch |
| Redact de dados sensíveis | Censura automática de headers como `authorization` e `cookie` |
| `pino-pretty` para dev | Logs coloridos e legíveis em desenvolvimento, JSON puro em produção |
| Integração com NestJS | `nestjs-pino` substitui o logger padrão — o `Logger` do `@nestjs/common` delega para Pino automaticamente |
| Docker-friendly | stdout puro → Docker logs → Promtail/Fluentd — sem filesystem nem rotator |

**Alternativas consideradas:**
- **Winston**: Mais popular, mas significativamente mais lento e com serialização JSON menos eficiente.
- **Console padrão do NestJS**: Sem estruturação JSON, sem redact, sem níveis configuráveis — inadequado para ambientes containerizados.
- **Bunyan**: Obsoleto, sem manutenção ativa.

---

## 12. Swagger / OpenAPI (@nestjs/swagger)

**Por que Swagger?**

| Vantagem | Detalhe |
|----------|---------|
| Documentação automática | Gera documentação interativa a partir dos Controllers e DTOs |
| Teste de endpoints | Interface web em `/api/docs` permite testar rotas diretamente no navegador |
| Auth integrado | `addBearerAuth()` documenta e permite testar endpoints protegidos por JWT |
| Padrão da indústria | OpenAPI é o padrão para documentação de APIs REST |
| Integração NestJS | `@nestjs/swagger` extrai informações de rotas, parâmetros e respostas automaticamente |

**Alternativas consideradas:**
- **Documentação manual (Markdown/Postman)**: Tende a ficar desatualizada rapidamente conforme a API evolui.
- **Redoc**: Melhor apresentação visual, mas sem funcionalidade de testes embutida.

---

## 13. Jest (Testes)

**Por que Jest?**

| Vantagem | Detalhe |
|----------|---------|
| Zero config com NestJS | O CLI do NestJS gera configuração Jest pronta |
| `ts-jest` | Executa TypeScript diretamente, sem compilação separada |
| Built-in mocks | `jest.fn()`, `jest.spyOn()` e automocking simplificam testes de serviços |
| Cobertura integrada | `--coverage` gera relatório sem plugins extras |

**Alternativas consideradas:**
- **Vitest**: Mais rápido e com melhor suporte a ESM, mas integração com NestJS menos madura.
- **Mocha + Chai**: Mais configuração manual necessária.
