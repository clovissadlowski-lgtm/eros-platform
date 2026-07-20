# Higeia — AI Observability, Monitoring and Cost Governance

**Documento:** Higeia AI Observability, Monitoring and Cost Governance  
**Versão:** 0.1  
**Status:** Estrutura inicial oficial  
**Data:** 19 de julho de 2026  
**Projeto interno:** Projeto Eros  
**Produto:** Higeia  
**Fundador:** Clovis Sadlowski  

---

## 1. Objetivo

Definir como o Higeia observará, medirá, monitorará e controlará o comportamento operacional e econômico de seus sistemas de inteligência artificial.

Este documento estabelece:

- padrões de logs;
- métricas;
- traces;
- correlation IDs;
- dashboards;
- alertas;
- monitoramento de prompts;
- monitoramento de modelos;
- monitoramento de safety;
- monitoramento de privacidade;
- monitoramento de qualidade;
- custos;
- orçamentos;
- limites;
- anomalias;
- relatórios;
- responsabilidades.

---

## 2. Princípio central

Nenhuma funcionalidade de IA deve operar em produção sem rastreabilidade suficiente para responder:

1. qual prompt foi usado;
2. qual versão estava ativa;
3. qual modelo processou;
4. qual schema foi aplicado;
5. quanto custou;
6. quanto demorou;
7. se houve retry;
8. se houve fallback;
9. se safety foi acionada;
10. se a saída foi válida;
11. se o usuário forneceu feedback;
12. se ocorreu incidente.

---

## 3. Escopo

Aplica-se a:

- geração de perfis;
- classificadores;
- extração;
- resumo;
- memória;
- check-ins;
- conversa;
- retrieval;
- tool use;
- safety;
- fallback;
- guardrails;
- filas;
- jobs;
- APIs;
- provedores;
- modelos;
- datasets;
- avaliações;
- incidentes.

---

## 4. Camadas de observabilidade

### Logs

Registro de eventos discretos.

### Metrics

Valores agregados ao longo do tempo.

### Traces

Caminho completo de uma execução.

### Events

Eventos de produto, safety e custo.

### Dashboards

Visão operacional consolidada.

### Alerts

Sinais automáticos que exigem ação.

---

## 5. Identificadores obrigatórios

Quando aplicável, cada execução deve registrar:

- execution_id;
- correlation_id;
- request_id;
- user_reference pseudonimizada;
- session_id;
- conversation_id;
- prompt_id;
- prompt_version;
- model_id;
- model_version;
- provider;
- schema_version;
- feature_flag_version;
- application_version;
- environment;
- timestamp.

---

## 6. Correlation ID

O correlation ID liga:

- frontend;
- API;
- filas;
- banco;
- modelo;
- memória;
- safety;
- fallback;
- resposta final.

Ele deve acompanhar toda a jornada técnica.

---

## 7. Estrutura mínima de log de IA

Campos recomendados:

```json
{
  "event": "ai_execution_completed",
  "execution_id": "EXE-...",
  "correlation_id": "COR-...",
  "prompt_id": "PRM-...",
  "prompt_version": "0.1.0",
  "model_id": "MODEL-001",
  "model_version": "provider-version",
  "schema_version": "1.0",
  "environment": "staging",
  "latency_ms": 0,
  "input_tokens": 0,
  "output_tokens": 0,
  "estimated_cost": 0,
  "retry_count": 0,
  "fallback_used": false,
  "schema_valid": true,
  "safety_status": "SAFE",
  "result": "success"
}
```

---

## 8. Dados que não devem ir para logs

Não registrar sem necessidade:

- nome;
- e-mail;
- telefone;
- documento;
- endereço;
- conteúdo integral de saúde;
- prontuário;
- anexos completos;
- prompt contendo dado sensível bruto;
- resposta completa em produção;
- segredo;
- chave;
- token;
- credencial;
- dado de pagamento.

---

## 9. Redaction

