# Higeia — AI Orchestration and Human Review Flow

1. User or system requests AI task.
2. Authorization and tenant checks run.
3. Use case and prompt version are selected.
4. Only approved context is assembled.
5. Sensitive data is minimized or redacted.
6. Provider adapter sends the request.
7. Response is validated against schema.
8. Safety checks run.
9. Draft output is stored.
10. Professional reviews the draft.
11. Professional approves, corrects, rejects or escalates.
12. Final allowed result is recorded.
13. Metrics, cost and evidence are updated.

## Fail-safe behavior

If any critical step fails:

- do not publish;
- mark as unavailable;
- preserve trace metadata;
- notify operations when required;
- allow manual continuation where safe.
