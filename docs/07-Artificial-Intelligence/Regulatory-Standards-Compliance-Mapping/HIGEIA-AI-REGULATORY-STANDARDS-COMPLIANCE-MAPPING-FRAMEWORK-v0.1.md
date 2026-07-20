# Higeia — AI Regulatory, Standards and Compliance Mapping Framework

**Documento:** Higeia AI Regulatory, Standards and Compliance Mapping Framework  
**Versão:** 0.1  
**Status:** Estrutura inicial oficial  
**Data:** 19 de julho de 2026  
**Projeto interno:** Projeto Eros  
**Produto:** Higeia  
**Fundador:** Clovis Sadlowski  

---

## 1. Objetivo

Definir como o Higeia identificará, classificará, mapeará, acompanhará e demonstrará requisitos legais, regulatórios, normativos, contratuais e internos aplicáveis às funcionalidades de inteligência artificial.

Este framework estabelece requisitos para:

- inventário de obrigações;
- mapeamento de controles;
- rastreabilidade;
- análise de aplicabilidade;
- evidências;
- gaps;
- planos de ação;
- monitoramento de mudanças;
- revisão jurídica;
- revisão regulatória;
- preparação para auditorias;
- comunicação de status;
- prevenção de alegações indevidas de conformidade.

---

## 2. Princípio central

O Higeia não deve afirmar que está:

- certificado;
- em conformidade;
- aprovado;
- validado;
- autorizado;
- regulado;
- auditado;

sem base documental, escopo definido, evidências e avaliação competente.

O correto é distinguir:

- requisito identificado;
- requisito aplicável;
- controle mapeado;
- controle implementado;
- controle testado;
- evidência disponível;
- gap existente;
- conformidade validada;
- certificação obtida.

---

## 3. Escopo

Aplica-se a:

- LGPD;
- privacidade;
- segurança;
- saúde digital;
- inteligência artificial;
- contratos;
- fornecedores;
- prontuários;
- dados pessoais;
- dados de saúde;
- decisões automatizadas;
- consentimento;
- direitos do titular;
- retenção;
- exclusão;
- incidentes;
- acessibilidade;
- qualidade;
- software;
- operações;
- registros;
- auditoria;
- pesquisa;
- expansão internacional.

---

## 4. Categorias de requisito

### LEGAL

Lei, decreto, regulamento ou obrigação jurídica.

### REGULATORY

Regra, orientação ou exigência de autoridade competente.

### CONTRACTUAL

Obrigação assumida em contrato.

### STANDARD

Requisito ou prática de norma técnica.

### POLICY

Regra interna do Higeia.

### PARTNER

Exigência de parceiro, cliente ou instituição.

### MARKET

Expectativa relevante de mercado ou due diligence.

---

## 5. Estados de aplicabilidade

- not_assessed;
- under_assessment;
- applicable;
- partially_applicable;
- not_applicable;
- applicability_uncertain;
- superseded;
- expired.

---

## 6. Estados de conformidade

- unknown;
- not_started;
- planned;
- partially_implemented;
- implemented;
- operating;
- tested;
- validated;
- nonconforming;
- exception_active;
- not_applicable.

---

## 7. Unidade de obrigação

Cada requisito deve possuir:

- obligation_id;
- source;
- jurisdiction;
- title;
- section;
- summary;
- applicability;
- owner;
- risk;
- control_ids;
- evidence_ids;
- status;
- review date;
- legal interpretation reference.

---

## 8. Regra de interpretação

A interpretação jurídica ou regulatória deve ser feita por profissional competente quando necessário.

A documentação interna pode:

- identificar;
- organizar;
- mapear;
- sinalizar;
- acompanhar.

Não deve substituir parecer jurídico quando houver dúvida relevante.

---

## 9. Jurisdição

Cada obrigação deve indicar:

- país;
- estado;
- município;
- autoridade;
- mercado;
- contrato;
- região de dados;
- público afetado.

---

## 10. Aplicabilidade por fase

Uma obrigação pode variar conforme:

