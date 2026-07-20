# Higeia — Stack PoC Git Workflow

## First commit after scaffold

Summary:

```text
chore: initialize Higeia application workspace
```

Description:

```text
Creates the initial pnpm workspace with Next.js frontend, NestJS backend and shared package directories for the Higeia stack proof of concept.
```

## Commit after health and mock

Summary:

```text
feat: add stack proof of concept foundation
```

Description:

```text
Adds API health checks, the mock AI provider contract, initial tenant isolation tests and proof-of-concept evidence records using synthetic data only.
```

## Before commit

```powershell
git status
git diff
```

## After commit

```powershell
git push -u origin feat/stack-poc
```

Do not merge into `main` before review.
