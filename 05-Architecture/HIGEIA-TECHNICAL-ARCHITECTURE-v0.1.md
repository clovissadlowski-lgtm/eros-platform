# Higeia — Technical Architecture Specification

**Documento:** Higeia Technical Architecture  
**Versão:** 0.1  
**Status:** Rascunho técnico oficial  
**Data:** 13 de julho de 2026  
**Projeto interno:** Projeto Eros  
**Produto:** Higeia  
**Fundador:** Clovis Sadlowski  

---

## 1. Objetivo

Definir a arquitetura técnica inicial do Higeia.

Este documento descreve como os principais componentes trabalharão juntos:

- aplicação web;
- API;
- autenticação;
- banco de dados;
- armazenamento de arquivos;
- filas;
- HIE;
- provedores de IA;
- observabilidade;
- segurança;
- ambientes;
- deploy;
- backups;
- integrações futuras.

---

## 2. Princípios arquiteturais

1. Simplicidade operacional no MVP.
2. Modularidade sem microsserviços prematuros.
3. Segurança desde o início.
4. Independência de um único provedor de IA.
5. Dados e IA auditáveis.
6. Versionamento de prompts, modelos e regras.
7. Processamento assíncrono para tarefas demoradas.
8. Capacidade de rollback.
9. Observabilidade obrigatória.
10. Arquitetura preparada para evolução gradual.

---

## 3. Estratégia geral

A arquitetura inicial será um **monólito modular** com componentes bem separados por domínio.

### Motivo

Um monólito modular permite:

- desenvolvimento mais rápido;
- menor custo;
- menor complexidade;
- deploy simples;
- testes mais fáceis;
- separação futura quando necessário.

---

## 4. Visão de alto nível

```text
Usuário
  ↓
Aplicação Web Responsiva
  ↓
API Backend
  ├── Identity
  ├── Assessment
  ├── Profile
  ├── Check-in
  ├── Conversation
  ├── Privacy
  └── Admin
  ↓
Application Services
  ├── HIE Orchestrator
  ├── Queue
  ├── File Service
  ├── Notification Service
  └── Audit Service
  ↓
Data Layer
  ├── PostgreSQL
  ├── Object Storage
  └── Cache
  ↓
External Services
  ├── AI Provider
  ├── Email Provider
  ├── Monitoring
  └── Future Integrations
```

---

## 5. Componentes principais

1. Web Front-end.
2. Backend API.
3. Authentication Service.
4. PostgreSQL.
5. Object Storage.
6. Queue and Workers.
7. HIE Runtime.
8. Model Provider Adapter.
9. Notification Service.
10. Audit and Logging.
11. Monitoring and Alerting.
12. Admin Console.

---

# 6. Front-end

## Recomendação inicial

Next.js com TypeScript.

## Responsabilidades

- páginas públicas;
- autenticação;
- onboarding;
- anamnese;
- perfil;
- dashboard;
- check-ins;
- timeline;
- assistente;
- configurações;
- admin básico.

## Princípios

- mobile-first;
- acessibilidade;
- componentes reutilizáveis;
- validação no cliente e servidor;
- estados de erro claros;
- carregamento progressivo;
- nenhuma regra crítica apenas no front-end.

## Organização sugerida

```text
src/
  app/
  components/
  features/
  lib/
  services/
  hooks/
  types/
  styles/
```

---

# 7. Backend API

## Recomendação inicial

NestJS ou API do próprio Next.js, dependendo da complexidade do protótipo.

### Preferência arquitetural

Para Alpha:
- Next.js full-stack pode ser suficiente.

Para MVP mais robusto:
- NestJS separado.

## Responsabilidades

- regras de negócio;
- autenticação e autorização;
- persistência;
- validação;
- integração com HIE;
- segurança;
- auditoria;
- filas;
- notificações;
- admin.

## Padrão

REST no MVP.

GraphQL não é necessário inicialmente.

---

# 8. Domínios do backend

## Identity
Usuários, sessões, permissões.

## Consent
Termos, consentimentos, revogações.

## Assessment
Anamnese, perguntas, respostas, progresso.

## Intelligence Profile
Geração e versionamento do perfil.

## Check-in
Acompanhamento semanal.

## Conversation
Mensagens e interação.

## Memory
Memórias e recuperação.

## Safety
Flags, políticas, redirecionamentos.

