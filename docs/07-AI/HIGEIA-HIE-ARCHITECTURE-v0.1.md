# Higeia — Higeia Intelligence Engine Architecture

**Documento:** Higeia Intelligence Engine Architecture  
**Sigla:** HIE  
**Versão:** 0.1  
**Status:** Rascunho arquitetural oficial  
**Data:** 13 de julho de 2026  
**Projeto interno:** Projeto Eros  
**Produto:** Higeia  
**Fundador:** Clovis Sadlowski  

---

## 1. Objetivo

Definir a arquitetura conceitual do Higeia Intelligence Engine.

O HIE é o conjunto de componentes responsáveis por:

- receber sinais;
- validar dados;
- preservar origem;
- organizar contexto;
- atualizar memória;
- consultar conhecimento;
- formular hipóteses;
- avaliar evidências;
- detectar riscos;
- gerar explicações;
- produzir saídas para o produto.

---

## 2. Princípios

1. O HIE não é um único modelo de linguagem.
2. O HIE não decide sozinho.
3. Toda saída relevante deve ser rastreável.
4. Toda hipótese deve ter evidências.
5. Dados insuficientes devem reduzir confiança.
6. Associação não deve ser apresentada como causalidade.
7. Modelos externos são componentes substituíveis.
8. Segurança deve existir antes e depois da geração.
9. O HIE deve preservar versões.
10. O usuário deve poder corrigir interpretações.

---

## 3. Visão geral

```text
Input
  ↓
Ingestion Layer
  ↓
Validation Layer
  ↓
Context Layer
  ↓
Memory Layer
  ↓
Knowledge Layer
  ↓
Reasoning Layer
  ↓
Evidence Layer
  ↓
Safety Layer
  ↓
Explanation Layer
  ↓
Output Layer
  ↓
Audit and Evaluation
```

---

## 4. Componentes principais

1. Ingestion Engine.
2. Data Validation Engine.
3. Context Engine.
4. Memory Engine.
5. Knowledge Retrieval Engine.
6. Hypothesis Engine.
7. Evidence Engine.
8. Pattern Engine.
9. Trajectory Engine.
10. Safety Engine.
11. Explainability Engine.
12. Response Composer.
13. Model Orchestrator.
14. Audit Engine.
15. Evaluation Engine.

---

# 5. Ingestion Engine

## Responsabilidade

Receber dados de diferentes fontes e transformá-los em sinais processáveis.

## Fontes iniciais

- anamnese;
- check-in;
- feedback;
- assistente;
- configurações;
- dados de conta;
- eventos internos.

## Fontes futuras

- profissionais;
- documentos;
- wearables;
- laboratórios;
- integrações.

## Saída

Health Signals normalizados.

## Regras

- preservar dado original;
- registrar origem;
- registrar data;
- não sobrescrever histórico;
- classificar sensibilidade;
- verificar consentimento.

---

# 6. Data Validation Engine

## Responsabilidade

Avaliar qualidade, plausibilidade e consistência.

## Validações

- tipo;
- formato;
- unidade;
- faixa plausível;
- duplicidade;
- conflito;
- recência;
- completude;
- origem.

## Estados de qualidade

- verified;
- plausible;
- uncertain;
- conflicting;
- invalid;
- missing.

## Regra

Informação inválida não deve alimentar inferência sem tratamento.

---

# 7. Context Engine

## Responsabilidade

Construir contexto atual.

## Dimensões

- identidade;
- objetivo;
- rotina;
- alimentação;
- sono;
- treinamento;
- estresse;
- motivação;
- recursos;
- saúde declarada;
- histórico.

## Saída

Context Snapshot.

## Estrutura

```text
context_id
user_id
valid_at
active_goal
current_states
recent_events
relevant_barriers
relevant_strengths
data_gaps
safety_flags
```

---

# 8. Memory Engine

## Responsabilidade

Manter memória longitudinal relevante.

## Tipos

### Factual Memory
Fatos declarados e observados.

### Contextual Memory
Rotina, ambiente e circunstâncias.

