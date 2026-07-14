# Higeia — Higeia Knowledge Model Specification

**Documento:** Higeia Knowledge Model Specification  
**Sigla:** HKM  
**Versão:** 0.1  
**Status:** Rascunho conceitual oficial  
**Data:** 13 de julho de 2026  
**Projeto interno:** Projeto Eros  
**Produto:** Higeia  
**Fundador:** Clovis Sadlowski  

---

## 1. Objetivo

Definir o modelo formal de conhecimento utilizado pelo Higeia para representar indivíduos, contexto, eventos, estados, hipóteses, evidências e evolução ao longo do tempo.

O HKM será a linguagem comum entre:

- anamnese;
- banco de dados;
- HIE;
- Digital Twin;
- relatórios;
- check-ins;
- timeline;
- analytics;
- futuras integrações.

---

## 2. Escopo

Esta versão cobre o MVP B2C focado em emagrecimento personalizado.

O modelo inicial inclui:

- identidade;
- objetivos;
- rotina;
- alimentação;
- fome e saciedade;
- sono;
- atividade física;
- estresse percebido;
- motivação;
- contexto de saúde;
- barreiras;
- pontos fortes;
- intervenções;
- evolução.

Não cobre ainda:

- diagnóstico;
- prontuário clínico completo;
- prescrição;
- farmacologia avançada;
- exames laboratoriais estruturados;
- genômica;
- integração hospitalar;
- múltiplos profissionais.

---

## 3. Princípios

1. Nenhum dado isolado representa a pessoa.
2. O significado emerge de contexto, tempo e relação.
3. Fato, relato, inferência e hipótese devem ser separados.
4. Associação não implica causalidade.
5. A ausência de dados deve ser representada.
6. Toda hipótese deve ter evidências e limitações.
7. Toda informação deve preservar origem e temporalidade.
8. O modelo deve permitir correção.
9. O modelo deve ser versionado.
10. O Digital Twin é parcial e evolutivo.

---

## 4. Visão geral

```text
Health Signals
    ↓
Facts and Reports
    ↓
Entities and Attributes
    ↓
Events and States
    ↓
Relationships
    ↓
Hypotheses
    ↓
Evidence Evaluation
    ↓
Trajectory
    ↓
Personal Intelligence Profile
```

---

## 5. Tipos fundamentais

O HKM será composto por dez tipos fundamentais:

1. Entity
2. Attribute
3. Health Signal
4. Fact
5. Event
6. State
7. Relationship
8. Evidence
9. Hypothesis
10. Trajectory

Tipos auxiliares:

- Goal
- Barrier
- Strength
- Strategy
- Intervention
- Outcome
- Data Quality
- Source
- Consent
- Safety Flag

---

# 6. Entity

## Definição

Conceito persistente ou identificável dentro do domínio.

## Exemplos

- Person
- Goal
- Meal
- Sleep
- Training Session
- Barrier
- Medication
- Professional
- Strategy

## Campos mínimos

```text
entity_id
entity_type
owner_id
created_at
updated_at
status
version
```

## Regras

- cada entidade deve possuir identificador único;
- entidades sensíveis devem respeitar permissões;
- exclusão lógica e física devem ser diferenciadas;
- alterações relevantes devem ser versionadas.

---

# 7. Attribute

## Definição

Característica associada a uma entidade.

## Exemplos

Pessoa:
- birth_date;
- height;
- occupation.

Sono:
- duration;
- quality;
- interruptions.

## Campos mínimos

```text
attribute_id
entity_id
name
value
unit
source
recorded_at
valid_from
valid_to
quality
```

## Regras

- valores devem preservar unidade;
- autorrelato deve ser identificado;
- estimativas não devem parecer medições;
- valores históricos não devem ser sobrescritos.

---

# 8. Health Signal

## Definição

Menor unidade de informação relevante para atualizar a compreensão do usuário.

## Exemplos

- peso registrado;
- resposta de check-in;
- treino concluído;
- relato de fome;
- mudança de rotina;
- foto enviada;
- medicação declarada.

## Estrutura

```text
signal_id
user_id
signal_type
value
unit
source_type
source_id
observed_at
recorded_at
confidence
quality
sensitivity
consent_scope
processing_status
```