## Audit
Logs e rastreabilidade.

## Admin
Operação interna.

---

# 9. Autenticação

## Requisitos

- e-mail e senha;
- verificação de e-mail;
- recuperação de senha;
- sessões seguras;
- logout;
- revogação;
- futura MFA para admin.

## Opções

- Supabase Auth;
- Auth.js;
- Clerk;
- serviço próprio futuro.

## Recomendação inicial

Usar serviço gerenciado para reduzir risco e tempo.

---

# 10. Autorização

## Papéis

- user;
- admin;
- reviewer;
- system.

## Futuro

- nutritionist;
- trainer;
- support;
- safety_reviewer;
- data_protection.

## Regra

Privilégio mínimo.

---

# 11. Banco de dados

## Recomendação

PostgreSQL.

## Responsabilidades

- dados relacionais;
- histórico;
- consentimentos;
- sinais;
- memória;
- perfis;
- hipóteses;
- auditoria;
- execuções.

## Acesso

ORM recomendado:

- Prisma;
- Drizzle;
- TypeORM.

## Recomendação inicial

Prisma pela clareza e ecossistema.

---

# 12. Object Storage

## Uso

- imagens;
- documentos;
- arquivos;
- futuras fotos;
- exports.

## Opções

- Supabase Storage;
- AWS S3;
- Cloudflare R2.

## Regras

- URL assinada;
- criptografia;
- acesso temporário;
- checksum;
- exclusão;
- classificação de sensibilidade.

---

# 13. Cache

## Uso inicial

- sessões;
- rate limiting;
- dados temporários;
- jobs;
- respostas repetidas.

## Opções

- Redis;
- Upstash;
- cache interno no protótipo.

## Regra

Cache não é fonte de verdade.

---

# 14. Queue

## Objetivo

Processar tarefas demoradas.

## Jobs

- geração do perfil;
- reprocessamento;
- notificações;
- exportação;
- exclusão;
- avaliação;
- atualização de memória;
- auditoria assíncrona.

## Opções

- BullMQ;
- Inngest;
- Trigger.dev;
- SQS futuro.

## Recomendação inicial

Inngest ou Trigger.dev para simplicidade.

---

# 15. Workers

## Responsabilidades

- executar jobs;
- aplicar retry;
- registrar erro;
- respeitar idempotência;
- atualizar status;
- acionar alertas.

## Regras

- limite de tentativas;
- backoff;
- dead-letter;
- timeout;
- correlação.

---

# 16. HIE Runtime

## Responsabilidade

Executar o pipeline de inteligência.

## Componentes

- ingestion;
- validation;
- context;
- memory;
- knowledge;
- hypothesis;
- evidence;
- safety;
- explainability;
- response;
- audit.

## Execução

Sincrona:
- respostas simples;
- classificação;
- navegação.

Assíncrona:
- perfil;
- reprocessamento;
- análises mais profundas.

---

# 17. Model Provider Adapter

## Objetivo

Isolar provedores.

## Interface conceitual

```text
generateStructuredOutput()
generateText()
classify()
embed()
moderate()
```

## Benefícios

- troca de provedor;
- fallback;
- testes;
- comparação;
- controle de custo.

---

# 18. Provedores de IA

## Estratégia

- provedor principal;
- provedor secundário futuro;
- modelos por tarefa;
- saídas estruturadas;
- versionamento;
- controle de custo.

## Regra

Não enviar dados desnecessários.

---

# 19. Prompt Registry

## Responsabilidade

Versionar prompts.

## Campos

- key;
- version;
- purpose;
- template;
- input schema;
- output schema;
- owner;
- status;
- tests.

## Regra

Prompt em produção não deve ser alterado sem nova versão.

---

# 20. Knowledge Layer

## MVP

- regras no banco;
- arquivos versionados;
- taxonomias;
- relações iniciais;
- políticas.

## Futuro

- HKG;
- RAG;
- banco vetorial;
- revisão científica;
- graph database.

---

# 21. RAG

## Status

Não obrigatório no primeiro Alpha.

## Quando usar

- referências;
- políticas;
- conhecimento versionado;
- documentação;
- explicações.

## Riscos

- recuperação irrelevante;
- fonte desatualizada;
- contexto excessivo;
- falsa autoridade.

---

# 22. Memory Retrieval

## Estratégia

