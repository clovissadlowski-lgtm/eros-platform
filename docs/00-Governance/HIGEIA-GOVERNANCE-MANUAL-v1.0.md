# Higeia — Governance Manual

**Documento:** Higeia Governance Manual  
**Versão:** 1.0  
**Status:** Documento mestre oficial  
**Data:** 20 de julho de 2026  
**Projeto interno:** Projeto Eros  
**Produto:** Higeia  
**Fundador:** Clovis Sadlowski  

---

## 1. Objetivo

Este manual é a principal porta de entrada para o sistema de governança do Higeia.

Ele explica:

- como a documentação está organizada;
- quem decide o quê;
- qual documento usar;
- quando usar cada framework;
- como uma ideia chega à produção;
- como riscos, controles e evidências se conectam;
- como releases são autorizadas;
- como incidentes são tratados;
- como o sistema é revisado e melhorado.

Este manual não substitui os frameworks específicos. Ele os integra e orienta seu uso.

---

## 2. Princípio central

A governança do Higeia deve operar como um sistema vivo de decisão, controle, evidência e melhoria contínua.

Documentos sem owner, uso, revisão, evidência ou conexão operacional não constituem governança efetiva.

---

## 3. Hierarquia documental

### Level 1 — Constitution and Principles

Define identidade, propósito, princípios e limites fundamentais.

### Level 2 — Frameworks and Policies

Define regras gerais por domínio.

### Level 3 — Standards and Procedures

Define como executar.

### Level 4 — Templates and Checklists

Padroniza registros e decisões.

### Level 5 — Operational Records and Evidence

Demonstra operação real.

---

## 4. Estrutura principal do repositório

```text
docs/
├── 00-Governance
├── 01-Constitution
├── 02-Business
├── 03-Product
├── 04-UX
├── 05-Architecture
├── 06-Engineering
├── 07-AI
├── 08-Data
├── 09-Brand
├── 10-Infrastructure
├── 11-Security
├── 12-Roadmap
├── 13-Investors
├── 14-Research
├── 15-Meeting-Notes
└── 16-Decisions
```

---

## 5. Função de cada domínio

### 00-Governance

Integração, orientação, operating model e visão executiva.

### 01-Constitution

Missão, princípios, limites, identidade e propósito.

### 02-Business

Modelo de negócio, mercado, estratégia, receitas e operação empresarial.

### 03-Product

Problema, público, casos de uso, MVP, roadmap e métricas de produto.

### 04-UX

Experiência, fluxos, acessibilidade, interfaces e comunicação.

### 05-Architecture

Arquitetura do sistema, decisões, dependências e integrações.

### 06-Engineering

Padrões de desenvolvimento, testes, releases e qualidade técnica.

### 07-AI

Governança de IA, modelos, prompts, safety, dados, avaliação e operação.

### 08-Data

Arquitetura, qualidade, ciclo de vida e governança de dados.

### 09-Brand

Marca, identidade, linguagem e posicionamento.

### 10-Infrastructure

Ambientes, cloud, observabilidade, deployment, backup e continuidade.

### 11-Security

Segurança da informação, IAM, vulnerabilidades, incidentes e controles.

### 12-Roadmap

Planos, fases, tarefas, dependências e execução.

### 13-Investors

Materiais para investidores, captação e governança financeira.

### 14-Research

Pesquisa, benchmarks, evidências científicas e análises.

### 15-Meeting-Notes

Registros de reuniões e fóruns.

### 16-Decisions

Decisões formais, ADRs, riscos aceitos e aprovações.

---

## 6. Fluxo completo de uma ideia até a produção

```text
Idea
→ Discovery
→ Use Case Brief
→ Value Hypothesis
→ Risk Assessment
→ Data Assessment
→ Architecture Design
→ Model and Prompt Design
→ Control Design
→ Experiment
→ Evaluation
→ Evidence
→ Stage Gate
→ Release
→ Monitoring
→ Incident and Finding Management
→ Value Review
→ Continue, Restrict, Redesign or Sunset
```

---

## 7. Sistema de identificadores

| Prefix | Object |
|---|---|
| UC | Use Case |
| RISK | Risk |
| CTRL | Control |
| EVID | Evidence |
| DEC | Decision |
| MODEL | Model |
| PROMPT | Prompt |
| DATA | Dataset or Data Asset |
| KNOW | Knowledge Source |
| MEM | Memory |
| VEND | Vendor |
| REL | Release |
| INC | Incident |
| FIND | Finding |
| OBL | Obligation |
| TRN | Training |
| AUTH | Authorization |
| SVC | Service |
| MET | Metric |
| EXC | Exception |
| REV | Review |

Format:

`PREFIX-NNN`

IDs são permanentes e não devem ser reutilizados.

---

## 8. Papéis principais

### Founder

Responsável por:

- visão;
- prioridade;
- investimento;
- apetite de risco;
- decisões críticas;
- aprovação do Alpha;
- exceções críticas.

### Governance Owner

