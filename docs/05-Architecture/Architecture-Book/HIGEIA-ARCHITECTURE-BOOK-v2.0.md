# Higeia — Architecture Book

**Documento:** Higeia Architecture Book  
**Versão:** 2.0  
**Status:** Arquitetura de referência para MVP e Controlled Alpha  
**Data:** 20 de julho de 2026  
**Projeto interno:** Projeto Eros  
**Produto:** Higeia  
**Fundador:** Clovis Sadlowski  

---

## 1. Objetivo

Definir a arquitetura de referência do Higeia para o MVP e Controlled Alpha.

O documento consolida:

- princípios arquiteturais;
- contexto do sistema;
- atores;
- componentes;
- fluxos;
- limites de confiança;
- dados;
- IA;
- memória;
- RAG;
- segurança;
- observabilidade;
- continuidade;
- ambientes;
- releases;
- integrações;
- decisões;
- restrições;
- evolução futura.

---

## 2. Princípios arquiteturais

1. Escopo do produto antes da tecnologia.
2. Menor privilégio.
3. Menor dado necessário.
4. Separação entre tenants.
5. Human review para outputs sensíveis.
6. IA desacoplada do core transacional.
7. Versionamento de modelos e prompts.
8. Auditabilidade por padrão.
9. Feature flags para funções de risco.
10. Rollback e kill switch obrigatórios.
11. Degraded mode antes de alta complexidade.
12. Segurança e privacidade desde o design.
13. Componentes substituíveis.
14. Custos observáveis.
15. Evolução incremental.

---

## 3. Escopo arquitetural do Alpha

Incluído:

- autenticação;
- workspace profissional;
- convite de paciente;
- consentimento;
- anamnese;
- check-in;
- medidas;
- relatos;
- fotos limitadas;
- resumo de IA;
- revisão profissional;
- timeline;
- feedback;
- logs;
- monitoring;
- incident support.

Excluído:

- diagnóstico;
- prescrição;
- prontuário hospitalar;
- wearables;
- app nativo completo;
- marketplace;
- múltiplas especialidades;
- automação clínica autônoma.

---

## 4. Atores

### Professional User

Nutricionista autorizado.

### Patient User

Paciente convidado.

### Operations User

Suporte e operações.

### Governance User

Revisão, auditoria e assurance.

### External Provider

Serviços externos como IA, email, storage ou observabilidade.

---

## 5. System context

```text
Professional
    |
    v
Higeia Web Application
    |
    +--> Application API
    |       |
    |       +--> Identity and Access
    |       +--> Professional Workspace
    |       +--> Patient Management
    |       +--> Consent
    |       +--> Anamnesis
    |       +--> Check-in
    |       +--> Timeline
    |       +--> AI Orchestration
    |       +--> Review Workflow
    |       +--> Audit and Events
    |
    +--> Data Stores
    |
    +--> External AI Provider
    +--> Object Storage
    +--> Email Provider
    +--> Monitoring Platform
```

---

## 6. Architectural style

Para o Alpha, recomenda-se:

- modular monolith;
- API-first;
- web application responsiva;
- background jobs apenas onde necessário;
- event log central;
- integrações externas encapsuladas;
- separação lógica forte entre domínios.

Microservices não são recomendados inicialmente.

---

## 7. Main modules

### MOD-001 — Identity and Access

Responsável por:

- login;
- sessão;
- roles;
- permissions;
- invitation;
- account status.

### MOD-002 — Professional Workspace

Responsável por:

- patient list;
- summaries;
- flags;
- reviews;
- notes.

### MOD-003 — Patient Management

Responsável por:

- patient profile;
- professional relationship;
- status;
- access;
- lifecycle.

### MOD-004 — Consent and Privacy

Responsável por:

- consent records;
- version;
- withdrawal;
- privacy requests;
- data deletion workflow.

### MOD-005 — Anamnesis

Responsável por:

- structured intake;
- sections;
- responses;
- progress;
- validation.

### MOD-006 — Check-in

Responsável por:

- weekly entries;
- measurements;
- text;
- photo references;
- completion status.

### MOD-007 — AI Orchestration

Responsável por:

- prompt selection;
- model routing;
- context assembly;
- redaction;
- provider calls;
- output validation;
- cost capture;
- trace correlation.

### MOD-008 — Professional Review

Responsável por:

- review queue;
- approve;
- correct;
- reject;
- feedback;
- escalation.

### MOD-009 — Longitudinal Timeline

Responsável por:

- chronological events;
- measurements;
- summaries;
- professional notes;
- changes.

### MOD-010 — Safety and Escalation

Responsável por:

- safety rules;
- flags;
- human escalation;
- stop actions;
- restricted output.

### MOD-011 — Audit and Governance

Responsável por:

- audit events;
- decisions;
- approvals;
- releases;
- evidence references.

### MOD-012 — Observability and Operations

Responsável por:

- logs;
- metrics;
- traces;
- alerts;
- incidents;
- cost monitoring.

