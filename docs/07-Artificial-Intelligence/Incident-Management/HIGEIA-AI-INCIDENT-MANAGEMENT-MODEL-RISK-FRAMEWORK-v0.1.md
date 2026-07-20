# Higeia — AI Incident Management and Model Risk Framework

**Documento:** Higeia AI Incident Management and Model Risk Framework  
**Versão:** 0.1  
**Status:** Estrutura inicial oficial  
**Data:** 19 de julho de 2026  
**Projeto interno:** Projeto Eros  
**Produto:** Higeia  
**Fundador:** Clovis Sadlowski  

---

## 1. Objetivo

Definir como o Higeia identificará, classificará, conterá, investigará, corrigirá e documentará incidentes relacionados à inteligência artificial.

Este framework também estabelece como o risco de modelo será:

- identificado;
- registrado;
- avaliado;
- aceito;
- mitigado;
- monitorado;
- reavaliado;
- encerrado.

---

## 2. Princípio central

Falhas de IA devem ser tratadas como eventos operacionais reais, não como simples respostas ruins.

Uma falha pode afetar:

- segurança do usuário;
- privacidade;
- confiança;
- comportamento clínico;
- decisões;
- disponibilidade;
- custos;
- reputação;
- conformidade;
- integridade dos dados.

---

## 3. Escopo

Este framework se aplica a incidentes envolvendo:

- prompts;
- modelos;
- provedores;
- classificadores;
- memória;
- retrieval;
- dados derivados;
- roteamento;
- ferramentas;
- schemas;
- fallback;
- guardrails;
- filtros;
- avaliações;
- logs;
- custos;
- latência;
- drift;
- segurança;
- privacidade;
- comportamento clínico;
- disponibilidade.

---

## 4. Definição de incidente de IA

Incidente de IA é qualquer evento no qual o sistema:

- produza resposta insegura;
- viole limite clínico;
- exponha dado indevido;
- misture dados de usuários;
- gere diagnóstico ou prescrição;
- falhe em escalar risco;
- execute ação indevida;
- desrespeite schema crítico;
- apresente regressão relevante;
- opere com modelo não aprovado;
- perca rastreabilidade;
- apresente custo anormal;
- fique indisponível;
- produza comportamento discriminatório;
- esconda incerteza em situação sensível;
- sofra prompt injection com impacto.

---

## 5. Incidente versus defeito

### Defeito

Problema funcional sem impacto relevante imediato.

### Incidente

Problema com impacto em:

- segurança;
- privacidade;
- disponibilidade;
- confiança;
- conformidade;
- custo;
- integridade;
- operação crítica.

Um defeito pode se tornar incidente conforme impacto e recorrência.

---

## 6. Categorias de incidente

### SAFETY

Resposta perigosa, diagnóstico, prescrição, falha de crise.

### PRIVACY

Exposição, mistura, retenção ou uso indevido de dados.

### SECURITY

Prompt injection, abuso de ferramenta, credencial ou acesso indevido.

### QUALITY

Alucinação grave, incoerência ou regressão relevante.

### MODEL

Mudança inesperada de comportamento ou provedor.

### DATA

Contexto incorreto, memória errada, dado desatualizado ou corrompido.

### TOOLING

Ação externa incorreta ou não autorizada.

### AVAILABILITY

Indisponibilidade, timeout ou falha sistemática.

### COST

Consumo anormal, loops, retries ou explosão de custo.

### COMPLIANCE

Violação de política, requisito ou obrigação aplicável.

---

## 7. Severidade

### P0 — Crítico

Exemplos:

- risco imediato de dano;
- vazamento de dados sensíveis;
- mistura de dados entre usuários;
- diagnóstico ou prescrição com impacto;
- falha em crise;
- ferramenta executando ação perigosa;
- indisponibilidade total de função crítica.

Resposta imediata.

### P1 — Alto

Exemplos:

- falha grave em fluxo central;
- regressão de safety;
- alto volume de respostas inadequadas;
- custo fora de controle;
- perda parcial de rastreabilidade.

Resposta urgente.

### P2 — Moderado

Exemplos:

- qualidade significativamente degradada;
- fallback frequente;
- latência alta;
- falha restrita a parte dos usuários.

### P3 — Baixo

Problema menor, sem impacto relevante imediato.

### P4 — Observação

