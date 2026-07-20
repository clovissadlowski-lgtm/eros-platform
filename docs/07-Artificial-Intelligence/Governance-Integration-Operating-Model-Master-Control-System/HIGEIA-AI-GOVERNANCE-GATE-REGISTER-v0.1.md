# Higeia — AI Governance Gate Register

**Versão:** 0.1

| Gate ID | Gate | Scope | Mandatory Reviewers | Required Evidence | Decision Authority | Decisions | Expiry |
|---|---|---|---|---|---|---|---|
| GATE-001 | Use case assessment | New AI use case | Product, AI, Risk | Brief, risk, value | Founder/Product | Approve/Restrict/Block | On material change |
| GATE-002 | Model approval | New model/provider | AI, Security, Privacy, Vendor | Model card, terms, evaluation | AI Owner + Risk | Approve/Restrict/Reject | On version/terms change |
| GATE-003 | Production release | Production deployment | Engineering, AI, Safety as applicable | Release gate, test, evidence | Release Authority | Approve/Rework/Block | Per release |
| GATE-004 | Incident closure | Major incident | Operations, Security, Domain owner | Timeline, validation, actions | Incident Authority | Close/Reopen | Per incident |

## Regra

O gate deve bloquear avanço quando evidências obrigatórias estiverem ausentes.
