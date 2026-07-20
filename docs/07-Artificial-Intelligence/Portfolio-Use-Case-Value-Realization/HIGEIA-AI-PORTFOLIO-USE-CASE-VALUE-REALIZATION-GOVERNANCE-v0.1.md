# Higeia — AI Portfolio, Use Case and Value Realization Governance

**Documento:** Higeia AI Portfolio, Use Case and Value Realization Governance  
**Versão:** 0.1  
**Status:** Estrutura inicial oficial  
**Data:** 20 de julho de 2026  
**Projeto interno:** Projeto Eros  
**Produto:** Higeia  
**Fundador:** Clovis Sadlowski  

---

## 1. Objetivo

Definir como o Higeia identificará, avaliará, priorizará, aprovará, desenvolverá, monitorará, continuará, restringirá ou encerrará casos de uso de inteligência artificial.

Este framework estabelece requisitos para:

- inventário de casos de uso;
- hipótese de valor;
- problema;
- público;
- owner;
- risco;
- custo;
- viabilidade;
- indicadores;
- prioridade;
- estágio;
- aprovação;
- experimento;
- monitoramento;
- continuidade;
- revisão;
- sunset;
- portfólio executivo.

---

## 2. Princípio central

Nenhum caso de uso de IA deve existir apenas porque é tecnicamente possível.

Cada caso de uso deve demonstrar:

- problema real;
- usuário definido;
- valor esperado;
- risco conhecido;
- owner;
- custo estimado;
- alternativa não-IA;
- critério de sucesso;
- critério de interrupção;
- evidência de valor;
- decisão explícita de continuidade.

---

## 3. Escopo

Aplica-se a:

- funcionalidades de IA;
- automações;
- classificações;
- recomendações;
- resumos;
- alertas;
- RAG;
- memória;
- Perfil de Inteligência;
- check-ins;
- análises;
- copilots;
- integrações;
- recursos internos;
- recursos B2C;
- recursos B2B;
- experimentos;
- protótipos;
- funcionalidades futuras.

---

## 4. Unidade de caso de uso

Cada caso de uso deve possuir:

- use_case_id;
- title;
- problem;
- user;
- outcome;
- owner;
- sponsor;
- stage;
- risk_class;
- value_hypothesis;
- cost_estimate;
- data;
- model;
- controls;
- metrics;
- decision;
- next_review.

---

## 5. Estágios

### IDEA

Ideia ainda não avaliada.

### DISCOVERY

Problema e usuário em investigação.

### ASSESSMENT

Valor, risco, custo e viabilidade em análise.

### EXPERIMENT

Hipótese em teste controlado.

### PILOT

Uso limitado com usuários selecionados.

### ALPHA

Uso inicial controlado.

### BETA

Uso ampliado controlado.

### PRODUCTION

Disponível no produto.

### RESTRICTED

Uso limitado por risco, custo ou desempenho.

### PAUSED

Temporariamente interrompido.

### SUNSET_PLANNED

Encerramento aprovado.

### RETIRED

Encerrado.

### BLOCKED

Não autorizado.

---

## 6. Tipos de valor

### USER_VALUE

Benefício direto ao usuário.

### CLINICAL_VALUE

Melhoria de qualidade, acompanhamento ou segurança.

### PROFESSIONAL_VALUE

Redução de tempo, retrabalho ou carga do profissional.

### OPERATIONAL_VALUE

Melhoria de processo interno.

### FINANCIAL_VALUE

Receita, margem ou redução de custo.

### STRATEGIC_VALUE

Diferenciação, dados, aprendizado ou posição de mercado.

### COMPLIANCE_VALUE

Redução de risco ou melhoria de evidência.

---

## 7. Problema antes da solução

O caso de uso deve descrever:

- problema;
- frequência;
- intensidade;
- usuário afetado;
- alternativa atual;
- custo atual;
- evidência;
- consequência de não resolver.

---

## 8. Alternativa não-IA

Cada proposta deve comparar:

- processo manual;
- regra simples;
- formulário;
- checklist;
- busca;
- conteúdo estático;
- automação tradicional;
- redesign de UX;
- não fazer.

---

## 9. Hipótese de valor

Formato recomendado:

> Para [usuário], se o Higeia [capacidade], então [resultado], medido por [métrica], sem ultrapassar [limites de risco, custo e qualidade].

---

## 10. Valor esperado

Registrar:

- baseline;
- target;
- prazo;
- população;
- método de medição;
- fonte;
- limitações.

---

## 11. Métricas de resultado

Exemplos:

- tempo economizado;
- taxa de conclusão;
- adesão;
- qualidade;
- satisfação;
- retenção;
- redução de erro;
- redução de retrabalho;
- ativação;
- conversão;
- resolução;
- uso recorrente.

---

