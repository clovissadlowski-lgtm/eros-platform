# Higeia — Sprint 0 Execution Book

**Documento:** Higeia Sprint 0 Execution Book  
**Versão:** 1.0  
**Status:** Plano técnico inicial para execução  
**Data:** 20 de julho de 2026  
**Projeto interno:** Projeto Eros  
**Produto:** Higeia  
**Fundador:** Clovis Sadlowski  

---

## 1. Objetivo

Transformar o Product Book, Architecture Book, frameworks de governança e requisitos do Controlled Alpha em um plano técnico executável.

O Sprint 0 deverá preparar:

- repositório;
- ambientes;
- arquitetura-base;
- autenticação;
- estrutura de dados;
- segurança;
- privacidade;
- observabilidade;
- IA;
- prompt e model registries;
- feature flags;
- rollback;
- backup;
- incident readiness;
- documentação operacional;
- base de testes;
- readiness para o primeiro sprint funcional.

---

## 2. O que é Sprint 0

Sprint 0 não é um sprint para entregar funcionalidades completas ao usuário.

Seu objetivo é criar as fundações para que o desenvolvimento ocorra com:

- segurança;
- rastreabilidade;
- velocidade sustentável;
- baixo retrabalho;
- capacidade de rollback;
- observabilidade;
- controle de escopo;
- documentação mínima operacional.

---

## 3. Critério de entrada

Sprint 0 só deve iniciar quando:

- Product Book revisado;
- escopo do Alpha definido;
- Architecture Book revisado;
- ADRs críticos propostos;
- módulos principais identificados;
- dados sensíveis mapeados;
- principais providers identificados;
- owner técnico definido;
- capacidade disponível conhecida.

---

## 4. Critério de saída

Sprint 0 será considerada concluída quando:

- repositório técnico estiver organizado;
- ambientes separados estiverem definidos;
- autenticação-base estiver funcional;
- tenant model estiver implementado;
- banco inicial estiver versionado;
- secrets estiverem protegidos;
- CI estiver funcional;
- logs e métricas básicas estiverem ativos;
- prompt/model registries existirem;
- AI provider adapter estiver preparado;
- feature flags estiverem disponíveis;
- backup e rollback estiverem testáveis;
- incident channel e runbooks mínimos existirem;
- testes críticos puderem ser executados;
- evidências estiverem registradas.

---

## 5. Workstreams

### WS-S0-01 — Repository and Engineering Foundation

### WS-S0-02 — Environments and Infrastructure

### WS-S0-03 — Identity, Access and Tenant Isolation

### WS-S0-04 — Data Foundation

### WS-S0-05 — AI Platform Foundation

### WS-S0-06 — Security and Privacy Controls

### WS-S0-07 — Observability and Cost

### WS-S0-08 — Release, Rollback and Continuity

### WS-S0-09 — Testing and Quality

### WS-S0-10 — Governance Evidence and Readiness

---

## 6. Priority classes

### P0 — Blocker

Sem conclusão, o próximo sprint não inicia.

### P1 — Critical

Deve estar concluído antes do Alpha.

### P2 — Required

Necessário para operação controlada.

### P3 — Improvement

Pode ser concluído após o primeiro sprint funcional.

---

## 7. Epic overview

| Epic ID | Epic | Priority | Target |
|---|---|---|---|
| EPIC-S0-01 | Repository and code standards | P0 | Sprint 0 |
| EPIC-S0-02 | Environment foundation | P0 | Sprint 0 |
| EPIC-S0-03 | Authentication and tenant isolation | P0 | Sprint 0 |
| EPIC-S0-04 | Database and migrations | P0 | Sprint 0 |
| EPIC-S0-05 | AI orchestration foundation | P1 | Sprint 0 |
| EPIC-S0-06 | Security and privacy baseline | P0 | Sprint 0 |
| EPIC-S0-07 | Observability and cost tracking | P1 | Sprint 0 |
| EPIC-S0-08 | CI/CD, release and rollback | P0 | Sprint 0 |
| EPIC-S0-09 | Backup and continuity | P1 | Sprint 0 |
| EPIC-S0-10 | Testing and evidence | P0 | Sprint 0 |

---

## 8. EPIC-S0-01 — Repository and code standards

### Objetivo

Criar uma base de desenvolvimento organizada e repetível.

### Entregas

- estrutura de código;
- convenções;
- branch policy;
- pull request template;
- issue template;
- linting;
- formatting;
- environment example;
- contribution guide;
- code owners.