- pesquisa;
- protótipo;
- desenvolvimento;
- staging;
- Alpha;
- Beta;
- produção;
- operação clínica;
- venda B2B;
- expansão internacional.

---

## 11. Aplicabilidade por papel

O Higeia poderá atuar como:

- controlador;
- operador;
- suboperador;
- fornecedor de software;
- prestador de serviço;
- parceiro tecnológico;
- pesquisador;
- processador de dados;
- plataforma;
- assistente de profissional.

O papel deve ser definido por fluxo e contrato.

---

## 12. Aplicabilidade por dado

Avaliar:

- dado pessoal;
- dado pessoal sensível;
- dado de saúde;
- dado clínico;
- dado de criança ou adolescente;
- dado profissional;
- dado anonimizado;
- dado pseudonimizado;
- metadado;
- dado inferido;
- dado derivado;
- dado de terceiro.

---

## 13. Aplicabilidade por funcionalidade

Exemplos:

- onboarding;
- anamnese;
- memória;
- Perfil de Inteligência;
- recomendação;
- alerta;
- classificação;
- RAG;
- integração clínica;
- upload de exame;
- exportação;
- exclusão;
- revisão humana;
- automação externa.

---

## 14. Matriz de rastreabilidade

Cada obrigação deve ser vinculada a:

- política;
- controle;
- owner;
- evidência;
- teste;
- finding;
- plano de ação;
- decisão;
- exceção;
- data de revisão.

---

## 15. Mapeamento muitos-para-muitos

Um requisito pode ter vários controles.

Um controle pode atender vários requisitos.

Evitar duplicar controles apenas para preencher matrizes diferentes.

---

## 16. Fonte oficial

Sempre que possível, registrar:

- fonte oficial;
- versão;
- publicação;
- vigência;
- autoridade;
- link ou referência;
- data de consulta;
- responsável pela análise.

---

## 17. Mudança regulatória

O processo deve monitorar:

- nova lei;
- novo regulamento;
- decisão de autoridade;
- orientação;
- atualização de norma;
- alteração contratual;
- mudança de fornecedor;
- expansão geográfica;
- novo mercado;
- nova funcionalidade.

---

## 18. Trigger de revisão

Revisar aplicabilidade quando:

- o produto muda;
- o público muda;
- o dado muda;
- o país muda;
- o modelo muda;
- a automação muda;
- o contrato muda;
- ocorre incidente;
- surge nova interpretação;
- termina a validade da análise.

---

## 19. Fontes prioritárias

Priorizar:

- textos legais oficiais;
- autoridades reguladoras;
- normas oficiais;
- contratos assinados;
- pareceres;
- políticas aprovadas;
- orientações institucionais;
- fontes primárias.

---

## 20. Cuidado com resumos

Resumos, blogs e materiais de terceiros podem apoiar entendimento, mas não devem ser a única base de obrigação crítica.

---

## 21. LGPD

O mapeamento pode incluir, conforme aplicabilidade:

- finalidade;
- adequação;
- necessidade;
- livre acesso;
- qualidade;
- transparência;
- segurança;
- prevenção;
- não discriminação;
- responsabilização;
- bases legais;
- direitos do titular;
- dados sensíveis;
- incidentes;
- operadores;
- transferências;
- retenção;
- exclusão;
- decisões automatizadas.

---

## 22. Dados de saúde

Dados de saúde exigem tratamento reforçado.

Avaliar:

- necessidade;
- finalidade;
- acesso;
- segurança;
- compartilhamento;
- revisão;
- retenção;
- exclusão;
- contrato;
- incidente;
- minimização;
- transparência.

---

## 23. Decisão automatizada

Mapear requisitos relacionados a:

- transparência;
- revisão;
- contestação;
- explicação;
- intervenção humana;
- impacto;
- registro;
- finalidade;
- segurança.

---

## 24. Segurança

Mapear requisitos referentes a:

- acesso;
- autenticação;
- criptografia;
- logs;
- vulnerabilidades;
- incidentes;
- continuidade;
- fornecedores;
- backups;
- segregação;
- ambientes;
- testes.