---

## 8. Tenant model

O tenant inicial é o profissional ou organização profissional.

Cada paciente deve estar vinculado a um tenant.

Regras:

- tenant_id em entidades sensíveis;
- autorização validada em cada operação;
- queries filtradas por tenant;
- testes de isolamento obrigatórios;
- storage organizado por tenant;
- acesso de suporte controlado e auditado.

---

## 9. Data classification

### Public

Conteúdo público e institucional.

### Internal

Configurações e documentação interna.

### Confidential

Dados comerciais, operacionais e de usuário.

### Sensitive Health Data

Dados de saúde e contexto pessoal.

### Restricted

Credenciais, secrets, tokens e dados críticos.

---

## 10. Main data entities

- User
- Role
- Tenant
- ProfessionalProfile
- PatientProfile
- ProfessionalPatientRelationship
- ConsentRecord
- Anamnesis
- AnamnesisResponse
- CheckIn
- Measurement
- PhotoAsset
- AISummary
- ReviewRecord
- TimelineEvent
- SafetyFlag
- AuditEvent
- PromptVersion
- ModelVersion
- AITrace
- IncidentReference
- DataDeletionRequest

---

## 11. Data ownership

### Professional-managed data

- patient relationship;
- professional notes;
- review decisions.

### Patient-provided data

- anamnesis;
- measurements;
- reports;
- photos;
- corrections.

### System-generated data

- summaries;
- derived flags;
- events;
- traces;
- metrics.

---

## 12. AI request flow

```text
User action
→ Authorization
→ Retrieve approved data
→ Minimize context
→ Apply redaction
→ Select prompt version
→ Select model/provider
→ Call provider
→ Validate response
→ Apply safety checks
→ Persist trace metadata
→ Create draft output
→ Human review
→ Approve or correct
→ Publish allowed result
```

---

## 13. AI boundaries

A IA não deve:

- executar escrita direta em registros clínicos finais;
- alterar dieta autonomamente;
- diagnosticar;
- prescrever;
- enviar output sensível sem revisão;
- acessar dados de outro tenant;
- escolher livremente dados fora do contexto permitido;
- reter conteúdo em memória sem regra aprovada.

---

## 14. Prompt architecture

Prompts devem ser compostos por:

- system policy;
- product instruction;
- use case instruction;
- allowed context;
- forbidden behavior;
- output schema;
- uncertainty handling;
- safety instructions;
- version metadata.

Cada execução deve registrar:

- prompt_id;
- version;
- model_id;
- use_case_id;
- timestamp;
- trace_id;
- cost;
- outcome.

---

## 15. Memory architecture

No Alpha:

- memória limitada;
- fatos explícitos;
- provenance obrigatório;
- confirmação do usuário quando aplicável;
- nenhuma memória invisível sensível;
- expiração;
- correção;
- contestação;
- exclusão.

Estados:

- proposed;
- active;
- confirmed;
- disputed;
- expired;
- superseded;
- deleted.

---

## 16. RAG architecture

RAG deve ser usado apenas quando existir:

- fonte aprovada;
- licença válida;
- chunking definido;
- versionamento;
- relevância;
- provenance;
- avaliação;
- fallback.

No Alpha, priorizar fontes internas controladas.

---

## 17. Human review architecture

Outputs de IA entram como draft.

Estados:

- generated;
- pending_review;
- approved;
- corrected;
- rejected;
- escalated;
- archived.

Nenhum output sensível deve ser tratado como final antes de revisão.

---

## 18. Safety architecture

Camadas:

1. input validation;
2. context restrictions;
3. prompt safety;
4. provider safety where available;
5. deterministic checks;
6. output validation;
7. human review;
8. escalation;
9. feature disable.

---

## 19. Security architecture

Controles mínimos:

- secure authentication;
- MFA for privileged users when feasible;
- role-based access;
- tenant isolation;
- encryption in transit;
- encryption at rest;
- secret management;
- audit logging;
- session timeout;
- rate limiting;
- input validation;
- vulnerability scanning;
- backup protection.

---

## 20. Privacy architecture

- consent versioning;
- purpose limitation;
- data minimization;
- access logging;
- correction;
- export where applicable;
- deletion workflow;
- retention;
- restricted support access;
- provider data terms review.

---

## 21. Photo architecture

Fotos devem ser opcionais.

Controles:

- explicit purpose;
- explicit consent where applicable;
- file validation;
- malware scanning;
- size limit;
- secure object storage;
- signed URLs;
- restricted access;
- retention;
- deletion;
- no model use by default.

---

## 22. Storage architecture

### Relational database

Para:

- accounts;
- tenant relationships;
- structured anamnesis;
- check-ins;
- measurements;
- reviews;
- audit references.

### Object storage

Para:

- photos;
- exported evidence;
- controlled attachments.

### Log and telemetry store

Para:

- application logs;
- AI traces;
- metrics;
- alerts.

---

## 23. API architecture

APIs devem:

- authenticate;
- authorize;
- validate tenant;
- validate schema;
- log critical actions;
- avoid excessive data;
- return consistent errors;
- support idempotency where needed.

---

## 24. Background processing

Usar apenas para:

- AI summary generation;
- notifications;
- media processing;
- deletion workflows;
- scheduled reviews;
- report generation.

Jobs devem possuir:

- retries limitados;
- dead-letter handling;
- correlation ID;
- monitoring;
- idempotency.

---

## 25. Observability

### Logs

- authentication;
- access failures;
- privileged actions;
- AI execution;
- review;
- release;
- incident.

### Metrics

- latency;
- errors;
- AI cost;
- token use;
- summary acceptance;
- safety flags;
- queue time;
- availability.

### Traces

- request ID;
- user/tenant-safe reference;
- service span;
- AI provider call;
- database call;
- outcome.

---

## 26. Cost architecture

Cada chamada de IA deve permitir:

- token measurement;
- estimated cost;
- use case allocation;
- tenant allocation;
- model comparison;
- anomaly detection.

---

## 27. Deployment architecture

Ambientes:

- local;
- development;
- staging;
- production/controlled-alpha.

Regras:

- no production secrets in development;
- environment separation;
- controlled migrations;
- release records;
- feature flags;
- rollback;
- approval gate.

---

## 28. Release architecture

Fluxo:

```text
Code change
→ review
→ tests
→ build
→ staging
→ verification
→ approval
→ controlled deployment
→ monitoring
→ rollback if needed
```

---

## 29. Rollback

Rollback deve cobrir:

- application version;
- prompt version;
- model route;
- feature flag;
- database migration strategy;
- configuration.

---

## 30. Degraded modes

- AI disabled;
- read-only;
- no-photo;
- no-memory;
- no-RAG;
- human-review-only;
- manual summary;
- support-only.

---

## 31. Business continuity

Definir:

- critical services;
- RTO;
- RPO;
- backups;
- restore tests;
- provider outage;
- communication;
- manual procedure;
- recovery authority.

---

## 32. External integrations

Alpha pode incluir:

- AI provider;
- email provider;
- object storage;
- monitoring;
- authentication provider.

Cada integração deve possuir:

- owner;
- terms review;
- data flow;
- fallback;
- monitoring;
- exit plan.

---

## 33. Technology selection principles

Escolha deve considerar:

- simplicity;
- security;
- cost;
- maintainability;
- ecosystem;
- vendor lock-in;
- observability;
- migration;
- team competence.

Tecnologias específicas devem ser registradas em ADRs.

---

## 34. Architecture risks

- scope creep;
- overengineering;
- weak tenant isolation;
- AI vendor lock-in;
- prompt drift;
- hidden memory;
- insufficient auditability;
- excessive sensitive data;
- high cost;
- missing rollback;
- manual process overload.

---

## 35. Alpha architecture gates

- [ ] scope approved;
- [ ] modules defined;
- [ ] data model reviewed;
- [ ] tenant isolation designed;
- [ ] AI flow reviewed;
- [ ] security controls designed;
- [ ] privacy controls designed;
- [ ] review workflow designed;
- [ ] observability designed;
- [ ] rollback designed;
- [ ] degraded modes defined;
- [ ] external providers reviewed.

---

## 36. Evolution path

### Stage 1 — Controlled Alpha

Modular monolith, limited users, manual review.

### Stage 2 — Beta

Better automation, stronger analytics, improved operations.

### Stage 3 — Multi-professional

Organization accounts, team roles, collaboration.

### Stage 4 — Platform

External integrations, ecosystem and advanced intelligence.

---

## 37. Required ADRs

- ADR-001 — Modular monolith.
- ADR-002 — Tenant model.
- ADR-003 — Authentication approach.
- ADR-004 — Relational database.
- ADR-005 — Object storage.
- ADR-006 — AI provider abstraction.
- ADR-007 — Prompt registry.
- ADR-008 — Human review.
- ADR-009 — Logging and tracing.
- ADR-010 — Deployment and rollback.
- ADR-011 — Memory scope.
- ADR-012 — Photo inclusion.
- ADR-013 — RAG scope.

---

## 38. Open decisions

1. Cloud provider.
2. Backend language/framework.
3. Frontend framework.
4. Database.
5. Authentication provider.
6. AI provider.
7. Object storage.
8. Monitoring stack.
9. Queue/job mechanism.
10. Photo inclusion.
11. Memory implementation.
12. RAG implementation.
13. RTO/RPO.
14. Hosting region.
15. Data residency requirements.

---

## 39. Source of truth

Este Architecture Book é a fonte principal para a arquitetura de referência do MVP e Alpha.

Decisões específicas devem ser mantidas em ADRs.

Implementação detalhada deve estar em Engineering e Infrastructure.

---

## 40. Histórico

| Versão | Data | Alteração |
|---|---|---|
| 2.0 | 20/07/2026 | Arquitetura revisada com base no Product Book e Controlled Alpha. |
