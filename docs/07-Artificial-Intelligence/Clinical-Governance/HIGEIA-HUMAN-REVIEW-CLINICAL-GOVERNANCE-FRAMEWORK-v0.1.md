# Higeia — Human Review and Clinical Governance Framework

**Documento:** Higeia Human Review and Clinical Governance Framework  
**Versão:** 0.1  
**Status:** Estrutura preliminar de governança  
**Data:** 19 de julho de 2026  
**Projeto interno:** Projeto Eros  
**Produto:** Higeia  
**Fundador:** Clovis Sadlowski  

---

## 1. Objetivo

Definir como profissionais humanos participarão da revisão, aprovação, supervisão e escalonamento de conteúdos, fluxos e comportamentos de inteligência artificial do Higeia.

Este framework estabelece:

- quais profissionais podem revisar cada domínio;
- quais decisões exigem revisão humana;
- níveis de aprovação;
- critérios de independência;
- conflitos de interesse;
- registros obrigatórios;
- segunda opinião;
- revalidação periódica;
- tratamento de incidentes;
- escalonamento de casos;
- responsabilidades;
- limites da revisão humana.

---

## 2. Princípio central

A presença de um profissional humano somente tem valor quando a revisão é:

- real;
- documentada;
- compatível com sua competência;
- vinculada à versão analisada;
- independente o suficiente;
- realizada com critérios definidos;
- capaz de bloquear uma entrega.

Não é permitido usar expressões como “revisado por especialistas” sem evidência formal.

---

## 3. Escopo

Este framework se aplica a:

- políticas clínicas;
- prompts;
- respostas-modelo;
- classificadores de risco;
- fluxos de crise;
- fluxos de medicamentos;
- interpretação educativa de exames;
- orientação nutricional;
- exercício físico;
- saúde mental;
- memória clínica;
- perfis de inteligência;
- datasets de avaliação;
- protocolos de escalonamento;
- conteúdos educativos;
- mudanças de modelo;
- incidentes;
- releases de alto risco.

---

## 4. Estrutura de governança

A governança será composta por:

1. Founder/Executive Owner;
2. Product Owner;
3. AI Owner;
4. Engineering Owner;
5. Safety Lead;
6. Privacy/Legal Reviewer;
7. Clinical Domain Reviewer;
8. Independent Reviewer, quando necessário;
9. Incident Review Group;
10. Advisory Board futuro.

---

## 5. Papéis

### Founder/Executive Owner

Responsável por:

- priorização;
- recursos;
- contratação de especialistas;
- aceitação de risco residual;
- garantia de independência;
- impedimento de pressão comercial sobre safety.

Não pode substituir parecer clínico.

### Product Owner

Responsável por:

- objetivo do fluxo;
- experiência;
- critérios de aceite;
- linguagem;
- aderência ao posicionamento.

### AI Owner

Responsável por:

- prompt;
- modelo;
- dataset;
- avaliação;
- observabilidade;
- rollback.

### Engineering Owner

Responsável por:

- implementação;
- controles;
- rastreabilidade;
- segurança técnica;
- feature flags;
- logs.

### Safety Lead

Responsável por:

- classificação de risco;
- políticas de safety;
- casos críticos;
- revisão de incidentes;
- decisão de bloqueio.

### Privacy/Legal Reviewer

Responsável por:

- proteção de dados;
- transparência;
- consentimento;
- retenção;
- comunicação;
- enquadramento jurídico.

### Clinical Domain Reviewer

Responsável por:

- precisão do conteúdo;
- limites profissionais;
- contraindicações;
- escalonamento;
- adequação clínica;
- linguagem de risco.

---

## 6. Competência por domínio

### Medicina

Revisão preferencial por médico para:

- sintomas;
- sinais de urgência;
- exames;
- medicamentos;
- condições crônicas;
- risco clínico;
- contraindicações médicas;
- encaminhamento;
- protocolos de emergência.

### Nutrição

Revisão por nutricionista para:

- alimentação;
- adesão alimentar;
- metas nutricionais;
- comportamento alimentar;
- suplementação no escopo permitido;
- risco nutricional;
- transtornos alimentares em colaboração multiprofissional.

### Psicologia

Revisão por psicólogo para:

- acolhimento;
- linguagem emocional;
- dependência emocional;
- crise;
- estratégias de autocuidado;
- limites de aconselhamento;
- comportamento manipulativo.

### Psiquiatria

Revisão por psiquiatra quando houver:

- risco de suicídio;
- transtorno mental grave;
- psicose;
- medicação psiquiátrica;
- crise aguda;
- risco elevado.

### Educação física

Revisão por profissional habilitado para:

- prescrição geral de exercício;
- progressão;
- contraindicações;
- dor e interrupção;
- segurança de treino.

### Fisioterapia

Revisão para:

- reabilitação;
- dor musculoesquelética;
- limitações funcionais;
- exercício terapêutico;
- pós-operatório.

### Enfermagem

Revisão para:

- autocuidado;
- monitoramento;
- sinais de alerta;
- educação em saúde;
- processos assistenciais.

### Jurídico/regulatório

Revisão para:

- escopo;
- comunicação;
- responsabilidade;
- termos;
- consentimento;
- publicidade;
- enquadramento regulatório.

---

## 7. Limites da competência

Um revisor não deve aprovar conteúdo fora de sua competência.

Exemplos:

- nutricionista não aprova protocolo médico;
- engenheiro não aprova linguagem clínica;
- médico não substitui revisão de privacidade;
- advogado não valida acurácia clínica;
- fundador não aprova safety sozinho.

---

## 8. Classes de revisão

### REVIEW-L1 — Técnica

Para alterações de baixo risco.

Revisores:

- engenharia;
- AI Owner;
- produto.

### REVIEW-L2 — Produto e Safety

Para personalização e conteúdo sensível moderado.

Revisores:

- produto;
- safety;
- engenharia;
- IA.

### REVIEW-L3 — Clínica

Para conteúdo de saúde de alto impacto.

Revisores:

- domínio clínico;
- safety;
- produto;
- engenharia;
- privacidade quando aplicável.

### REVIEW-L4 — Crítica

Para crise, emergência, diagnóstico, medicação, risco grave ou função regulada.

Revisores:

- especialista principal;
- segundo revisor;
- safety;
- jurídico/regulatório;
- fundador;
- engenharia;
- IA.

---

## 9. Matriz de aprovação

| Tipo de mudança | Classe | Revisão mínima |
|---|---|---|
| Correção editorial | L1 | Produto + engenharia |
| Mudança de tom | L2 | Produto + safety |
| Novo prompt de personalização | L2 | IA + produto + safety |
| Novo perfil de inteligência | L3 | Domínio + IA + produto + safety |
| Conteúdo de exame | L3 | Médico + safety |
| Conteúdo de medicamento | L4 | Médico + segundo revisor + jurídico |
| Fluxo de autolesão | L4 | Psicólogo/psiquiatra + segundo revisor + safety + jurídico |
| Novo domínio clínico | L4 | Especialista + regulatório + conselho |
| Mudança em classificação de emergência | L4 | Médico + segundo revisor + safety |

---

## 10. Critérios para escolha de revisor

O revisor deve possuir:

- formação adequada;
- registro ativo, quando aplicável;
- experiência no domínio;
- independência suficiente;
- capacidade de justificar decisões;
- disponibilidade para revisão;
- compromisso de confidencialidade;
- ausência de conflito impeditivo.

---

## 11. Cadastro de revisores

Cada revisor deverá possuir registro interno com:

- reviewer_id;
- nome;
- profissão;
- especialidade;
- registro profissional;
- jurisdição;
- situação do registro;
- experiência;
- domínios autorizados;
- data de onboarding;
- termo de confidencialidade;
- conflito declarado;
- status;
- última verificação.

---

## 12. Verificação de credenciais

Antes de aprovar conteúdo clínico:

- validar registro profissional;
- validar situação ativa;
- validar identidade;
- confirmar especialidade declarada;
- registrar data de verificação;
- repetir verificação periodicamente.

---

## 13. Conflito de interesse

Exemplos:

- participação financeira direta;
- vínculo com fornecedor avaliado;
- autoria exclusiva da solução;
- incentivo por aprovação;
- relação pessoal relevante;
- disputa profissional;
- interesse comercial oculto.

### Regra

Conflitos devem ser declarados antes da revisão.

---

## 14. Classificação de conflito

### COI-LOW

Conflito remoto sem impacto provável.

### COI-MEDIUM