---

## 25. Requisitos clínicos

Quando aplicável, mapear:

- limites de uso;
- revisão profissional;
- evidência científica;
- responsabilidade;
- comunicação de risco;
- prontuário;
- registro;
- supervisão;
- atualização;
- incidentes.

---

## 26. Normas técnicas

Normas podem ser usadas para:

- estruturar controles;
- elevar maturidade;
- preparar certificação;
- atender parceiros;
- comparar práticas;
- organizar auditoria.

A adoção de práticas de uma norma não significa certificação.

---

## 27. Certificação

Somente declarar certificação quando:

- escopo definido;
- organismo competente;
- auditoria concluída;
- certificado válido;
- período válido;
- condições atendidas.

---

## 28. Claims control

Toda alegação externa deve ser revisada.

Exemplos de alegações sensíveis:

- “100% seguro”;
- “totalmente conforme”;
- “certificado”;
- “aprovado clinicamente”;
- “sem risco”;
- “diagnóstico preciso”;
- “compliance garantido”.

---

## 29. Linguagem permitida

Exemplos mais adequados:

- “controles estruturados com base em princípios de privacidade”;
- “framework interno alinhado a boas práticas”;
- “processo em desenvolvimento”;
- “avaliação em andamento”;
- “escopo sujeito a validação”.

---

## 30. Avaliação de gap

Cada obrigação deve ser comparada com:

- controle existente;
- implementação;
- operação;
- teste;
- evidência;
- owner;
- prazo.

---

## 31. Tipos de gap

### GAP-DESIGN

Controle ausente ou mal desenhado.

### GAP-IMPLEMENTATION

Controle não implementado.

### GAP-OPERATION

Controle não opera corretamente.

### GAP-EVIDENCE

Evidência insuficiente.

### GAP-INTERPRETATION

Aplicabilidade ou interpretação incerta.

### GAP-OWNER

Sem responsável.

---

## 32. Severidade de gap

- critical;
- high;
- medium;
- low;
- observation.

---

## 33. Plano de adequação

Cada gap deve possuir:

- ação;
- owner;
- prazo;
- dependência;
- custo;
- risco residual;
- evidência;
- validação;
- status.

---

## 34. Exceção

Exceções devem ser:

- temporárias;
- justificadas;
- aprovadas;
- monitoradas;
- documentadas;
- encerradas.

---

## 35. Contratos

O mapeamento contratual deve considerar:

- proteção de dados;
- confidencialidade;
- incidentes;
- SLA;
- subcontratados;
- auditoria;
- retenção;
- exclusão;
- portabilidade;
- propriedade intelectual;
- limitação de responsabilidade;
- continuidade;
- encerramento.

---

## 36. Fornecedores

Mapear:

- obrigações do fornecedor;
- obrigações do Higeia;
- evidências;
- certificados;
- relatórios;
- incidentes;
- transferências;
- retenção;
- exclusão;
- suboperadores.

---

## 37. Parceiros clínicos

Mapear:

- responsabilidade;
- supervisão;
- acesso;
- prontuário;
- confidencialidade;
- revisão;
- comunicação;
- incidentes;
- uso permitido;
- limites da IA.

---

## 38. Expansion readiness

Antes de entrar em novo país ou mercado:

- identificar jurisdição;
- avaliar dados;
- avaliar papel;
- revisar contratos;
- revisar fornecedores;
- revisar claims;
- revisar consentimentos;
- revisar retenção;
- revisar direitos;
- aprovar expansão.

---

## 39. Standards crosswalk

Criar matrizes de correspondência entre:

- controles internos;
- requisitos legais;
- normas;
- contratos;
- políticas;
- evidências.

---

## 40. Compliance by design

Requisitos devem entrar em:

- discovery;
- produto;
- arquitetura;
- engenharia;
- UX;
- procurement;
- release;
- operação;
- depreciação.

---

## 41. Compliance gate

Mudanças relevantes devem verificar:

- nova obrigação;
- impacto contratual;
- impacto de privacidade;
- impacto regulatório;
- impacto clínico;
- claims;
- documentação;
- evidência;
- aprovação.

---

## 42. Legal hold

Quando aplicável, impedir exclusão de registros necessários para:

- investigação;
- litígio;
- auditoria;
- incidente;
- obrigação;
- ordem legal.

---

## 43. Registro de parecer

Quando houver parecer jurídico, registrar:

- legal_review_id;
- questão;
- escopo;
- premissas;
- conclusão;
- limitações;
- responsável;
- data;
- validade;
- gatilhos de revisão.

---

## 44. Registro de interpretação

Interpretações internas devem ser claramente marcadas como:

- preliminary;
- operational;
- legal_reviewed;
- regulatory_reviewed;
- superseded.

---

## 45. Evidência

Nenhuma obrigação deve ser marcada como atendida apenas por existir política.

A evidência pode incluir:

- configuração;
- log;
- teste;
- contrato;
- checklist;
- aprovação;
- relatório;
- ticket;
- registro de usuário;
- auditoria;
- evidência de operação.

---

## 46. Assurance

O status “validated” deve exigir:

- controles implementados;
- evidência suficiente;
- teste;
- revisão adequada;
- escopo definido;
- validade.

---

## 47. Revisão periódica

Frequência proposta:

- critical: quarterly or on change;
- high: semiannual or on change;
- medium: annual;
- low: annual or on change.

---

## 48. Reporte executivo

O relatório deve destacar:

- requisitos críticos;
- gaps;
- mudanças;
- riscos;
- decisões;
- prazos;
- owners;
- claims;
- próximos marcos.

---

## 49. Métricas

Monitorar:

- obligations identified;
- obligations unassessed;
- applicable obligations;
- gaps open;
- critical gaps;
- overdue actions;
- expired legal reviews;
- controls without evidence;
- claims pending review;
- regulatory changes pending assessment.

---

## 50. Auditoria

Deve ser possível responder:

- qual requisito;
- por que se aplica;
- qual interpretação;
- qual controle;
- qual evidência;
- qual teste;
- qual gap;
- quem aprovou;
- quando revisar;
- qual claim foi autorizado.

---

## 51. Gates antes do Alpha

- [ ] inventário inicial de obrigações criado;
- [ ] LGPD mapeada em nível preliminar;
- [ ] papéis de controlador e operador avaliados;
- [ ] dados sensíveis identificados;
- [ ] direitos do titular mapeados;
- [ ] decisões automatizadas avaliadas;
- [ ] contratos críticos identificados;
- [ ] fornecedores mapeados;
- [ ] claims revisados;
- [ ] gaps críticos registrados;
- [ ] owners definidos;
- [ ] evidências vinculadas;
- [ ] revisão jurídica necessária identificada;
- [ ] nenhuma certificação indevida declarada.

---

## 52. Responsabilidades

### Compliance Owner

Mantém o inventário e o mapeamento.

### Privacy Owner

Avalia privacidade e LGPD.

### Legal Counsel

Interpreta questões jurídicas relevantes.

### Security Owner

Mapeia controles técnicos.

### Clinical Owner

Avalia obrigações clínicas.

### Product Owner

Integra requisitos à experiência.

### Engineering

Implementa controles.

### Founder

Aprova risco estratégico e claims relevantes.

---

## 53. Questões abertas

1. Quem será o Compliance Owner?
2. Qual assessor jurídico?
3. Quais normas serão priorizadas?
4. Qual escopo do MVP?
5. Qual papel do Higeia em cada fluxo?
6. Quais contratos serão usados?
7. Como monitorar mudanças legais?
8. Qual frequência de revisão?
9. Quais claims serão permitidos?
10. Como preparar expansão internacional?
11. Quais requisitos clínicos se aplicam?
12. Quais certificações futuras fazem sentido?

---

## 54. Histórico

| Versão | Data | Alteração |
|---|---|---|
| 0.1 | 19/07/2026 | Criação do framework inicial de mapeamento regulatório, normativo e de compliance. |
