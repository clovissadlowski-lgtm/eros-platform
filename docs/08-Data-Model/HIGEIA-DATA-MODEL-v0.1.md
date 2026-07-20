# Higeia — Data Model Specification

**Documento:** Higeia Data Model Specification  
**Versão:** 0.1  
**Status:** Rascunho técnico oficial  
**Data:** 13 de julho de 2026  
**Projeto interno:** Projeto Eros  
**Produto:** Higeia  
**Fundador:** Clovis Sadlowski  

---

## 1. Objetivo

Definir o modelo de dados inicial do Higeia.

Este documento traduz o PRD, o HKM, o HIE e o Memory Model em uma estrutura persistente capaz de suportar:

- usuários;
- consentimentos;
- anamnese;
- respostas;
- Health Signals;
- fatos;
- eventos;
- estados;
- hipóteses;
- evidências;
- memória;
- perfil de inteligência;
- check-ins;
- timeline;
- segurança;
- auditoria;
- exclusão;
- versionamento.

---

## 2. Princípios

1. O dado original deve ser preservado.
2. Histórico não deve ser sobrescrito.
3. Toda informação relevante deve registrar origem.
4. Toda informação temporal deve registrar quando ocorreu e quando foi registrada.
5. Hipótese não deve ser armazenada como fato.
6. Consentimento deve ser versionado.
7. Dados sensíveis devem ser classificados.
8. Exclusão deve ser projetada desde o início.
9. Logs devem seguir minimização.
10. O modelo deve permitir correção e rastreabilidade.
11. O MVP deve usar arquitetura simples.
12. O modelo deve permitir evolução sem exigir reconstrução total.

---

## 3. Estratégia de armazenamento

### MVP

Recomendação inicial:

- PostgreSQL como banco principal;
- armazenamento de objetos para arquivos;
- JSONB para estruturas flexíveis;
- fila para processamento assíncrono;
- busca semântica futura;
- sem banco de grafo no primeiro Alpha.

### Justificativa

O PostgreSQL permite:

- consistência;
- relacionamentos;
- transações;
- histórico;
- JSON;
- busca;
- simplicidade operacional.

### Futuro

Avaliar:

- pgvector;
- banco de grafo;
- data warehouse;
- feature store;
- event streaming.

---

## 4. Visão geral das entidades

```text
User
  ├── UserProfile
  ├── Consent
  ├── Assessment
  │     ├── AssessmentSection
  │     ├── Question
  │     └── Answer
  ├── HealthSignal
  ├── Fact
  ├── Event
  ├── State
  ├── Memory
  ├── Hypothesis
  │     └── Evidence
  ├── Trajectory
  ├── PersonalProfile
  ├── CheckIn
  ├── Conversation
  │     └── Message
  ├── Feedback
  ├── SafetyFlag
  └── AuditLog
```

---

# 5. User

## Responsabilidade

Representar a identidade principal da conta.

## Campos

```text
id UUID PK
email VARCHAR UNIQUE
password_hash VARCHAR
status ENUM
email_verified_at TIMESTAMP NULL
created_at TIMESTAMP
updated_at TIMESTAMP
deleted_at TIMESTAMP NULL
```

## Status

- pending;
- active;
- paused;
- suspended;
- deletion_requested;
- deleted.

## Regras

- e-mail deve ser único;
- senha nunca deve ser armazenada em texto;
- exclusão lógica precede exclusão definitiva quando necessário;
- acesso depende do status.

---

# 6. UserProfile

## Responsabilidade

Armazenar dados pessoais básicos.

## Campos

```text
id UUID PK
user_id UUID FK
preferred_name VARCHAR
birth_date DATE
biological_sex VARCHAR NULL
height_cm NUMERIC NULL
occupation VARCHAR NULL
work_format VARCHAR NULL
household_context JSONB NULL
timezone VARCHAR
locale VARCHAR
created_at TIMESTAMP
updated_at TIMESTAMP
```

## Sensibilidade

Personal ou Sensitive conforme campo.

---

# 7. Consent

## Responsabilidade

Registrar consentimentos.

## Campos

```text
id UUID PK
user_id UUID FK
consent_type VARCHAR
document_version VARCHAR
granted BOOLEAN
granted_at TIMESTAMP
revoked_at TIMESTAMP NULL
scope JSONB
source VARCHAR
ip_hash VARCHAR NULL
created_at TIMESTAMP
```

## Tipos

- terms_of_use;
- privacy_policy;
- personal_analysis;
- longitudinal_storage;
- notifications;
- anonymized_learning;
- professional_sharing.

## Regra

Nova versão de documento exige novo registro.

