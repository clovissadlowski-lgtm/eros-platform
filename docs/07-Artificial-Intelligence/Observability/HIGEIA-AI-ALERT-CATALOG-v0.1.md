# Higeia — AI Alert Catalog

**Versão:** 0.1

| Alert ID | Condition | Severity | Window | Owner | Runbook | Status |
|---|---|---|---|---|---|---|
| ALT-AI-001 | Cross-user data detected | A0 | Immediate | TBD | Incident Playbook | Proposed |
| ALT-AI-002 | Safety critical failure > 0 | A0 | Immediate | TBD | Safety Playbook | Proposed |
| ALT-AI-003 | Schema pass rate below threshold | A1 | 5 min | TBD | Schema Runbook | Proposed |
| ALT-AI-004 | AI cost exceeds daily budget | A1 | Daily | TBD | Cost Runbook | Proposed |
| ALT-AI-005 | P95 latency above threshold | A2 | 15 min | TBD | Latency Runbook | Proposed |
| ALT-AI-006 | Fallback rate anomalous | A2 | 15 min | TBD | Provider Runbook | Proposed |
| ALT-AI-007 | Retry rate anomalous | A2 | 15 min | TBD | Provider Runbook | Proposed |
| ALT-AI-008 | Logging pipeline unavailable | A1 | 5 min | TBD | Observability Runbook | Proposed |

## Regras

- Todo alerta precisa de owner.
- Todo alerta precisa de runbook.
- Alertas sem ação devem ser removidos ou reconfigurados.
- Alertas críticos devem ser testados antes do Alpha.
