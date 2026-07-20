# Higeia — Windows and VS Code Setup

## 1. Abrir o terminal correto

No VS Code:

```text
Terminal
→ New Terminal
```

Confirme que o terminal está na raiz:

```powershell
Get-Location
```

A pasta deve terminar em:

```text
eros-platform
```

## 2. Verificar ferramentas

```powershell
git --version
node --version
npm --version
pnpm --version
```

Caso `pnpm` não exista, não improvise uma instalação sem antes confirmar a versão do Node.js e o método adotado pelo responsável técnico.

## 3. Conferir o Git

```powershell
git status
git branch --show-current
```

O status precisa estar limpo antes de iniciar.

## 4. Criar a branch

```powershell
git checkout -b feat/stack-poc
```

## 5. Regra de segurança

Nunca cole no terminal:

- senha;
- token da OpenAI;
- chave AWS;
- secret do Cognito;
- private key.

Arquivos `.env` reais não devem ser commitados.
