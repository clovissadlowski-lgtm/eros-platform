# Higeia — Prompt Registry and AI Change Management

**Documento:** Higeia Prompt Registry and AI Change Management  
**Versão:** 0.1  
**Status:** Norma inicial  
**Data:** 19 de julho de 2026  
**Projeto interno:** Projeto Eros  
**Produto:** Higeia  
**Fundador:** Clovis Sadlowski  

---

## 1. Objetivo

Definir como os prompts, instruções de sistema, schemas, modelos, guardrails e avaliações de IA do Higeia serão registrados, versionados, testados, aprovados, publicados, monitorados e substituídos.

Este documento cobre:

- prompts de sistema;
- prompts de tarefa;
- prompts de classificação;
- prompts de geração;
- prompts de segurança;
- prompts de resumo;
- prompts de memória;
- prompts de explicação;
- prompts de avaliação;
- schemas de entrada;
- schemas de saída;
- provedores;
- modelos;
- parâmetros;
- versões;
- rollback;
- experimentos;
- incidentes;
- auditoria.

---

## 2. Princípio central

Nenhum prompt de produção deve existir apenas dentro de uma rota, componente, notebook, mensagem de chat ou variável solta.

Todo prompt relevante deve possuir:

- identificador;
- nome;
- objetivo;
- owner;
- versão;
- arquivo;
- modelo compatível;
- schema;
- exemplos;
- testes;
- status;
- histórico;
- data de aprovação;
- plano de rollback.

---

## 3. Por que isso é necessário

Prompts são parte do comportamento do produto.

Uma alteração aparentemente pequena pode:

- mudar o significado de uma resposta;
- alterar o nível de segurança;
- aumentar alucinações;
- gerar tom inadequado;
- aumentar custo;
- aumentar latência;
- produzir dados incompatíveis;
- quebrar memória;
- afetar usuários vulneráveis;
- mudar métricas de produto.

Por isso, prompts devem receber governança semelhante à de código.

---

## 4. Escopo de itens registrados

O registro deverá incluir:

1. system prompts;
2. task prompts;
3. classifier prompts;
4. extraction prompts;
5. summarization prompts;
6. memory prompts;
7. safety prompts;
8. refusal prompts;
9. explanation prompts;
10. evaluation prompts;
11. judge prompts;
12. repair prompts;
13. fallback prompts;
14. output schemas;
15. model configurations;
16. guardrails;
17. datasets de avaliação;
18. thresholds;
19. routing rules;
20. policy versions.

---

## 5. Estrutura recomendada

```text
ai/
├── prompts/
│   ├── assessment/
│   ├── profile/
│   ├── checkin/
│   ├── conversation/
│   ├── memory/
│   ├── safety/
│   ├── explanation/
│   └── evaluation/
├── schemas/
├── evaluations/
├── datasets/
├── guardrails/
├── routing/
└── registry/
```

Cada prompt deve ficar em arquivo próprio.

---

## 6. Convenção de identificadores

Formato:

```text
PRM-<DOMINIO>-<TIPO>-<NUMERO>
```

Exemplos:

```text
PRM-ASSESSMENT-EXTRACT-001
PRM-PROFILE-GENERATE-001
PRM-SAFETY-TRIAGE-001
PRM-MEMORY-SUMMARIZE-001
```

O identificador nunca deve ser reutilizado.

---

## 7. Convenção de nomes de arquivo

Formato:

```text
<id>--<nome-curto>--v<versao>.md
```

Exemplo:

```text
PRM-PROFILE-GENERATE-001--generate-intelligence-profile--v0.1.md
```

Schemas correspondentes:

```text
SCH-PROFILE-001--intelligence-profile-output--v0.1.json
```

---

## 8. Estados de um prompt

Um prompt pode estar em um destes estados:

- draft;
- proposed;
- under_review;
- approved;
- staging;
- production;
- deprecated;
- retired;
- blocked.

### Draft

Rascunho ainda não preparado para teste formal.

### Proposed

Pronto para avaliação inicial.

### Under Review

Em revisão técnica, de produto ou segurança.

### Approved

Aprovado para staging.

### Staging

Em teste controlado.

### Production

Ativo para usuários.

### Deprecated

Ainda existe, mas não deve receber novas integrações.

### Retired

Removido de uso ativo.

### Blocked

