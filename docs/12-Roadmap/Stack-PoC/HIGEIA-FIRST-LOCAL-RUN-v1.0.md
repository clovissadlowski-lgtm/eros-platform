# Higeia — First Local Run

## Frontend

Em um terminal:

```powershell
pnpm dev:web
```

Abra o endereço informado pelo terminal.

Registre:

- data;
- endereço;
- screenshot;
- resultado.

## Backend

Em outro terminal:

```powershell
pnpm dev:api
```

Abra:

```text
http://localhost:3000
```

Como Next.js normalmente também tenta usar a porta 3000, altere a porta da API para 3001 antes de executar os dois juntos.

## Porta recomendada

- Web: `3000`
- API: `3001`

## Health check esperado

```text
GET http://localhost:3001/health
```

Resposta:

```json
{
  "status": "ok",
  "service": "higeia-api"
}
```

## Evidência

Salve em:

```text
evidence/stack-poc/
```

- screenshot-web.png;
- health-response.txt;
- terminal-output.txt;
- git-status.txt.