### Behavioral Memory
Padrões, barreiras e respostas.

### Evolution Memory
Estados e trajetórias.

### Strategy Memory
Intervenções testadas.

### Preference Memory
Preferências e rejeições.

### Safety Memory
Sinais relevantes para segurança.

## Regras

- memória deve ser seletiva;
- informações obsoletas devem ser marcadas;
- correções devem preservar histórico;
- informações sensíveis devem respeitar acesso;
- exclusão deve alcançar derivados quando aplicável.

---

# 9. Knowledge Retrieval Engine

## Responsabilidade

Consultar HKM e HKG.

## Fontes

- ontologia;
- relações;
- regras;
- referências;
- políticas;
- limites;
- taxonomias.

## Saída

Knowledge Context.

## Regras

- usar versão conhecida;
- registrar fonte;
- distinguir conhecimento interno e externo;
- não usar relação sem metadados;
- não elevar hipótese populacional a verdade individual.

---

# 10. Hypothesis Engine

## Responsabilidade

Criar explicações provisórias.

## Gatilhos

- mudança de estado;
- contradição;
- padrão recorrente;
- meta não alcançada;
- novo evento;
- relação no HKG;
- pergunta do usuário.

## Processo

1. identificar observação;
2. gerar hipóteses candidatas;
3. buscar evidências;
4. buscar contradições;
5. identificar lacunas;
6. classificar confiança;
7. registrar versão;
8. enviar para segurança.

## Regras

- limitar quantidade;
- priorizar hipóteses úteis;
- evitar diagnóstico;
- evitar causalidade indevida;
- permitir status inconclusivo.

---

# 11. Evidence Engine

## Responsabilidade

Avaliar sustentação.

## Critérios

- quantidade;
- independência;
- relevância;
- recência;
- consistência;
- qualidade;
- duração;
- repetição;
- conflito.

## Saída

Evidence Bundle.

## Estrutura

```text
supporting
opposing
missing
conflicting
quality_summary
confidence_level
limitations
```

---

# 12. Pattern Engine

## Responsabilidade

Detectar padrões repetidos.

## Exemplos

- sono baixo seguido de fome maior;
- alta carga de trabalho seguida de refeições improvisadas;
- preparação antecipada associada a maior consistência;
- queda recorrente aos finais de semana.

## Requisitos mínimos

- histórico suficiente;
- múltiplas ocorrências;
- temporalidade;
- comparação;
- incerteza.

## Regra

Correlação individual não implica causalidade.

---

# 13. Trajectory Engine

## Responsabilidade

Analisar direção da evolução.

## Dimensões

- peso;
- sono;
- alimentação;
- atividade;
- energia;
- estresse;
- adesão;
- motivação.

## Saídas

- improving;
- stable;
- worsening;
- oscillating;
- insufficient_history.

---

# 14. Safety Engine

## Responsabilidade

Reduzir risco.

## Posição

Atua em três pontos:

1. entrada;
2. raciocínio;
3. saída.

## Funções

- detectar temas sensíveis;
- limitar escopo;
- bloquear prescrição;
- redirecionar;
- registrar incidentes;
- exigir revisão;
- aplicar políticas.

## Níveis

- caution;
- professional_referral;
- urgent_redirection;
- blocked_processing.

## Regra

Segurança tem prioridade sobre fluidez.

---

# 15. Explainability Engine

## Responsabilidade

Transformar raciocínio em explicação.

## Perguntas

1. O que foi observado?
2. Quais dados foram usados?
3. O que é fato?
4. O que é inferência?
5. O que é hipótese?
6. Qual a confiança?
7. O que falta saber?
8. Qual o próximo ponto a observar?

## Formatos

- resumo;
- card;
- detalhe;
- timeline;
- resposta conversacional.

---

# 16. Response Composer

## Responsabilidade

Criar texto final.

## Entradas

- fatos;
- estados;
- hipóteses;
- evidências;
- lacunas;
- safety instructions;
- tom da marca;
- canal;
- objetivo.

## Regras

