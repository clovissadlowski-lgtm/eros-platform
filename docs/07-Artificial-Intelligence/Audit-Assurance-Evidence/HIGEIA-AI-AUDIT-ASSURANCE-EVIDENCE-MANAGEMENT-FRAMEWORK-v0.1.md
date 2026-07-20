# Higeia — AI Audit, Assurance and Evidence Management Framework

**Documento:** Higeia AI Audit, Assurance and Evidence Management Framework  
**Versão:** 0.1  
**Status:** Estrutura inicial oficial  
**Data:** 19 de julho de 2026  
**Projeto interno:** Projeto Eros  
**Produto:** Higeia  
**Fundador:** Clovis Sadlowski  

---

## 1. Objetivo

Definir como o Higeia organizará, preservará, verificará e apresentará evidências relacionadas à governança, desenvolvimento, operação e controle de sistemas de inteligência artificial.

Este framework estabelece requisitos para:

- evidências;
- trilhas de auditoria;
- auditorias internas;
- avaliações independentes;
- testes de controle;
- não conformidades;
- planos de ação;
- assurance;
- due diligence;
- preparação regulatória;
- evidências para parceiros;
- evidências para investidores;
- revisões periódicas.

---

## 2. Princípio central

Uma política ou controle não deve ser considerado efetivo apenas porque foi documentado.

É necessário demonstrar:

- que o controle existe;
- que foi implementado;
- que está ativo;
- que foi testado;
- que funciona;
- que possui owner;
- que produz evidência;
- que falhas são corrigidas;
- que a evidência é confiável.

---

## 3. Escopo

Aplica-se a:

- políticas;
- procedimentos;
- controles;
- modelos;
- prompts;
- datasets;
- releases;
- avaliações;
- incidentes;
- fornecedores;
- segurança;
- privacidade;
- LGPD;
- safety;
- clínica;
- fairness;
- observabilidade;
- custos;
- memória;
- RAG;
- acessibilidade;
- decisões;
- exceções;
- treinamentos.

---

## 4. Conceitos

### Audit

Avaliação estruturada contra critérios definidos.

### Assurance

Nível de confiança obtido por evidências, testes e revisão.

### Evidence

Registro verificável que demonstra a existência ou execução de uma atividade.

### Control

Medida destinada a reduzir risco ou garantir requisito.

### Finding

Achado identificado durante revisão ou auditoria.

### Nonconformity

Falha em atender requisito definido.

### Remediation

Ação para corrigir causa, impacto ou controle.

---

## 5. Tipos de evidência

### DESIGN-EVIDENCE

Demonstra que o controle foi projetado.

### IMPLEMENTATION-EVIDENCE

Demonstra que foi implementado.

### OPERATING-EVIDENCE

Demonstra que está operando.

### TEST-EVIDENCE

Demonstra que foi testado.

### MONITORING-EVIDENCE

Demonstra acompanhamento contínuo.

### DECISION-EVIDENCE

Demonstra aprovação ou decisão.

### INCIDENT-EVIDENCE

Demonstra tratamento de incidente.

### CORRECTION-EVIDENCE

Demonstra correção ou remediação.

---

## 6. Qualidade da evidência

A evidência deve ser:

- autêntica;
- íntegra;
- relevante;
- suficiente;
- datada;
- versionada;
- rastreável;
- acessível;
- protegida;
- proporcional ao risco.

---

## 7. Exemplos de evidência

- commit;
- pull request;
- aprovação;
- log;
- screenshot;
- relatório;
- resultado de teste;
- ticket;
- ata;
- checklist;
- dashboard;
- alerta;
- configuração;
- contrato;
- DPA;
- evidência de exclusão;
- evidência de rollback;
- model card;
- dataset card;
- release notes.

---

## 8. Hierarquia de evidência

Preferência:

