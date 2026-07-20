# Higeia — AI Sustainability, Environmental Impact and Resource Efficiency Governance

**Documento:** Higeia AI Sustainability, Environmental Impact and Resource Efficiency Governance  
**Versão:** 0.1  
**Status:** Estrutura inicial oficial  
**Data:** 19 de julho de 2026  
**Projeto interno:** Projeto Eros  
**Produto:** Higeia  
**Fundador:** Clovis Sadlowski  

---

## 1. Objetivo

Definir como o Higeia medirá, avaliará, reduzirá e justificará o uso de recursos computacionais e operacionais relacionados à inteligência artificial.

Este framework estabelece requisitos para:

- eficiência de modelos;
- uso de tokens;
- consumo de computação;
- storage;
- embeddings;
- RAG;
- inferência;
- treinamento;
- fine-tuning;
- observabilidade;
- custo por fluxo;
- desperdício;
- escalabilidade;
- impacto ambiental;
- proporcionalidade;
- governança de recursos;
- melhoria contínua.

---

## 2. Princípio central

O Higeia deve utilizar recursos computacionais de forma proporcional ao valor produzido.

Mais processamento, mais tokens, modelos maiores ou maior redundância não significam automaticamente melhor resultado.

Cada decisão deve considerar:

- valor para o usuário;
- valor clínico;
- segurança;
- qualidade;
- custo;
- latência;
- energia;
- escalabilidade;
- complexidade;
- alternativas mais eficientes.

---

## 3. Escopo

Aplica-se a:

- chamadas a modelos;
- prompts;
- contexto;
- memória;
- RAG;
- embeddings;
- vector database;
- bancos;
- storage;
- logs;
- observabilidade;
- pipelines;
- backups;
- fine-tuning;
- avaliações;
- testes;
- ambientes;
- fornecedores;
- infraestrutura;
- features;
- batch processing;
- analytics;
- notificações.

---

## 4. Conceitos

### Resource Efficiency

Capacidade de produzir valor com menor uso de recursos.

### Computational Footprint

Uso de CPU, GPU, memória, tokens, storage, rede e tempo.

### Environmental Impact

Impacto associado ao consumo de energia, infraestrutura e ciclo de vida computacional.

### Cost Efficiency

Relação entre custo e valor entregue.

### Right-Sizing

Escolha de recurso proporcional à necessidade.

### Waste

Uso de recursos sem valor suficiente ou sem necessidade.

---

## 5. Unidades de análise

Avaliar por:

- feature;
- fluxo;
- usuário;
- sessão;
- resposta;
- modelo;
- provider;
- ambiente;
- release;
- cohort;
- produto;
- período.

---

## 6. Métricas mínimas

Podem incluir:

- tokens de entrada;
- tokens de saída;
- custo por chamada;
- custo por sessão;
- custo por usuário ativo;
- latência;
- taxa de cache;
- chamadas duplicadas;
- retries;
- uso de storage;
- crescimento de embeddings;
- custo de observabilidade;
- custo de backup;
- custo por ambiente;
- custo por feature.

---

## 7. Valor entregue

A eficiência deve ser comparada a indicadores como:

- resolução;
- adesão;
- segurança;
- qualidade;
- redução de retrabalho;
- redução de tempo profissional;
- satisfação;
- taxa de conclusão;
- uso real;
- retenção;
- impacto operacional.

---

## 8. Proporcionalidade

Uma feature com baixo uso e alto custo deve ser revisada.

Uma feature com alto valor clínico pode justificar maior custo, desde que:

- o benefício seja demonstrável;
- o risco seja controlado;
- alternativas sejam avaliadas;
- o custo seja monitorado;
- a decisão seja documentada.

---

## 9. Classes de eficiência

### EFFICIENCY-GREEN

Uso proporcional e controlado.

### EFFICIENCY-YELLOW

Custo ou consumo crescente, requer revisão.

### EFFICIENCY-ORANGE

Ineficiência material ou tendência preocupante.

### EFFICIENCY-RED

Uso insustentável, desperdício crítico ou risco financeiro.

---

## 10. Model selection

A escolha de modelo deve considerar:

- qualidade;
- safety;
- latência;
- custo;
- contexto;
- idioma;
- estabilidade;
- disponibilidade;
- impacto computacional;
- possibilidade de fallback;
- necessidade real.

---

## 11. Model routing

Quando apropriado, usar roteamento entre:

- modelo pequeno;
- modelo médio;
- modelo avançado;
- regra determinística;
- cache;
- busca;
- resposta estática;
- revisão humana.

---

## 12. Modelo maior não é padrão

O maior modelo disponível não deve ser usado por padrão quando um modelo menor atender ao requisito.

---

## 13. Prompt efficiency

Prompts devem ser:

- claros;
- compactos;
- versionados;
- sem instruções redundantes;
- com contexto necessário;
- sem anexos desnecessários;
- com saída estruturada quando apropriado.

---

## 14. Context management

Evitar enviar repetidamente:

- histórico completo;
- documentos irrelevantes;
- memória não utilizada;
- logs;
- metadados excessivos;
- fontes duplicadas.

---

## 15. Context compression

Pode incluir:

- resumo;
- seleção;
- chunking;
- deduplicação;
- hierarquia;
- cache;
- memória estruturada;
- filtragem.

---

## 16. RAG efficiency

Avaliar:

- quantidade de chunks;
- tamanho;
- top-k;
- reranking;
- duplicidade;
- cache;
- frequência de reindexação;
- embeddings;
- fontes;
- precisão;
- custo.

---

## 17. Embeddings

Controlar:

- modelo;
- dimensão;
- volume;
- duplicidade;
- frequência;
- reprocessamento;
- retenção;
- exclusão;
- reconstrução;
- custo.

---

## 18. Cache

O cache pode reduzir:

- custo;
- latência;
- chamadas;
- energia.

Mas deve respeitar:

- privacidade;
- validade;
- segregação;
- expiração;
- atualização;
- segurança;
- não reutilização indevida.

---

## 19. Retry waste

Retries mal configurados podem multiplicar custo.

Definir:

- limite;
- backoff;
- idempotência;
- timeout;
- circuit breaker;
- observabilidade.

---

## 20. Logging efficiency

Logs devem ser suficientes, mas não excessivos.

Evitar:

- duplicidade;
- conteúdo sensível sem necessidade;
- retenção infinita;
- alta cardinalidade sem valor;
- telemetria não utilizada.

---

## 21. Storage efficiency

Avaliar:

- dados duplicados;
- versões antigas;
- arquivos órfãos;
- logs expirados;
- embeddings obsoletos;
- ambientes abandonados;
- backups excessivos;
- dados sem owner.

---

## 22. Retention alignment

Retenção deve considerar:

- necessidade;
- segurança;
- custo;
- obrigação;
- valor;
- exclusão;
- backups;
- legal hold.

---

## 23. Environments

Ambientes de desenvolvimento e teste devem:

- desligar quando não usados;
- usar capacidade proporcional;
- limitar dados;
- evitar recursos permanentes sem necessidade;
- possuir owner;
- ser revisados.

---

## 24. Batch processing

Quando possível, agrupar trabalhos para reduzir:

- overhead;
- custo;
- latência acumulada;
- chamadas duplicadas;
- consumo de rede.

---

## 25. Scheduling

Tarefas não urgentes podem ser executadas em janelas mais eficientes, desde que não comprometam segurança ou experiência.

---

## 26. Fine-tuning

Antes de fine-tuning:

- definir problema;
- comparar com prompting;
- comparar com RAG;
- estimar custo;
- avaliar dados;
- avaliar manutenção;
- avaliar drift;
- avaliar retorno.

---

## 27. Training

Treinamento de modelos próprios exige análise específica de:

- necessidade;
- recursos;
- dados;
- energia;
- custo;
- equipe;
- manutenção;
- alternativa externa.

---

## 28. Evaluation efficiency

Avaliações devem ser robustas, mas evitar:

- conjuntos redundantes;
- execuções desnecessárias;
- repetição sem mudança;
- modelos maiores sem necessidade;
- ambientes ativos sem uso.

---

## 29. Observability cost

Observabilidade deve possuir orçamento e valor.

Monitorar:

- custo por log;
- custo por trace;
- retenção;
- cardinalidade;
- dashboards não usados;
- alertas irrelevantes;
- duplicidade de ferramentas.

---

## 30. Vendor transparency

Quando possível, solicitar:

- métricas de consumo;
- região;
- eficiência;
- políticas ambientais;
- compromissos;
- relatórios;
- infraestrutura;
- opções de modelo.

---

## 31. Carbon claims

Não declarar:

- carbon neutral;
- zero impact;
- green AI;
- sustainable by design;

sem metodologia, escopo e comprovação adequados.

---

## 32. Estimativas