Pode influenciar percepção.

### COI-HIGH

Compromete independência.

### COI-BLOCKING

Impede participação na decisão.

---

## 15. Segunda opinião

Segunda revisão será obrigatória quando houver:

- risco AI-CRITICAL;
- novo protocolo de crise;
- medicamento;
- diagnóstico ou exclusão de diagnóstico;
- sinais de emergência;
- divergência importante;
- conflito de interesse;
- incidente grave;
- alto risco regulatório.

---

## 16. Revisão independente

Sempre que possível, o segundo revisor não deve:

- ter escrito o conteúdo;
- ter participado da implementação principal;
- depender financeiramente da aprovação;
- conhecer a recomendação do primeiro revisor antes da análise inicial.

---

## 17. Blind review

Para comparações de versões:

- ocultar qual versão é atual;
- ocultar qual modelo foi usado;
- randomizar ordem;
- registrar avaliação individual;
- reconciliar divergências depois.

---

## 18. Processo de revisão

1. abrir review record;
2. definir escopo;
3. classificar risco;
4. selecionar revisores;
5. verificar conflitos;
6. fornecer versão exata;
7. fornecer critérios;
8. realizar análise;
9. registrar achados;
10. classificar falhas;
11. solicitar correções;
12. revisar novamente;
13. emitir decisão;
14. registrar validade;
15. publicar aprovação.

---

## 19. Materiais fornecidos ao revisor

O pacote de revisão deve conter:

- objetivo do fluxo;
- público;
- limites;
- prompt;
- schema;
- exemplos;
- casos críticos;
- dataset;
- métricas;
- falhas conhecidas;
- política de safety;
- contexto regulatório;
- versão anterior;
- mudanças propostas.

---

## 20. Decisões possíveis

### APPROVED

Aprovado para o escopo indicado.

### APPROVED_WITH_RESTRICTIONS

Aprovado com limitações obrigatórias.

### REWORK_REQUIRED

Correções necessárias antes de nova análise.

### BLOCKED

Não pode avançar.

### OUT_OF_SCOPE

O revisor não possui competência para decidir.

### ESCALATE

Necessita nível superior ou outro especialista.

---

## 21. Validade da aprovação

Toda aprovação deve indicar:

- versão;
- escopo;
- ambiente;
- data;
- validade;
- condições;
- exclusões;
- gatilhos de reavaliação.

Uma aprovação não é permanente.

---

## 22. Reavaliação obrigatória

Revisar novamente quando houver:

- mudança de prompt;
- mudança de modelo;
- mudança de schema;
- novo público;
- novo país;
- nova condição clínica;
- mudança de política;
- incidente;
- nova evidência;
- alteração regulatória;
- drift;
- reclamação relevante.

---

## 23. Frequência de revisão

Proposta inicial:

- L1: conforme mudança;
- L2: a cada release relevante;
- L3: pelo menos anual ou por mudança;
- L4: a cada mudança e revisão periódica mais curta;
- incidentes: imediatamente;
- recursos locais de crise: revisão frequente.

Os prazos finais deverão ser aprovados.

---

## 24. Escalonamento

Escalonar quando:

- houver divergência entre revisores;
- risco residual for alto;
- competência for insuficiente;
- evidência for limitada;
- regulação for incerta;
- impacto potencial for grave;
- revisor pedir escalonamento;
- safety discordar;
- jurídico discordar;
- fundador pretender aceitar risco elevado.

---

## 25. Resolução de divergências

1. registrar posições;
2. identificar ponto técnico;
3. buscar fonte;
4. pedir terceira opinião;
5. consultar regulatório;
6. adotar opção mais conservadora;
7. documentar decisão;
8. definir reavaliação.

---

## 26. Poder de bloqueio

Devem possuir poder de bloqueio em seu domínio:

- Safety Lead;
- Privacy/Legal Reviewer;
- Clinical Reviewer principal;
- Security Owner;
- Engineering Owner em risco técnico grave.

O fundador não deve remover bloqueio sem nova análise formal.

---

## 27. Revisão de conteúdo educativo

Cada conteúdo deve registrar:

- autor;
- revisor;
- fontes;
- data;
- versão;
- público;
- limitações;
- próxima revisão.

---

## 28. Revisão de datasets

Revisores devem avaliar:

- representatividade;
- dificuldade;
- risco;
- vieses;
- comportamento esperado;
- comportamento proibido;
- linguagem;
- severidade;
- casos ausentes.

---

## 29. Revisão de prompts

O revisor clínico deve avaliar o comportamento, não necessariamente a sintaxe técnica.

Deve verificar:

- limites;
- linguagem;
- inferências;
- segurança;
- encaminhamento;
- ausência de diagnóstico;
- ausência de prescrição;
- incerteza;
- tom.

---

## 30. Revisão de respostas

A amostra deve incluir:

- casos comuns;
- bordas;
- casos adversariais;
- crise;
- respostas ruins;
- falhas conhecidas;
- comparação entre versões.

---

## 31. Revisão de incidentes

Incidentes clínicos devem receber:

- triagem;
- contenção;
- revisão técnica;
- revisão clínica;
- análise de causa;
- correção;
- teste de regressão;
- decisão de comunicação;
- atualização de política.

---

## 32. Comité de incidentes

Para P0 ou P1, reunir:

- fundador;
- safety;
- engenharia;
- IA;
- clínico;
- jurídico;
- privacidade;
- comunicação, quando necessário.

---

## 33. Registro de decisão

Toda decisão deve registrar:

- decision_id;
- assunto;
- versão;
- participantes;
- conflitos;
- evidências;
- posições;
- decisão;
- restrições;
- riscos;
- validade;
- follow-up.

---

## 34. Auditoria

A auditoria deverá permitir responder:

- quem revisou;
- o que revisou;
- qual versão;
- quando;
- com quais critérios;
- quais falhas encontrou;
- o que foi corrigido;
- quem aprovou;
- por quanto tempo.

---

## 35. Confidencialidade

Revisores devem:

- acessar somente o necessário;
- usar ambiente aprovado;
- não copiar dados;
- não usar dados reais fora do processo;
- proteger credenciais;
- reportar incidente;
- cumprir contrato.

---

## 36. Uso de dados reais em revisão

Evitar dados reais sempre que possível.

Quando indispensável:

- base legal;
- minimização;
- acesso restrito;
- redaction;
- ambiente seguro;
- registro;
- retenção definida;
- aprovação.

---

## 37. Remuneração

A remuneração deve ser:

- transparente;
- independente do resultado;
- não vinculada à aprovação;
- documentada;
- compatível com o trabalho.

---

## 38. Marketing

Não usar nome, registro ou imagem do revisor em marketing sem autorização específica.

Não afirmar endosso institucional indevido.

---

## 39. Advisory Board futuro

Poderá incluir:

- medicina;
- nutrição;
- psicologia;
- psiquiatria;
- educação física;
- enfermagem;
- bioética;
- proteção de dados;
- regulação;
- segurança;
- experiência do paciente.

---

## 40. Critérios para Alpha

Antes do Alpha:

- revisores essenciais identificados;
- credenciais verificadas;
- conflitos registrados;
- fluxos L3 e L4 revisados;
- padrões de crise aprovados;
- safety review concluída;
- jurídico/regulatório concluído;
- registros armazenados;
- poder de bloqueio definido;
- processo de incidentes testado.

---

## 41. Responsabilidades do fundador

O fundador deve:

- contratar competências adequadas;
- respeitar bloqueios;
- não usar revisão simbólica;
- garantir orçamento;
- documentar risco;
- preservar independência;
- impedir pressão por prazo;
- acompanhar pendências.

---

## 42. Limitações

A revisão humana:

- não elimina risco;
- não garante ausência de erro;
- não substitui testes;
- não substitui monitoramento;
- não transfere automaticamente responsabilidade;
- deve ser atualizada;
- depende de escopo e competência.

---

## 43. Questões abertas

1. Quais revisores serão contratados primeiro?
2. Qual frequência final?
3. Qual remuneração?
4. Qual ferramenta de registro?
5. Qual validade de aprovação?
6. Como formar o Advisory Board?
7. Como tratar revisão internacional?
8. Como verificar credenciais?
9. Como operar segunda opinião?
10. Como documentar independência?
11. Como tratar divergências?
12. Qual SLA para incidentes?

---

## 44. Histórico

| Versão | Data | Alteração |
|---|---|---|
| 0.1 | 19/07/2026 | Criação do framework inicial de revisão humana e governança clínica. |
