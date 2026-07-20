# Higeia — AI Fallback and Degraded Mode Matrix

**Versão:** 0.1

| Component Failure | Trigger | Degraded Mode | Fallback | User Message | Max Duration | Owner | Exit Criteria |
|---|---|---|---|---|---|---|---|
| Primary AI provider unavailable | Timeout/error threshold | AI limited | Secondary model or safe unavailable response | TBD | TBD | AI/Operations | Provider stable and validated |
| RAG unavailable | Retrieval failure | No sourced answer | Block source-dependent response | TBD | TBD | AI/Data | Retrieval tested |
| Memory unavailable | Memory read/write error | Session-only | No long-term memory | TBD | TBD | AI/Data | Memory consistency validated |
| Database read-only | Database incident | Read-only | Preserve access where safe | TBD | TBD | Engineering | Writes restored and reconciled |

## Regra

Fallback não deve produzir comportamento mais arriscado que o componente principal.
