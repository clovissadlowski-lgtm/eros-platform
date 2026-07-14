# Higeia — Roadmap and Delivery Plan

**Versão:** 0.1  
**Status:** Rascunho operacional oficial  
**Data:** 14 de julho de 2026  
**Projeto interno:** Projeto Eros  
**Produto:** Higeia  

## 1. Objetivo

Transformar a documentação do Higeia em uma sequência executável de fases, marcos, sprints, dependências e critérios de passagem.

## 2. Princípios

1. Documentar o suficiente para reduzir risco, sem adiar indefinidamente a construção.
2. Construir somente o necessário para validar a próxima hipótese.
3. Reduzir escopo antes de ampliar prazo.
4. Validar valor antes de escalar tecnologia.
5. Segurança e privacidade são gates obrigatórios.
6. Cada fase deve produzir um resultado utilizável.
7. Mudanças de direção devem ser registradas.
8. Progresso deve ser medido por aprendizado e valor, não apenas por tarefas concluídas.

## 3. Fases

### Fase 0 — Consolidação
Encerrar a documentação estrutural mínima.

**Saída:** escopo claro, documentos versionados, riscos identificados e stack provisória.

### Fase 1 — Prototipação
Criar wireframes e protótipo navegável.

**Entregáveis:**
- landing page conceitual;
- anamnese simulada;
- Perfil de Inteligência manual ou semiautomático;
- primeiro check-in;
- roteiro de teste;
- coleta de feedback.

**Critério de saída:**
- 5 a 10 usuários testados;
- pelo menos 60% concluem o fluxo;
- utilidade média do perfil de pelo menos 7/10;
- problemas de UX e segurança documentados.

### Fase 2 — Alpha Técnico
Construir a primeira versão funcional.

**Inclui:**
- cadastro;
- login;
- consentimento;
- anamnese;
- banco;
- geração de perfil;
- dashboard;
- check-in;
- timeline;
- feedback;
- safety;
- auditoria;
- admin mínimo.

**Critério de saída:**
- 5 usuários internos completam o fluxo;
- nenhum bloqueio crítico;
- perfil reproduzível;
- exclusão e logs funcionais;
- testes críticos aprovados.

### Fase 3 — Alpha Fechado
Testar com 10 a 30 usuários durante quatro semanas.

**Métricas:**
- conclusão da anamnese;
- visualização do perfil;
- utilidade;
- primeiro e segundo check-ins;
- respostas contestadas;
- custo por usuário;
- incidentes.

**Critério de saída:**
- conclusão de pelo menos 60%;
- utilidade média de pelo menos 7/10;
- primeiro check-in de pelo menos 40%;
- segundo check-in de pelo menos 25%;
- nenhum incidente crítico aberto.

### Fase 4 — Validação Comercial
Testar disposição real a pagar.

**Entregáveis:**
- página de preços;
- oferta;
- checkout simulado ou real;
- planos;
- política de cancelamento.

**Critério de saída:**
- pelo menos 10% com interesse forte;
- pelo menos 5% tentando comprar ou reservar;
- custo variável compatível;
- objeções principais conhecidas.

### Fase 5 — Beta Controlado
Operar com 50 a 200 usuários.

**Critério de saída:**
- retenção e churn compreendidos;
- operação estável;
- segurança monitorada;
- suporte estruturado;
- backlog orientado por evidência.

### Fase 6 — Preparação para Escala
Decidir entre escalar B2C, expandir para B2B2C, aprofundar nicho, buscar investimento ou pivotar.

## 4. Prioridades

### P0 — Essenciais
- cadastro;
- consentimento;
- anamnese;
- perfil;
- safety;
- persistência;
- feedback;
- exclusão;
- auditoria.

### P1 — Importantes
- dashboard;
- check-in;
- timeline;
- admin;
- observabilidade;
- correção.

### P2 — Diferenciais
- assistente;
- hipóteses detalhadas;
- evidências;
- atualização longitudinal.

### P3 — Futuro
- billing;
- profissionais;
- fotos;
- exames;
- wearables;
- integrações.

## 5. Ordem de construção

1. repositório e ambiente;
2. aplicação web;
3. autenticação;
4. banco;
5. consentimento;
6. anamnese;
7. Perfil de Inteligência manual;
8. HIE inicial;
9. dashboard;
10. check-in;
11. safety;
12. feedback;
13. admin;
14. deploy;
15. testes.

## 6. Sprints

