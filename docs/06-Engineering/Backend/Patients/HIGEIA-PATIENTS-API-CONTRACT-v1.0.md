# Higeia Patients API Contract v1.0

**Status:** Contrato inicial interno  
**Base path atual:** `/api`  
**Versão:** 1.0

## 1. Criar paciente

```http
POST /api/patients
Content-Type: application/json
```

Request:

```json
{
  "name": "Maria da Silva",
  "email": "maria@example.com",
  "phone": "+5547999999999",
  "birthDate": "1990-05-14"
}
```

Regras:

- `name`: obrigatório, 2 a 120 caracteres;
- `email`: opcional, válido;
- `phone`: opcional, 8 a 20 caracteres;
- `birthDate`: opcional, `YYYY-MM-DD`;
- campos extras são rejeitados;
- `organizationId` não é aceito no body.

Resposta esperada:

```http
201 Created
```

```json
{
  "id": "generated-id",
  "organizationId": "development-organization",
  "name": "Maria da Silva",
  "email": "maria@example.com",
  "phone": "+5547999999999",
  "birthDate": "1990-05-14",
  "status": "ACTIVE",
  "createdAt": "2026-07-22T21:30:00.000Z",
  "updatedAt": "2026-07-22T21:30:00.000Z"
}
```

Na PoC, resposta direta é aceita. O envelope `{ "data": ... }` será aplicado antes da estabilização pública.

## 2. Listar pacientes

```http
GET /api/patients
```

Resposta:

```http
200 OK
```

```json
[
  {
    "id": "generated-id",
    "organizationId": "development-organization",
    "name": "Maria da Silva",
    "email": "maria@example.com",
    "phone": "+5547999999999",
    "birthDate": "1990-05-14",
    "status": "ACTIVE",
    "createdAt": "2026-07-22T21:30:00.000Z",
    "updatedAt": "2026-07-22T21:30:00.000Z"
  }
]
```

Futuro:

```text
page
pageSize
search
status
sort
order
```

## 3. Consultar paciente por ID

```http
GET /api/patients/:patientId
```

Resposta:

```http
200 OK
```

```json
{
  "id": "generated-id",
  "organizationId": "development-organization",
  "name": "Maria da Silva",
  "email": "maria@example.com",
  "phone": "+5547999999999",
  "birthDate": "1990-05-14",
  "status": "ACTIVE",
  "createdAt": "2026-07-22T21:30:00.000Z",
  "updatedAt": "2026-07-22T21:30:00.000Z"
}
```

Não encontrado:

```http
404 Not Found
```

Código:

```text
PATIENT_NOT_FOUND
```

## 4. Validação

Exemplo:

```json
{
  "name": "",
  "email": "invalid"
}
```

Resposta esperada:

```http
400 Bad Request
```

A forma final seguirá o Error Handling Standard.

## 5. Tenant temporário da PoC

Enquanto autenticação não estiver implementada, o backend usará internamente:

```text
development-organization
```

Esse valor:

- não vem do body;
- não é escolhido pelo cliente;
- será removido quando Cognito e membership forem implementados;
- não deve ser usado em produção.

## 6. Compatibilidade futura

A evolução para PostgreSQL, Prisma, autenticação e envelope de resposta deve preservar:

- rotas;
- significado;
- campos principais;
- status;
- erros.

Mudanças incompatíveis devem ser documentadas.
