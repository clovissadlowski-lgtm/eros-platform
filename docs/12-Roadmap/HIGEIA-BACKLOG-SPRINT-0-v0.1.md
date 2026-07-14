# Higeia — Backlog and Sprint 0 Plan

**Documento:** Higeia Backlog and Sprint 0 Plan  
**Versão:** 0.1  
**Status:** Plano operacional oficial  
**Data:** 14 de julho de 2026  
**Projeto interno:** Projeto Eros  
**Produto:** Higeia  
**Fundador:** Clovis Sadlowski  

---

## 1. Objetivo

Preparar o ambiente técnico do Higeia para iniciar o desenvolvimento com segurança, organização e rastreabilidade.

A Sprint 0 não entrega funcionalidades ao usuário final.

Ela entrega a base necessária para que as próximas sprints possam ser executadas sem improvisação.

---

## 2. Resultado esperado

Ao final da Sprint 0, o projeto deverá possuir:

- aplicação web funcionando localmente;
- repositório organizado;
- TypeScript configurado;
- lint e formatação configurados;
- banco de dados conectado;
- autenticação escolhida;
- variáveis de ambiente documentadas;
- CI funcionando;
- deploy de preview funcionando;
- documentação técnica inicial atualizada;
- backlog inicial criado.

---

## 3. Decisões técnicas propostas

Estas escolhas são provisórias e devem ser confirmadas antes da instalação.

### Front-end e aplicação

- Next.js
- TypeScript
- App Router
- Tailwind CSS

### Banco e autenticação

- Supabase
- PostgreSQL
- Supabase Auth
- Supabase Storage

### ORM

- Prisma

### Validação

- Zod

### UI

- shadcn/ui
- Radix UI

### Deploy

- Vercel

### Monitoramento

- Sentry

### CI

- GitHub Actions

### IA futura

- camada de abstração própria;
- primeiro provedor por API;
- saídas estruturadas em JSON.

---

## 4. Por que esta stack

### Next.js

Permite construir front-end e rotas de servidor na mesma aplicação, reduzindo complexidade para o fundador.

### Supabase

Entrega banco, autenticação e storage em uma plataforma gerenciada.

### Prisma

Facilita o trabalho com banco por meio de modelos tipados.

### Vercel

Simplifica deploy de aplicações Next.js.

### GitHub Actions

Automatiza lint, testes, build e verificações.

### Sentry

Ajuda a detectar erros de produção.

---

## 5. Backlog macro

### EPIC-001 — Foundation

- configuração do projeto;
- ferramentas;
- ambientes;
- CI;
- preview;
- documentação.

### EPIC-002 — Identity

- cadastro;
- login;
- verificação;
- recuperação;
- sessão.

### EPIC-003 — Consent

- termos;
- privacidade;
- consentimentos;
- revogação.

### EPIC-004 — Assessment

- blocos;
- perguntas;
- respostas;
- progresso;
- revisão.

### EPIC-005 — Personal Profile

- processamento;
- fatos;
- hipóteses;
- evidências;
- feedback.

### EPIC-006 — Check-in

- formulário;
- histórico;
- atualização;
- timeline.

### EPIC-007 — Safety

- flags;
- redirecionamento;
- logs;
- incidentes.

### EPIC-008 — Operations

- admin;
- monitoramento;
- backup;
- exclusão;
- auditoria.

---

# 6. Sprint 0 — Tarefas

## S0-001 — Revisar o repositório

### Objetivo
Confirmar a estrutura existente e evitar duplicações.

### Ações
- abrir o repositório;
- verificar pastas;
- verificar arquivos;
- confirmar branch principal;
- confirmar que os documentos estão versionados;
- verificar se existe código inicial.

### Critério de aceite
Estrutura atual conhecida e registrada.

---

## S0-002 — Instalar Node.js

### Recomendação
Instalar a versão LTS atual.

### Verificação

No terminal:

```bash
node -v
npm -v
```

### Critério de aceite
Os dois comandos retornam versões válidas.

---

## S0-003 — Instalar VS Code

### Extensões recomendadas

- ESLint;
- Prettier;
- Prisma;
- GitLens;
- Error Lens;
- Tailwind CSS IntelliSense;
- Markdown All in One.

### Critério de aceite
VS Code abre o repositório e reconhece TypeScript.

---

## S0-004 — Criar ou confirmar aplicação Next.js

### Cenário A — Repositório ainda sem aplicação

Executar:

```bash
npx create-next-app@latest .
```

Escolhas sugeridas:

- TypeScript: Yes
- ESLint: Yes
- Tailwind CSS: Yes
- `src/` directory: Yes
- App Router: Yes
- Turbopack: Yes
- Import alias: Yes

### Cenário B — Aplicação já existente

Executar:

```bash
npm install
npm run dev
```

### Critério de aceite

A aplicação abre em:

```text
http://localhost:3000
```

---

## S0-005 — Configurar Git Ignore

Confirmar que `.gitignore` contém:

```text
node_modules
.next
.env
.env.local
.env.development.local
.env.test.local
.env.production.local
coverage
dist
```

### Critério de aceite
Segredos e dependências não aparecem no GitHub Desktop.

---

## S0-006 — Criar `.env.example`

Criar arquivo:

```text
.env.example
```

Conteúdo inicial:

```text
NEXT_PUBLIC_APP_URL=
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
DATABASE_URL=
DIRECT_URL=
SENTRY_DSN=
AI_PROVIDER_API_KEY=
```

### Regra
Nunca colocar chaves reais nesse arquivo.

---

## S0-007 — Criar projeto Supabase

### Ações

1. criar conta;
2. criar projeto;
3. escolher região;
4. registrar URL;
5. registrar anon key;
6. registrar database URL;
7. guardar service role key com segurança.

### Critério de aceite
Projeto Supabase criado e credenciais disponíveis localmente.

---

## S0-008 — Configurar Prisma

Instalar:

```bash
npm install prisma @prisma/client
npx prisma init
```

Configurar:

```text
DATABASE_URL
DIRECT_URL
```

### Critério de aceite
Prisma reconhece o banco.

---

## S0-009 — Criar schema inicial

Primeiras entidades:

- User;
- UserProfile;
- Consent;
- AuditLog.

### Critério de aceite
Schema compila.

Comando:

```bash
npx prisma validate
```

---

## S0-010 — Criar primeira migration

Executar:

```bash
npx prisma migrate dev --name init
```

### Critério de aceite
Migration criada e aplicada.

---

## S0-011 — Configurar Supabase Auth

### Escopo inicial

- cadastro com e-mail;
- login;
- logout;
- verificação de e-mail;
- recuperação de senha.

### Critério de aceite
Usuário de teste consegue criar conta.

---

## S0-012 — Instalar Zod

Executar:

```bash
npm install zod
```

### Objetivo
Validar formulários, variáveis de ambiente e respostas estruturadas.

---

## S0-013 — Configurar Prettier

Instalar:

```bash
npm install -D prettier prettier-plugin-tailwindcss
```

Criar:

```text
.prettierrc
```

Exemplo:

```json
{
  "semi": true,
  "singleQuote": true,
  "trailingComma": "all",
  "plugins": ["prettier-plugin-tailwindcss"]
}
```

---

## S0-014 — Configurar scripts

Confirmar scripts:

```json
{
  "dev": "next dev",
  "build": "next build",
  "start": "next start",
  "lint": "next lint",
  "typecheck": "tsc --noEmit",
  "format": "prettier --write .",
  "format:check": "prettier --check ."
}
```

---

## S0-015 — Criar estrutura de pastas

Sugestão:

```text
src/
  app/
  components/
  features/
    identity/
    consent/
    assessment/
    profile/
    checkin/
    conversation/
    safety/
  lib/
  services/
  server/
  types/
```

### Critério de aceite
Estrutura criada sem arquivos vazios desnecessários.

---

## S0-016 — Configurar shadcn/ui

Executar:

```bash
npx shadcn@latest init
```

Adicionar componentes iniciais:

```bash
npx shadcn@latest add button input textarea card progress alert dialog
```

### Critério de aceite
Um componente é renderizado na aplicação.

---

## S0-017 — Criar layout base

Criar:

- header;
- área principal;
- container;
- tipografia;
- navegação mínima;
- página inicial temporária.

### Critério de aceite
Layout responsivo em desktop e celular.

---

## S0-018 — Criar health check

Criar endpoint:

```text
/api/health
```

Resposta esperada:

```json
{
  "status": "ok"
}
```

### Critério de aceite
Endpoint responde em ambiente local e preview.

---

## S0-019 — Configurar Sentry

Instalar e configurar.

### Critério de aceite
Erro de teste aparece no painel.

---

## S0-020 — Configurar GitHub Actions

Criar:

```text
.github/workflows/ci.yml
```

Pipeline mínimo:

- install;
- lint;
- typecheck;
- build.

### Critério de aceite
Pull request ou push executa pipeline com sucesso.

---

## S0-021 — Configurar Vercel