---

# 8. Assessment

## Responsabilidade

Representar uma execução da anamnese.

## Campos

```text
id UUID PK
user_id UUID FK
assessment_type VARCHAR
version VARCHAR
status ENUM
started_at TIMESTAMP
completed_at TIMESTAMP NULL
progress NUMERIC
data_quality VARCHAR NULL
created_at TIMESTAMP
updated_at TIMESTAMP
```

## Status

- not_started;
- in_progress;
- paused;
- completed;
- abandoned;
- invalidated.

---

# 9. AssessmentSection

## Responsabilidade

Controlar blocos.

## Campos

```text
id UUID PK
assessment_id UUID FK
section_code VARCHAR
position INTEGER
status ENUM
started_at TIMESTAMP NULL
completed_at TIMESTAMP NULL
```

---

# 10. Question

## Responsabilidade

Versionar perguntas.

## Campos

```text
id UUID PK
question_code VARCHAR
version VARCHAR
section_code VARCHAR
text TEXT
response_type VARCHAR
required_level VARCHAR
sensitive BOOLEAN
help_text TEXT NULL
mapping JSONB
branching_rules JSONB
active BOOLEAN
created_at TIMESTAMP
```

## Regra

Perguntas não devem ser alteradas sem nova versão.

---

# 11. Answer

## Responsabilidade

Armazenar respostas.

## Campos

```text
id UUID PK
assessment_id UUID FK
question_id UUID FK
user_id UUID FK
value_json JSONB
free_text TEXT NULL
source VARCHAR
answered_at TIMESTAMP
skipped BOOLEAN
quality VARCHAR
sensitivity VARCHAR
created_at TIMESTAMP
updated_at TIMESTAMP
```

## Regra

A resposta original deve ser preservada.

---

# 12. AdaptiveQuestion

## Responsabilidade

Registrar perguntas geradas adaptativamente.

## Campos

```text
id UUID PK
assessment_id UUID FK
parent_answer_id UUID FK
prompt_version VARCHAR
model_version VARCHAR
question_text TEXT
reason TEXT
response_type VARCHAR
created_at TIMESTAMP
```

## Regra

A origem da pergunta deve ser auditável.

---

# 13. HealthSignal

## Responsabilidade

Representar a menor unidade relevante.

## Campos

```text
id UUID PK
user_id UUID FK
signal_type VARCHAR
value_json JSONB
unit VARCHAR NULL
source_type VARCHAR
source_id UUID NULL
observed_at TIMESTAMP
recorded_at TIMESTAMP
quality VARCHAR
confidence VARCHAR
sensitivity VARCHAR
consent_scope VARCHAR
processing_status VARCHAR
created_at TIMESTAMP
```

## Índices

- user_id + observed_at;
- signal_type;
- source_type;
- processing_status.

---

# 14. Fact

## Responsabilidade

Armazenar fatos estruturados.

## Campos

```text
id UUID PK
user_id UUID FK
fact_type VARCHAR
subject VARCHAR
predicate VARCHAR
object_json JSONB
source_type VARCHAR
source_id UUID
observed_at TIMESTAMP
valid_from TIMESTAMP
valid_to TIMESTAMP NULL
quality VARCHAR
status VARCHAR
version INTEGER
created_at TIMESTAMP
```

## Status

- active;
- corrected;
- superseded;
- disputed;
- deleted.

---

# 15. Event

## Responsabilidade

Representar acontecimentos.

## Campos

```text
id UUID PK
user_id UUID FK
event_type VARCHAR
description TEXT
started_at TIMESTAMP
ended_at TIMESTAMP NULL
source_type VARCHAR
source_id UUID NULL
severity VARCHAR NULL
metadata JSONB
created_at TIMESTAMP
```

---

# 16. State

## Responsabilidade

Representar condição em período.

## Campos

```text
id UUID PK
user_id UUID FK
state_type VARCHAR
value_json JSONB
classification VARCHAR
valid_from TIMESTAMP
valid_to TIMESTAMP NULL
confidence VARCHAR
status VARCHAR
created_at TIMESTAMP
```

## Status

- active;
- outdated;
- superseded;
- disputed;
- archived.

---

# 17. Relationship

## Responsabilidade

Representar ligação individual.

## Campos

```text
id UUID PK
user_id UUID FK NULL
subject_type VARCHAR
subject_id UUID
predicate VARCHAR
object_type VARCHAR
object_id UUID
direction VARCHAR
strength VARCHAR
evidence_level VARCHAR
conditions JSONB
valid_from TIMESTAMP
valid_to TIMESTAMP NULL
source VARCHAR
version INTEGER
created_at TIMESTAMP
```

