# Higeia — AI Model Lifecycle, Deployment and Rollback Governance

**Documento:** Higeia AI Model Lifecycle, Deployment and Rollback Governance  
**Versão:** 0.1  
**Status:** Estrutura inicial oficial  
**Data:** 19 de julho de 2026  
**Projeto interno:** Projeto Eros  
**Produto:** Higeia  
**Fundador:** Clovis Sadlowski  

---

## 1. Objetivo

Definir como modelos, prompts, schemas, guardrails, classificadores, parâmetros e configurações de inteligência artificial evoluem ao longo do ciclo de vida.

Este framework estabelece:

- proposta;
- avaliação;
- aprovação;
- testes;
- staging;
- canary;
- rollout;
- produção;
- monitoramento;
- rollback;
- restrição;
- depreciação;
- retirada;
- auditoria;
- responsabilidades.

---

## 2. Princípio central

Nenhuma mudança de IA deve chegar à produção apenas porque funcionou em alguns exemplos.

Toda mudança deve possuir:

- identificador;
- owner;
- versão;
- finalidade;
- classe de risco;
- evidências;
- avaliação;
- critérios de aprovação;
- plano de rollout;
- plano de rollback;
- monitoramento;
- validade;
- histórico.

---

## 3. Escopo

Aplica-se a:

- modelos fundacionais;
- modelos especializados;
- embeddings;
- classificadores;
- prompts;
- system prompts;
- schemas;
- guardrails;
- regras determinísticas;
- thresholds;
- roteamento;
- fallback;
- ferramentas;
- memória;
- RAG;
- parâmetros;
- feature flags;
- configurações de segurança.

---

## 4. Unidade de mudança

Cada release de IA deve identificar todos os componentes alterados.

Exemplo:

- model_id;
- model_version;
- prompt_id;
- prompt_version;
- schema_version;
- guardrail_version;
- dataset_version;
- application_version;
- feature_flag_version.

Uma mudança deve ser tratada como um pacote coerente.

---

## 5. Estados do ciclo de vida

- proposed;
- designed;
- implementing;
- testing;
- evaluation_pending;
- approved_for_staging;
- staging;
- approved_for_canary;
- canary;
- approved_for_production;
- production;
- restricted;
- rollback_pending;
- rolled_back;
- deprecated;
- retired;
- blocked.

---

## 6. Proposta

Toda nova mudança deve registrar:

- problema;
- hipótese;
- objetivo;
- usuários afetados;
- benefício esperado;
- componentes;
- dados;
- risco;
- custo;
- alternativas;
- critérios de sucesso;
- critérios de abandono.

---

## 7. Classificação de mudança

### CHANGE-LOW

Mudança editorial ou técnica sem impacto relevante.

### CHANGE-MEDIUM

Mudança de comportamento moderada.

### CHANGE-HIGH

Mudança em personalização, contexto, memória ou qualidade central.

### CHANGE-CRITICAL

Mudança em safety, crise, medicação, emergência, privacidade, ferramenta ou função regulada.

---

## 8. Mudanças que exigem novo ciclo

Exigem nova avaliação:

- troca de modelo;
- nova versão de modelo;
- alteração de prompt;
- mudança de schema;
- novo guardrail;
- alteração de threshold;
- mudança de temperatura;
- nova ferramenta;
- nova fonte de conhecimento;
- novo fallback;
- mudança de memória;
- mudança de fornecedor;
- nova região;
- novo público;
- nova finalidade.

---

## 9. Versionamento

Utilizar versionamento consistente.

Exemplo:

```text
MAJOR.MINOR.PATCH
```

### MAJOR

Mudança incompatível ou de comportamento relevante.

### MINOR

Nova capacidade compatível.

### PATCH

Correção controlada sem mudança estrutural.

---

## 10. Identificadores

Exemplos:

- MODEL-001;
- PRM-PROFILE-GENERATE-001;
- SCHEMA-PROFILE-001;
- GRD-SAFETY-001;
- ROUTER-001;
- RELEASE-AI-2026-001.

---

## 11. Change record

Cada mudança deve possuir registro contendo:

- change_id;
- título;
- owner;
- componentes;
- versões;
- risco;
- motivação;
- evidências;
- testes;
- aprovação;
- rollout;
- rollback;
- resultado.

---

## 12. Ambiente local

Permitido para:

- desenvolvimento inicial;
- testes isolados;
- mocks;
- dados sintéticos.

Não usar dados reais.

---

## 13. Ambiente de desenvolvimento

Permitido para:

- integração;
- testes automatizados;
- validação de schema;
- experimentação controlada;
- observabilidade inicial.

Sem dados reais, salvo processo formal específico.

---

## 14. Staging

Deve reproduzir, quando possível:

- arquitetura;
- configurações;
- schemas;
- feature flags;
- observabilidade;
- safety;
- fallback;
- limites;
- comportamento de produção.

---

## 15. Produção

Produção exige:

- avaliação;
- aprovação;
- feature flag;
- rollback;
- monitoramento;
- owner;
- suporte;
- incident response;
- versão rastreável.