### Ações

- conectar GitHub;
- importar repositório;
- configurar variáveis;
- gerar preview;
- testar deploy.

### Critério de aceite
Preview acessível por URL.

---

## S0-022 — Proteger branch principal

Configurar:

- exigir status checks;
- bloquear push forçado;
- exigir PR quando equipe crescer;
- impedir exclusão acidental.

### Critério de aceite
Branch principal protegida conforme capacidade da conta.

---

## S0-023 — Criar README técnico

Conteúdo mínimo:

- visão do projeto;
- requisitos;
- instalação;
- comandos;
- variáveis;
- banco;
- execução;
- testes;
- deploy;
- documentação.

---

## S0-024 — Criar ADRs técnicos

Criar registros para:

- Next.js;
- Supabase;
- Prisma;
- Vercel;
- monólito modular.

---

## S0-025 — Criar backlog no GitHub

Criar issues para:

- Sprint 1;
- Sprint 2;
- Sprint 3;
- segurança;
- documentação;
- protótipo.

### Labels

- epic;
- feature;
- bug;
- docs;
- security;
- ai;
- ux;
- P0;
- P1;
- P2;
- P3.

---

# 7. Ordem recomendada

## Etapa 1

- S0-001
- S0-002
- S0-003
- S0-004
- S0-005

## Etapa 2

- S0-006
- S0-007
- S0-008
- S0-009
- S0-010

## Etapa 3

- S0-011
- S0-012
- S0-013
- S0-014
- S0-015

## Etapa 4

- S0-016
- S0-017
- S0-018
- S0-019

## Etapa 5

- S0-020
- S0-021
- S0-022
- S0-023
- S0-024
- S0-025

---

# 8. Checklist de conclusão

## Ambiente

- [ ] Node.js instalado
- [ ] VS Code configurado
- [ ] aplicação roda localmente
- [ ] build funciona
- [ ] lint funciona
- [ ] typecheck funciona

## Dados

- [ ] Supabase criado
- [ ] Prisma configurado
- [ ] migration inicial aplicada
- [ ] `.env.example` criado
- [ ] segredos fora do Git

## Interface

- [ ] Tailwind ativo
- [ ] shadcn/ui configurado
- [ ] layout base criado
- [ ] responsividade testada

## Operação

- [ ] health check ativo
- [ ] Sentry ativo
- [ ] GitHub Actions ativo
- [ ] preview na Vercel
- [ ] branch protegida

## Documentação

- [ ] README técnico
- [ ] ADRs
- [ ] backlog criado
- [ ] Sprint 1 preparada

---

# 9. Critério de saída da Sprint 0

A Sprint 0 estará concluída quando:

- o projeto rodar localmente;
- o banco estiver conectado;
- a autenticação estiver funcional ou pronta para integração;
- CI estiver verde;
- preview estiver online;
- erros forem observáveis;
- segredos estiverem protegidos;
- documentação estiver atualizada;
- backlog da Sprint 1 estiver pronto.

---

# 10. Riscos

1. Executar comandos no diretório errado.
2. Sobrescrever estrutura existente.
3. Versionar segredos.
4. Configurar banco incorretamente.
5. Misturar ambientes.
6. Criar complexidade desnecessária.
7. Instalar dependências em excesso.
8. Avançar sem compreender os passos.

---

# 11. Mitigações

- um passo por vez;
- commit após cada bloco;
- revisar GitHub Desktop;
- usar `.env.example`;
- manter backup;
- registrar erros;
- não executar comandos sem saber o diretório;
- parar e revisar antes de sobrescrever arquivos.

---

# 12. Commits sugeridos

```text
chore: initialize Next.js application
chore: configure linting and formatting
feat: configure Supabase and Prisma
feat: add initial database schema
feat: configure authentication foundation
chore: configure CI and preview deployment
docs: add technical setup instructions
```

---

# 13. Próxima sprint

## Sprint 1 — Identity and Consent

Entregas:

- cadastro;
- login;
- sessão;
- recuperação;
- consentimento;
- termos;
- privacidade;
- auditoria inicial.

---

# 14. Próxima ação do fundador

1. Copiar este documento para o repositório.
2. Fazer commit.
3. Abrir o repositório no VS Code.
4. Confirmar se já existe uma aplicação Next.js.
5. Executar somente a Etapa 1.
6. Registrar qualquer erro antes de avançar.

---

# 15. Histórico

| Versão | Data | Alteração |
|---|---|---|
| 0.1 | 14/07/2026 | Primeiro backlog e plano operacional da Sprint 0. |
