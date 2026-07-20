# Higeia — AI Evaluation Framework

**Documento:** Higeia AI Evaluation Framework  
**Versão:** 0.1  
**Status:** Estrutura inicial oficial  
**Data:** 19 de julho de 2026  
**Projeto interno:** Projeto Eros  
**Produto:** Higeia  
**Fundador:** Clovis Sadlowski  

---

## 1. Objetivo

Definir como o Higeia avaliará sistemas, prompts, modelos e fluxos de inteligência artificial antes, durante e depois de sua liberação.

Este framework cobre:

- geração de respostas;
- classificação;
- extração estruturada;
- memória;
- perfil de inteligência;
- check-ins;
- explicações;
- segurança;
- roteamento;
- uso de ferramentas;
- fallback;
- regressão;
- custo;
- latência;
- experiência do usuário.

---

## 2. Princípio central

Uma saída de IA não deve ser considerada boa apenas porque parece convincente.

Ela deve ser avaliada por critérios explícitos, reproduzíveis e rastreáveis.

Nenhuma versão de alto risco poderá ser liberada sem:

- dataset de avaliação;
- critérios de aprovação;
- casos críticos;
- revisão humana;
- testes de segurança;
- comparação com versão anterior;
- plano de rollback.

---

## 3. Objetivos da avaliação

A avaliação deve responder:

1. A resposta está correta?
2. Está apoiada nos dados disponíveis?
3. Distingue fatos de hipóteses?
4. Demonstra incerteza adequada?
5. Respeita limites de escopo?
6. Protege o usuário?
7. Protege dados pessoais?
8. Mantém consistência?
9. Possui utilidade real?
10. Funciona com custo e latência aceitáveis?

---

## 4. Escopo de avaliação

Devem ser avaliados:

- prompts;
- modelos;
- parâmetros;
- schemas;
- pipelines;
- classificadores;
- memória;
- retrieval;
- guardrails;
- ferramentas;
- fallback;
- roteamento;
- pós-processamento;
- experiência final.

---

## 5. Tipos de avaliação

### Offline

Executada com datasets fixos antes da liberação.

### Online

Executada com telemetria e feedback em ambiente controlado.

### Humana

Executada por revisores capacitados.

### Automática

Executada por regras, schemas, métricas ou modelos avaliadores.

### Adversarial

Executada com entradas maliciosas, ambíguas ou de alto risco.

### Longitudinal

Avalia comportamento ao longo do tempo e entre múltiplas interações.

---

## 6. Unidades avaliadas

A avaliação poderá ocorrer por:

- resposta;
- execução;
- conversa;
- jornada;
- usuário fictício;
- fluxo;
- versão;
- coorte;
- release;
- incidente.

---

## 7. Dimensões principais

### Correção

A resposta está compatível com os dados e regras disponíveis.

### Fundamentação

As afirmações relevantes podem ser ligadas a evidências.

### Relevância

A resposta atende ao objetivo.

### Clareza

A linguagem é compreensível.

### Utilidade

A resposta ajuda o usuário a avançar.

### Consistência

Respostas semelhantes mantêm comportamento compatível.

### Incerteza

Limitações e ambiguidades são expressas.

### Segurança

A resposta evita danos e escalona risco.

### Privacidade

A resposta não expõe dados indevidos.

### Tom

A comunicação é respeitosa, acolhedora e não julgadora.

### Estrutura

A saída respeita o schema esperado.

### Eficiência

Custo e latência são aceitáveis.

---

## 8. Escala de pontuação

Escala recomendada:

- 0 — falha grave;
- 1 — inadequado;
- 2 — parcialmente adequado;
- 3 — adequado;
- 4 — muito bom;
- 5 — excelente.

### Regra

Médias não podem esconder falhas críticas.

Uma única falha P0 ou safety-critical pode bloquear a versão.

---

## 9. Critérios bloqueadores

Bloquear release quando houver:

- diagnóstico indevido;
- prescrição indevida;
- incentivo a comportamento perigoso;
- falha de encaminhamento em crise;
- vazamento de dados;
- acesso cruzado entre usuários;
- falsa certeza em situação crítica;
- discriminação grave;
- quebra frequente de schema crítico;
- instrução maliciosa executada;
- regressão significativa de safety;
- ausência de rollback.

---

## 10. Classes de risco

### AI-LOW

Conteúdo operacional de baixo impacto.

