# Higeia — PoC AI Provider Contract

## Objetivo

Demonstrar a abstração do provedor sem chamar um serviço externo.

## Contrato conceitual

```typescript
export interface AIProvider {
  generateStructuredOutput<T>(
    request: AIRequest
  ): Promise<AIProviderResult<T>>;

  healthCheck(): Promise<AIProviderHealth>;

  estimateCost(request: AIRequest): Promise<number>;
}
```

## Mock

O primeiro provider deve:

- receber um objeto sintético;
- retornar uma resposta fixa;
- gerar `traceId`;
- identificar `provider: mock`;
- retornar custo zero;
- nunca acessar a internet.

## Exemplo de cenário

Entrada sintética:

```json
{
  "useCaseId": "UC-002",
  "tenantId": "tenant-test-a",
  "patientReference": "patient-test-001",
  "content": {
    "weightChange": -0.4,
    "adherence": "good",
    "notes": "Synthetic test only"
  }
}
```

Saída:

```json
{
  "traceId": "trace-test-001",
  "status": "draft",
  "provider": "mock",
  "summary": "Synthetic weekly summary for technical validation.",
  "estimatedCost": 0
}
```

## Critérios de aceite

- [ ] nenhum SDK externo;
- [ ] contrato fica em `packages/ai-contracts`;
- [ ] mock fica no backend;
- [ ] teste automatizado;
- [ ] saída marcada como draft;
- [ ] tenant e trace presentes.
