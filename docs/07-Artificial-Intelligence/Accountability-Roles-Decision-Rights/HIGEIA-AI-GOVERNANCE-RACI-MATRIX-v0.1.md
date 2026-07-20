# Higeia — AI Governance RACI Matrix

**Versão:** 0.1

Legenda:

- R = Responsible
- A = Accountable
- C = Consulted
- I = Informed

| Process | Founder | Product | AI | Engineering | Data | Safety | Clinical | Privacy | Security | Operations |
|---|---|---|---|---|---|---|---|---|---|---|
| Define AI use case | C | A/R | R | C | C | C | C | C | C | I |
| Select model | I | C | A/R | R | C | C | C | C | C | C |
| Approve clinical behavior | I | C | R | I | C | C | A/R | C | I | I |
| Approve safety critical change | C | C | R | C | C | A | C | C | C | I |
| Approve production release | C | A | R | R | C | C | C | C | C | R |
| Execute deployment | I | I | C | A/R | I | I | I | I | C | R |
| Execute rollback | I | I | C | A/R | I | C | C | C | C | R |
| Handle privacy incident | I | I | C | R | C | C | I | A | R | C |
| Handle security incident | I | I | C | R | I | C | I | C | A | R |
| Approve vendor critical | A | C | C | C | C | C | C | C | C | I |
| Approve exception critical | A | C | C | C | C | C | C | C | C | I |

## Regras

- Ajustar nomes e alçadas conforme a equipe real.
- Cada linha deve ter um único A.
- Mudanças críticas não devem depender de uma única pessoa sem revisão.