### Sprint 0 — Preparação
- confirmar stack;
- instalar Node.js;
- iniciar Next.js;
- TypeScript;
- lint;
- Prettier;
- banco;
- `.env.example`;
- CI;
- preview.

**Aceite:** projeto local, build e CI funcionando.

### Sprint 1 — Identity and Consent
- cadastro;
- login;
- verificação;
- recuperação;
- consentimentos;
- termos;
- privacidade.

### Sprint 2 — Assessment Core
- blocos;
- perguntas;
- respostas;
- progresso;
- salvar e continuar;
- revisão;
- conclusão.

### Sprint 3 — Profile v0
- processamento;
- fatos;
- pontos fortes;
- barreiras;
- hipóteses;
- evidências;
- lacunas;
- feedback.

A primeira versão poderá ser semiautomática para reduzir risco.

### Sprint 4 — Dashboard and Check-in
- dashboard;
- check-in;
- resultado;
- timeline;
- atualização básica.

### Sprint 5 — Safety and Operations
- safety flags;
- redirecionamentos;
- admin;
- logs;
- incidentes;
- exclusão;
- observabilidade;
- backup.

### Sprint 6 — Alpha Readiness
- testes E2E;
- testes de IA;
- red teaming;
- UX;
- acessibilidade;
- performance;
- documentação;
- release candidate.

## 7. Marcos

- **M0:** fundação documental concluída.
- **M1:** protótipo navegável.
- **M2:** Alpha técnico.
- **M3:** Alpha fechado.
- **M4:** primeira receita.
- **M5:** Beta controlado.
- **M6:** decisão de escala.

## 8. Gates

### Gate 1 — Prototipar
Exige PRD, jornada, telas, anamnese e perfil.

### Gate 2 — Construir Alpha
Exige protótipo validado, stack, dados, arquitetura e safety.

### Gate 3 — Testar usuários reais
Exige termos, privacidade, consentimento, logs, suporte e redirecionamentos.

### Gate 4 — Cobrar
Exige valor percebido, retenção, custo conhecido, billing e política comercial.

## 9. Gestão de backlog

Cada item deverá conter:
- problema;
- usuário;
- objetivo;
- prioridade;
- critério de aceite;
- dependências;
- risco;
- referência documental;
- status.

Estados:
- backlog;
- ready;
- in_progress;
- review;
- blocked;
- done.

## 10. Priorização

Fórmula simples:

`Prioridade = Impacto × Aprendizado × Redução de Risco / Esforço`

## 11. Gestão de escopo

Quando houver atraso:
1. reduzir detalhe;
2. retirar funções não essenciais;
3. adiar integrações;
4. preservar o fluxo principal;
5. nunca remover consentimento, safety, auditoria, exclusão ou validação.

## 12. Cadência

Ciclos semanais ou quinzenais com:
- planejamento;
- execução;
- demonstração;
- retrospectiva;
- atualização documental.

## 13. Equipe por fase

### Fundação
Fundador + IA + revisões pontuais.

### Prototipação
Fundador + UX/UI + revisão de saúde.

### Alpha Técnico
Full-stack + IA + jurídico + segurança.

### Alpha Fechado
Produto + engenharia + suporte + safety reviewer + nutricionista consultor.

## 14. Riscos iniciais

- perfil genérico;
- anamnese longa;
- segurança;
- custo de IA;
- aquisição B2C;
- privacidade;
- disponibilidade da marca;
- falta de equipe técnica.

Cada risco deverá ter probabilidade, impacto, responsável, mitigação e gatilho.

## 15. Decisões tecnológicas antes da Sprint 0

1. Next.js full-stack ou NestJS.
2. Supabase ou Neon.
3. autenticação.
4. ORM.
5. fila.
6. storage.
7. provedor de IA.
8. monitoramento.

Critérios:
- simplicidade;
- custo;
- documentação;
- segurança;
- reversibilidade;
- adequação ao fundador.

## 16. Próxima ação

1. conferir se todos os documentos estão no repositório;
2. criar backlog inicial;
3. definir stack;
4. iniciar Sprint 0;
5. produzir wireframes do fluxo principal.

## 17. Próximo documento

**Higeia Backlog and Sprint 0 Plan v0.1**

Ele deverá conter tarefas, comandos, ferramentas, arquivos, critérios e instruções passo a passo para o fundador.

## 18. Histórico

| Versão | Data | Alteração |
|---|---|---|
| 0.1 | 14/07/2026 | Primeiro roadmap operacional do Higeia. |