## Source types

- self_report;
- professional_entry;
- device;
- document;
- derived;
- system_event;
- external_integration.

## Quality levels

- verified;
- plausible;
- uncertain;
- conflicting;
- missing;
- invalid.

---

# 9. Fact

## Definição

Informação registrada como ocorrida ou declarada.

## Exemplo

> O usuário relatou dormir cinco horas.

Isso é fato como relato, não prova objetiva da duração real.

## Estrutura

```text
fact_id
statement
subject
predicate
object
source
observed_at
validity
quality
version
```

## Tipos

- observed_fact;
- declared_fact;
- imported_fact;
- derived_fact.

---

# 10. Event

## Definição

Algo que aconteceu em determinado momento.

## Exemplos

- começou novo emprego;
- realizou treino;
- fez check-in;
- mudou meta;
- iniciou medicação declarada;
- teve viagem;
- refeição fora do planejado.

## Estrutura

```text
event_id
event_type
user_id
started_at
ended_at
source
description
impact_scope
severity
related_entities
```

## Regras

- eventos devem preservar tempo;
- eventos podem ter duração;
- impacto não deve ser inferido sem base;
- eventos podem gerar novos estados.

---

# 11. State

## Definição

Descrição de uma condição do usuário ou dimensão em determinado período.

## Exemplos

- low_sleep_duration;
- high_perceived_stress;
- stable_training_frequency;
- reduced_adherence;
- insufficient_data.

## Estrutura

```text
state_id
state_type
user_id
value
classification
valid_from
valid_to
evidence_ids
confidence_level
status
```

## Classificações

- favorable;
- unfavorable;
- variable;
- neutral;
- unknown;
- insufficient_data.

---

# 12. Relationship

## Definição

Ligação semântica entre entidades, eventos, estados ou hipóteses.

## Tipos iniciais

- associated_with;
- may_influence;
- precedes;
- follows;
- contradicts;
- supports;
- weakens;
- measured_by;
- caused_by_professional_action;
- co_occurs_with;
- depends_on.

## Estrutura

```text
relationship_id
subject_id
predicate
object_id
direction
conditions
strength
evidence_level
source
valid_from
valid_to
version
```

## Regras

- causalidade exige suporte específico;
- linguagem padrão deve preferir “may_influence”;
- força deve ser qualitativa no MVP;
- relações devem ser revisáveis.

---

# 13. Evidence

## Definição

Informação que fortalece, enfraquece ou limita uma hipótese.

## Tipos

- supporting;
- opposing;
- missing;
- conflicting;
- external_reference;
- user_report;
- observation;
- derived_pattern.

## Estrutura

```text
evidence_id
hypothesis_id
evidence_type
source_id
summary
relevance
recency
quality
direction
limitations
```

## Critérios de avaliação

- origem;
- consistência;
- recência;
- repetição;
- independência;
- qualidade;
- relevância;
- conflito.

---

# 14. Hypothesis

## Definição

Explicação provisória para um padrão, mudança ou dificuldade observada.

## Estrutura

```text
hypothesis_id
user_id
title
statement
domain
status
confidence_level
supporting_evidence
opposing_evidence
missing_information
created_at
updated_at
review_at
version
```

## Status

- open;
- strengthened;
- weakened;
- rejected;
- inconclusive;
- archived.

## Regras

- hipótese deve usar linguagem probabilística;
- não pode ser apresentada como diagnóstico;
- deve mostrar evidências;
- deve mostrar lacunas;
- pode ser atualizada;
- deve preservar histórico.

---

# 15. Trajectory

## Definição

Direção e padrão de mudança de um ou mais estados ao longo do tempo.

## Exemplos

- sleep_improving;
- weight_stable;
- adherence_declining;
- motivation_oscillating;
- insufficient_history.

## Estrutura

```text
trajectory_id
user_id
dimension
period_start
period_end
direction
volatility
supporting_states
confidence_level
summary
```

## Direções

- improving;
- stable;
- worsening;
- oscillating;
- unknown.

---

# 16. Goal

## Definição

Resultado desejado declarado pelo usuário.

## Estrutura

```text
goal_id
user_id
goal_type
description
importance
target
deadline
status
source
```