- linguagem simples;
- sem diagnóstico;
- sem promessas;
- sem detalhes inventados;
- sem certeza indevida;
- não ocultar incerteza.

---

# 17. Model Orchestrator

## Responsabilidade

Selecionar modelos e ferramentas.

## Funções

- escolher modelo;
- controlar prompts;
- limitar tokens;
- executar fallback;
- registrar custo;
- aplicar timeout;
- controlar versão.

## Estratégia inicial

- um provedor principal;
- um fallback;
- prompts versionados;
- saída estruturada;
- validação pós-geração.

## Regra

O provedor não deve ser acoplado ao domínio.

---

# 18. Audit Engine

## Responsabilidade

Registrar o caminho de geração.

## Logs

- usuário;
- evento;
- dados usados;
- versões;
- prompt;
- modelo;
- resposta bruta;
- resposta final;
- safety flags;
- latência;
- custo;
- feedback.

## Privacidade

Logs devem seguir minimização e acesso restrito.

---

# 19. Evaluation Engine

## Responsabilidade

Avaliar qualidade.

## Dimensões

- factualidade;
- relevância;
- segurança;
- explicabilidade;
- clareza;
- consistência;
- utilidade;
- aderência ao escopo.

## Métodos

- testes automatizados;
- casos de referência;
- revisão humana;
- feedback;
- red teaming;
- comparação entre versões.

---

# 20. Pipeline principal

```text
User Input
  ↓
Consent Check
  ↓
Signal Creation
  ↓
Validation
  ↓
Context Update
  ↓
Memory Update
  ↓
Knowledge Retrieval
  ↓
Candidate Hypotheses
  ↓
Evidence Evaluation
  ↓
Safety Review
  ↓
Explanation
  ↓
Response Composition
  ↓
Output Validation
  ↓
Audit Log
  ↓
User Feedback
```

---

# 21. Pipeline do Perfil

1. receber anamnese;
2. validar completude;
3. criar sinais;
4. criar fatos;
5. criar estados;
6. identificar pontos fortes;
7. identificar barreiras;
8. gerar hipóteses;
9. avaliar evidências;
10. identificar lacunas;
11. executar safety review;
12. compor perfil;
13. validar saída;
14. versionar;
15. apresentar.

---

# 22. Pipeline de Check-in

1. receber respostas;
2. comparar com linha de base;
3. criar eventos;
4. atualizar estados;
5. detectar mudança;
6. atualizar hipóteses;
7. atualizar trajetória;
8. gerar resumo;
9. atualizar perfil;
10. registrar.

---

# 23. Pipeline Conversacional

1. classificar intenção;
2. detectar risco;
3. buscar contexto;
4. buscar memória;
5. consultar conhecimento;
6. formular resposta;
7. aplicar safety;
8. registrar;
9. permitir feedback.

---

# 24. Arquitetura de prompts

## Tipos

- extraction;
- classification;
- hypothesis_generation;
- evidence_summary;
- profile_generation;
- conversation;
- safety;
- evaluation.

## Requisitos

- identificador;
- versão;
- objetivo;
- entrada;
- saída;
- limites;
- exemplos;
- testes;
- owner;
- data.

---

# 25. Saídas estruturadas

O HIE deve preferir JSON validável antes da renderização.

## Exemplo

```json
{
  "observation": "...",
  "facts": [],
  "hypotheses": [],
  "evidence": [],
  "missing_data": [],
  "safety_flags": [],
  "confidence": "moderate"
}
```

---

# 26. Gestão de confiança

## MVP

Qualitativa:

- low;
- moderate;
- high;
- insufficient_data.

## Base conceitual

- qualidade;
- quantidade;
- recência;
- consistência;
- conflito;
- independência;
- histórico.

## Limite

Não apresentar probabilidade matemática sem validação.

---

# 27. Gestão de conflitos

## Exemplo

Usuário relata alimentação excelente, mas descreve padrão incompatível.

## Ação

- marcar conflito;
- não escolher uma versão automaticamente;
- perguntar;
- reduzir confiança;
- preservar ambas.

