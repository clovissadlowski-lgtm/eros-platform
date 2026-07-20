# Higeia — Critical Service and Dependency Register

**Versão:** 0.1

| Service ID | Service | Criticality | Owner | Dependencies | RTO | RPO | Fallback | Last Test | Status |
|---|---|---|---|---|---|---|---|---|---|
| SVC-001 | Authentication | Critical | TBD | Identity provider, database | TBD | TBD | Restricted access mode | TBD | Proposed |
| SVC-002 | Core user data | Critical | TBD | Database, storage | TBD | TBD | Read-only where safe | TBD | Proposed |
| SVC-003 | AI response generation | High | TBD | AI provider, prompts | TBD | TBD | Secondary model or safe message | TBD | Proposed |
| SVC-004 | RAG retrieval | High | TBD | Vector DB, source registry | TBD | TBD | Disable sourced answers | TBD | Proposed |

## Regras

- Atualizar quando dependências mudarem.
- Serviço crítico deve possuir runbook e teste.