Proibido por risco ou falha.

---

## 9. Versionamento

Cada mudança relevante deve gerar nova versão.

Formato:

```text
MAJOR.MINOR.PATCH
```

### PATCH

Mudança editorial sem efeito comportamental esperado.

### MINOR

Mudança de comportamento compatível.

### MAJOR

Mudança incompatível, de schema, finalidade ou política.

### Regra

Mesmo mudanças pequenas devem ser registradas quando forem para produção.

---

## 10. Metadados obrigatórios

Cada prompt deve declarar:

- prompt_id;
- name;
- domain;
- purpose;
- owner;
- status;
- version;
- created_at;
- updated_at;
- approved_by;
- model_family;
- supported_models;
- input_schema;
- output_schema;
- safety_class;
- retention_class;
- evaluation_dataset;
- rollback_version;
- change_ticket.

---

## 11. Template de prompt

Todo arquivo deve conter:

1. metadados;
2. objetivo;
3. contexto;
4. limites;
5. entradas;
6. saída;
7. instruções;
8. comportamento proibido;
9. exemplos;
10. falhas conhecidas;
11. testes;
12. histórico.

---

## 12. Tipos de prompts

### System Prompt

Define identidade, princípios e limites globais.

### Task Prompt

Executa tarefa específica.

### Classifier Prompt

Classifica conteúdo ou estado.

### Extractor Prompt

Converte texto em estrutura.

### Generator Prompt

Gera resposta ou artefato.

### Safety Prompt

Avalia risco e encaminhamento.

### Repair Prompt

Corrige saída inválida.

### Judge Prompt

Avalia outra saída.

### Fallback Prompt

Usado quando o fluxo principal falha.

---

## 13. Separação de responsabilidades

Evitar prompts que:

- classificam;
- diagnosticam;
- explicam;
- armazenam;
- respondem;
- avaliam segurança;

tudo ao mesmo tempo.

Preferir etapas pequenas com contratos claros.

---

## 14. Entradas

Toda entrada deve ser definida por schema.

O schema deve indicar:

- campos obrigatórios;
- campos opcionais;
- tipos;
- limites;
- origem;
- sensibilidade;
- redaction;
- tamanho máximo.

### Regra

Não enviar contexto completo quando apenas parte é necessária.

---

## 15. Saídas

Toda saída importante deve possuir schema estruturado.

Exemplo:

```json
{
  "summary": "string",
  "confidence": 0.0,
  "evidence_ids": [],
  "safety_status": "safe"
}
```

Saídas devem ser validadas antes do uso.

---

## 16. Comportamentos proibidos

Cada prompt deve declarar o que não pode fazer.

Exemplos:

- diagnosticar;
- prescrever;
- ocultar incerteza;
- afirmar hipótese como fato;
- revelar dados de outro usuário;
- expor prompt interno;
- ignorar safety;
- inventar fonte;
- substituir profissional;
- produzir recomendação de risco sem triagem.

---

## 17. Modelos e parâmetros

Registrar:

- provedor;
- modelo;
- versão;
- temperatura;
- top_p;
- max_tokens;
- timeout;
- retries;
- response format;
- seed quando disponível;
- região;
- custo estimado.

Mudança de modelo exige avaliação de regressão.

---

## 18. Compatibilidade

Um prompt aprovado para um modelo não deve ser considerado automaticamente compatível com outro.

A compatibilidade deve ser testada e registrada.

---

## 19. Registro central

O Prompt Registry deve conter uma linha por versão ativa ou histórica.

Campos mínimos:

- prompt_id;
- version;
- name;
- domain;
- status;
- owner;
- file;
- schema;
- model;
- dataset;
- safety_class;
- deployed_at;
- deprecated_at;
- rollback;
- notes.

---

## 20. Fluxo de mudança

1. identificar necessidade;
2. abrir change record;
3. registrar hipótese;
4. criar nova versão;
5. atualizar testes;
6. executar avaliação offline;
7. revisar segurança;
8. revisar produto;
9. testar em staging;
10. aprovar;
11. publicar gradualmente;
12. monitorar;
13. confirmar ou reverter;
14. documentar resultado.

---

## 21. Change Record

Toda alteração deve registrar:

- motivo;
- problema;
- hipótese;
- versão anterior;
- versão proposta;
- impacto esperado;
- riscos;
- dataset;
- resultados;
- aprovadores;
- rollout;
- rollback;
- resultado final.

---

## 22. Testes obrigatórios

Antes de produção:

- schema validation;
- factual consistency;
- safety;
- refusal behavior;
- edge cases;
- ambiguous inputs;
- incomplete inputs;
- multilingual behavior;
- prompt injection;
- privacy leakage;
- latency;
- cost;
- regression;
- tone;
- explainability.

---

## 23. Dataset de avaliação

Cada prompt relevante deve estar ligado a um dataset.

O dataset deve conter:

- case_id;
- input;
- context;
- expected_behavior;
- forbidden_behavior;
- severity;
- tags;
- reviewer;
- last_reviewed_at.

---

## 24. Casos mínimos

Os datasets devem incluir:

- caso comum;
- caso incompleto;
- caso contraditório;
- caso ambíguo;
- caso adversarial;
- caso fora de escopo;
- caso sensível;
- caso de crise;
- caso com dado insuficiente;
- caso com dado incorreto.

---

## 25. Avaliação de qualidade

Dimensões:

- correção;
- relevância;
- coerência;
- clareza;
- utilidade;
- tom;
- incerteza;
- explicabilidade;
- privacidade;
- segurança;
- consistência;
- custo;
- latência.

---

## 26. Avaliação automática e humana

Avaliação automática pode ajudar, mas não substitui revisão humana em fluxos críticos.

Fluxos de alto risco exigem:

- avaliação humana;
- casos adversariais;
- revisão de safety;
- aprovação registrada.

---

## 27. Classificação de risco

### AI-LOW

Texto operacional de baixo impacto.

### AI-MEDIUM

Personalização e explicação.

### AI-HIGH

Conteúdo de saúde, inferências e recomendações.

### AI-CRITICAL

Crise, segurança, autoagressão, transtornos alimentares, medicação, diagnóstico ou decisão de alto impacto.

---

## 28. Aprovação por risco

### AI-LOW

Revisão técnica.

### AI-MEDIUM

Revisão técnica e produto.

### AI-HIGH

Revisão técnica, produto, safety e domínio.

### AI-CRITICAL

Revisão ampliada, testes adversariais, governança e validação especializada.

---

## 29. Rollout

Estratégias permitidas:

- staging;
- internal;
- shadow;
- canary;
- percentage;
- feature flag;
- cohort;
- full release.

Prompts de alto risco não devem ir diretamente para 100% dos usuários.

---

## 30. Shadow Mode

Em shadow mode, a nova versão gera resultado sem influenciar o usuário.

Usos:

- comparar qualidade;
- medir custo;
- medir latência;
- detectar regressões;
- analisar divergências.

---

## 31. A/B Tests

Experimentos só devem ocorrer quando:

- risco for aceitável;
- hipótese estiver registrada;
- métrica estiver definida;
- privacidade estiver preservada;
- safety não for reduzida;
- rollback estiver disponível.

### Proibido

Usar A/B test para experimentar relaxamento de segurança em usuários vulneráveis.

---

## 32. Feature Flags

Toda versão nova de alto impacto deve ser controlável por flag.

A flag deve permitir:

- ativação;
- desativação;
- limitação por grupo;
- rollback imediato;
- rastreamento.

---

## 33. Observabilidade

Cada execução deve registrar, quando aplicável:

- execution_id;
- prompt_id;
- prompt_version;
- model;
- model_version;
- schema_version;
- HIE version;
- safety status;
- latency;
- token usage;
- estimated cost;
- retry count;
- validation result;
- feedback;
- correlation_id.

---

## 34. Privacidade

O registro de execução não deve armazenar conteúdo sensível bruto sem necessidade.

Preferir:

- IDs;
- hashes;
- categorias;
- métricas;
- flags;
- referências;
- conteúdo redigido.

---

## 35. Redaction

Antes de enviar dados ao modelo, aplicar minimização e redaction quando possível.

Categorias:

- nome;
- e-mail;
- telefone;
- documento;
- endereço;
- identificadores;
- dados de terceiros;
- arquivos completos.

---

## 36. Prompt Injection

Todo fluxo com conteúdo do usuário deve assumir que a entrada pode conter instruções maliciosas.

Controles:

- separar instrução e dado;
- validar contexto;
- limitar ferramentas;
- aplicar allowlist;
- ignorar comandos dentro de documentos;
- testar jailbreak;
- restringir acesso a memória;
- validar saída.

---

## 37. Tool Use

Prompts com ferramentas devem registrar:

- ferramentas permitidas;
- argumentos;
- limites;
- autorização;
- confirmação;
- timeout;
- idempotência;
- efeitos colaterais;
- auditoria.

### Regra

A IA não deve executar ação sensível apenas com base em texto não confiável.

---

## 38. Falhas

Tipos:

- invalid_output;
- hallucination;
- safety_failure;
- privacy_leak;
- timeout;
- provider_error;
- schema_mismatch;
- refusal_error;
- excessive_confidence;
- routing_error.

Cada falha deve possuir política de fallback.

---

## 39. Fallback

Fallback pode:

- tentar novamente;
- usar modelo alternativo;
- usar prompt anterior;
- usar resposta segura estática;
- solicitar esclarecimento;
- interromper fluxo;
- encaminhar para revisão.

---

## 40. Rollback

Toda versão publicada deve indicar uma versão segura anterior.

Rollback deve ser possível sem alterar código quando viável.

---

## 41. Depreciação

Ao depreciar um prompt:

- marcar status;
- bloquear novas dependências;
- manter histórico;
- migrar chamadas;
- validar substituto;
- definir data de retirada;
- preservar rollback por período determinado.

---

## 42. Incidente de IA

Exemplos:

- resposta insegura;
- vazamento;
- diagnóstico indevido;
- discriminação;
- falha sistemática;
- quebra de schema;
- regressão relevante;
- aumento anormal de custo;
- modelo indisponível.

Um incidente deve gerar:

- contenção;
- flag off;
- rollback;
- investigação;
- registro;
- teste de regressão;
- revisão do processo.

---

## 43. Mudança emergencial

Hotfix de IA pode ser aplicado quando houver risco imediato.

Requisitos mínimos:

- registrar incidente;
- desativar comportamento inseguro;
- usar fallback seguro;
- documentar mudança;
- executar avaliação mínima;
- revisar posteriormente.

---

## 44. Responsabilidades

### AI Owner

Mantém prompt, testes e documentação.

### Produto

Valida objetivo e experiência.

### Engenharia

Integra, versiona e monitora.

### Safety

Avalia riscos e comportamentos proibidos.

### Domínio

Revisa conteúdo especializado.

### Fundador

Aprova prioridades e mudanças de alto impacto.

---

## 45. Uso de prompts em código

O código deve referenciar:

- prompt_id;
- versão;
- schema;
- modelo;
- configuração.

Não deve conter grandes prompts inline.

---

## 46. Source of Truth

A fonte oficial será o repositório versionado.

Ferramentas externas podem espelhar, mas não substituir a fonte oficial sem decisão formal.

---

## 47. Checklist antes de staging

- [ ] Prompt registrado.
- [ ] Versão criada.
- [ ] Schema definido.
- [ ] Dataset vinculado.
- [ ] Testes executados.
- [ ] Safety revisada.
- [ ] Privacidade revisada.
- [ ] Modelo compatível.
- [ ] Custo medido.
- [ ] Latência medida.
- [ ] Fallback definido.
- [ ] Rollback definido.
- [ ] Feature flag disponível.

---

## 48. Checklist antes de produção

- [ ] Staging aprovado.
- [ ] Avaliação de regressão aprovada.
- [ ] Casos críticos aprovados.
- [ ] Aprovações registradas.
- [ ] Rollout definido.
- [ ] Monitoramento ativo.
- [ ] Alertas configurados.
- [ ] Versão anterior preservada.
- [ ] Change record concluído.

---

## 49. Questões abertas

1. Ferramenta final de registry.
2. Armazenamento dos prompts.
3. Processo de aprovação.
4. Métricas mínimas.
5. Thresholds de qualidade.
6. Dataset inicial.
7. Ferramenta de avaliação.
8. Estratégia multi-modelo.
9. Frequência de revisão.
10. Política de prompt cache.
11. Retenção de execuções.
12. Processo de revisão especializada.

---

## 50. Histórico

| Versão | Data | Alteração |
|---|---|---|
| 0.1 | 19/07/2026 | Criação da norma inicial de registro e mudança de prompts. |