- filtros estruturados;
- recência;
- domínio;
- prioridade;
- segurança;
- busca semântica futura.

## Regra

Nunca enviar toda a memória ao modelo.

---

# 23. API endpoints iniciais

## Auth

```text
POST /auth/register
POST /auth/login
POST /auth/logout
POST /auth/verify-email
POST /auth/forgot-password
POST /auth/reset-password
```

## Consent

```text
GET /consents
POST /consents
POST /consents/revoke
```

## Assessment

```text
POST /assessments
GET /assessments/:id
POST /assessments/:id/answers
POST /assessments/:id/complete
GET /assessments/:id/progress
```

## Profile

```text
POST /profiles/generate
GET /profiles/latest
GET /profiles/:id
POST /profiles/:id/feedback
POST /profiles/:id/corrections
```

## Check-in

```text
POST /checkins
GET /checkins
GET /checkins/:id
POST /checkins/:id/complete
```

## Conversation

```text
POST /conversations
GET /conversations/:id
POST /conversations/:id/messages
POST /messages/:id/report
```

## Privacy

```text
GET /me/data
POST /me/export
POST /me/pause
POST /me/delete
```

---

# 24. API conventions

- JSON;
- versionamento `/v1`;
- IDs UUID;
- timestamps UTC;
- erros padronizados;
- idempotency key;
- correlation ID;
- paginação;
- validação por schema.

---

# 25. Error model

```json
{
  "code": "ASSESSMENT_INCOMPLETE",
  "message": "A avaliação ainda não foi concluída.",
  "details": {},
  "correlation_id": "..."
}
```

---

# 26. Eventos de domínio

## Exemplos

- UserRegistered;
- EmailVerified;
- ConsentGranted;
- AssessmentStarted;
- AssessmentCompleted;
- ProfileGenerationRequested;
- ProfileGenerated;
- CheckInCompleted;
- SafetyFlagRaised;
- AccountDeletionRequested.

## Uso

- desacoplamento;
- filas;
- analytics;
- auditoria.

---

# 27. Ambientes

## Local
Desenvolvimento.

## Development
Integração contínua.

## Staging
Testes próximos da produção.

## Production
Usuários reais.

## Regras

- dados separados;
- chaves separadas;
- deploy separado;
- logs separados;
- nenhum dado real em desenvolvimento.

---

# 28. Deploy

## Front-end

Vercel é opção inicial.

## Backend

- Vercel functions;
- Railway;
- Render;
- Fly.io;
- AWS futuro.

## Banco

- Supabase;
- Neon;
- Railway Postgres;
- RDS futuro.

## Recomendação Alpha

- Vercel;
- Supabase ou Neon;
- serviço gerenciado de fila;
- storage gerenciado.

---

# 29. CI/CD

## Pipeline

1. lint;
2. typecheck;
3. tests;
4. security scan;
5. build;
6. deploy preview;
7. staging;
8. approval;
9. production.

## Ferramenta

GitHub Actions.

---

# 30. Testes

## Tipos

- unitários;
- integração;
- end-to-end;
- contrato;
- segurança;
- IA;
- regressão;
- acessibilidade.

## Requisitos

Fluxos críticos:

- cadastro;
- consentimento;
- anamnese;
- perfil;
- check-in;
- segurança;
- exclusão.

---

# 31. Observabilidade

## Logs

- estruturados;
- correlation ID;
- sem excesso de dados sensíveis.

## Métricas

- latência;
- erro;
- custo;
- jobs;
- IA;
- segurança;
- uso.

## Traces

Fluxos críticos.

## Ferramentas

- Sentry;
- OpenTelemetry;
- Grafana;
- provider analytics.

---

# 32. Alertas

## Exemplos

- erro crítico;
- falha de geração;
- fila parada;
- custo elevado;
- safety spike;
- falha de backup;
- aumento de latência;
- vazamento suspeito.

---

# 33. Segurança

## Controles

- TLS;
- criptografia;
- segredo gerenciado;
- acesso mínimo;
- rate limiting;
- validação;
- proteção CSRF;
- proteção XSS;
- headers;
- audit logs;
- backups;
- scans.

---

# 34. Privacidade

## Requisitos

- minimização;
- finalidade;
- consentimento;
- revogação;
- exportação futura;
- correção;
- exclusão;
- retenção;
- segregação;
- acesso restrito.

