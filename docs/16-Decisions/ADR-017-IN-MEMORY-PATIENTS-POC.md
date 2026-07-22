# ADR-017 — In-Memory Patients PoC

**Status:** Accepted  
**Date:** 2026-07-22

## Contexto

A Higeia precisa validar o primeiro módulo de negócio antes de introduzir PostgreSQL, Prisma, migrations, autenticação e infraestrutura de cloud.

Adicionar todos esses elementos simultaneamente aumentaria a quantidade de variáveis e dificultaria identificar problemas de domínio, API e estrutura.

## Decisão

A primeira implementação do módulo Patients utilizará armazenamento em memória.

Ela incluirá:

- criação;
- listagem;
- consulta por ID;
- validação;
- tenant temporário interno;
- erros;
- testes.

## Consequências positivas

- menor complexidade inicial;
- validação rápida;
- contrato estabilizado;
- testes simples;
- separação entre domínio e persistência;
- menor risco de retrabalho em migrations.

## Consequências negativas

- perda de dados ao reiniciar;
- ausência de concorrência real;
- ausência de transações;
- não adequado para produção;
- não prova performance de banco.

## Restrições

- proibido usar essa implementação em produção;
- tenant não pode vir do body;
- contrato deve permitir substituição por repositório;
- evolução para PostgreSQL é obrigatória antes de uso real.

## Próxima decisão

Após a PoC:

- validar Prisma;
- definir repository port;
- criar migration;
- implementar persistência;
- testar isolamento de tenant no banco.
