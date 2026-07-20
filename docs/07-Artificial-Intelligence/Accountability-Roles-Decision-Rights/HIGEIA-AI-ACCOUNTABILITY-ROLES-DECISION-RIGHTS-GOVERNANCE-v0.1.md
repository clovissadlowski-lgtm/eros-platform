# Higeia — AI Accountability, Roles and Decision Rights Governance

**Documento:** Higeia AI Accountability, Roles and Decision Rights Governance  
**Versão:** 0.1  
**Status:** Estrutura inicial oficial  
**Data:** 19 de julho de 2026  
**Projeto interno:** Projeto Eros  
**Produto:** Higeia  
**Fundador:** Clovis Sadlowski  

---

## 1. Objetivo

Definir responsabilidades, direitos de decisão, alçadas, aprovações, bloqueios, escalonamentos e prestação de contas para todos os componentes e processos de inteligência artificial do Higeia.

Este framework estabelece:

- papéis;
- owners;
- aprovadores;
- revisores;
- consultados;
- informados;
- direito de bloquear;
- direito de implantar;
- direito de reverter;
- segregação de funções;
- resolução de conflitos;
- exceções;
- trilha de decisão;
- accountability final.

---

## 2. Princípio central

Nenhuma decisão relevante de IA deve existir sem:

- responsável nomeado;
- decisão documentada;
- critérios conhecidos;
- evidências;
- alçada compatível;
- possibilidade de contestação;
- plano de escalonamento;
- validade;
- revisão.

A responsabilidade não pode ser atribuída genericamente à “equipe” ou à “IA”.

---

## 3. Escopo

Aplica-se a:

- modelos;
- prompts;
- schemas;
- guardrails;
- memória;
- RAG;
- datasets;
- fornecedores;
- releases;
- incidentes;
- safety;
- privacidade;
- clínica;
- observabilidade;
- custos;
- dados;
- acessibilidade;
- fairness;
- revisões humanas;
- automações;
- ferramentas externas.

---

## 4. Conceitos

### Accountable

Pessoa que responde pela decisão final.

### Responsible

Pessoa que executa ou coordena o trabalho.

### Approver

Pessoa com autoridade formal para autorizar.

### Reviewer

Pessoa que avalia evidências e riscos.

### Blocker

Pessoa com direito formal de impedir avanço.

### Consulted

Pessoa ou função consultada antes da decisão.

### Informed

Pessoa ou função comunicada após a decisão.

---

## 5. Regra de accountability única

Cada decisão deve ter um único accountable principal.

Pode haver vários responsáveis e revisores, mas não múltiplos accountable sem definição clara.

---

## 6. Papéis iniciais

### Founder / Executive Sponsor

Responsável por risco estratégico, orçamento, direção e exceções críticas.

### Product Owner

Responsável por objetivo, valor, impacto e experiência.

### AI Owner

Responsável por comportamento da IA, avaliação, prompts, modelos e performance.

### Engineering Owner

Responsável por implementação, arquitetura, deployment e rollback.

### Data Owner

Responsável por qualidade, schema, proveniência e datasets.

### Security Owner

Responsável por segurança técnica, acesso e incidentes.

### Privacy Owner

Responsável por finalidade, minimização, retenção, direitos e LGPD.

### Clinical Owner / Reviewer

Responsável por validade e limites clínicos.

### Safety Owner

Responsável por riscos de dano e controles de safety.

### Operations Owner

Responsável por observabilidade, alertas, SLOs e continuidade.

### Finance Owner

Responsável por orçamento, custo e viabilidade.

### Support Owner

Responsável por feedback, reclamações, contestação e comunicação operacional.

---

## 7. Acúmulo de funções

Em equipe pequena, uma pessoa pode exercer múltiplos papéis.

Nesses casos:

- documentar o acúmulo;
- identificar conflitos;
- criar revisão independente quando necessário;
- limitar autoaprovação em mudanças críticas;
- registrar exceções.

---

## 8. Segregação de funções

Sempre que possível, separar:

- quem propõe;
- quem implementa;
- quem avalia;
- quem aprova;
- quem implanta;
- quem monitora;
- quem investiga incidente.

---