Responsável por:

- integração;
- calendário;
- registros mestres;
- consistência;
- maturidade;
- management review.

### Product Owner

Responsável por:

- problema;
- usuário;
- valor;
- casos de uso;
- métricas;
- escopo.

### AI Owner

Responsável por:

- modelos;
- prompts;
- avaliações;
- limitações;
- custos;
- lifecycle.

### Engineering Owner

Responsável por:

- arquitetura;
- implementação;
- testes;
- releases;
- rollback;
- qualidade.

### Data Owner

Responsável por:

- origem;
- qualidade;
- retenção;
- memória;
- embeddings;
- exclusão.

### Clinical and Safety Authority

Responsável por:

- limites clínicos;
- safety;
- escalonamento;
- human review;
- riscos críticos.

### Privacy and Security Owners

Responsáveis por:

- LGPD;
- acessos;
- data protection;
- incidentes;
- vulnerabilidades;
- evidências.

### Operations Owner

Responsável por:

- monitoring;
- suporte;
- incident response;
- continuidade;
- comunicação.

---

## 9. Regra para acúmulo de papéis

Na fase inicial, uma pessoa pode acumular papéis.

Entretanto:

- o acúmulo deve ser registrado;
- decisões críticas não devem depender apenas de autoaprovação;
- riscos clínicos, legais, privacy ou security podem exigir revisão externa;
- backup owners devem ser criados conforme a equipe cresce.

---

## 10. Fóruns de governança

### Operational Review

Foco:

- incidentes;
- alertas;
- custos;
- disponibilidade;
- mudanças urgentes.

### Product and AI Review

Foco:

- casos de uso;
- valor;
- experimentos;
- modelos;
- prompts;
- roadmap.

### Risk and Assurance Review

Foco:

- safety;
- clinical;
- privacy;
- security;
- fairness;
- compliance;
- audit;
- findings.

### Executive Governance Review

Foco:

- riscos;
- investimento;
- prioridade;
- exceções;
- readiness;
- expansão.

---

## 11. Cadência mínima

### Semanal

Quando houver operação:

- alertas;
- incidentes;
- custos;
- disponibilidade.

### Mensal

- portfólio;
- riscos;
- documentação;
- fornecedores;
- modelos;
- workforce gaps.

### Trimestral

- management review;
- controles;
- compliance;
- continuidade;
- value realization.

### Anual

- maturidade;
- políticas;
- strategic risk review;
- exercício completo de continuidade.

---

## 12. Fluxo de decisão

### Decisão de baixo risco

Pode ser aprovada pelo owner do domínio.

### Decisão de médio risco

Exige revisão cruzada.

### Decisão de alto risco

Exige participação dos domínios afetados e aprovação superior.

### Decisão crítica

Exige Founder e autoridades aplicáveis.

---

## 13. Hierarquia de conflito

Quando frameworks entrarem em conflito:

1. safety;
2. lei e regulação;
3. privacy e security;
4. integridade clínica;
5. obrigação contratual;
6. valor do produto;
7. custo e eficiência;
8. conveniência.

---

## 14. Registros mestres

### Master Governance Register

Mapa dos objetos críticos.

### Master Control Catalog

Catálogo de controles.

### Master Evidence Register

Registro de evidências.

### Gate Register

Aprovações e bloqueios.

### Decision Register

Decisões formais.

### Exception Register

Desvios temporários.

### Risk Register

Riscos e tratamento.

### Incident Register

Incidentes e resposta.

### Finding Register

Findings e remediações.

---

## 15. Regra de rastreabilidade

A cadeia ideal é:

```text
UC-001
→ RISK-001
→ CTRL-001
→ MODEL-001
→ PROMPT-001
→ DATA-001
→ EVID-001
→ REL-001
→ MET-001
→ INC-001 or FIND-001
→ DEC-001
```

---

## 16. Frameworks principais e quando usar

| Framework | Objetivo | Quando usar |
|---|---|---|
| Portfolio and Value Realization | Selecionar e revisar casos de uso | Antes de construir |
| Data, Memory and Knowledge | Controlar dados, memória e RAG | Ao projetar fluxos |
| Model Lifecycle | Controlar modelos e releases | Ao selecionar ou mudar modelos |
| Prompt Management | Versionar e aprovar prompts | Ao criar ou alterar prompts |
| AI Evaluation | Medir qualidade e desempenho | Antes de releases |
| Safety and Clinical Boundaries | Controlar risco clínico | Em fluxos sensíveis |
| Human Review | Definir revisão humana | Quando automação não puder ser autônoma |
| Explainability and User Control | Explicar e contestar resultados | Em outputs ao usuário |
| Fairness and Bias | Avaliar impacto desigual | Antes e depois da release |
| Observability | Monitorar operação | Na Sprint 0 e produção |
| Incident Management | Responder a falhas | Quando eventos ocorrerem |
| Vendor Governance | Avaliar terceiros | Antes da contratação |
| Continuity and DR | Preparar falhas | Antes do Alpha |
| Audit and Evidence | Comprovar controles | Durante toda a operação |
| Compliance Mapping | Mapear obrigações | Antes e após mudanças |
| Workforce Competence | Garantir capacidade | Antes de autorizações |
| IP and Licensing | Controlar direitos | Antes de incorporar ativos |
| Sustainability and Efficiency | Controlar recursos e custos | No design e operação |
| Implementation Roadmap | Executar o programa | Durante todas as fases |