## 12. Métricas de guardrail

Exemplos:

- unsafe output rate;
- incident rate;
- hallucination rate;
- override rate;
- complaint rate;
- privacy findings;
- latency;
- cost per use;
- abandonment;
- human review burden.

---

## 13. Critério de sucesso

Deve ser definido antes do experimento.

---

## 14. Critério de interrupção

Pode incluir:

- risco;
- baixa qualidade;
- custo excessivo;
- baixa adoção;
- ausência de valor;
- incidente;
- impossibilidade regulatória;
- dependência inviável;
- falta de dados.

---

## 15. Risk-adjusted value

A prioridade deve considerar valor ajustado ao risco.

Um caso de alto valor bruto pode não ser prioritário se possuir:

- risco clínico elevado;
- baixa reversibilidade;
- alto custo;
- dependência incerta;
- baixa evidência;
- alto esforço.

---

## 16. Classes de risco

- low;
- medium;
- high;
- critical.

A classificação deve alinhar-se aos frameworks de safety, privacy, security, fairness e clinical governance.

---

## 17. Classes de prioridade

### P0 — MANDATORY

Obrigatório por segurança, legal ou operação.

### P1 — STRATEGIC

Alta contribuição estratégica.

### P2 — CORE

Importante para o produto principal.

### P3 — ENHANCEMENT

Melhoria relevante.

### P4 — EXPERIMENTAL

Exploração com valor ainda incerto.

### P5 — DEFERRED

Não priorizado.

---

## 18. Critérios de priorização

Avaliar:

- intensidade do problema;
- número de usuários;
- valor;
- evidência;
- estratégia;
- urgência;
- risco;
- custo;
- complexidade;
- dependência;
- reversibilidade;
- tempo para valor;
- aprendizagem.

---

## 19. Score

Pode utilizar:

- value score;
- risk score;
- effort score;
- confidence score;
- strategic fit;
- cost score.

Nenhum score deve substituir decisão humana.

---

## 20. Owner e sponsor

### Owner

Responsável pelo caso de uso.

### Sponsor

Responsável por justificar prioridade e recursos.

---

## 21. Aprovação

Casos de maior risco exigem revisão de:

- Product;
- AI;
- Safety;
- Clinical;
- Privacy;
- Security;
- Legal;
- Finance;
- Founder.

---

## 22. Segregação

Quem propõe não deve necessariamente aprovar sozinho.

---

## 23. Use case brief

Todo caso de uso deve possuir brief antes de entrar no backlog de construção.

---

## 24. Experimento

Deve possuir:

- hipótese;
- escopo;
- amostra;
- orçamento;
- prazo;
- métricas;
- baseline;
- guardrails;
- stop criteria;
- owner;
- decisão.

---

## 25. Evidência

Pode incluir:

- entrevistas;
- observação;
- dados de uso;
- benchmark;
- piloto;
- teste;
- análise financeira;
- revisão clínica;
- feedback;
- incidentes;
- analytics.

---

## 26. Confidence level

### LOW

Evidência fraca.

### MEDIUM

Evidência parcial.

### HIGH

Evidência consistente.

### VERY_HIGH

Evidência operacional robusta.

---

## 27. Viabilidade

Avaliar:

- dados;
- tecnologia;
- modelo;
- integração;
- segurança;
- privacidade;
- compliance;
- equipe;
- custo;
- tempo;
- dependências;
- manutenção.

---

## 28. Dados

Cada caso deve declarar:

- dados necessários;
- origem;
- qualidade;
- sensibilidade;
- retenção;
- consentimento;
- compartilhamento;
- uso em avaliação;
- uso em treinamento.

---

## 29. Modelo

Registrar:

- modelo;
- provider;
- version;
- prompt;
- RAG;
- memória;
- fallback;
- custo;
- limitações.

---

## 30. Human review

Definir:

- quando exigida;
- quem executa;
- SLA;
- volume;
- treinamento;
- custo;
- escalonamento.

---

## 31. Dependencies

Mapear:

- serviços;
- dados;
- fornecedores;
- contratos;
- APIs;
- especialistas;
- infraestrutura;
- decisões.

---

## 32. Unit economics

Avaliar:

- custo por uso;
- custo por usuário;
- custo de revisão;
- custo de suporte;
- custo de infraestrutura;
- receita;
- margem;
- escalabilidade.

---

## 33. Portfolio balance

O portfólio deve equilibrar:

- valor de curto prazo;
- estratégia de longo prazo;
- risco;
- exploração;
- produto principal;
- obrigações;
- eficiência;
- capacidade da equipe.

---

## 34. Capacidade limitada

Não iniciar mais casos de uso do que a equipe consegue:

- construir;
- avaliar;
- monitorar;
- operar;
- manter;
- documentar.

---

## 35. WIP limit