## 9. Mudanças críticas

Para mudanças críticas, evitar que a mesma pessoa:

- proponha;
- implemente;
- aprove;
- coloque em produção;
- encerre a revisão.

Uma segunda função independente deve participar.

---

## 10. Classes de decisão

### DECISION-LOW

Mudança operacional simples e reversível.

### DECISION-MEDIUM

Mudança funcional com impacto moderado.

### DECISION-HIGH

Mudança relevante em comportamento, dados ou usuários.

### DECISION-CRITICAL

Mudança em safety, clínica, privacidade, segurança, medicação, crise, dados de saúde ou ação externa.

---

## 11. Tipos de decisão

- product;
- technical;
- architecture;
- AI behavior;
- clinical;
- safety;
- privacy;
- security;
- financial;
- vendor;
- operational;
- incident;
- release;
- exception;
- retirement.

---

## 12. Decision owner

Toda decisão deve possuir:

- decision_id;
- accountable;
- responsible;
- class;
- type;
- scope;
- date;
- validity;
- evidence;
- approvers;
- blockers;
- outcome.

---

## 13. Direitos de propor

Podem propor mudanças:

- Product;
- AI;
- Engineering;
- Clinical;
- Safety;
- Security;
- Privacy;
- Operations;
- Founder;
- Support, por meio de feedback estruturado.

Propor não significa aprovar.

---

## 14. Direitos de aprovar

Aprovações dependem do domínio e da classe de risco.

Exemplo:

- Product aprova valor e escopo;
- AI aprova comportamento;
- Engineering aprova viabilidade;
- Safety aprova risco;
- Privacy aprova uso de dados;
- Clinical aprova conteúdo clínico;
- Founder aprova risco estratégico.

---

## 15. Direitos de bloquear

Podem bloquear dentro de seu domínio:

- Safety;
- Security;
- Privacy;
- Clinical;
- Engineering;
- Operations;
- Founder.

O bloqueio deve ser:

- fundamentado;
- registrado;
- proporcional;
- revisável;
- acompanhado de condição para desbloqueio.

---

## 16. Bloqueio imediato

Pode ocorrer sem aprovação prévia quando houver:

- risco de dano;
- vazamento;
- incidente crítico;
- comportamento clínico perigoso;
- falha de isolamento;
- uso indevido de dados;
- custo fora de controle;
- indisponibilidade grave;
- ação externa insegura.

---

## 17. Direito de suspender

Safety, Security, Privacy, Operations ou Founder podem suspender uma funcionalidade crítica quando o risco justificar.

A suspensão deve gerar:

- registro;
- comunicação;
- incidente;
- avaliação;
- decisão de retorno, restrição ou retirada.

---

## 18. Direito de rollback

Engineering e Operations podem executar rollback quando gatilhos objetivos forem atendidos.

Mudanças clínicas ou de safety podem exigir comunicação imediata ao respectivo owner, sem aguardar autorização para contenção urgente.

---

## 19. Direito de implantação

Somente pessoas ou automações autorizadas podem implantar.

A implantação exige:

- release aprovado;
- ambiente correto;
- versões conhecidas;
- feature flags;
- monitoramento;
- rollback;
- registro.

---

## 20. Direito de exceção

Exceções podem ser aprovadas apenas por alçada compatível.

Exceções críticas exigem:

- Founder;
- owner do domínio;
- prazo;
- mitigação;
- risco residual;
- plano de encerramento.

---

## 21. Matriz RACI

Para cada processo, definir:

- R — Responsible;
- A — Accountable;
- C — Consulted;
- I — Informed.

Não usar RACI como substituto de decisão real.

---

## 22. Matriz RAPID

Para decisões complexas, pode-se usar:

- Recommend;
- Agree;
- Perform;
- Input;
- Decide.

---

## 23. Quórum

Decisões High ou Critical devem definir quórum mínimo.

Exemplo inicial:

- Product;
- AI;
- Engineering;
- domínio de risco;
- Founder quando aplicável.

---

## 24. Aprovação assíncrona

Aprovação assíncrona deve conter:

- decisão explícita;
- data;
- versão;
- escopo;
- restrições;
- validade;
- identidade do aprovador.

