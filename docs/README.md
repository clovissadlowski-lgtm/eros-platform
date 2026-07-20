# Higeia — Master Documentation Index

**Versão:** 0.1  
**Status:** Índice oficial  
**Data:** 19 de julho de 2026  
**Projeto interno:** Projeto Eros  
**Produto:** Higeia  
**Fundador:** Clovis Sadlowski  

## 1. Objetivo

Este documento é a porta de entrada oficial para toda a documentação do Higeia.

Ele serve para localizar documentos, definir ordem de leitura, registrar finalidades, evitar duplicidades e facilitar o onboarding de futuros colaboradores.

## 2. Estrutura atual

```text
docs/
├── 01-Constitution/
├── 02-Business/
├── 03-Product/
├── 04-UX/
├── 05-Architecture/
├── 06-EIF/
├── 07-AI/
├── 08-Data/
├── 09-Brand/
├── 10-Infrastructure/
├── 11-Security/
├── 12-Roadmap/
├── 13-Investors/
├── 14-Research/
├── 15-Meeting-Notes/
└── 16-Decisions/
```

A nomenclatura atual será mantida até uma futura padronização formal.

## 3. Ordem recomendada de leitura

### Fundador
1. `01-Constitution`
2. `16-Decisions`
3. `02-Business`
4. `03-Product`
5. `12-Roadmap`
6. `05-Architecture`
7. `07-AI`
8. `08-Data`
9. `11-Security`
10. `10-Infrastructure`

### Produto e UX
1. visão;
2. PRD;
3. jornada;
4. mapa de telas;
5. anamnese;
6. Perfil de Inteligência;
7. UX;
8. marca.

### Engenharia
1. arquitetura técnica;
2. modelo de dados;
3. padrões de engenharia;
4. Sprint 0;
5. decisões;
6. segurança;
7. infraestrutura.

### Inteligência artificial
1. glossário;
2. Knowledge Model;
3. HIE Architecture;
4. Memory Model;
5. AI Safety and Evaluation;
6. Data Model.

### Investidores
1. visão;
2. modelo de negócio;
3. marca;
4. roadmap;
5. arquitetura;
6. IA;
7. validação;
8. riscos.

## 4. Finalidade das pastas

### 01-Constitution
Visão, glossário, constituição, manifesto e princípios.

### 02-Business
Modelo de negócio, validação, preços, go-to-market, finanças e canais.

### 03-Product
PRD, jornada, telas, anamnese, Perfil de Inteligência e requisitos.

### 04-UX
Experiência, acessibilidade, wireframes, design system e UX writing.

### 05-Architecture
Arquitetura técnica, implantação, integrações, diagramas e ADRs.

### 06-EIF
Documentação histórica produzida antes da consolidação do nome HIE. Novos documentos devem usar HIE.

### 07-AI
Knowledge Model, HIE, memória, prompts, modelos, avaliações e segurança de IA.

### 08-Data
Modelo de dados, dicionário, retenção, exclusão, lineage e anonimização.

### 09-Brand
Marca, identidade visual, voz, mensagens, naming e ativos.

### 10-Infrastructure
Repositório, ambientes, CI/CD, deploy, monitoramento e backups.

### 11-Security
Segurança, LGPD, incidentes, acessos, riscos e threat model.

### 12-Roadmap
Roadmap, Sprint 0, backlog, releases, marcos e gates.

### 13-Investors
Pitch deck, one-pager, data room, cap table e fundraising.

### 14-Research
Mercado, concorrentes, referências, literatura e validações.

### 15-Meeting-Notes
Registros de reuniões, decisões, responsáveis e próximos passos.

### 16-Decisions
Founder Decisions, ADRs e decisões de produto, dados e IA.

## 5. Documentos prioritários

### Fundação
- HIGEIA-VISION-v0.1.md
- HIGEIA-GLOSSARY-v0.1.md
- HIGEIA-FOUNDER-DECISIONS-v0.1.md

### Negócio
- HIGEIA-BUSINESS-MODEL-VALIDATION-v0.1.md

### Produto
- HIGEIA-MVP-PRD-v0.1.md
- HIGEIA-USER-JOURNEY-v0.1.md
- HIGEIA-SCREEN-MAP-v0.1.md
- HIGEIA-ASSESSMENT-SPEC-v0.1.md
- HIGEIA-PERSONAL-PROFILE-SPEC-v0.1.md

### Arquitetura e engenharia
- HIGEIA-TECHNICAL-ARCHITECTURE-v0.1.md
- HIGEIA-ENGINEERING-STANDARDS-v0.1.md
- HIGEIA-DATA-MODEL-v0.1.md

### IA
- HIGEIA-KNOWLEDGE-MODEL-v0.1.md
- HIGEIA-HIE-ARCHITECTURE-v0.1.md
- HIGEIA-MEMORY-MODEL-v0.1.md
- HIGEIA-AI-SAFETY-EVALUATION-v0.1.md

### Execução
- HIGEIA-ROADMAP-DELIVERY-PLAN-v0.1.md
- HIGEIA-BACKLOG-SPRINT-0-v0.1.md

### Infraestrutura
- HIGEIA-REPOSITORY-STRUCTURE-INDEX-v0.1.md
- HIGEIA-REPOSITORY-MIGRATION-GUIDE-v0.1.md

## 6. Status documental

- **Rascunho:** em construção.
- **Revisão interna:** aguardando revisão.
- **Aprovado:** referência vigente.
- **Histórico:** preservado, mas não vigente.
- **Substituído:** substituído por versão posterior.

## 7. Convenção de versões

- `v0.1`: primeira versão estruturada;
- `v0.2`: revisão relevante;
- `v0.9`: candidato a aprovação;
- `v1.0`: versão aprovada;
- `v1.1`: melhoria compatível;
- `v2.0`: mudança estrutural.

## 8. Convenção de nomes

```text
HIGEIA-<NOME-DO-DOCUMENTO>-v<versão>.md
```

## 9. Regra de atualização

Ao alterar um documento:

1. revisar impacto;
2. atualizar conteúdo;
3. atualizar versão quando necessário;
4. atualizar histórico;
5. atualizar este índice;
6. registrar decisão relevante;
7. fazer commit específico.

## 10. Documentos futuros prioritários

1. Wireframe Specification.
2. ADRs técnicos.
3. Security and LGPD Foundation.
4. Testing Strategy.
5. Data Retention and Deletion Policy.
6. Prompt Registry.
7. Alpha Readiness Checklist.
8. Release Process.
9. Financial Model.
10. Investor One-Pager.

## 11. Critério de documento pronto

Um documento deve possuir:

- objetivo;
- escopo;
- definições;
- decisões;
- riscos;
- limitações;
- questões abertas;
- próximos passos;
- versão;
- data;
- histórico.

## 12. Próxima etapa

Depois deste índice:

1. conferir arquivos;
2. registrar a estrutura como estável;
3. iniciar Sprint 0;
4. criar novos documentos apenas quando necessários à execução.

## 13. Histórico

| Versão | Data | Alteração |
|---|---|---|
| 0.1 | 19/07/2026 | Criação do índice mestre da documentação. |