---

# 35. Gestão de segredos

## Exemplos

- API keys;
- database URLs;
- signing secrets;
- email credentials.

## Regra

Nunca versionar segredos no Git.

## Ferramentas

- Vercel secrets;
- Doppler;
- AWS Secrets Manager futuro.

---

# 36. Backups

## Banco

- diário;
- criptografado;
- retenção definida;
- teste de restauração.

## Arquivos

- versionamento;
- replicação futura;
- lifecycle rules.

---

# 37. Disaster Recovery

## Objetivos iniciais

- RPO: até 24 horas no Alpha;
- RTO: até 8 horas no Alpha.

## Futuro

Reduzir conforme criticidade.

---

# 38. Performance

## Metas iniciais

- páginas principais < 3s;
- API comum < 500ms;
- geração de perfil assíncrona;
- chat com primeiro token < 3s quando possível.

---

# 39. Escalabilidade

## Estratégia

- stateless API;
- fila;
- workers;
- banco gerenciado;
- cache;
- object storage;
- horizontal scaling futuro.

## Regra

Escalar após medir.

---

# 40. Custos

## Componentes

- hospedagem;
- banco;
- storage;
- fila;
- IA;
- e-mail;
- monitoramento.

## Requisito

Registrar custo de IA por execução.

---

# 41. Feature Flags

## Uso

- ativar funções;
- rollout gradual;
- testar versões;
- desligar IA;
- controlar beta.

## Ferramentas

- banco interno;
- LaunchDarkly futuro.

---

# 42. Rollback

Deve permitir:

- versão anterior;
- prompt anterior;
- modelo anterior;
- desativar feature;
- pausar worker;
- trocar provedor.

---

# 43. Administração

## Painel mínimo

- usuários;
- onboarding;
- feedback;
- safety flags;
- incidentes;
- jobs;
- versões;
- custos.

---

# 44. Integrações futuras

- nutricionistas;
- personal trainers;
- wearables;
- laboratórios;
- pagamentos;
- notificações push;
- calendário;
- prontuários.

---

# 45. Decisões tecnológicas provisórias

## Front-end
Next.js + TypeScript.

## Banco
PostgreSQL.

## ORM
Prisma.

## Auth
Gerenciado.

## Storage
S3-compatible.

## Queue
Serviço gerenciado.

## Hosting
Vercel + serviço de backend se necessário.

## Monitoring
Sentry.

## IA
Provider abstraction.

---

# 46. Critérios de aceite

A arquitetura v0.1 estará pronta quando:

- componentes estiverem definidos;
- fronteiras estiverem claras;
- tecnologia inicial estiver proposta;
- APIs principais estiverem mapeadas;
- ambientes estiverem definidos;
- CI/CD estiver previsto;
- segurança estiver incorporada;
- observabilidade estiver prevista;
- rollback estiver definido;
- custos estiverem considerados.

---

# 47. Riscos

1. Complexidade excessiva.
2. Vendor lock-in.
3. Serverless limitations.
4. Custo de IA.
5. Latência.
6. Falha de fila.
7. Logs sensíveis.
8. Segurança insuficiente.
9. Crescimento sem observabilidade.
10. Escolha precoce de tecnologia.

---

# 48. Mitigações

- monólito modular;
- abstrações;
- serviços gerenciados;
- limites;
- métricas;
- rollback;
- versionamento;
- testes;
- documentação;
- revisão periódica.

---

# 49. Questões abertas

1. Next.js full-stack ou NestJS?
2. Supabase ou Neon?
3. Auth.js ou Supabase Auth?
4. Prisma ou Drizzle?
5. Qual fila?
6. Qual storage?
7. Qual provedor de IA?
8. Qual orçamento?
9. Qual região de hospedagem?
10. Como atender LGPD?
11. Quando usar pgvector?
12. Como implementar admin?

---

# 50. Próximo documento

O próximo documento será:

> Higeia Engineering Standards v0.1.

Ele definirá:

- estrutura de código;
- convenções;
- branches;
- commits;
- testes;
- revisão;
- segurança;
- documentação;
- qualidade;
- Definition of Done.

---

# 51. Histórico

| Versão | Data | Alteração |
|---|---|---|
| 0.1 | 13/07/2026 | Primeira arquitetura técnica integrada do Higeia. |