Silêncio não significa aprovação.

---

## 25. Aprovação automática

Pode ser usada apenas quando:

- critérios forem objetivos;
- risco for baixo;
- testes forem confiáveis;
- rollback existir;
- auditoria estiver ativa.

---

## 26. Conflitos

Conflitos podem ocorrer entre:

- velocidade e safety;
- produto e privacidade;
- custo e qualidade;
- clínica e experiência;
- engenharia e prazo;
- operação e inovação.

O conflito deve ser registrado e escalado.

---

## 27. Regra de prevalência

Em conflito, prevalece:

1. proteção à vida e segurança;
2. segurança e privacidade;
3. obrigação legal e regulatória;
4. integridade clínica;
5. continuidade operacional;
6. experiência do usuário;
7. custo e velocidade.

---

## 28. Escalonamento

Níveis propostos:

- L1 — owner operacional;
- L2 — owner de domínio;
- L3 — comitê de IA;
- L4 — Founder;
- L5 — conselho ou assessoria externa, quando necessário.

---

## 29. Comitê de IA

O comitê pode incluir:

- Founder;
- Product;
- AI;
- Engineering;
- Clinical;
- Safety;
- Privacy;
- Security;
- Operations.

---

## 30. Funções do comitê

- revisar mudanças críticas;
- resolver conflitos;
- aprovar exceções;
- revisar incidentes;
- revisar risco residual;
- acompanhar métricas;
- aprovar depreciações;
- revisar roadmap de IA.

---

## 31. Periodicidade

Proposta inicial:

- operacional: semanal;
- risco e incidentes: quinzenal;
- governança: mensal;
- revisão estratégica: trimestral.

A frequência final dependerá da fase do produto.

---

## 32. Registro de decisão

Toda decisão relevante deve registrar:

- contexto;
- opções;
- critérios;
- evidências;
- riscos;
- participantes;
- decisão;
- restrições;
- validade;
- follow-up.

---

## 33. Validade

Decisões podem expirar quando:

- muda o modelo;
- muda o fornecedor;
- muda a finalidade;
- muda o dado;
- muda a legislação;
- muda o risco;
- ocorre incidente;
- termina o prazo.

---

## 34. Delegação

Delegação deve definir:

- quem delega;
- para quem;
- escopo;
- prazo;
- limites;
- decisões permitidas;
- decisões excluídas;
- revogação.

---

## 35. Substituição temporária

Ausências devem possuir substitutos definidos para funções críticas.

Exemplos:

- incident commander;
- release approver;
- security owner;
- clinical reviewer.

---

## 36. Independência de revisão

Revisões críticas devem buscar independência suficiente.

Possíveis formas:

- segunda pessoa;
- consultor externo;
- profissional clínico;
- revisão cruzada;
- avaliação automatizada separada;
- auditoria.

---

## 37. Conflito de interesse

Declarar quando o decisor:

- criou a solução;
- possui interesse financeiro;
- é fornecedor;
- será avaliado pelo resultado;
- participa de parceria;
- não possui independência adequada.

---

## 38. Evidência mínima

Decisão sem evidência suficiente deve ser:

- adiada;
- limitada;
- aprovada com restrição;
- testada em ambiente controlado;
- bloqueada.

---

## 39. Prestação de contas

Owners devem responder por:

- decisões;
- atrasos;
- riscos;
- controles;
- métricas;
- exceções;
- incidentes;
- planos de ação.

---

## 40. Accountability da IA

A IA não pode ser accountable.

Ela pode:

- recomendar;
- classificar;
- sinalizar;
- resumir;
- apoiar.

A decisão final continua humana quando houver impacto significativo.

---

## 41. Decisões automatizadas

Toda decisão automatizada deve possuir:

- owner humano;
- finalidade;
- regra;
- explicação;
- contestação;
- monitoramento;
- rollback;
- revisão.

---

## 42. Incident command

Incidentes graves devem definir:

- Incident Commander;
- Technical Lead;
- Safety Lead;
- Privacy/Security Lead;
- Communications Lead;
- Scribe.

---

## 43. Registros de incidente

O incidente deve indicar:

- quem declarou;
- quem comandou;
- quem decidiu contenção;
- quem aprovou retorno;
- quem comunicou;
- quem encerrou.

---

## 44. Aprovação de retorno

Após incidente, retornar somente com:

- causa compreendida;
- mitigação;
- teste;
- monitoramento;
- rollback;
- aprovação dos owners afetados.

---

## 45. Direitos sobre dados

### Data Owner

Define qualidade, schema e ciclo de vida.

### Privacy Owner

Define finalidade, minimização e direitos.

### Security Owner

Define proteção e acesso.

Nenhum desses papéis substitui os demais.

---

## 46. Direitos sobre conhecimento clínico

Clinical Owner pode:

- aprovar;
- restringir;
- bloquear;
- solicitar revisão;
- retirar fonte;
- exigir atualização.

---

## 47. Direitos sobre prompts e modelos

AI Owner pode:

- propor;
- versionar;
- avaliar;
- recomendar;
- restringir;
- solicitar rollback.

Produção depende dos gates aplicáveis.

---

## 48. Direitos sobre custo

Finance Owner pode:

- definir orçamento;
- emitir alerta;
- bloquear expansão;
- exigir otimização;
- solicitar fallback econômico.

Não pode reduzir safety apenas para economizar.

---

## 49. Direitos sobre experiência

Product e UX podem:

- definir fluxo;
- linguagem;
- prioridade;
- interação;
- transparência.

Não podem remover controles obrigatórios de safety, privacidade ou acessibilidade.

---

## 50. Decisões reversíveis e irreversíveis

### Reversíveis

Podem aceitar maior velocidade, com controles.

### Difíceis de reverter

Exigem revisão reforçada.

Exemplos:

- publicação de dados;
- migração incompatível;
- contrato longo;
- envio de dados a terceiro;
- automação de ação externa;
- exclusão em massa.

---

## 51. SLA de decisão

Definir prazo para:

- revisão;
- aprovação;
- bloqueio;
- contestação;
- incidente;
- exceção;
- retorno pós-incidente.

---

## 52. Métricas de governança

Monitorar:

- decisões sem owner;
- tempo de aprovação;
- bloqueios;
- exceções;
- decisões expiradas;
- autoaprovações;
- conflitos;
- rollback;
- ações atrasadas;
- decisões sem evidência.

---

## 53. Auditoria

Deve ser possível responder:

- quem decidiu;
- quem aprovou;
- quem bloqueou;
- quem executou;
- quem foi consultado;
- qual evidência;
- qual versão;
- qual validade;
- qual conflito;
- qual exceção.

---

## 54. Gates antes do Alpha

- [ ] papéis definidos;
- [ ] owners nomeados;
- [ ] RACI inicial criada;
- [ ] direitos de bloqueio definidos;
- [ ] direito de rollback definido;
- [ ] incident command definido;
- [ ] alçadas definidas;
- [ ] conflitos escaláveis;
- [ ] comitê definido;
- [ ] substitutos críticos definidos;
- [ ] registros de decisão disponíveis;
- [ ] exceções documentadas;
- [ ] autoaprovação crítica bloqueada;
- [ ] revisões independentes definidas.

---

## 55. Responsabilidades

### Founder

Accountable final pelo risco estratégico e estrutura de governança.

### Domain Owners

Accountable por decisões em seus domínios.

### Reviewers

Responsáveis por avaliação independente.

### Approvers

Responsáveis por autorizações formais.

### Operators

Responsáveis por execução e monitoramento.

### Support

Responsável por registrar sinais externos.

---

## 56. Questões abertas

1. Quem ocupará cada papel no MVP?
2. Quais funções serão externas?
3. Qual quórum do comitê?
4. Qual frequência?
5. Quem pode implantar?
6. Quem pode fazer rollback?
7. Quem pode bloquear?
8. Qual SLA de decisão?
9. Qual formato de aprovação?
10. Como registrar delegação?
11. Como tratar ausência?
12. Quais decisões exigem Founder?

---

## 57. Histórico

| Versão | Data | Alteração |
|---|---|---|
| 0.1 | 19/07/2026 | Criação da governança inicial de accountability, papéis e direitos de decisão. |