Definir limite de casos simultâneos por estágio.

---

## 36. Stage gate

Cada passagem de estágio deve possuir critérios.

Exemplo:

- IDEA → DISCOVERY;
- DISCOVERY → ASSESSMENT;
- ASSESSMENT → EXPERIMENT;
- EXPERIMENT → PILOT;
- PILOT → ALPHA;
- ALPHA → BETA;
- BETA → PRODUCTION.

---

## 37. Gate de discovery

- problema definido;
- usuário definido;
- evidência inicial;
- alternativa atual;
- owner;
- hipótese.

---

## 38. Gate de assessment

- valor;
- risco;
- custo;
- viabilidade;
- dados;
- controles;
- métricas;
- prioridade.

---

## 39. Gate de experiment

- hipótese;
- baseline;
- amostra;
- orçamento;
- stop criteria;
- guardrails;
- aprovação.

---

## 40. Gate de pilot

- resultado do experimento;
- riscos tratados;
- monitoring;
- suporte;
- feedback;
- rollback;
- users defined.

---

## 41. Gate de production

- valor validado;
- controles operando;
- indicadores;
- owner;
- suporte;
- custo;
- documentação;
- release approval.

---

## 42. Monitoramento de valor

Em produção, acompanhar:

- uso;
- resultado;
- custo;
- satisfação;
- segurança;
- reclamações;
- qualidade;
- carga humana;
- tendência.

---

## 43. Value decay

O valor pode diminuir por:

- mudança de usuário;
- mudança de processo;
- baixa adoção;
- mudança de preço;
- alternativa melhor;
- degradação;
- aumento de suporte;
- nova regulação.

---

## 44. Review cadence

Proposta:

- critical/high risk: monthly or on change;
- strategic production: quarterly;
- experiments: per milestone;
- low-value features: semiannual;
- paused: monthly until decision.

---

## 45. Continuation decision

Possíveis decisões:

- continue;
- scale;
- optimize;
- restrict;
- pause;
- redesign;
- merge;
- replace;
- sunset;
- retire;
- block.

---

## 46. Sunset

A decisão de sunset deve considerar:

- usuários;
- dados;
- contratos;
- integrações;
- comunicação;
- migração;
- retenção;
- suporte;
- evidências;
- custos;
- dependências.

---

## 47. Portfólio executivo

O dashboard deve mostrar:

- total de casos;
- casos por estágio;
- casos por risco;
- investimento;
- valor esperado;
- valor realizado;
- gaps;
- decisões;
- casos sem owner;
- casos sem métrica;
- casos sem revisão;
- casos candidatos a sunset.

---

## 48. Métricas do portfólio

Monitorar:

- use cases by stage;
- use cases by risk;
- time in stage;
- experiment success rate;
- value realization rate;
- cost variance;
- cases without owner;
- cases without metrics;
- paused cases;
- retired cases;
- portfolio WIP;
- value per engineering effort.

---

## 49. Auditoria

Deve ser possível responder:

- por que existe;
- quem usa;
- qual valor;
- qual evidência;
- qual risco;
- quanto custa;
- quem aprovou;
- qual estágio;
- qual decisão;
- quando revisar;
- como encerrar.

---

## 50. Gates antes do Alpha

- [ ] inventário inicial criado;
- [ ] casos de uso do MVP identificados;
- [ ] owners definidos;
- [ ] hipóteses de valor registradas;
- [ ] riscos classificados;
- [ ] métricas de sucesso definidas;
- [ ] guardrails definidos;
- [ ] custos estimados;
- [ ] alternativas não-IA avaliadas;
- [ ] prioridades aprovadas;
- [ ] WIP limitado;
- [ ] critérios de interrupção definidos;
- [ ] dashboard inicial disponível;
- [ ] casos sem valor removidos do escopo.

---

## 51. Responsabilidades

### Portfolio Owner

Mantém o portfólio.

### Product Owner

Define problema, usuário e valor.

### AI Owner

Avalia viabilidade e modelo.

### Safety/Clinical

Avaliam risco e limites.

### Finance

Avalia custo e retorno.

### Engineering

Avalia esforço e dependências.

### Founder

Aprova prioridade estratégica.

---

## 52. Questões abertas

1. Quais casos formam o MVP?
2. Qual caso é realmente central?
3. Qual valor mínimo esperado?
4. Qual custo máximo?
5. Qual WIP?
6. Quem será owner?
7. Quais métricas?
8. Quais guardrails?
9. Qual processo de sunset?
10. Qual frequência de revisão?
11. Qual dashboard?
12. Quais casos devem ser adiados?

---

## 53. Histórico

| Versão | Data | Alteração |
|---|---|---|
| 0.1 | 20/07/2026 | Criação da governança inicial de portfólio, casos de uso e realização de valor. |