## Observação

Relações populacionais e individuais devem ser separadas.

---

# 18. Hypothesis

## Responsabilidade

Registrar interpretação provisória.

## Campos

```text
id UUID PK
user_id UUID FK
title VARCHAR
statement TEXT
domain VARCHAR
status VARCHAR
confidence_level VARCHAR
created_at TIMESTAMP
updated_at TIMESTAMP
review_at TIMESTAMP NULL
version INTEGER
created_by VARCHAR
```

## Status

- open;
- strengthened;
- weakened;
- rejected;
- inconclusive;
- archived.

---

# 19. Evidence

## Responsabilidade

Vincular sustentação a hipóteses.

## Campos

```text
id UUID PK
hypothesis_id UUID FK
evidence_type VARCHAR
source_type VARCHAR
source_id UUID
summary TEXT
direction VARCHAR
relevance VARCHAR
recency VARCHAR
quality VARCHAR
limitations TEXT NULL
created_at TIMESTAMP
```

## Direction

- supporting;
- opposing;
- missing;
- conflicting.

---

# 20. Trajectory

## Responsabilidade

Registrar evolução longitudinal.

## Campos

```text
id UUID PK
user_id UUID FK
dimension VARCHAR
period_start TIMESTAMP
period_end TIMESTAMP
direction VARCHAR
volatility VARCHAR
confidence_level VARCHAR
summary TEXT
source_state_ids JSONB
created_at TIMESTAMP
```

---

# 21. Memory

## Responsabilidade

Representar memória longitudinal.

## Campos

```text
id UUID PK
user_id UUID FK
memory_type VARCHAR
content_json JSONB
source_type VARCHAR
source_id UUID
observed_at TIMESTAMP
valid_from TIMESTAMP
valid_to TIMESTAMP NULL
status VARCHAR
confidence VARCHAR
quality VARCHAR
sensitivity VARCHAR
consent_scope VARCHAR
supersedes UUID NULL
superseded_by UUID NULL
version INTEGER
created_at TIMESTAMP
updated_at TIMESTAMP
deleted_at TIMESTAMP NULL
```

## Índices

- user_id + memory_type;
- status;
- valid_from;
- sensitivity.

---

# 22. Goal

## Campos

```text
id UUID PK
user_id UUID FK
goal_type VARCHAR
description TEXT
importance INTEGER
target_json JSONB NULL
deadline DATE NULL
status VARCHAR
source VARCHAR
created_at TIMESTAMP
updated_at TIMESTAMP
```

---

# 23. Barrier

## Campos

```text
id UUID PK
user_id UUID FK
barrier_type VARCHAR
description TEXT
frequency VARCHAR
context JSONB
status VARCHAR
confidence VARCHAR
created_at TIMESTAMP
updated_at TIMESTAMP
```

---

# 24. Strength

## Campos

```text
id UUID PK
user_id UUID FK
strength_type VARCHAR
description TEXT
evidence_ids JSONB
status VARCHAR
created_at TIMESTAMP
updated_at TIMESTAMP
```

---

# 25. Strategy

## Campos

```text
id UUID PK
user_id UUID FK
goal_id UUID FK NULL
description TEXT
rationale TEXT
source VARCHAR
status VARCHAR
created_at TIMESTAMP
updated_at TIMESTAMP
```

---

# 26. Intervention

## Campos

```text
id UUID PK
strategy_id UUID FK
started_at TIMESTAMP
ended_at TIMESTAMP NULL
status VARCHAR
adherence VARCHAR NULL
user_feedback TEXT NULL
created_at TIMESTAMP
```

---

# 27. Outcome

## Campos

```text
id UUID PK
intervention_id UUID FK NULL
user_id UUID FK
metric VARCHAR
value_json JSONB
unit VARCHAR NULL
observed_at TIMESTAMP
quality VARCHAR
interpretation TEXT NULL
created_at TIMESTAMP
```

---

# 28. PersonalProfile

## Responsabilidade

Armazenar versões do Perfil de Inteligência.

## Campos

```text
id UUID PK
user_id UUID FK
profile_version INTEGER
hie_version VARCHAR
model_version VARCHAR
prompt_version VARCHAR
status VARCHAR
summary TEXT
content_json JSONB
data_snapshot_id UUID
generated_at TIMESTAMP
published_at TIMESTAMP NULL
superseded_at TIMESTAMP NULL
safety_status VARCHAR
created_at TIMESTAMP
```

## Status

- processing;
- generated;
- published;
- failed;
- superseded;
- blocked.

---

# 29. CheckIn