1. evidência automática;
2. evidência gerada pelo sistema;
3. evidência técnica reproduzível;
4. evidência documental aprovada;
5. declaração manual;
6. memória verbal.

Declaração verbal não deve ser usada como evidência única para controle crítico.

---

## 9. Identificação

Cada evidência relevante deve possuir:

- evidence_id;
- control_id;
- owner;
- source;
- date;
- environment;
- version;
- classification;
- retention;
- status;
- location;
- integrity reference.

---

## 10. Evidence register

O inventário deve permitir:

- localizar evidência;
- identificar controle;
- verificar atualização;
- identificar ausência;
- revisar validade;
- preparar auditoria;
- rastrear owner.

---

## 11. Control register

Cada controle deve registrar:

- control_id;
- objetivo;
- risco;
- owner;
- frequência;
- natureza;
- evidência esperada;
- teste;
- status;
- exceções;
- último teste;
- próximo teste.

---

## 12. Natureza do controle

### PREVENTIVE

Evita o problema.

### DETECTIVE

Detecta o problema.

### CORRECTIVE

Corrige o problema.

### DIRECTIVE

Orienta comportamento.

### COMPENSATING

Compensa ausência de controle principal.

---

## 13. Tipo de execução

### MANUAL

Executado por pessoa.

### AUTOMATED

Executado pelo sistema.

### HYBRID

Combina automação e revisão humana.

---

## 14. Frequência

- continuous;
- per_event;
- daily;
- weekly;
- monthly;
- quarterly;
- semiannual;
- annual;
- on_change;
- on_incident.

---

## 15. Mapeamento de controle

Um controle pode atender múltiplos requisitos.

Exemplos:

- segurança;
- privacidade;
- safety;
- clínica;
- fairness;
- operação;
- contrato;
- auditoria;
- due diligence.

---

## 16. Teste de design

Verifica se o controle foi desenhado adequadamente.

Perguntas:

- reduz o risco?
- possui owner?
- possui frequência?
- possui evidência?
- cobre o escopo?
- é proporcional?
- possui exceção?
- possui fallback?

---

## 17. Teste de implementação

Verifica se o controle foi implementado conforme o design.

---

## 18. Teste de efetividade operacional

Verifica se o controle funcionou durante determinado período.

---

## 19. Amostragem

Quando testar por amostra, registrar:

- população;
- período;
- método;
- tamanho;
- seleção;
- limitações;
- exceções;
- conclusão.

---

## 20. Auditoria interna

A auditoria interna deve:

- possuir escopo;
- possuir critérios;
- evitar conflito de interesse;
- revisar evidências;
- registrar achados;
- classificar risco;
- definir ações;
- acompanhar fechamento.

---

## 21. Avaliação independente

Pode ser realizada por:

- consultor externo;
- auditor;
- especialista clínico;
- especialista de segurança;
- especialista de privacidade;
- avaliador de IA;
- parceiro qualificado.

---

## 22. Independência

O avaliador não deve depender exclusivamente da pessoa que implementou o controle.

Para controles críticos, buscar revisão independente proporcional.

---

## 23. Plano de auditoria

O plano deve definir:

- objetivo;
- escopo;
- período;
- critérios;
- controles;
- amostra;
- equipe;
- conflitos;
- cronograma;
- entregáveis.

---

## 24. Critérios de auditoria

Podem incluir:

- políticas internas;
- requisitos legais;
- contratos;
- standards;
- ADRs;
- arquitetura;
- release gates;
- SLAs;
- SLOs;
- controles aprovados.

---

## 25. Achados

Classificação proposta:

### AUDIT-CRITICAL

Falha com risco crítico.

### AUDIT-HIGH

Falha relevante com risco elevado.

### AUDIT-MEDIUM

Falha material moderada.

### AUDIT-LOW

Falha de baixo impacto.

### OBSERVATION

Oportunidade de melhoria.

---

## 26. Não conformidade

Cada não conformidade deve registrar:

- requirement;
- evidence;
- gap;
- impact;
- severity;
- owner;
- due date;
- root cause;
- remediation;
- validation;
- closure.

---

## 27. Causa raiz

Métodos possíveis:

- 5 Whys;
- fishbone;
- fault tree;
- event timeline;
- control failure analysis.

Não encerrar finding apenas corrigindo sintoma quando houver causa sistêmica.

---

## 28. Plano de ação

Cada ação deve conter:

- action_id;
- finding_id;
- descrição;
- owner;
- prioridade;
- prazo;
- dependências;
- evidência esperada;
- status;
- validação.

---

## 29. Estados de ação

- open;
- planned;
- in_progress;
- blocked;
- ready_for_validation;
- validated;
- closed;
- accepted_risk;
- overdue.

---

## 30. Fechamento

Um finding só pode ser fechado quando:

- ação concluída;
- evidência disponível;
- teste realizado;
- risco reavaliado;
- owner concorda;
- auditor valida;
- exceção encerrada ou formalizada.

---

## 31. Aceitação de risco

Quando não houver correção imediata:

- justificar;
- definir risco residual;
- aprovar por alçada;
- definir prazo;
- monitorar;
- revisar;
- preparar saída.

---

## 32. Evidence pack

Para cada auditoria ou due diligence, preparar pacote contendo:

- escopo;
- índice;
- controles;
- evidências;
- políticas;
- resultados;
- exceções;
- findings;
- planos de ação;
- owners;
- validade.

---

## 33. Data room

A data room deve:

- ter controle de acesso;
- separar conteúdo;
- registrar compartilhamento;
- evitar excesso de dados;
- aplicar redaction;
- possuir owner;
- expirar acessos;
- registrar download quando possível.

---

## 34. Due diligence

Possíveis públicos:

- investidores;
- parceiros;
- clínicas;
- hospitais;
- seguradoras;
- clientes;
- fornecedores;
- reguladores;
- compradores;
- conselheiros.

---

## 35. Evidências para investidores

Podem incluir:

- arquitetura;
- segurança;
- privacidade;
- roadmap;
- riscos;
- governança;
- vendor strategy;
- incident readiness;
- model lifecycle;
- custos;
- indicadores.

Evitar compartilhar segredos ou dados pessoais sem necessidade.

---

## 36. Evidências para parceiros clínicos

Podem incluir:

- limites clínicos;
- revisão humana;
- fontes;
- safety;
- incident response;
- qualidade;
- auditoria;
- explicabilidade;
- responsabilidades.

---

## 37. Evidências para reguladores

Devem ser:

- consistentes;
- rastreáveis;
- completas;
- verdadeiras;
- aprovadas;
- preservadas;
- proporcionais à solicitação.

---

## 38. Retenção de evidências

Definir por categoria:

- período;
- obrigação;
- valor probatório;
- sensibilidade;
- expiração;
- exclusão;
- legal hold.

---

## 39. Integridade

Possíveis controles:

- checksum;
- assinatura;
- versionamento;
- immutable logs;
- controle de alteração;
- read-only storage;
- approvals;
- timestamps.

---

## 40. Cadeia de custódia

Para evidência sensível, registrar:

- quem coletou;
- quando;
- onde;
- quem acessou;
- quem alterou;
- quem exportou;
- quem recebeu;
- onde foi armazenada.

---

## 41. Evidência automática

Priorizar automação para:

- deploy;
- testes;
- logs;
- alertas;
- backups;
- revisão de acesso;
- exclusão;
- feature flags;
- versão;
- custo;
- uptime;
- incidentes.

---

## 42. Evidência manual

Quando manual:

- usar template;
- definir owner;
- exigir data;
- exigir aprovação;
- evitar edição silenciosa;
- registrar versão.

---

## 43. Assurance level

Escala proposta:

### ASSURANCE-LOW

Evidência limitada.

### ASSURANCE-MODERATE

