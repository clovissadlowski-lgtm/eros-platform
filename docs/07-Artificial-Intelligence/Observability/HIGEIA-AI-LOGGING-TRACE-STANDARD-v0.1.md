# Higeia — AI Logging and Trace Standard

**Versão:** 0.1

## Eventos mínimos

- ai_execution_started
- ai_execution_completed
- ai_execution_failed
- ai_schema_failed
- ai_safety_triggered
- ai_fallback_used
- ai_retry_performed
- ai_tool_called
- ai_tool_failed
- ai_cost_threshold_exceeded
- ai_model_changed
- ai_prompt_changed
- ai_incident_opened

## Campos obrigatórios

- timestamp
- environment
- event
- execution_id
- correlation_id
- result
- prompt_id/version
- model_id/version
- schema_version
- latency_ms
- token usage
- estimated cost
- retry count
- fallback
- safety status

## Regras

- Não registrar dados sensíveis brutos.
- Usar redaction antes de persistir.
- Logs devem ser estruturados.
- Todos os horários devem usar padrão consistente.
- Toda falha deve ter correlation ID.
- Toda mudança de versão deve ser auditável.