---

## 17. Gates essenciais

### Use Case Gate

Confirma problema, valor, owner, risco e métricas.

### Data Gate

Confirma origem, finalidade, proteção e retenção.

### Model and Provider Gate

Confirma avaliação, termos, risco e fallback.

### Prompt Gate

Confirma versão, teste e aprovação.

### Experiment Gate

Confirma hipótese, amostra, guardrails e stop criteria.

### Release Gate

Confirma testes, evidências, rollback e monitoring.

### Alpha Gate

Confirma readiness, blockers, exceções e capacidade operacional.

### Incident Closure Gate

Confirma causa, correção, validação e prevenção de recorrência.

### Sunset Gate

Confirma retirada, comunicação, migração e dados.

---

## 18. Definition of Done

Uma atividade só está concluída quando:

- entrega existe;
- critério de aceite foi atendido;
- evidência foi registrada;
- revisão ocorreu;
- owner confirmou;
- registro mestre foi atualizado;
- pendências residuais foram documentadas.

---

## 19. O que não é conclusão

Não equivale a conclusão:

- criar um template;
- escrever uma política;
- marcar item sem evidência;
- executar teste sem registrar;
- aprovar verbalmente;
- deixar owner como TBD;
- adiar indefinidamente;
- operar com exceção vencida.

---

## 20. Alpha controlado

O Alpha deve ser explicitamente limitado por:

- casos de uso;
- usuários;
- duração;
- geografia;
- volume;
- dados;
- automação;
- revisão humana;
- suporte;
- stop authority.

---

## 21. Critérios de NO-GO

Exemplos:

- risco crítico aberto;
- ausência de isolamento de dados;
- ausência de rollback;
- ausência de monitoring;
- ausência de incident response;
- ausência de owner;
- limites clínicos indefinidos;
- termos de fornecedor desconhecidos;
- ausência de avaliação;
- ausência de evidência.

---

## 22. Critérios de GO

Exemplos:

- escopo definido;
- riscos avaliados;
- controles ativos;
- modelo e prompts avaliados;
- monitoring ativo;
- rollback testado;
- suporte pronto;
- incident simulation executada;
- decisão formal registrada.

---

## 23. Exceções

Uma exceção deve possuir:

- ID;
- requisito afetado;
- motivo;
- risco;
- controle compensatório;
- owner;
- aprovação;
- prazo;
- monitoramento;
- plano de saída.

Exceção sem prazo é proibida.

---

## 24. Escalonamento

Escalonar imediatamente quando houver:

- risco critical;
- unsafe output grave;
- incidente de dados;
- falha de controle crítico;
- custo anormal;
- indisponibilidade crítica;
- exceção vencida;
- obrigação não cumprida;
- ausência de owner em objeto crítico.

---

## 25. Evidências

Tipos de evidência:

- design;
- implementation;
- operation;
- test;
- monitoring;
- decision;
- incident;
- correction.

A evidência deve ser verificável, íntegra e localizada.

---

## 26. Maturidade

### Level 0 — Ad hoc

### Level 1 — Documented

### Level 2 — Repeatable

### Level 3 — Measured

### Level 4 — Integrated

### Level 5 — Optimized

Documentação ampla normalmente corresponde a Level 1, não automaticamente a níveis superiores.

---

## 27. Sequência recomendada de implementação

1. Consolidar índice documental.
2. Adotar IDs.
3. Preencher Master Register.
4. Definir escopo do Alpha.
5. Criar Use Case Briefs.
6. Mapear riscos.
7. Mapear dados.
8. Definir arquitetura.
9. Selecionar modelos e fornecedores.
10. Projetar controles.
11. Executar Sprint 0.
12. Avaliar.
13. Reunir evidências.
14. Realizar Readiness Review.
15. Decidir GO ou NO-GO.

---

## 28. Onboarding de novos membros

Todo novo membro deve:

1. ler este manual;
2. entender a estrutura do repositório;
3. entender seu papel;
4. conhecer os registros mestres;
5. conhecer os gates;
6. conhecer o escalonamento;
7. concluir treinamentos aplicáveis;
8. receber autorização formal quando necessário.

---

## 29. Revisão deste manual

Revisar:

- anualmente;
- após mudança relevante no operating model;
- após incidente grave;
- após mudança regulatória material;
- antes de expansão internacional;
- quando novos domínios forem criados.

---

## 30. Histórico

| Versão | Data | Alteração |
|---|---|---|
| 1.0 | 20/07/2026 | Criação do manual mestre de governança do Higeia. |