### Critérios de aceite

- projeto executa localmente;
- instalação é documentada;
- branches seguem regra definida;
- pull request exige checklist;
- secrets não ficam versionados;
- lint e testes básicos executam.

---

## 9. EPIC-S0-02 — Environment foundation

### Objetivo

Separar ambientes e configurar infraestrutura mínima.

### Ambientes

- local;
- development;
- staging;
- controlled-alpha.

### Entregas

- configuração por ambiente;
- secrets separados;
- URLs e recursos separados;
- naming convention;
- infrastructure inventory;
- environment owner;
- access policy.

### Critérios de aceite

- desenvolvimento não usa secrets de produção;
- staging é isolado;
- configuração é reproduzível;
- inventário está documentado.

---

## 10. EPIC-S0-03 — Authentication and tenant isolation

### Objetivo

Garantir acesso autenticado e isolamento entre profissionais.

### Entregas

- login;
- sessão;
- roles;
- tenant_id;
- patient-professional relationship;
- authorization middleware;
- tenant-aware queries;
- privileged access policy.

### Critérios de aceite

- usuário não autenticado não acessa dados;
- profissional não acessa outro tenant;
- suporte privilegiado é auditado;
- testes de isolamento passam.

---

## 11. EPIC-S0-04 — Database and migrations

### Objetivo

Criar a base de dados inicial com versionamento.

### Entidades iniciais

- User
- Role
- Tenant
- ProfessionalProfile
- PatientProfile
- ProfessionalPatientRelationship
- ConsentRecord
- AuditEvent

### Entregas

- schema inicial;
- migrations;
- seeds controlados;
- indexes;
- backup strategy;
- data classification reference.

### Critérios de aceite

- banco pode ser criado do zero;
- migrations são repetíveis;
- rollback de migration foi avaliado;
- tenant_id existe onde necessário;
- dados sensíveis são identificados.

---

## 12. EPIC-S0-05 — AI orchestration foundation

### Objetivo

Criar a camada que permitirá usar IA com controle e rastreabilidade.

### Entregas

- provider adapter;
- prompt registry;
- model registry;
- AI trace;
- context minimization;
- output schema validation;
- cost capture;
- feature flag;
- kill switch;
- retry policy.

### Critérios de aceite

- nenhuma chamada ocorre diretamente fora do adapter;
- prompt e modelo são versionados;
- trace_id é gerado;
- custo estimado é registrado;
- output inválido não é publicado;
- kill switch pode bloquear chamadas.

---

## 13. EPIC-S0-06 — Security and privacy baseline

### Objetivo

Implementar controles mínimos antes de dados reais.

### Entregas

- secrets management;
- TLS;
- encryption at rest;
- input validation;
- access logging;
- consent versioning;
- data minimization;
- deletion workflow skeleton;
- security headers;
- rate limiting;
- dependency scanning.

### Critérios de aceite

- secrets não aparecem em código;
- ações críticas são auditadas;
- consentimento possui versão;
- fluxo de exclusão está documentado;
- dependências são verificadas.

---

## 14. EPIC-S0-07 — Observability and cost tracking

### Objetivo

Tornar a operação observável desde o início.

### Entregas

- structured logs;
- request correlation;
- error tracking;
- latency metrics;
- AI cost metrics;
- token metrics;
- availability check;
- alert baseline;
- dashboard inicial.

### Critérios de aceite

- requisição pode ser rastreada;
- erro crítico gera alerta;
- chamada de IA possui custo;
- logs não incluem dado sensível bruto;
- dashboard mínimo está disponível.

---

## 15. EPIC-S0-08 — CI/CD, release and rollback

### Objetivo

Permitir mudanças controladas.

### Entregas

- CI pipeline;
- test pipeline;
- build pipeline;
- staging deployment;
- controlled release;
- feature flags;
- release record;
- rollback procedure;
- migration review.

### Critérios de aceite

- pull request executa checks;
- build é reproduzível;
- staging recebe release controlada;
- rollback básico foi simulado;
- prompt/model changes são registradas.

---

## 16. EPIC-S0-09 — Backup and continuity

### Objetivo

Preparar recuperação e degraded mode.

### Entregas

- backup configuration;
- restore procedure;
- provider outage plan;
- AI-disabled mode;
- read-only option where feasible;
- no-photo mode;
- manual summary fallback;
- communication contacts.

### Critérios de aceite