## Campos

```text
id UUID PK
user_id UUID FK
checkin_type VARCHAR
period_start DATE
period_end DATE
status VARCHAR
started_at TIMESTAMP
completed_at TIMESTAMP NULL
summary TEXT NULL
created_at TIMESTAMP
```

## Relação

Respostas do check-in podem reutilizar Question e Answer.

---

# 30. Conversation

## Campos

```text
id UUID PK
user_id UUID FK
conversation_type VARCHAR
status VARCHAR
started_at TIMESTAMP
ended_at TIMESTAMP NULL
created_at TIMESTAMP
```

---

# 31. Message

## Campos

```text
id UUID PK
conversation_id UUID FK
sender_type VARCHAR
content TEXT
created_at TIMESTAMP
model_version VARCHAR NULL
prompt_version VARCHAR NULL
safety_status VARCHAR
memory_promotion_status VARCHAR
```

## Regra

Mensagem não vira memória automaticamente.

---

# 32. Feedback

## Campos

```text
id UUID PK
user_id UUID FK
feedback_type VARCHAR
target_type VARCHAR
target_id UUID NULL
rating INTEGER NULL
comment TEXT NULL
severity VARCHAR NULL
status VARCHAR
created_at TIMESTAMP
resolved_at TIMESTAMP NULL
```

---

# 33. SafetyFlag

## Campos

```text
id UUID PK
user_id UUID FK
risk_type VARCHAR
severity VARCHAR
trigger TEXT
input_excerpt TEXT NULL
response_excerpt TEXT NULL
action VARCHAR
status VARCHAR
created_at TIMESTAMP
reviewed_at TIMESTAMP NULL
reviewer_id UUID NULL
```

---

# 34. Incident

## Campos

```text
id UUID PK
severity VARCHAR
category VARCHAR
description TEXT
user_impact TEXT
root_cause TEXT NULL
containment TEXT NULL
resolution TEXT NULL
status VARCHAR
owner_id UUID NULL
created_at TIMESTAMP
resolved_at TIMESTAMP NULL
```

---

# 35. AuditLog

## Campos

```text
id UUID PK
actor_type VARCHAR
actor_id UUID NULL
action VARCHAR
target_type VARCHAR
target_id UUID NULL
metadata JSONB
created_at TIMESTAMP
ip_hash VARCHAR NULL
```

## Regra

Não armazenar conteúdo sensível desnecessário.

---

# 36. PromptRegistry

## Campos

```text
id UUID PK
prompt_key VARCHAR
version VARCHAR
purpose VARCHAR
template TEXT
input_schema JSONB
output_schema JSONB
status VARCHAR
created_at TIMESTAMP
retired_at TIMESTAMP NULL
```

---

# 37. ModelRegistry

## Campos

```text
id UUID PK
provider VARCHAR
model_name VARCHAR
version VARCHAR
purpose VARCHAR
status VARCHAR
configuration JSONB
created_at TIMESTAMP
retired_at TIMESTAMP NULL
```

---

# 38. HIEExecution

## Campos

```text
id UUID PK
user_id UUID FK
execution_type VARCHAR
input_snapshot_id UUID
prompt_version VARCHAR
model_version VARCHAR
hie_version VARCHAR
status VARCHAR
latency_ms INTEGER
cost_estimate NUMERIC
safety_status VARCHAR
started_at TIMESTAMP
completed_at TIMESTAMP NULL
```

---

# 39. DataSnapshot

## Responsabilidade

Registrar conjunto de dados usado em geração.

## Campos

```text
id UUID PK
user_id UUID FK
snapshot_type VARCHAR
content_hash VARCHAR
included_entities JSONB
created_at TIMESTAMP
```

## Objetivo

Permitir reproduzir e auditar perfis.

---

# 40. FileAsset

## Campos

```text
id UUID PK
user_id UUID FK
file_type VARCHAR
storage_key VARCHAR
mime_type VARCHAR
size_bytes INTEGER
checksum VARCHAR
sensitivity VARCHAR
uploaded_at TIMESTAMP
deleted_at TIMESTAMP NULL
```

## Regra

Arquivos não devem ficar diretamente no banco.

---

# 41. Relacionamentos principais

```text
User 1—1 UserProfile
User 1—N Consent
User 1—N Assessment
Assessment 1—N Answer
User 1—N HealthSignal
User 1—N Fact
User 1—N Event
User 1—N State
User 1—N Memory
User 1—N Hypothesis
Hypothesis 1—N Evidence
User 1—N PersonalProfile
User 1—N CheckIn
User 1—N Conversation
Conversation 1—N Message
User 1—N Feedback
User 1—N SafetyFlag
```