---

# 28. Human-in-the-loop

## MVP

Revisão humana ocorrerá em:

- respostas sinalizadas;
- incidentes;
- testes;
- feedback crítico;
- casos sensíveis.

## Futuro profissional

Profissionais poderão:

- confirmar;
- rejeitar;
- editar;
- adicionar evidência;
- registrar decisão.

---

# 29. Falhas e fallback

## Cenários

- provedor indisponível;
- timeout;
- resposta inválida;
- safety failure;
- custo excedido;
- contexto insuficiente.

## Ações

- repetir;
- usar fallback;
- retornar mensagem segura;
- salvar progresso;
- não inventar;
- registrar incidente.

---

# 30. Observabilidade

## Métricas

- latência;
- custo;
- taxa de erro;
- taxa de fallback;
- safety triggers;
- respostas contestadas;
- hipóteses rejeitadas;
- satisfação;
- uso por fluxo.

---

# 31. Segurança técnica

- autenticação;
- autorização;
- criptografia;
- segregação;
- segredo de API;
- rate limiting;
- proteção de logs;
- controle de acesso;
- backups;
- retenção;
- exclusão.

---

# 32. Privacidade

## Princípios

- minimização;
- finalidade;
- consentimento;
- transparência;
- correção;
- exclusão;
- portabilidade futura;
- acesso restrito.

---

# 33. Componentes do MVP

Obrigatórios:

- Ingestion;
- Validation;
- Context;
- Memory básico;
- Hypothesis;
- Evidence;
- Safety;
- Explainability;
- Orchestrator;
- Audit;
- Evaluation mínimo.

Futuros:

- HKG avançado;
- modelos preditivos;
- aprendizado coletivo;
- multiagentes;
- integração profissional;
- modelos próprios.

---

# 34. Decisões arquiteturais

## Modular Monolith

O HIE inicial deve ser modular, mas implantado de forma simples.

## Async Processing

Geração de perfil pode usar fila.

## Provider Abstraction

O provedor deve ser substituível.

## Structured Output

Saídas devem ser validadas.

## Version Everything

Prompts, modelos, regras e perfis devem ser versionados.

---

# 35. Critérios de aceite

O HIE v0.1 estará pronto para detalhamento técnico quando:

- componentes estiverem definidos;
- pipelines estiverem documentados;
- segurança estiver incorporada;
- memória estiver separada;
- hipóteses e evidências estiverem modeladas;
- outputs estruturados estiverem previstos;
- auditoria estiver definida;
- avaliação estiver definida;
- fallback estiver previsto;
- limites do MVP estiverem claros.

---

# 36. Riscos

1. Dependência excessiva de LLM.
2. Alucinação.
3. Prompts inconsistentes.
4. Falta de dados.
5. Custo alto.
6. Latência.
7. Segurança insuficiente.
8. Logs excessivos.
9. Perfil genérico.
10. Confiança indevida.

---

# 37. Mitigações

- dados estruturados;
- validação;
- knowledge model;
- saídas estruturadas;
- safety layer;
- testes;
- auditoria;
- feedback;
- fallback;
- versionamento.

---

# 38. Questões abertas

1. Qual provedor inicial?
2. Qual modelo principal?
3. Qual fallback?
4. Qual banco de memória?
5. Qual fila?
6. Qual formato de logs?
7. Como calcular confiança?
8. Como testar factualidade?
9. Como revisar casos sensíveis?
10. Qual política de retenção?
11. Qual orçamento por usuário?
12. Quando introduzir HKG real?

---

# 39. Próximo documento

O próximo documento será:

> Higeia Memory Model Specification v0.1.

Ele definirá:

- tipos de memória;
- ciclo de vida;
- atualização;
- esquecimento;
- correção;
- prioridade;
- privacidade;
- vínculo com Digital Twin.

---

# 40. Histórico

| Versão | Data | Alteração |
|---|---|---|
| 0.1 | 13/07/2026 | Primeira arquitetura conceitual do HIE. |