- backup existe;
- restore foi testado ou programado;
- sistema pode bloquear IA;
- degraded mode está documentado;
- responsáveis estão definidos.

---

## 17. EPIC-S0-10 — Testing and evidence

### Objetivo

Criar a base de testes e a captura de evidências.

### Entregas

- test strategy;
- unit test structure;
- integration test structure;
- tenant isolation tests;
- security checks;
- AI contract tests;
- evidence folder;
- Definition of Done;
- acceptance checklist.

### Critérios de aceite

- testes executam no CI;
- isolamento é testado;
- provider adapter possui mocks;
- evidências possuem localização;
- tarefas não são encerradas sem aceite.

---

## 18. Critical path

```text
Repository
→ Environments
→ Authentication
→ Tenant isolation
→ Database
→ Security baseline
→ CI/CD
→ Observability
→ AI foundation
→ Rollback
→ Verification
→ Sprint 1 readiness
```

---

## 19. Dependencies

| Dependency ID | Deliverable | Depends On | Blocks |
|---|---|---|---|
| S0-DEP-001 | Tenant isolation | Authentication and data model | Patient features |
| S0-DEP-002 | AI adapter | Provider decision | AI features |
| S0-DEP-003 | Prompt registry | AI adapter design | AI summary |
| S0-DEP-004 | Cost dashboard | AI trace | Cost governance |
| S0-DEP-005 | Rollback | Deployment pipeline | Controlled release |
| S0-DEP-006 | Restore test | Backup configuration | Continuity readiness |

---

## 20. Suggested sequence

### Wave 1 — Foundation

- repository;
- conventions;
- local environment;
- architecture skeleton;
- database setup.

### Wave 2 — Identity and security

- authentication;
- roles;
- tenant;
- authorization;
- audit events;
- secrets.

### Wave 3 — Delivery capability

- CI;
- staging;
- deployment;
- feature flags;
- rollback.

### Wave 4 — AI and observability

- AI adapter;
- prompt/model registries;
- traces;
- logs;
- metrics;
- costs.

### Wave 5 — Readiness

- tests;
- backup;
- restore;
- degraded modes;
- evidence;
- gate review.

---

## 21. Sprint 0 Definition of Done

Uma tarefa está concluída quando:

- código/configuração existe;
- documentação mínima existe;
- teste foi executado;
- critério de aceite foi atendido;
- evidência foi armazenada;
- owner confirmou;
- dependências foram atualizadas;
- risco residual foi registrado.

---

## 22. Prohibited shortcuts

- usar produção como ambiente de teste;
- inserir secrets no repositório;
- acessar banco sem tenant filter;
- chamar IA sem adapter;
- usar prompt sem versão;
- liberar output sensível sem revisão;
- marcar tarefa sem evidência;
- adiar rollback;
- registrar logs com texto de saúde bruto;
- liberar feature sem flag quando o risco exigir controle.

---

## 23. Sprint 1 readiness gate

Antes de iniciar o Sprint 1 funcional:

- [ ] repository foundation complete;
- [ ] local setup documented;
- [ ] development environment available;
- [ ] staging available or planned;
- [ ] authentication base available;
- [ ] tenant model implemented;
- [ ] database migrations functional;
- [ ] CI active;
- [ ] secrets protected;
- [ ] audit events available;
- [ ] AI adapter skeleton available;
- [ ] prompt/model registries created;
- [ ] logs and error tracking active;
- [ ] feature flag available;
- [ ] rollback approach documented;
- [ ] critical tests passing;
- [ ] blockers reviewed.

---

## 24. Open decisions

1. Tecnologia backend.
2. Tecnologia frontend.
3. Banco de dados.
4. Provedor de autenticação.
5. Cloud provider.
6. Provedor de IA.
7. Observability stack.
8. Object storage.
9. Queue mechanism.
10. CI/CD platform.
11. Infrastructure as Code.
12. Hosting region.
13. Sprint duration.
14. Engineering owner.
15. External technical support.

---

## 25. Expected outputs

Ao final do Sprint 0, o Higeia deve possuir uma base capaz de iniciar o desenvolvimento de:

- professional account;
- patient invitation;
- consent;
- anamnesis;
- check-in;
- AI summary;
- professional review.

Sem reinventar infraestrutura, segurança e operação a cada feature.

---

## 26. Histórico

| Versão | Data | Alteração |
|---|---|---|
| 1.0 | 20/07/2026 | Criação do Sprint 0 Execution Book. |
