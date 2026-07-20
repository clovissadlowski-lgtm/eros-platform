# Higeia — AI Cost Governance Policy

**Versão:** 0.1

## 1. Objetivo

Evitar que custos de IA cresçam sem controle e garantir que cada funcionalidade possua viabilidade econômica conhecida.

## 2. Regras

- Toda funcionalidade deve ter custo unitário estimado.
- Toda mudança de modelo deve medir impacto econômico.
- Todo fluxo deve ter limite de tokens.
- Retries devem ser limitados.
- Loops devem possuir proteção.
- Custos devem ser segmentados por ambiente.
- Produção deve ter orçamento e alertas.
- Segurança não pode ser reduzida apenas para economizar.

## 3. Campos mínimos

- flow_id
- model_id
- prompt_id
- input tokens
- output tokens
- retries
- estimated cost
- monthly projection
- budget owner

## 4. Budget gates

- 50%: informativo
- 75%: revisão
- 90%: ação
- 100%: bloqueio ou aprovação excepcional

## 5. Ações de otimização

- reduzir contexto;
- usar cache;
- usar modelo menor quando seguro;
- evitar duplicação;
- limitar retries;
- reduzir geração desnecessária;
- consolidar jobs;
- revisar arquitetura.

## 6. Aprovação excepcional

Exceder orçamento exige:

- justificativa;
- prazo;
- owner;
- impacto;
- aprovação;
- plano de normalização.
