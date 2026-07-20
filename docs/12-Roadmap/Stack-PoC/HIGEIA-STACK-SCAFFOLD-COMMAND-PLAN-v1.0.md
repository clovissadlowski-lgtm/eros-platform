# Higeia — Scaffold Command Plan

> Execute um bloco por vez. Confira o resultado antes de prosseguir.

## 1. Criar o workspace raiz

Crie `pnpm-workspace.yaml`:

```yaml
packages:
  - "apps/*"
  - "packages/*"
```

Crie ou ajuste o `package.json` da raiz:

```json
{
  "name": "eros-platform",
  "private": true,
  "scripts": {
    "dev:web": "pnpm --dir apps/web dev",
    "dev:api": "pnpm --dir apps/api start:dev",
    "test": "pnpm -r test",
    "build": "pnpm -r build"
  }
}
```

## 2. Criar o frontend

Na raiz:

```powershell
pnpm create next-app apps/web
```

Seleções recomendadas:

- TypeScript: Yes
- ESLint: Yes
- Tailwind CSS: Yes
- `src/` directory: Yes
- App Router: Yes
- Import alias: manter `@/*`

## 3. Criar o backend

Método preferencial com Nest CLI:

```powershell
npm install -g @nestjs/cli
nest new apps/api --strict
```

Ao escolher o package manager, use `pnpm`.

## 4. Criar pacotes compartilhados

```powershell
New-Item -ItemType Directory -Force packages/shared-types
New-Item -ItemType Directory -Force packages/validation
New-Item -ItemType Directory -Force packages/ai-contracts
```

## 5. Não executar ainda

Não instale nesta primeira sessão:

- AWS SDK;
- OpenAI SDK;
- Prisma;
- Cognito SDK;
- Terraform;
- ferramentas de observabilidade.

Primeiro confirme que o frontend e o backend básicos iniciam.
