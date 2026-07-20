# Higeia — AI Control Register Template

**Versão:** 0.1

| Control ID | Control | Risk | Type | Execution | Frequency | Owner | Evidence Expected | Last Test | Next Test | Status |
|---|---|---|---|---|---|---|---|---|---|---|
| CTRL-AI-001 | AI release requires approval | Unapproved production change | Preventive | Hybrid | Per event | TBD | Release gate and approval record | TBD | TBD | Proposed |
| CTRL-AI-002 | Cross-user isolation test | Data leakage | Detective | Automated | On change | TBD | Test report | TBD | TBD | Proposed |
| CTRL-AI-003 | AI rollback available | Unsafe release persistence | Corrective | Hybrid | Quarterly/on change | TBD | Rollback test record | TBD | TBD | Proposed |

## Regras

- Uma linha por controle.
- Todo controle crítico deve possuir evidência.
- Status sem evidência não deve ser marcado como effective.