Aplicar redaction antes do armazenamento.

Métodos:

- remoção;
- mascaramento;
- tokenização;
- pseudonimização;
- hashing quando adequado;
- categorização;
- truncamento;
- allowlist de campos.

---

## 10. Níveis de log

### DEBUG

Somente desenvolvimento controlado.

### INFO

Eventos normais de operação.

### WARN

Comportamento inesperado sem falha crítica.

### ERROR

Falha funcional ou operacional.

### CRITICAL

Safety, privacidade, segurança ou indisponibilidade grave.

---

## 11. Ambientes

### Local

Pode ter maior detalhe, sempre com dados fictícios.

### Development

Logs técnicos ampliados sem dados reais.

### Staging

Comportamento semelhante à produção.

### Production

Minimização rigorosa, controles de acesso e retenção definida.

---

## 12. Métricas de uso

Monitorar:

- execuções por fluxo;
- execuções por usuário;
- execuções por modelo;
- execuções por prompt;
- volume por hora;
- volume por dia;
- volume por coorte;
- uso de fallback;
- retries;
- timeouts;
- cancelamentos.

---

## 13. Métricas de qualidade

Monitorar:

- schema pass rate;
- groundedness;
- factuality;
- approval rate;
- user feedback;
- correction rate;
- re-generation rate;
- abandonment;
- complaint rate;
- escalation rate;
- regression failures.

---

## 14. Métricas de safety

Monitorar:

- safety flags;
- casos por nível;
- false negatives;
- false positives;
- emergency escalations;
- blocked requests;
- clinical boundary violations;
- unsafe output rate;
- crisis flow completion;
- incident conversion.

---

## 15. Métricas de privacidade

Monitorar:

- redaction failures;
- cross-user access attempts;
- memory isolation failures;
- unauthorized retrieval;
- excessive context;
- deletion failures;
- retention exceptions;
- privacy incidents.

---

## 16. Métricas de latência

Registrar:

- média;
- mediana;
- p75;
- p90;
- p95;
- p99;
- timeout rate;
- latência por etapa;
- latência por provedor;
- latência por modelo;
- latência por fluxo.

---

## 17. Métricas de custo

Registrar:

- custo por execução;
- custo por usuário;
- custo por fluxo;
- custo por prompt;
- custo por modelo;
- custo por sessão;
- custo por coorte;
- custo por dia;
- custo por mês;
- custo de retry;
- custo de fallback;
- custo de avaliação;
- custo de background jobs.

---

## 18. Custo unitário

Todo fluxo deve possuir uma estimativa de custo unitário.

Exemplos:

- custo por anamnese;
- custo por perfil;
- custo por check-in;
- custo por resposta;
- custo por resumo;
- custo por memória atualizada.

---

## 19. Orçamento de IA

Definir:

- orçamento mensal;
- orçamento por ambiente;
- orçamento por produto;
- orçamento por usuário;
- orçamento por funcionalidade;
- reserva para incidentes;
- margem de crescimento.

---

## 20. Limites de consumo

Controles possíveis:

- rate limit;
- token limit;
- max context;
- max retries;
- timeout;
- daily quota;
- monthly quota;
- per-user quota;
- per-feature quota;
- circuit breaker;
- cache;
- batching.

---

## 21. Budget alerts

Alertas propostos:

- 50% do orçamento;
- 75%;
- 90%;
- 100%;
- crescimento anormal;
- custo unitário acima do limite;
- retry excessivo;
- loop;
- aumento por provedor;
- variação por versão.

---

## 22. Dashboards

Dashboards mínimos:

1. visão executiva;
2. visão operacional;
3. qualidade;
4. safety;
5. privacidade;
6. custo;
7. latência;
8. incidentes;
9. modelos;
10. prompts.

---

## 23. Dashboard executivo

Deve mostrar:

- usuários ativos;
- execuções;
- custo total;
- custo por usuário;
- qualidade;
- safety;
- incidentes;
- disponibilidade;
- principais anomalias;
- tendência semanal.