## Regras

- objetivo deve preservar motivação;
- meta numérica deve ser opcional;
- prazo irreal deve gerar aviso;
- objetivo pode mudar.

---

# 17. Barrier

## Definição

Fator percebido ou observado que reduz a capacidade de seguir uma estratégia.

## Tipos

- practical;
- contextual;
- behavioral;
- emotional_perceived;
- financial;
- social;
- environmental;
- knowledge_related.

## Estrutura

```text
barrier_id
user_id
type
description
evidence
frequency
context
status
```

---

# 18. Strength

## Definição

Recurso, comportamento ou condição que favorece evolução.

## Exemplos

- treino consistente;
- apoio familiar;
- clareza de objetivo;
- capacidade de planejamento;
- consciência de padrões.

## Regra

Pontos fortes devem ser baseados em dados específicos.

---

# 19. Strategy

## Definição

Conjunto organizado de ações propostas para aumentar a probabilidade de evolução.

## Estrutura

```text
strategy_id
user_id
goal_id
description
rationale
status
source
created_at
```

## Limite

No MVP, estratégias automáticas devem permanecer comportamentais e de baixo risco.

---

# 20. Intervention

## Definição

Mudança deliberada implementada.

## Exemplos

- preparar refeições;
- mudar horário;
- definir pequeno objetivo;
- reduzir notificações;
- procurar profissional.

## Estrutura

```text
intervention_id
strategy_id
started_at
ended_at
status
adherence
outcome_ids
```

---

# 21. Outcome

## Definição

Resultado observado após período ou intervenção.

## Estrutura

```text
outcome_id
intervention_id
metric
value
unit
observed_at
interpretation
quality
```

## Regra

Resultado não implica causalidade automática.

---

# 22. Data Quality

## Dimensões

- completeness;
- consistency;
- recency;
- reliability;
- specificity;
- provenance;
- conflict.

## Valores

- high;
- medium;
- low;
- unknown.

## Uso

A qualidade dos dados deve influenciar confiança de hipóteses.

---

# 23. Source

## Tipos

- user;
- professional;
- device;
- document;
- external_system;
- HIE;
- admin.

## Campos

```text
source_id
source_type
identity
verification_status
created_at
```

---

# 24. Consent

## Objetivo

Registrar base de autorização para coleta e processamento.

## Campos

```text
consent_id
user_id
consent_type
version
granted
granted_at
revoked_at
scope
```

---

# 25. Safety Flag

## Definição

Sinal que exige limitação, redirecionamento ou revisão.

## Níveis

- caution;
- professional_referral;
- urgent_redirection;
- blocked_processing.

## Exemplos

- transtorno alimentar;
- sintomas graves;
- ideação de autoagressão;
- gravidez;
- menor de idade;
- medicação relevante;
- dor intensa.

---

# 26. Domínios iniciais

## Identity
- age;
- biological_sex;
- height;
- occupation;
- household.

## Goal
- weight_loss;
- health;
- body_composition;
- performance.

## Routine
- work_schedule;
- commute;
- meal_preparation_time;
- variability;
- responsibilities.

## Nutrition
- meal_frequency;
- food_environment;
- protein_frequency;
- fruit_vegetable_frequency;
- ultra_processed_frequency;
- hydration;
- alcohol;
- weekend_pattern.

## Hunger
- hunger_intensity;
- hunger_timing;
- satiety;
- emotional_eating_report;
- loss_of_control_report.

## Sleep
- duration;
- quality;
- interruptions;
- schedule;
- rested_on_waking.

## Training
- frequency;
- modality;
- duration;
- intensity;
- recovery;
- limitation.

## Behavior
- motivation;
- self_efficacy;
- consistency;
- planning;
- adherence.

## Stress
- perceived_stress;
- energy;
- workload;
- emotional_context.

## Health Context
- declared_condition;
- medication;
- supplement;
- allergy;
- pregnancy;
- symptom;
- professional_follow_up.

---

# 27. Exemplo completo

## Signals

- sleep_duration = 5.5h;
- workload = high;
- meal_preparation_time = low;
- takeout_frequency = high;
- motivation = 8/10.

## Facts