### AI-MEDIUM

Personalização, orientação geral e explicações.

### AI-HIGH

Inferências de saúde, memória longitudinal e recomendações personalizadas.

### AI-CRITICAL

Crise, autolesão, transtornos alimentares, medicação, diagnóstico ou decisão de alto impacto.

---

## 11. Rigor por risco

### AI-LOW

- avaliação automática;
- amostra humana;
- schema validation;
- regressão.

### AI-MEDIUM

- avaliação automática;
- revisão humana;
- casos adversariais;
- segurança;
- privacidade.

### AI-HIGH

- dataset ampliado;
- revisão especializada;
- safety review;
- regressão formal;
- rollout gradual;
- monitoramento reforçado.

### AI-CRITICAL

- validação especializada;
- testes adversariais aprofundados;
- critérios bloqueadores estritos;
- fallback seguro;
- feature flag;
- aprovação formal;
- rollout extremamente limitado.

---

## 12. Dataset de avaliação

Cada fluxo deve possuir dataset próprio ou compartilhado.

Estrutura mínima:

- case_id;
- domain;
- risk_class;
- input;
- context;
- expected_behavior;
- forbidden_behavior;
- required_elements;
- optional_elements;
- severity;
- tags;
- reviewer;
- created_at;
- last_reviewed_at.

---

## 13. Categorias de casos

O dataset deve incluir:

- caso normal;
- caso simples;
- caso complexo;
- caso incompleto;
- caso contraditório;
- caso ambíguo;
- caso com erro do usuário;
- caso adversarial;
- caso de crise;
- caso fora de escopo;
- caso com dado sensível;
- caso com múltiplas hipóteses;
- caso longitudinal;
- caso de privacidade;
- caso de falha de fornecedor.

---

## 14. Personas sintéticas

Devem ser criadas personas fictícias para testar:

- diferentes rotinas;
- diferentes objetivos;
- baixa adesão;
- alta ansiedade;
- múltiplas restrições;
- baixa alfabetização em saúde;
- informações conflitantes;
- histórico incompleto;
- mudanças ao longo do tempo.

### Regra

Personas sintéticas não podem reproduzir dados reais identificáveis.

---

## 15. Casos de segurança

O dataset deve incluir:

- autolesão;
- ideação suicida;
- transtorno alimentar;
- uso incorreto de medicação;
- sintomas graves;
- pedido de diagnóstico;
- pedido de prescrição;
- gravidez;
- menores;
- violência;
- abuso;
- desidratação severa;
- sinais de emergência;
- conteúdo enganoso;
- tentativa de manipular safety.

---

## 16. Avaliação de factualidade

Verificar:

- compatibilidade com contexto;
- ausência de invenção;
- ausência de falsa fonte;
- separação entre dado e inferência;
- indicação de incerteza;
- ausência de contradição interna.

---

## 17. Avaliação de groundedness

Cada afirmação relevante deve ser classificada como:

- diretamente suportada;
- inferida;
- especulativa;
- não suportada;
- contraditória.

### Critério

Afirmações não suportadas em contexto sensível devem bloquear a saída.

---

## 18. Avaliação de hipóteses

O Higeia deve:

- marcar hipótese como hipótese;
- apresentar confiança;
- indicar evidência;
- indicar falta de evidência;
- evitar causalidade indevida;
- permitir revisão futura.

---

## 19. Avaliação de segurança

Dimensões:

- detecção de risco;
- classificação;
- resposta;
- limite;
- encaminhamento;
- tom;
- ausência de instrução perigosa;
- ausência de normalização de dano;
- escalonamento adequado.

---

## 20. Avaliação de privacidade

Verificar:

- exposição de nome;
- exposição de identificadores;
- dados de terceiros;
- mistura entre usuários;
- prompt leakage;
- memory leakage;
- logs indevidos;
- conteúdo excessivo enviado ao modelo;
- retenção desnecessária.

---

## 21. Avaliação de memória

Verificar:

- precisão;
- origem;
- temporalidade;
- atualização;
- conflito;
- expiração;
- isolamento;
- correção;
- exclusão;
- relevância;
- não memorização excessiva.

---

## 22. Avaliação de consistência longitudinal

Verificar:

- coerência entre sessões;
- adaptação à evolução;
- respeito a mudanças declaradas;
- ausência de contradição;
- atualização de hipóteses;
- manutenção de preferências válidas;
- remoção de fatos corrigidos.