---

## 24. Dashboard operacional

Deve mostrar:

- volume;
- erros;
- timeouts;
- retries;
- fallbacks;
- latência;
- filas;
- provedores;
- modelos;
- versões;
- alertas ativos.

---

## 25. Dashboard de qualidade

Deve mostrar:

- schema pass rate;
- avaliação;
- feedback;
- regressões;
- respostas reprovadas;
- principais falhas;
- comparação entre versões.

---

## 26. Dashboard de safety

Deve mostrar:

- eventos por nível;
- escalonamentos;
- bloqueios;
- incidentes;
- falsos positivos;
- falsos negativos;
- versões envolvidas;
- tendências.

---

## 27. Dashboard de custos

Deve mostrar:

- orçamento;
- realizado;
- previsão;
- custo unitário;
- custo por modelo;
- custo por fluxo;
- retry;
- cache savings;
- anomalias;
- tendência.

---

## 28. Alertas

Todo alerta deve registrar:

- alert_id;
- condição;
- severidade;
- owner;
- canal;
- janela;
- threshold;
- runbook;
- cooldown;
- status.

---

## 29. Severidade de alerta

### A0

Risco crítico imediato.

### A1

Alto impacto ou degradação grave.

### A2

Problema relevante.

### A3

Atenção operacional.

### A4

Informativo.

---

## 30. Alertas críticos

Exemplos:

- cross-user leakage;
- safety critical failure;
- unauthorized tool action;
- schema critical failure;
- cost explosion;
- provider outage;
- rollback failure;
- deletion failure;
- alert pipeline failure.

---

## 31. Alert fatigue

Evitar excesso de alertas.

Práticas:

- deduplicação;
- agrupamento;
- cooldown;
- threshold revisado;
- owner claro;
- runbook;
- post-alert review.

---

## 32. SLOs

Cada fluxo crítico deve possuir objetivos para:

- disponibilidade;
- latência;
- schema;
- safety;
- privacidade;
- custo;
- qualidade.

---

## 33. SLIs

Indicadores possíveis:

- success rate;
- schema pass rate;
- p95 latency;
- fallback rate;
- safety miss rate;
- privacy failure rate;
- cost per execution;
- response availability.

---

## 34. Error budget

Fluxos críticos devem possuir orçamento de erro.

O orçamento pode considerar:

- falhas;
- timeouts;
- regressões;
- incidentes;
- violações de SLO.

Quando esgotado:

- pausar releases;
- priorizar confiabilidade;
- corrigir causas;
- revisar arquitetura.

---

## 35. Health checks

Verificar:

- API;
- provedor;
- modelo;
- fila;
- banco;
- cache;
- storage;
- feature flags;
- safety service;
- logging pipeline;
- alert pipeline.

---

## 36. Synthetic monitoring

Executar periodicamente casos sintéticos para:

- resposta básica;
- schema;
- safety;
- fallback;
- provider availability;
- memory isolation;
- latency;
- cost.

Usar apenas dados fictícios.

---

## 37. Canary monitoring

Durante rollout gradual, comparar:

- erro;
- safety;
- qualidade;
- custo;
- latência;
- feedback;
- fallback;
- abandono.

---

## 38. Version-aware monitoring

Toda métrica deve poder ser segmentada por:

- prompt_version;
- model_version;
- schema_version;
- app_version;
- feature_flag;
- dataset_version;
- coorte.

---

## 39. Monitoramento de drift

Monitorar:

- qualidade;
- safety;
- custo;
- latência;
- resposta;
- recusas;
- feedback;
- distribuição de entradas;
- comportamento do modelo;
- mudança do provedor.

---

## 40. Retenção de telemetria

A retenção deve considerar:

- finalidade;
- sensibilidade;
- necessidade operacional;
- auditoria;
- investigação;
- custo;
- política de retenção;
- obrigação legal.

Não manter indefinidamente.