Evidência suficiente para confiança razoável.

### ASSURANCE-HIGH

Evidência robusta, testes independentes e controles maduros.

---

## 44. Maturidade

### LEVEL-0

Ausente.

### LEVEL-1

Documentado.

### LEVEL-2

Implementado.

### LEVEL-3

Operando.

### LEVEL-4

Medido.

### LEVEL-5

Otimizado.

---

## 45. Self-assessment

Cada owner deve revisar periodicamente:

- controles;
- evidências;
- gaps;
- exceções;
- ações;
- maturidade;
- riscos.

---

## 46. Revisão independente

A revisão independente deve testar uma amostra de controles e validar a autoavaliação.

---

## 47. Auditoria de fornecedores

Para fornecedores críticos, avaliar:

- certificados;
- relatórios;
- incidentes;
- contrato;
- DPA;
- controles;
- SLA;
- subcontratados;
- retenção;
- exclusão;
- continuidade.

---

## 48. Auditoria de IA

Pode incluir:

- comportamento;
- safety;
- fairness;
- privacidade;
- explicabilidade;
- custo;
- versão;
- dados;
- fontes;
- rollback;
- monitoramento.

---

## 49. Auditoria de releases

Verificar:

- change record;
- evaluation;
- approvals;
- release gate;
- deployment record;
- canary;
- alerts;
- rollback;
- release notes;
- incidentes.

---

## 50. Auditoria de incidentes

Verificar:

- detecção;
- classificação;
- contenção;
- comunicação;
- evidência;
- causa raiz;
- remediação;
- aprendizado;
- encerramento.

---

## 51. Evidência negativa

Ausência de incidente não prova efetividade.

Evidência deve demonstrar que:

- monitoramento estava ativo;
- alertas funcionavam;
- testes ocorreram;
- cobertura era adequada.

---

## 52. Métricas

Monitorar:

- controls without evidence;
- overdue evidence;
- failed controls;
- open findings;
- overdue findings;
- remediation lead time;
- repeat findings;
- expired evidence;
- audit completion;
- assurance level;
- vendor assurance gaps.

---

## 53. Relatório executivo

O relatório deve mostrar:

- riscos principais;
- controles críticos;
- findings;
- atrasos;
- tendência;
- exceções;
- assurance;
- decisões necessárias.

---

## 54. Gates antes do Alpha

- [ ] control register criado;
- [ ] evidence register criado;
- [ ] controles críticos mapeados;
- [ ] evidências mínimas definidas;
- [ ] owners definidos;
- [ ] testes de controle planejados;
- [ ] findings process definido;
- [ ] plano de ação definido;
- [ ] data room estruturada;
- [ ] evidências de release disponíveis;
- [ ] evidências de rollback disponíveis;
- [ ] evidências de exclusão disponíveis;
- [ ] auditoria interna piloto executada;
- [ ] gaps críticos tratados.

---

## 55. Responsabilidades

### Control Owner

Mantém desenho e operação.

### Evidence Owner

Mantém evidência atualizada.

### Auditor

Avalia de forma independente.

### Domain Owner

Responde por remediação.

### Founder

Aprova risco estratégico e recursos.

### Security/Privacy

Protegem evidências sensíveis.

### Operations

Automatiza coleta e monitoramento.

---

## 56. Questões abertas

1. Onde armazenar evidências?
2. Qual convenção de IDs?
3. Qual retenção?
4. Quais controles são críticos?
5. Qual frequência de teste?
6. Quem realizará auditoria?
7. Qual data room?
8. Qual assurance esperado?
9. Como preservar integridade?
10. Como compartilhar com terceiros?
11. Qual processo de redaction?
12. Qual auditoria antes do Alpha?

---

## 57. Histórico

| Versão | Data | Alteração |
|---|---|---|
| 0.1 | 19/07/2026 | Criação do framework inicial de auditoria, assurance e evidências. |