---

## 16. Evaluation gates

Antes de staging:

- testes unitários;
- testes de integração;
- schema;
- safety;
- privacidade;
- dataset offline;
- regressão;
- custo;
- latência.

Antes de produção:

- staging validado;
- canary definido;
- alertas ativos;
- rollback testado;
- revisão humana quando exigida;
- aprovação formal.

---

## 17. Golden dataset

Cada fluxo crítico deve possuir conjunto de avaliação versionado.

O golden dataset deve incluir:

- casos comuns;
- casos difíceis;
- casos adversariais;
- regressões;
- safety;
- privacidade;
- bordas;
- falhas históricas.

---

## 18. Baseline

Toda mudança deve ser comparada a uma baseline.

Comparar:

- qualidade;
- safety;
- schema;
- custo;
- latência;
- fallback;
- feedback;
- taxa de erro.

---

## 19. Critérios de aprovação

Uma mudança só pode avançar quando:

- atende critérios mínimos;
- não piora safety;
- não piora privacidade;
- não cria regressão crítica;
- possui custo aceitável;
- possui latência aceitável;
- possui rollback;
- possui owner;
- possui monitoramento.

---

## 20. Critérios de bloqueio

Bloquear quando houver:

- falha crítica;
- regressão de safety;
- cross-user leakage;
- schema crítico instável;
- custo imprevisível;
- ausência de rollback;
- ausência de owner;
- avaliação insuficiente;
- contrato não aprovado;
- fonte clínica não aprovada.

---

## 21. Aprovação condicional

Pode haver aprovação com restrições:

- apenas staging;
- apenas dados sintéticos;
- apenas pequena coorte;
- apenas fluxo não clínico;
- limite de volume;
- revisão humana obrigatória;
- prazo curto;
- monitoramento reforçado.

---

## 22. Canary release

O canary deve começar com pequena exposição.

Dimensões possíveis:

- percentual de usuários;
- grupo interno;
- usuários beta;
- fluxo específico;
- região;
- tipo de conta;
- feature flag.

---

## 23. Critérios de expansão

Expandir somente quando:

- métricas estão estáveis;
- nenhum incidente grave ocorreu;
- safety permanece dentro do limite;
- custo está dentro do orçamento;
- latência está aceitável;
- feedback não piorou;
- schema permanece válido.

---

## 24. Progressive rollout

Exemplo:

```text
1% → 5% → 10% → 25% → 50% → 100%
```

Cada estágio deve ter:

- duração;
- métricas;
- threshold;
- owner;
- decisão;
- rollback automático ou manual.

---

## 25. Hold period

Entre estágios, manter período de observação suficiente para:

- coletar volume;
- detectar regressão;
- medir custo;
- observar feedback;
- avaliar safety;
- investigar anomalias.

---

## 26. Feature flags

Toda mudança relevante deve usar feature flag quando possível.

A flag deve permitir:

- ativar;
- desativar;
- limitar coorte;
- segmentar;
- reverter;
- registrar versão;
- auditar alteração.

---

## 27. Kill switch

Funções críticas devem possuir mecanismo rápido de desativação.

Exemplos:

- tool use;
- memória;
- RAG;
- fluxo de crise;
- modelo novo;
- automação externa.

---

## 28. Rollback

Rollback é o retorno para uma versão anterior conhecida e aprovada.

Deve incluir:

- versão alvo;
- condição de acionamento;
- responsável;
- passos;
- validação;
- comunicação;
- monitoramento pós-rollback.

---

## 29. Gatilhos de rollback

- incidente P0 ou P1;
- regressão crítica;
- safety fora do limite;
- vazamento;
- custo explosivo;
- latência severa;
- schema crítico;
- fornecedor instável;
- ferramenta indevida;
- monitoramento indisponível.

---

## 30. Rollback automático

Pode ser usado quando critérios forem objetivos.

Exemplos:

- schema pass rate abaixo do limite;
- custo acima de teto;
- erro acima de threshold;
- provider outage;
- safety critical event.

Requer cuidado para evitar loops.

---

## 31. Rollback manual

Necessário quando:

- impacto exige julgamento;
- métricas são ambíguas;
- existe dependência de dados;
- migração de schema está envolvida;
- há implicação clínica;
- há comunicação necessária.

---

## 32. Roll forward

Quando rollback não for possível, pode ser necessário corrigir avançando.

Exige:

- contenção;
- avaliação;
- plano;
- testes;
- aprovação;
- observação reforçada.

---

## 33. Compatibilidade

Mudanças devem avaliar:

- prompts antigos;
- schemas antigos;
- dados armazenados;
- memória;
- embeddings;
- ferramentas;
- API;
- frontend;
- relatórios;
- auditoria.

---

## 34. Migração

Migrações devem possuir:

- plano;
- backup;
- teste;
- rollback;
- validação;
- versionamento;
- impacto;
- owner;
- janela.

---

## 35. Mudança de modelo

Trocar modelo exige:

- nova avaliação;
- comparação com baseline;
- teste de schema;
- teste de safety;
- teste de custo;
- teste de latência;
- revisão de privacidade;
- revisão do fornecedor;
- canary;
- rollback.

---

## 36. Mudança silenciosa de fornecedor

Se o fornecedor alterar comportamento sem nova versão explícita:

- detectar por monitoramento;
- congelar rollout;
- reavaliar;
- comparar com baseline;
- acionar fallback;
- registrar incidente se necessário.

---

## 37. Mudança de prompt

Toda alteração deve registrar:

- motivação;
- diff;
- versão;
- dataset;
- resultado;
- regressões;
- aprovação;
- rollout;
- rollback.

---

## 38. Mudança de schema

Exige:

- compatibilidade;
- migração;
- validação;
- testes;
- adaptação de consumidores;
- versionamento;
- fallback.

---

## 39. Mudança de guardrail

Mudanças em safety exigem nível elevado de revisão.

Avaliar:

- false positives;
- false negatives;
- casos de crise;
- bloqueios;
- linguagem;
- escalonamento;
- impacto por grupo.

---

## 40. Mudança de parâmetros

Alterações de:

- temperatura;
- top_p;
- max tokens;
- retries;
- timeout;
- threshold;
- top_k;
- similarity threshold;

devem ser versionadas e avaliadas quando alterarem comportamento relevante.

---

## 41. Deployment record

Cada implantação deve registrar:

- deployment_id;
- release_id;
- ambiente;
- versões;
- data;
- owner;
- aprovadores;
- feature flags;
- coorte;
- métricas;
- status;
- rollback target.

---

## 42. Deployment window

Implantações críticas devem considerar:

- disponibilidade da equipe;
- capacidade de monitoramento;
- suporte;
- horário;
- dependências;
- risco;
- plano de comunicação.

---

## 43. Freeze

Pode haver freeze quando:

- incidentes graves;
- error budget esgotado;
- mudança regulatória;
- ausência de reviewer;
- indisponibilidade de monitoramento;
- período crítico de negócio.

---

## 44. Depreciação

Antes de deprecar:

- identificar dependências;
- comunicar;
- definir prazo;
- oferecer alternativa;
- migrar;
- monitorar;
- impedir novos usos;
- registrar decisão.

---

## 45. Retirada

Ao retirar:

- desativar;
- remover credenciais;
- remover rota;
- arquivar documentação;
- preservar histórico;
- atualizar inventário;
- atualizar fallback;
- excluir dados quando aplicável.

---

## 46. Model card

Cada modelo deve possuir documentação sobre:

- finalidade;
- escopo;
- limitações;
- dados;
- riscos;
- avaliações;
- métricas;
- usos proibidos;
- owner;
- histórico.

---

## 47. Release notes

Toda release deve registrar:

- mudanças;
- motivos;
- impacto;
- versões;
- riscos;
- restrições;
- métricas;
- rollback;
- follow-up.

---

## 48. Auditoria

Deve ser possível responder:

- quem propôs;
- quem aprovou;
- o que mudou;
- qual versão;
- quais testes;
- qual baseline;
- qual coorte;
- qual resultado;
- se houve rollback;
- por que foi retirado.

---

## 49. Métricas do ciclo de vida

Monitorar:

- lead time;
- approval time;
- deployment frequency;
- rollback rate;
- failed deployment rate;
- canary failure rate;
- regression rate;
- time to detect;
- time to rollback;
- version adoption;
- deprecated components.

---

## 50. Gates antes do Alpha

- [ ] estados definidos;
- [ ] versionamento padronizado;
- [ ] change record disponível;
- [ ] deployment record disponível;
- [ ] feature flags implementadas;
- [ ] kill switch testado;
- [ ] rollback documentado;
- [ ] rollback testado;
- [ ] canary definido;
- [ ] baseline criada;
- [ ] datasets versionados;
- [ ] model card disponível;
- [ ] release notes disponíveis;
- [ ] owners definidos;
- [ ] critérios de bloqueio aprovados.

---

## 51. Responsabilidades

### Founder

Aprova risco estratégico e recursos.

### Product

Define objetivo e impacto.

### AI Owner

Mantém modelos, prompts e avaliação.

### Engineering

Implementa deployment, flags e rollback.

### Safety

Bloqueia regressões de risco.

### Security/Privacy

Avalia controles e dados.

### Clinical Reviewer

Revisa mudanças clínicas.

### Operations

Monitora rollout e incidentes.

---

## 52. Questões abertas

1. Ferramenta de feature flags.
2. Percentuais de canary.
3. Duração dos estágios.
4. Thresholds de rollback.
5. Processo de freeze.
6. Convenção final de versão.
7. Ferramenta de deployment.
8. Aprovação automática.
9. Critérios de roll forward.
10. Processo de depreciação.
11. Retenção de versões.
12. Frequência de revisão.

---

## 53. Histórico

| Versão | Data | Alteração |
|---|---|---|
| 0.1 | 19/07/2026 | Criação da governança inicial de ciclo de vida, deployment e rollback. |