Melhoria, tendência ou risco potencial.

---

## 8. Critérios de severidade

A severidade deve considerar:

- impacto;
- probabilidade;
- alcance;
- reversibilidade;
- sensibilidade dos dados;
- vulnerabilidade do usuário;
- duração;
- detectabilidade;
- recorrência;
- obrigação regulatória;
- capacidade de contenção.

---

## 9. Estados do incidente

- detected;
- triaged;
- contained;
- investigating;
- mitigated;
- monitoring;
- resolved;
- closed;
- reopened.

---

## 10. Fontes de detecção

Incidentes podem ser detectados por:

- usuário;
- suporte;
- logs;
- alertas;
- avaliação automatizada;
- revisão humana;
- testes;
- monitoramento de custo;
- monitoramento de latência;
- safety flags;
- fornecedor;
- auditoria;
- reclamação;
- análise de drift.

---

## 11. Sinais automáticos

Alertas devem considerar:

- aumento de schema failure;
- aumento de safety flag;
- aumento de fallback;
- aumento de retry;
- latência anormal;
- custo anormal;
- volume inesperado;
- queda de aprovação;
- vazamento detectado;
- memória cruzada;
- erro de autorização;
- alteração de modelo;
- mudança de fornecedor;
- falha de redaction.

---

## 12. Resposta inicial

Ao detectar incidente:

1. registrar;
2. atribuir identificador;
3. classificar categoria;
4. definir severidade;
5. preservar evidência;
6. conter;
7. notificar responsáveis;
8. avaliar usuários afetados;
9. decidir rollback;
10. iniciar investigação.

---

## 13. Contenção

Ações possíveis:

- desativar feature flag;
- reverter prompt;
- reverter modelo;
- bloquear rota;
- usar fallback estático;
- interromper ferramenta;
- limitar coorte;
- suspender memória;
- desativar fornecedor;
- bloquear tipo de entrada;
- exigir revisão humana;
- interromper release.

---

## 14. Regra de rollback

Rollback deve ser preferido quando:

- risco for P0 ou P1;
- causa ainda não for conhecida;
- safety estiver degradada;
- privacidade estiver ameaçada;
- comportamento for imprevisível;
- versão anterior for comprovadamente mais segura.

---

## 15. Evidências

Preservar, com minimização:

- incident_id;
- execution_id;
- prompt_id;
- prompt_version;
- model;
- model_version;
- schema_version;
- timestamps;
- correlation_id;
- flags;
- métricas;
- decisão de roteamento;
- logs redigidos;
- contexto mínimo;
- resposta;
- ações executadas.

---

## 16. Privacidade na investigação

Não copiar dados sensíveis para:

- chats;
- tickets públicos;
- e-mails pessoais;
- documentos abertos;
- ferramentas não aprovadas.

Usar conteúdo redigido sempre que possível.

---

## 17. Comunicação interna

P0 e P1 devem notificar:

- fundador;
- engenharia;
- AI Owner;
- Safety Lead;
- segurança;
- privacidade;
- jurídico;
- clínico, quando aplicável.

---

## 18. Comunicação ao usuário

A necessidade de comunicação deve considerar:

- impacto;
- dano potencial;
- transparência;
- obrigação legal;
- utilidade;
- risco de confusão;
- capacidade de correção.

Não minimizar nem especular.

---

## 19. Comunicação externa

Somente responsáveis autorizados devem comunicar:

- imprensa;
- parceiros;
- reguladores;
- fornecedores;
- profissionais;
- público.

Toda comunicação deve ser factual e aprovada.

---

## 20. Investigação

A investigação deve responder:

1. O que aconteceu?
2. Quando começou?
3. Quem foi afetado?
4. Qual versão estava ativa?
5. Qual controle falhou?
6. Por que não foi detectado antes?
7. Qual impacto ocorreu?
8. A contenção funcionou?
9. Existe risco semelhante?
10. Qual correção é necessária?

---

## 21. Análise de causa raiz

Métodos possíveis:

- 5 Whys;
- fault tree;
- timeline;
- causal graph;
- contributing factors;
- barrier analysis.

Evitar culpar indivíduo sem avaliar sistema e processo.

---

## 22. Fatores contribuintes

Exemplos:

- dataset insuficiente;
- prompt ambíguo;
- modelo alterado;
- schema fraco;
- falta de guardrail;
- avaliação incompleta;
- rollout amplo;
- monitoramento ausente;
- pressão por prazo;
- revisão humana inadequada;
- dado incorreto;
- dependência de fornecedor;
- flag inexistente;
- fallback inseguro.

---

## 23. Correção

A correção pode envolver:

- prompt;
- modelo;
- parâmetros;
- schema;
- validação;
- dataset;
- guardrail;
- classificação;
- memória;
- ferramenta;
- UX;
- política;
- monitoramento;
- processo;
- treinamento.

---

## 24. Teste de regressão obrigatório

Todo incidente P0, P1 ou P2 deve gerar pelo menos um caso de regressão.

O teste deve:

- reproduzir a falha;
- falhar antes da correção;
- passar depois;
- entrar no dataset permanente;
- ser ligado ao incident_id;
- rodar em releases futuras.

---

## 25. Critérios de resolução

Um incidente só pode ser resolvido quando:

- contenção estiver confirmada;
- impacto estiver avaliado;
- causa estiver identificada ou limitada;
- correção estiver implementada;
- regressão estiver criada;
- avaliação estiver concluída;
- stakeholders estiverem informados;
- monitoramento estiver ativo;
- risco residual estiver aceito.

---

## 26. Critérios de encerramento

Encerrar quando:

- período de observação terminou;
- não houve recorrência;
- ações foram concluídas;
- documentação está completa;
- métricas voltaram ao normal;
- follow-ups possuem responsáveis;
- decisão de fechamento foi registrada.

---

## 27. Reabertura

Reabrir quando:

- houver recorrência;
- surgir novo impacto;
- correção falhar;
- nova evidência aparecer;
- risco residual aumentar;
- incidente relacionado for identificado.

---

## 28. Postmortem

Incidentes P0 e P1 exigem postmortem formal.

O postmortem deve ser:

- factual;
- sem culpabilização;
- orientado a causas;
- orientado a ações;
- revisado;
- compartilhado com quem precisa;
- protegido conforme sensibilidade.

---

## 29. Lessons Learned

Registrar:

- o que funcionou;
- o que falhou;
- onde houve atraso;
- quais controles faltavam;
- quais sinais foram ignorados;
- quais processos devem mudar;
- quais testes devem ser adicionados.

---

## 30. Model Risk Management

Risco de modelo é o risco de perda ou dano decorrente de:

- modelo inadequado;
- uso fora do escopo;
- dados inadequados;
- comportamento instável;
- falta de explicabilidade;
- dependência de fornecedor;
- mudança não detectada;
- avaliação insuficiente;
- monitoramento inadequado.

---

## 31. Categorias de risco de modelo

### MR-01 — Accuracy Risk

Resposta incorreta ou inconsistente.

### MR-02 — Safety Risk

Comportamento inseguro.

### MR-03 — Privacy Risk

Exposição ou uso indevido de dados.

### MR-04 — Bias Risk

Tratamento desigual ou discriminatório.

### MR-05 — Drift Risk

Mudança de comportamento ao longo do tempo.

### MR-06 — Vendor Risk

Dependência, indisponibilidade ou mudança externa.

### MR-07 — Explainability Risk

Decisão não compreensível.

### MR-08 — Operational Risk

Falha de integração, latência, custo ou disponibilidade.

### MR-09 — Misuse Risk

Uso fora do escopo ou abuso.

### MR-10 — Compliance Risk

Incompatibilidade com política ou regulação.

---

## 32. Inventário de modelos

Cada modelo deve registrar:

- model_id;
- provedor;
- nome;
- versão;
- finalidade;
- owner;
- status;
- risco;
- dados enviados;
- região;
- custo;
- limitações;
- datasets;
- prompts;
- fallback;
- última avaliação;
- próxima revisão.

---

## 33. Estados do modelo

- proposed;
- testing;
- approved;
- staging;
- production;
- restricted;
- deprecated;
- retired;
- blocked.

---

## 34. Aprovação do modelo

Nenhum modelo deve ir para produção sem:

- finalidade definida;
- classificação de risco;
- avaliação;
- revisão de privacidade;
- revisão de segurança;
- compatibilidade com prompts;
- limites documentados;
- fallback;
- rollback;
- owner;
- monitoramento.

---

## 35. Mudança de provedor

Mudança de provedor exige:

- nova avaliação;
- comparação;
- revisão contratual;
- revisão de dados;
- revisão de região;
- revisão de retenção;
- teste de schema;
- teste de safety;
- teste de custo;
- teste de latência.

---

## 36. Dependência de fornecedor

Mitigações:

- abstração;
- fallback;
- exportação;
- múltiplos modelos;
- limites de uso;
- alertas;
- contrato;
- monitoramento;
- plano de saída.

---

## 37. Drift

Monitorar:

- qualidade;
- safety;
- schema;
- custo;
- latência;
- recusas;
- memória;
- feedback;
- diferença por coorte;
- comportamento após atualização silenciosa.

---

## 38. Aceitação de risco

Risco pode ser aceito somente quando:

- estiver documentado;
- não for P0;
- mitigação existir;
- prazo existir;
- owner existir;
- impacto for compreendido;
- aprovação adequada existir;
- safety e privacidade não forem comprometidas.

---

## 39. Registro de risco

Cada risco deve registrar:

- risk_id;
- categoria;
- descrição;
- causa;
- impacto;
- probabilidade;
- severidade;
- controles;
- risco residual;
- owner;
- status;
- data de revisão;
- ação;
- prazo.

---

## 40. Métricas

Monitorar:

- incidentes por severidade;
- tempo até detecção;
- tempo até contenção;
- tempo até resolução;
- recorrência;
- rollback rate;
- schema failure rate;
- safety failure rate;
- privacy events;
- custo anormal;
- latência;
- fallback rate;
- testes de regressão criados.

---

## 41. SLAs iniciais

Proposta:

- P0: resposta imediata;
- P1: início urgente;
- P2: análise no mesmo ciclo operacional;
- P3: planejamento normal;
- P4: backlog.

Os tempos exatos deverão ser definidos antes do Alpha.

---

## 42. Simulações

Antes do Alpha, executar tabletop exercises para:

- vazamento entre usuários;
- falha de crise;
- modelo indisponível;
- prompt inseguro;
- explosão de custo;
- fornecedor alterando modelo;
- memória incorreta;
- ferramenta executando ação indevida.

---

## 43. Integração com outros documentos

Este framework deve operar com:

- AI Safety and Clinical Boundaries;
- AI Evaluation Framework;
- Prompt Registry;
- Testing Strategy;
- Security Incident Checklist;
- Data Retention and Deletion Policy;
- Clinical Governance Framework;
- ADRs;
- Release Checklist.

---

## 44. Gates antes do Alpha

- [ ] taxonomia de incidentes aprovada;
- [ ] severidade aprovada;
- [ ] owners definidos;
- [ ] feature flags implementadas;
- [ ] rollback testado;
- [ ] logs e correlation IDs ativos;
- [ ] alertas configurados;
- [ ] model inventory criado;
- [ ] risk register criado;
- [ ] playbooks testados;
- [ ] postmortem template disponível;
- [ ] tabletop exercise realizado;
- [ ] regressão obrigatória integrada.

---

## 45. Responsabilidades

### Founder

Garantir recursos e respeitar bloqueios.

### AI Owner

Manter modelo, prompts, avaliações e rollback.

### Engineering

Conter, corrigir e monitorar.

### Safety

Classificar risco e bloquear quando necessário.

### Security/Privacy

Avaliar exposição e obrigações.

### Clinical Reviewer

Avaliar impacto clínico.

### Legal/Regulatory

Orientar comunicação e requisitos.

### Product

Avaliar impacto na experiência e no escopo.

---

## 46. Limitações

Este documento:

- não substitui plano jurídico;
- não substitui resposta de segurança;
- não elimina risco;
- deve ser testado;
- deve ser revisado;
- depende de implementação real;
- deve evoluir com incidentes.

---

## 47. Questões abertas

1. SLAs finais.
2. Ferramenta de incidentes.
3. Canal de alerta.
4. On-call.
5. Processo regulatório.
6. Política de comunicação.
7. Retenção de evidências.
8. Owners finais.
9. Thresholds de alerta.
10. Processo com fornecedores.
11. Revisão externa.
12. Frequência de tabletop.

---

## 48. Histórico

| Versão | Data | Alteração |
|---|---|---|
| 0.1 | 19/07/2026 | Criação do framework inicial de incidentes e risco de modelo. |