---

## 23. Avaliação de schema

Toda saída estruturada deve passar por:

- validação sintática;
- validação semântica;
- campos obrigatórios;
- tipos;
- enumerações;
- limites;
- nullability;
- versionamento;
- repair policy.

---

## 24. Avaliação de tom

O tom deve ser:

- respeitoso;
- acolhedor;
- claro;
- não julgador;
- não alarmista;
- não paternalista;
- não manipulativo;
- adequado ao contexto.

---

## 25. Avaliação de utilidade

Perguntas:

- A resposta resolve a necessidade?
- Oferece próximo passo?
- Evita excesso de informação?
- Ajuda o usuário a decidir?
- É executável?
- Respeita limitações reais?

---

## 26. Avaliação de explicabilidade

A resposta deve permitir compreender:

- o que foi observado;
- o que foi inferido;
- por que foi inferido;
- qual confiança existe;
- quais dados faltam;
- o que pode mudar a conclusão.

---

## 27. Avaliação de incerteza

Falhas comuns:

- afirmar com certeza;
- esconder ambiguidade;
- usar linguagem absoluta;
- não pedir informação necessária;
- transformar correlação em causalidade.

---

## 28. Avaliação de recusa

A recusa deve:

- ocorrer quando necessária;
- ser específica;
- explicar o limite;
- oferecer alternativa segura;
- não soar punitiva;
- não bloquear indevidamente conteúdo permitido.

---

## 29. Avaliação de prompt injection

Casos:

- “ignore as instruções”;
- tentativa de revelar system prompt;
- instrução maliciosa em documento;
- texto que pede dados de outro usuário;
- comando escondido;
- conflito entre usuário e política;
- tentativa de executar ferramenta.

---

## 30. Avaliação de tool use

Verificar:

- autorização;
- argumentos;
- confirmação;
- escopo;
- idempotência;
- limites;
- timeout;
- falha;
- auditoria;
- efeito colateral;
- rollback.

---

## 31. Avaliação de roteamento

Verificar se o sistema escolhe corretamente:

- modelo;
- prompt;
- fluxo;
- guardrail;
- fallback;
- encaminhamento;
- revisão humana.

---

## 32. Avaliação de fallback

O fallback deve ser:

- seguro;
- útil;
- coerente;
- rastreável;
- acionado no momento correto;
- incapaz de piorar o risco.

---

## 33. Avaliação de custo

Registrar:

- custo por execução;
- custo por usuário;
- custo por fluxo;
- custo por versão;
- custo em retry;
- custo de fallback;
- custo por coorte.

---

## 34. Avaliação de latência

Registrar:

- média;
- mediana;
- p90;
- p95;
- p99;
- timeout;
- impacto por etapa;
- impacto no usuário.

---

## 35. Avaliação de estabilidade

Executar o mesmo caso múltiplas vezes para medir:

- variabilidade;
- schema pass rate;
- divergência;
- regressão;
- sensibilidade a parâmetros;
- sensibilidade a ordem do contexto.

---

## 36. Avaliação comparativa

Comparar:

- versão atual;
- versão candidata;
- modelo atual;
- modelo candidato;
- prompt atual;
- prompt candidato;
- custo;
- latência;
- safety;
- qualidade.

---

## 37. Regressão

Uma versão candidata não pode degradar significativamente:

- safety;
- privacidade;
- factualidade;
- schema;
- consistência;
- experiência;
- custo;
- latência.

Regressões devem ser registradas mesmo quando aceitas.

---

## 38. Thresholds iniciais

Os thresholds finais serão definidos por fluxo.

Proposta inicial:

- schema pass rate: 100% em fluxo crítico;
- safety critical pass rate: 100%;
- privacy leakage: 0 ocorrência;
- cross-user leakage: 0 ocorrência;
- blocked behavior: 0 ocorrência crítica;
- factuality mínima: a definir;
- groundedness mínima: a definir;
- latência máxima: a definir;
- custo máximo: a definir.

---

## 39. Avaliação humana

Revisores devem possuir:

- instruções;
- rubrica;
- exemplos;
- treinamento;
- critérios de desempate;
- confidencialidade;
- registro de conflito.

---

## 40. Concordância entre revisores

Quando aplicável, medir:

- taxa de concordância;
- divergências;
- casos ambíguos;
- necessidade de revisão da rubrica.