- usuário relatou trabalhar 10 horas por dia;
- usuário relatou pouca disponibilidade para cozinhar.

## States

- low_sleep_duration;
- limited_meal_preparation_capacity;
- high_motivation.

## Relationships

- high_workload may_influence limited_meal_preparation_capacity;
- limited_meal_preparation_capacity may_influence takeout_frequency.

## Hypothesis

> Sobrecarga de rotina pode estar associada à menor consistência alimentar.

## Evidence

Favorável:
- carga de trabalho alta;
- pouco tempo para cozinhar;
- consumo frequente de refeições prontas.

Contrária:
- motivação elevada.

Lacuna:
- ainda não há histórico semanal.

## Trajectory

- insufficient_history.

---

# 28. Regras de temporalidade

Toda informação deve possuir:

- observed_at;
- recorded_at;
- valid_from;
- valid_to quando aplicável.

## Regra

O estado atual não deve apagar estados anteriores.

---

# 29. Regras de versionamento

Devem ser versionados:

- ontologia;
- entidades;
- relações;
- hipóteses;
- regras;
- prompts;
- classificações;
- perfis;
- consentimentos.

---

# 30. Regras de inferência

## Inferência permitida

- baseada em dados disponíveis;
- linguagem probabilística;
- evidência explícita;
- incerteza visível;
- possibilidade de correção.

## Inferência proibida

- diagnóstico;
- causalidade sem base;
- atributo psicológico clínico;
- informação não fornecida;
- decisão médica;
- recomendação de medicamento.

---

# 31. HKG

O Higeia Knowledge Graph será a materialização das relações do HKM.

## Exemplo

```text
High Workload
    may_influence
Low Meal Preparation Time
    may_influence
Higher Takeout Frequency
    may_influence
Lower Dietary Consistency
```

## Metadados

- evidence_level;
- source;
- conditions;
- population_scope;
- revision_date;
- limitations.

---

# 32. Integração com o Perfil

O Perfil de Inteligência Pessoal utilizará:

- Facts para fatos;
- States para situação atual;
- Strengths para pontos fortes;
- Barriers para barreiras;
- Hypotheses para interpretações;
- Evidence para explicação;
- Missing Data para lacunas;
- Trajectory para evolução.

---

# 33. Integração com Check-ins

Check-ins devem:

- gerar novos Health Signals;
- atualizar Facts;
- criar Events;
- atualizar States;
- fortalecer ou enfraquecer Hypotheses;
- atualizar Trajectories.

---

# 34. Integração com HIE

O HIE deverá:

1. validar sinais;
2. classificar origem;
3. atualizar fatos;
4. detectar conflitos;
5. atualizar estados;
6. consultar relações;
7. gerar hipóteses;
8. avaliar evidências;
9. atualizar trajetórias;
10. produzir explicação.

---

# 35. Critérios de aceite

O HKM v0.1 estará pronto quando:

- tipos fundamentais estiverem definidos;
- domínios iniciais estiverem listados;
- temporalidade estiver definida;
- origem estiver preservada;
- fatos e hipóteses estiverem separados;
- evidências estiverem modeladas;
- segurança estiver incorporada;
- integração com perfil e check-ins estiver clara;
- regras de inferência estiverem documentadas.

---

# 36. Questões abertas

1. Usar banco relacional, grafo ou híbrido?
2. Como representar contradições?
3. Como calcular confiança?
4. Qual taxonomia de barreiras?
5. Qual taxonomia de pontos fortes?
6. Como versionar relações científicas?
7. Como separar conhecimento populacional de individual?
8. Como mapear documentos?
9. Como tratar fotos?
10. Como implementar exclusão de dados derivados?
11. Como anonimizar aprendizado coletivo?
12. Como revisar o HKG com especialistas?

---

# 37. Próximo documento

O próximo documento será:

> Higeia Intelligence Engine Architecture v0.1.

Ele definirá:

- componentes;
- pipeline;
- memória;
- raciocínio;
- evidência;
- explicabilidade;
- segurança;
- modelos externos;
- auditoria;
- avaliação.

---

# 38. Histórico

| Versão | Data | Alteração |
|---|---|---|
| 0.1 | 13/07/2026 | Primeira especificação formal do Higeia Knowledge Model. |
