# Higeia Patients Implementation Plan v1.0

## Objetivo

Implementar a primeira fatia funcional de negócio da Higeia.

## Etapa 1 — Estrutura

Criar:

```text
apps/api/src/patients/
```

Arquivos:

- DTO;
- entity;
- error;
- service;
- controller;
- module;
- unit test.

## Etapa 2 — Integração

Adicionar `PatientsModule` ao `AppModule`.

## Etapa 3 — Contratos

Implementar:

```text
POST /api/patients
GET /api/patients
GET /api/patients/:patientId
```

## Etapa 4 — Tenant temporário

Usar constante interna:

```text
development-organization
```

Não aceitar tenant no body.

## Etapa 5 — Testes

Executar:

```powershell
pnpm --filter api run test
pnpm --filter api run build
```

## Etapa 6 — Teste manual

Criar paciente:

```powershell
$body = @{
  name = "Maria da Silva"
  email = "maria@example.com"
  phone = "+5547999999999"
  birthDate = "1990-05-14"
} | ConvertTo-Json

Invoke-RestMethod `
  -Method Post `
  -Uri http://localhost:3001/api/patients `
  -ContentType "application/json" `
  -Body $body
```

Listar:

```powershell
Invoke-RestMethod http://localhost:3001/api/patients
```

Consultar:

```powershell
Invoke-RestMethod http://localhost:3001/api/patients/<patientId>
```

## Etapa 7 — Evidência

Criar pasta:

```text
evidence/stack-poc/patients/
```

Registrar:

- build;
- testes;
- criação;
- listagem;
- consulta;
- erro 404.

## Etapa 8 — Commit

Sugestão:

```text
feat(patients): add in-memory patient endpoints
```

## Etapa 9 — Próximo gate

Após aprovação:

- criar repository port;
- adicionar Prisma;
- criar migration;
- mover armazenamento para PostgreSQL;
- manter contrato HTTP.
