# Higeia — Stack Proof of Concept Execution Guide

**Versão:** 1.0  
**Objetivo:** executar a primeira prova técnica do Higeia sem utilizar dados reais.

## 1. Resultado esperado

Ao final da PoC, o repositório deverá possuir:

- monorepo com `apps/web` e `apps/api`;
- frontend Next.js executando;
- backend NestJS executando;
- workspace pnpm;
- endpoint de health check;
- modelo conceitual de tenant;
- contrato do AI Provider Adapter;
- provedor de IA mock;
- testes básicos;
- estrutura para evidências;
- primeiro pipeline de integração contínua planejado.

A PoC não é o MVP. Ela apenas demonstra que a base tecnológica funciona.

## 2. Limites

Durante esta etapa:

- use apenas dados sintéticos;
- não conecte pacientes reais;
- não envie dados de saúde a provedores externos;
- não implemente diagnóstico;
- não implemente prescrição;
- não contrate infraestrutura de produção;
- não armazene secrets no Git;
- não altere a branch `main` diretamente.

## 3. Ordem de execução

1. Fazer commit de toda documentação pendente.
2. Confirmar que a branch atual está limpa.
3. Criar uma branch específica para a PoC.
4. Verificar Node.js, Git e pnpm.
5. Criar o workspace.
6. Criar o frontend.
7. Criar o backend.
8. Criar os pacotes compartilhados.
9. Executar localmente.
10. Criar health checks.
11. Criar AI Adapter mock.
12. Criar teste de isolamento conceitual.
13. Registrar evidências.
14. Fazer commit.
15. Revisar antes de qualquer AWS.

## 4. Branch recomendada

```bash
git checkout -b feat/stack-poc
```

Não use novamente a branch de reorganização documental para iniciar o código.

## 5. Estrutura alvo

```text
eros-platform/
├── apps/
│   ├── web/
│   └── api/
├── packages/
│   ├── shared-types/
│   ├── validation/
│   └── ai-contracts/
├── tests/
│   └── security/
├── evidence/
│   └── stack-poc/
├── docs/
├── pnpm-workspace.yaml
├── package.json
└── README.md
```

## 6. Gate de entrada

Antes de executar comandos:

- [ ] documentação commitada;
- [ ] `git status` limpo;
- [ ] branch de PoC criada;
- [ ] backup remoto no GitHub;
- [ ] Node.js instalado;
- [ ] pnpm disponível;
- [ ] VS Code aberto na raiz correta.

## 7. Gate de saída

- [ ] frontend inicia;
- [ ] backend inicia;
- [ ] health check responde;
- [ ] workspace reconhece os dois apps;
- [ ] mock de IA funciona;
- [ ] nenhum dado real foi usado;
- [ ] nenhum secret foi versionado;
- [ ] testes básicos passam;
- [ ] evidências estão registradas;
- [ ] revisão técnica foi realizada.