Quando dados ambientais exatos não estiverem disponíveis, usar estimativas claramente identificadas.

---

## 33. Hierarquia de decisão

Priorizar:

1. segurança;
2. privacidade;
3. integridade clínica;
4. confiabilidade;
5. valor ao usuário;
6. eficiência;
7. custo;
8. conveniência.

Eficiência não deve reduzir controles críticos.

---

## 34. Guardrails financeiros

Definir:

- orçamento mensal;
- custo por usuário;
- custo por feature;
- limite por fluxo;
- alertas;
- bloqueios;
- aprovação de exceção;
- revisão.

---

## 35. Budget anomaly

Anomalias podem indicar:

- bug;
- loop;
- ataque;
- retry excessivo;
- abuso;
- mudança de modelo;
- alteração de preço;
- degradação de cache.

---

## 36. Efficiency review

Cada feature de IA deve responder:

- qual valor entrega;
- qual custo;
- qual modelo;
- qual volume;
- qual latência;
- qual alternativa;
- qual tendência;
- qual owner;
- qual decisão.

---

## 37. Release gate

Mudanças devem verificar:

- impacto de tokens;
- impacto de custo;
- impacto de storage;
- impacto de latência;
- impacto de logs;
- impacto de embeddings;
- impacto de fornecedor;
- impacto de escala.

---

## 38. Sunset

Features ineficientes podem ser:

- otimizadas;
- restringidas;
- agrupadas;
- substituídas;
- cobradas;
- desativadas;
- encerradas.

---

## 39. Experimentos

Experimentos devem possuir:

- hipótese;
- limite de custo;
- prazo;
- amostra;
- critério de sucesso;
- critério de interrupção;
- owner;
- resultado.

---

## 40. FinOps

Práticas de FinOps podem apoiar:

- alocação;
- forecasting;
- budget;
- anomaly detection;
- ownership;
- tagging;
- unit economics;
- otimização.

---

## 41. GreenOps

Práticas de GreenOps podem apoiar:

- redução de desperdício;
- right-sizing;
- scheduling;
- eficiência de software;
- uso de regiões;
- redução de storage;
- medição.

---

## 42. Ambiente e saúde

A sustentabilidade deve ser tratada como parte da responsabilidade ampla do produto, sem comprometer qualidade e safety.

---

## 43. Papéis

### Sustainability Owner

Mantém o programa.

### AI Owner

Otimiza modelos e prompts.

### Engineering

Otimiza arquitetura e infraestrutura.

### Data Owner

Controla storage, embeddings e pipelines.

### FinOps

Monitora custos e orçamento.

### Product

Avalia valor da feature.

### Founder

Aprova trade-offs estratégicos.

---

## 44. Métricas executivas

Monitorar:

- AI cost per active user;
- cost per successful outcome;
- token growth;
- cache hit rate;
- duplicate call rate;
- retry rate;
- storage growth;
- embedding growth;
- idle resource cost;
- observability cost;
- efficiency findings;
- optimization savings.

---

## 45. Auditoria

Deve ser possível responder:

- quanto custa;
- qual recurso usa;
- qual valor produz;
- quem é responsável;
- qual tendência;
- qual limite;
- qual otimização;
- qual evidência;
- qual decisão.

---

## 46. Gates antes do Alpha

- [ ] custos por provedor estimados;
- [ ] métricas de tokens definidas;
- [ ] orçamento inicial definido;
- [ ] limites de uso definidos;
- [ ] prompts revisados;
- [ ] contexto controlado;
- [ ] retries limitados;
- [ ] cache avaliado;
- [ ] embeddings dimensionados;
- [ ] storage planejado;
- [ ] observabilidade orçada;
- [ ] alertas de custo definidos;
- [ ] features críticas avaliadas;
- [ ] nenhuma alegação ambiental indevida.

---

## 47. Questões abertas

1. Qual custo máximo por usuário?
2. Qual modelo por fluxo?
3. Qual política de roteamento?
4. Qual orçamento mensal?
5. Qual limite por feature?
6. Qual estratégia de cache?
7. Qual retenção de logs?
8. Qual dimensão de embeddings?
9. Qual ferramenta de FinOps?
10. Como estimar impacto ambiental?
11. Quais regiões usar?
12. Quem será o owner?

---

## 48. Histórico

| Versão | Data | Alteração |
|---|---|---|
| 0.1 | 19/07/2026 | Criação da governança inicial de sustentabilidade, impacto ambiental e eficiência de recursos. |
