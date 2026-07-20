# Higeia — AI Metrics Catalog

**Versão:** 0.1

| Metric ID | Metric | Type | Unit | Description | Dimensions | Owner | Alert | Status |
|---|---|---|---|---|---|---|---|---|
| MET-AI-001 | ai_execution_count | Counter | executions | Total de execuções | prompt, model, environment | TBD | No | Proposed |
| MET-AI-002 | ai_execution_latency | Histogram | ms | Latência da execução | prompt, model, flow | TBD | Yes | Proposed |
| MET-AI-003 | ai_execution_cost | Gauge | currency | Custo estimado | prompt, model, flow | TBD | Yes | Proposed |
| MET-AI-004 | ai_schema_pass_rate | Gauge | percent | Saídas válidas | prompt, schema | TBD | Yes | Proposed |
| MET-AI-005 | ai_safety_trigger_rate | Gauge | percent | Eventos de safety | flow, level | TBD | Yes | Proposed |
| MET-AI-006 | ai_fallback_rate | Gauge | percent | Uso de fallback | prompt, model | TBD | Yes | Proposed |
| MET-AI-007 | ai_retry_rate | Gauge | percent | Retries | provider, model | TBD | Yes | Proposed |
| MET-AI-008 | ai_user_feedback_score | Gauge | score | Feedback de utilidade | flow, version | TBD | No | Proposed |

## Regras

- Toda métrica deve ter owner.
- Toda métrica crítica deve ter threshold.
- Métricas devem ser segmentáveis por versão.
- Não criar métrica sem decisão operacional associada.