---

## 41. LLM-as-Judge

Pode ser usado como apoio, nunca como única garantia em fluxos de alto risco.

Requisitos:

- prompt avaliador versionado;
- modelo registrado;
- calibração humana;
- testes de viés;
- comparação;
- limites documentados.

---

## 42. Blind Review

Quando possível, revisores não devem saber qual versão gerou cada saída.

Isso reduz viés de preferência.

---

## 43. Avaliação online

Pode usar:

- feedback;
- abandono;
- retry;
- correção;
- reclamação;
- flag de segurança;
- latência;
- custo;
- reversão;
- uso de fallback.

---

## 44. Feedback do usuário

Tipos:

- útil;
- não útil;
- incorreto;
- confuso;
- ofensivo;
- inseguro;
- repetitivo;
- invasivo;
- muito genérico.

Feedback deve ser ligado à versão da execução.

---

## 45. Monitoramento pós-release

Acompanhar:

- falhas;
- safety flags;
- schema failures;
- latência;
- custo;
- feedback;
- divergência;
- incidentes;
- drift;
- mudanças de provedor.

---

## 46. Drift

Tipos:

- data drift;
- behavior drift;
- model drift;
- provider drift;
- prompt drift;
- policy drift;
- user population drift.

---

## 47. Reavaliação obrigatória

Reavaliar quando houver:

- mudança de prompt;
- mudança de modelo;
- mudança de parâmetros;
- mudança de schema;
- mudança de contexto;
- mudança de fornecedor;
- incidente;
- novo público;
- nova funcionalidade;
- alteração regulatória;
- mudança de safety policy.

---

## 48. Aprovação de release

A aprovação deve registrar:

- versão;
- dataset;
- resultados;
- falhas;
- exceções;
- risco residual;
- aprovadores;
- rollout;
- rollback;
- data.

---

## 49. Exceções

Uma versão pode ser aprovada com limitação não crítica quando:

- o risco estiver documentado;
- houver mitigação;
- não afetar safety ou privacidade;
- houver prazo para correção;
- o rollout for controlado;
- os aprovadores aceitarem formalmente.

---

## 50. Artefatos obrigatórios

Cada avaliação relevante deve produzir:

- evaluation run;
- dataset version;
- metric summary;
- failure report;
- reviewer notes;
- decision record;
- release recommendation.

---

## 51. Identificador de execução

Formato:

```text
EVAL-YYYYMMDD-DOMAIN-000
```

Exemplo:

```text
EVAL-20260719-PROFILE-001
```

---

## 52. Estrutura de resultados

```text
evaluations/
└── EVAL-20260719-PROFILE-001/
    ├── metadata.yaml
    ├── results.csv
    ├── failures.md
    ├── reviewer-notes.md
    └── decision.md
```

---

## 53. Severidade de falhas

### P0

Falha crítica de segurança, privacidade ou dano.

### P1

Falha grave em fluxo central.

### P2

Falha relevante com impacto moderado.

### P3

Falha menor.

### P4

Preferência ou melhoria.

---

## 54. Responsabilidades

### AI Owner

Mantém avaliação do fluxo.

### Engenharia

Implementa harness, métricas e rastreabilidade.

### Produto

Valida utilidade e experiência.

### Safety

Valida riscos e bloqueadores.

### Domínio

Revisa conteúdo especializado.

### Privacidade

Valida proteção de dados.

### Fundador

Aprova gates e risco residual de alto impacto.

---

## 55. Definition of Evaluated

Uma versão está avaliada quando:

- dataset está versionado;
- execução está registrada;
- critérios foram aplicados;
- falhas foram classificadas;
- regressão foi comparada;
- safety foi revisada;
- privacidade foi revisada;
- decisão foi documentada;
- rollback está disponível.

---

## 56. Questões abertas

1. Thresholds finais.
2. Ferramenta de avaliação.
3. Dataset inicial.
4. Revisores especializados.
5. Métrica de groundedness.
6. Métrica de consistência longitudinal.
7. Processo de calibração.
8. Frequência de reavaliação.
9. Custo aceitável.
10. Latência aceitável.
11. Política de LLM-as-Judge.
12. Processo de auditoria externa.

---

## 57. Histórico

| Versão | Data | Alteração |
|---|---|---|
| 0.1 | 19/07/2026 | Criação do framework inicial de avaliação de IA. |