---

# 42. Temporalidade

## Regras

- created_at: quando registro foi criado;
- observed_at: quando ocorreu;
- valid_from: quando passou a valer;
- valid_to: quando deixou de valer;
- updated_at: quando foi alterado;
- deleted_at: exclusão lógica.

---

# 43. Versionamento

Versionar:

- perguntas;
- consentimentos;
- perfis;
- prompts;
- modelos;
- hipóteses;
- memórias;
- relações;
- regras.

---

# 44. Correção

## Padrão

- não editar silenciosamente;
- criar nova versão;
- marcar anterior;
- reprocessar derivados;
- registrar auditoria.

---

# 45. Exclusão

## Etapas

1. marcar conta;
2. bloquear processamento;
3. identificar dados;
4. excluir ou anonimizar;
5. remover arquivos;
6. remover embeddings futuros;
7. revisar derivados;
8. registrar conclusão.

## Regra

Dados legalmente retidos devem ser segregados.

---

# 46. Classificação de sensibilidade

- standard;
- personal;
- sensitive;
- highly_sensitive.

## Aplicação

Cada tabela deve possuir classificação padrão e, quando necessário, por campo.

---

# 47. Controle de acesso

## Papéis iniciais

- user;
- admin;
- reviewer;
- system.

## Futuro

- nutritionist;
- trainer;
- support;
- data_protection;
- safety_reviewer.

---

# 48. Índices recomendados

- user_id;
- created_at;
- observed_at;
- status;
- type;
- severity;
- consent_type;
- hypothesis_id;
- memory_type;
- signal_type.

---

# 49. Integridade

## Regras

- FK quando possível;
- enums controlados;
- constraints;
- idempotência;
- unique keys;
- transações;
- validação de schema.

---

# 50. JSONB

Usar para:

- conteúdo variável;
- respostas;
- metadados;
- snapshots;
- configurações;
- output estruturado.

Evitar para:

- campos usados em filtros frequentes;
- chaves centrais;
- relações principais;
- dados que exigem constraint forte.

---

# 51. Eventos de domínio

Exemplos:

- UserRegistered;
- ConsentGranted;
- AssessmentCompleted;
- ProfileGenerated;
- CheckInCompleted;
- HypothesisCreated;
- MemoryCorrected;
- SafetyFlagRaised;
- DeletionRequested.

---

# 52. Migrações

## Regra

Toda mudança de schema deve:

- ter migration;
- ter rollback;
- ser revisada;
- preservar dados;
- atualizar documentação.

---

# 53. Backup

## Requisitos

- backup automático;
- criptografia;
- teste de restauração;
- retenção definida;
- segregação de produção.

---

# 54. Critérios de aceite

O Data Model v0.1 estará pronto quando:

- entidades principais estiverem definidas;
- relacionamentos estiverem claros;
- temporalidade estiver prevista;
- consentimento estiver modelado;
- auditoria estiver modelada;
- segurança estiver modelada;
- exclusão estiver prevista;
- versionamento estiver previsto;
- HIE estiver integrado;
- perfil puder ser reproduzido.

---

# 55. Riscos

1. Modelo complexo demais.
2. Uso excessivo de JSONB.
3. Dados derivados difíceis de excluir.
4. Logs sensíveis.
5. Falta de índices.
6. Conflitos de versão.
7. Duplicidade.
8. Falta de rastreabilidade.
9. Acoplamento ao provedor.
10. Migração difícil.

---

# 56. Mitigações

- modularidade;
- schema review;
- constraints;
- versionamento;
- snapshots;
- auditoria;
- minimização;
- testes;
- migrations;
- documentação.

---

# 57. Questões abertas

1. Qual provedor de banco?
2. Usar Supabase?
3. Usar Prisma?
4. Usar Drizzle?
5. Quando adicionar pgvector?
6. Como armazenar embeddings?
7. Como anonimizar dados?
8. Qual política de retenção?
9. Qual estratégia de tenancy?
10. Como modelar profissionais?
11. Como modelar cobrança?
12. Como implementar data lineage?

---

# 58. Próximo documento

O próximo documento será:

> Higeia Technical Architecture v0.1.

Ele definirá:

- front-end;
- back-end;
- banco;
- autenticação;
- filas;
- IA;
- armazenamento;
- deploy;
- ambientes;
- observabilidade;
- segurança;
- integração entre componentes.

---

# 59. Histórico

| Versão | Data | Alteração |
|---|---|---|
| 0.1 | 13/07/2026 | Primeira especificação do modelo de dados do Higeia. |
