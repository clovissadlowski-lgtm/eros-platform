# Higeia API Conventions v1.0

## 1. Finalidade

Define o padrão HTTP/JSON da Higeia para manter frontend, mobile, testes, integrações e documentação consistentes.

## 2. Prefixo

PoC atual:

```text
/api
```

Antes de estabilização externa:

```text
/api/v1
```

## 3. Rotas

Usar plural, minúsculas e kebab-case:

```text
/patients
/care-plans
/ai-analyses
```

Evitar verbos em rotas, exceto transições de negócio claras:

```text
POST /assessments/:assessmentId/complete
```

## 4. Métodos HTTP

- GET: consultar;
- POST: criar ou executar ação não idempotente;
- PUT: substituição completa;
- PATCH: alteração parcial;
- DELETE: exclusão permitida ou solicitação de exclusão.

GET nunca altera estado.

## 5. Status HTTP

Sucesso:

- 200 OK
- 201 Created
- 202 Accepted
- 204 No Content

Erros do cliente:

- 400 Bad Request
- 401 Unauthorized
- 403 Forbidden
- 404 Not Found
- 409 Conflict
- 422 Unprocessable Entity
- 429 Too Many Requests

Erros de servidor:

- 500 Internal Server Error
- 502 Bad Gateway
- 503 Service Unavailable
- 504 Gateway Timeout

Não retornar erro dentro de resposta 200.

## 6. Identificadores

Usar identificadores opacos, inicialmente UUID ou equivalente.

Parâmetros descritivos:

```text
:patientId
:assessmentId
```

## 7. Datas

Timestamp UTC em ISO 8601:

```text
2026-07-22T21:30:00.000Z
```

Data sem horário:

```text
1990-05-14
```

Frontend cuida da apresentação local.

## 8. Campos JSON

Usar camelCase:

```json
{
  "organizationId": "org-id",
  "birthDate": "1990-05-14",
  "createdAt": "2026-07-22T21:30:00.000Z"
}
```

## 9. Resposta de recurso único

Padrão futuro:

```json
{
  "data": {
    "id": "patient-id",
    "name": "Maria da Silva",
    "status": "ACTIVE"
  }
}
```

Na PoC interna, objeto direto pode ser aceito temporariamente.

O health check permanece simples.

## 10. Coleções

```json
{
  "data": [],
  "meta": {
    "page": 1,
    "pageSize": 20,
    "total": 0,
    "totalPages": 0
  }
}
```

Depois da estabilização pública, coleções não retornam array puro.

## 11. Paginação

Parâmetros:

```text
page=1
pageSize=20
```

Padrões:

- page: 1
- pageSize: 20
- máximo: 100

## 12. Filtros e ordenação

Exemplo:

```text
GET /api/v1/patients?status=ACTIVE&search=maria
```

Ordenação:

```text
sort=createdAt&order=desc
```

Campos de filtro e ordenação devem ser permitidos explicitamente.

## 13. PATCH

Somente campos enviados são alterados.

Campo ausente e campo enviado como `null` são operações diferentes.

## 14. Exemplo de criação

Request:

```json
{
  "name": "Maria da Silva",
  "email": "maria@example.com",
  "phone": "+5547999999999",
  "birthDate": "1990-05-14"
}
```

Response `201 Created`:

```json
{
  "data": {
    "id": "generated-id",
    "name": "Maria da Silva",
    "email": "maria@example.com",
    "phone": "+5547999999999",
    "birthDate": "1990-05-14",
    "status": "ACTIVE",
    "createdAt": "2026-07-22T21:30:00.000Z",
    "updatedAt": "2026-07-22T21:30:00.000Z"
  }
}
```

`organizationId` vem do contexto autenticado.

## 15. Erros

Baseline:

```json
{
  "statusCode": 404,
  "code": "PATIENT_NOT_FOUND",
  "message": "Patient not found.",
  "details": null,
  "requestId": "request-id",
  "timestamp": "2026-07-22T21:30:00.000Z"
}
```

- `code` é estável;
- `message` é segura;
- `details` não contém dado sensível;
- stack trace nunca é retornado.

## 16. Erros de validação

```json
{
  "statusCode": 400,
  "code": "VALIDATION_ERROR",
  "message": "Request validation failed.",
  "details": [
    {
      "field": "email",
      "constraints": ["must be an email"]
    }
  ],
  "requestId": "request-id",
  "timestamp": "2026-07-22T21:30:00.000Z"
}
```

## 17. Autenticação

```http
Authorization: Bearer <token>
```

O tenant é resolvido pelo backend.

## 18. Operações assíncronas

Para trabalho demorado:

```http
202 Accepted
```

```json
{
  "data": {
    "jobId": "job-id",
    "status": "PENDING"
  }
}
```

## 19. Versionamento

Mudanças incompatíveis exigem nova versão após estabilização pública.

Mudanças incompatíveis incluem:

- remover campo;
- mudar tipo;
- mudar significado;
- mudar autenticação;
- tornar campo obrigatório.

## 20. OpenAPI

A API de produção deve publicar OpenAPI com:

- DTOs;
- autenticação;
- status;
- erros;
- exemplos;
- jornadas críticas.

## 21. Checklist de endpoint

- rota está correta?
- método HTTP está correto?
- tenant vem da autenticação?
- DTO foi validado?
- status está correto?
- resposta está consistente?
- datas são ISO 8601?
- campos são camelCase?
- erros são seguros?
- paginação é necessária?
- filtros são permitidos?
- dados sensíveis foram minimizados?
- OpenAPI foi atualizado?