---

## 41. Acesso

Acesso aos dados de observabilidade deve ser:

- mínimo;
- baseado em função;
- auditado;
- revogável;
- revisado;
- segregado por ambiente.

---

## 42. Logs de auditoria

Registrar ações como:

- alteração de prompt;
- mudança de modelo;
- mudança de threshold;
- ativação de flag;
- rollback;
- acesso a log sensível;
- exportação;
- exclusão;
- alteração de orçamento.

---

## 43. Integridade

Proteger logs contra:

- alteração;
- exclusão indevida;
- truncamento;
- perda;
- acesso não autorizado;
- relógio incorreto;
- duplicação.

---

## 44. Monitoramento de fornecedor

Acompanhar:

- disponibilidade;
- latência;
- mudanças;
- versão;
- custo;
- limites;
- incidentes;
- retenção;
- região;
- status page;
- contrato.

---

## 45. Falha do provedor

Ações possíveis:

- retry limitado;
- fallback;
- modelo alternativo;
- resposta segura;
- fila;
- degradação controlada;
- indisponibilidade explícita;
- circuit breaker.

---

## 46. Governança de custo

Toda mudança com impacto econômico deve registrar:

- baseline;
- estimativa;
- teste;
- limite;
- owner;
- alerta;
- resultado real;
- decisão.

---

## 47. Otimização de custo

Estratégias:

- reduzir contexto;
- usar modelo menor;
- cache;
- batching;
- classificação prévia;
- evitar retries;
- limitar geração;
- reutilizar resultados;
- armazenamento estruturado;
- roteamento por complexidade.

Nunca reduzir safety apenas para economizar.

---

## 48. Chargeback interno

No futuro, custos poderão ser atribuídos a:

- produto;
- cliente;
- plano;
- funcionalidade;
- equipe;
- coorte;
- experimento.

---

## 49. Relatório semanal

Deve incluir:

- volume;
- custo;
- custo unitário;
- qualidade;
- safety;
- latência;
- incidentes;
- anomalias;
- alterações de versões;
- ações.

---

## 50. Relatório mensal

Deve incluir:

- orçamento versus realizado;
- tendência;
- principais riscos;
- eficiência;
- releases;
- incidentes;
- performance por modelo;
- decisões recomendadas.

---

## 51. Ownership

Cada dashboard, métrica e alerta deve possuir owner.

Sem owner, não existe responsabilidade operacional.

---

## 52. Gates antes do Alpha

- [ ] correlation IDs implementados;
- [ ] logs estruturados;
- [ ] redaction testada;
- [ ] métricas básicas;
- [ ] dashboard operacional;
- [ ] dashboard de custo;
- [ ] alertas críticos;
- [ ] thresholds iniciais;
- [ ] model/version tracking;
- [ ] prompt/version tracking;
- [ ] synthetic monitoring;
- [ ] retention definida;
- [ ] acesso configurado;
- [ ] runbooks vinculados;
- [ ] teste de alerta realizado.

---

## 53. Responsabilidades

### Founder

Aprovar orçamento e limites.

### Engineering

Implementar telemetria.

### AI Owner

Definir métricas de IA.

### Safety

Definir alertas de risco.

### Security/Privacy

Definir minimização e acesso.

### Product

Definir métricas de experiência.

### Finance/Operations

Acompanhar orçamento e custo unitário.

---

## 54. Questões abertas

1. Stack de observabilidade.
2. Ferramenta de dashboards.
3. Ferramenta de alertas.
4. Retenção final.
5. Thresholds.
6. SLOs.
7. Orçamento de IA.
8. Quotas por plano.
9. Estratégia multi-provider.
10. Política de cache.
11. Processo de chargeback.
12. Frequência de relatórios.

---

## 55. Histórico

| Versão | Data | Alteração |
|---|---|---|
| 0.1 | 19/07/2026 | Criação da estrutura inicial de observabilidade, monitoramento e custo. |
