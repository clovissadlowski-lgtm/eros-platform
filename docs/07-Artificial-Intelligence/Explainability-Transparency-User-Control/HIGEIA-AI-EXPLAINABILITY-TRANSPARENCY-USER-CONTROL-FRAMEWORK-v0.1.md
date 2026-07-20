# Higeia — AI Explainability, Transparency and User Control Framework

**Documento:** Higeia AI Explainability, Transparency and User Control Framework  
**Versão:** 0.1  
**Status:** Estrutura inicial oficial  
**Data:** 19 de julho de 2026  
**Projeto interno:** Projeto Eros  
**Produto:** Higeia  
**Fundador:** Clovis Sadlowski  

---

## 1. Objetivo

Definir como o Higeia explicará o funcionamento de suas funcionalidades de inteligência artificial e dará ao usuário controle sobre informações, inferências, memórias, recomendações e resultados.

Este framework estabelece princípios e requisitos para:

- transparência;
- explicabilidade;
- identificação de conteúdo gerado por IA;
- distinção entre fatos e inferências;
- exibição de fontes;
- comunicação de incerteza;
- correção;
- contestação;
- controle de memória;
- consentimento e preferências;
- revisão humana;
- histórico de mudanças;
- acessibilidade.

---

## 2. Princípio central

O usuário não deve ser induzido a acreditar que uma saída de IA é:

- uma certeza;
- uma decisão clínica;
- uma verdade confirmada;
- uma avaliação humana;
- uma fonte oficial;
- uma substituição do profissional.

O sistema deve comunicar com clareza:

- o que é conhecido;
- o que foi declarado;
- o que foi medido;
- o que foi calculado;
- o que foi inferido;
- o que é hipótese;
- qual é o nível de confiança;
- quais limitações existem;
- como corrigir;
- como contestar;
- quando buscar revisão humana.

---

## 3. Escopo

Aplica-se a:

- Perfil de Inteligência;
- resumos;
- recomendações;
- alertas;
- classificações;
- hipóteses;
- memórias;
- check-ins;
- interpretações;
- explicações;
- RAG;
- fontes;
- scores;
- tendências;
- respostas conversacionais;
- automações;
- relatórios;
- painéis profissionais.

---

## 4. Transparência em camadas

A transparência deve ser apresentada em níveis.

### Camada 1 — Aviso imediato

Informação curta e clara no momento de uso.

### Camada 2 — Explicação contextual

Detalhes sobre como o resultado foi produzido.

### Camada 3 — Evidências e origem

Fontes, dados utilizados, versões e limitações.

### Camada 4 — Registro técnico

Informação de auditoria para profissionais e equipe autorizada.

---

## 5. Identificação de conteúdo de IA

Toda saída relevante deve indicar quando foi:

- gerada por IA;
- revisada por humano;
- aprovada por profissional;
- baseada em fonte;
- baseada em cálculo;
- baseada em informação declarada;
- baseada em inferência.

---

## 6. Tipos de conteúdo

### FACT-DECLARED

Informação declarada pelo usuário.

### FACT-MEASURED

Informação medida.

### FACT-IMPORTED

Informação importada de fonte.

### CALCULATION

Resultado determinístico.

### AI-INFERENCE

Inferência da IA.

### AI-HYPOTHESIS

Hipótese da IA.

### PROFESSIONAL-REVIEWED

Conteúdo revisado por profissional.

### SYSTEM-GENERATED

Conteúdo gerado por regra do sistema.

---

## 7. Linguagem

A linguagem deve ser:

- simples;
- proporcional ao risco;
- direta;
- não alarmista;
- não enganosa;
- não excessivamente técnica;
- compatível com o contexto;
- acessível.

Evitar:

- certeza indevida;
- autoridade artificial;
- jargão sem explicação;
- termos absolutos;
- linguagem que imite diagnóstico;
- ocultação de incerteza.

---

## 8. Comunicação de incerteza

Quando houver incerteza, o sistema deve informar:

- que existe incerteza;
- por que existe;
- quais dados faltam;
- qual é o nível de confiança;
- o que poderia confirmar;
- qual ação segura é recomendada.

---

## 9. Níveis de confiança

Escala proposta:

- HIGH;
- MEDIUM;
- LOW;
- UNKNOWN.

A confiança deve se referir à robustez da informação ou inferência, não à certeza médica.

---

## 10. Explicação de resultado

A explicação deve responder, quando aplicável:

1. O que foi concluído?
2. Quais dados foram usados?
3. Quais dados não foram usados?
4. Quais fontes sustentam?
5. O que é inferência?
6. Qual é a confiança?
7. Quais limitações existem?
8. Como corrigir?
9. Como contestar?
10. Quando buscar ajuda humana?

---

## 11. Explicação do Perfil de Inteligência

O Perfil de Inteligência deve separar:

- dados confirmados;
- dados declarados;
- tendências;
- padrões;
- hipóteses;
- lacunas;
- recomendações;
- alertas;
- fontes;
- limitações.

Cada seção deve permitir correção ou contestação.

---

## 12. Explicação de recomendações

Toda recomendação deve indicar:

- objetivo;
- dados considerados;
- premissas;
- limites;
- alternativas;
- riscos;
- necessidade de validação profissional;
- validade temporal.

---

## 13. Explicação de alertas

Alertas devem informar:

- o motivo;
- o nível;
- o dado que acionou;
- se foi regra ou IA;
- o que fazer;
- quando escalar;
- como contestar.

---

## 14. Explicação de scores

Scores devem informar:

- finalidade;
- composição;
- escala;
- significado;
- limitações;
- atualização;
- impacto;
- como corrigir dados de origem.

Não usar score sem explicação adequada.

---

## 15. Fontes e citações

Quando houver fonte:

- deve existir;
- deve sustentar a afirmação;
- deve estar ativa;
- deve ter versão;
- deve ser rastreável;
- deve ser compreensível.

A IA não deve inventar fontes.

---

## 16. Ausência de fonte

Quando uma afirmação não possuir fonte externa:

- informar que é inferência;
- não apresentá-la como fato;
- mostrar dados internos considerados;
- reduzir força da linguagem.

---

## 17. Dados utilizados

O usuário deve poder entender, em nível adequado:

- quais categorias de dados foram usadas;
- quando foram coletadas;
- se estavam atualizadas;
- se vieram de documento;
- se foram inferidas;
- se foram memorizadas;
- se foram compartilhadas com fornecedor.

---

## 18. Dados não utilizados

Quando relevante, informar que determinados dados:

- não foram considerados;
- estavam expirados;
- estavam conflitantes;
- não eram confiáveis;
- não eram autorizados;
- não eram necessários.

---

## 19. Controle de memória

O usuário deve poder:

- visualizar memórias relevantes;
- saber por que foram salvas;
- corrigir;
- desativar;
- excluir;
- contestar;
- limitar categorias;
- impedir novas memórias quando aplicável.

---

## 20. Painel de memória

O painel deve mostrar:

- memória;
- categoria;
- origem;
- data;
- finalidade;
- confiança;
- expiração;
- status;
- ação disponível.

---

## 21. Memória sugerida

Quando o sistema sugerir guardar uma memória:

- explicar o benefício;
- mostrar o conteúdo;
- permitir aceitar;
- permitir editar;
- permitir rejeitar;
- não penalizar a rejeição.

---

## 22. Correção

Correções devem:

- ser simples;
- propagar para dados derivados;
- atualizar versões;
- reavaliar resultados;
- gerar trilha de auditoria;
- evitar reutilização da informação incorreta.

---

## 23. Contestação

O usuário deve poder contestar:

- inferência;
- hipótese;
- memória;
- score;
- resumo;
- recomendação;
- alerta;
- classificação.

A contestação deve gerar:

- registro;
- status;
- revisão;
- resposta;
- correção quando necessária;
- reavaliação de impacto.

---

## 24. Estados da contestação

- submitted;
- acknowledged;
- under_review;
- corrected;
- upheld;
- partially_upheld;
- rejected_with_reason;
- escalated;
- closed.

---

## 25. Revisão humana

Oferecer revisão humana quando:

- o risco for alto;
- houver impacto significativo;
- o usuário contestar;
- a confiança for baixa;
- existirem dados conflitantes;
- houver impacto clínico;
- a IA não puder explicar adequadamente.

---

## 26. Registro da revisão

A revisão deve registrar:

- reviewer_id;
- escopo;
- data;
- decisão;
- justificativa;
- alterações;
- limitações;
- validade.

---

## 27. Preferências do usuário

Permitir controlar:

- memória;
- personalização;
- comunicações;
- linguagem;
- nível de detalhe;
- explicações;
- compartilhamento;
- revisão humana;
- uso de dados quando aplicável.

---

## 28. Consentimento contextual

Quando necessário, o consentimento deve ser:

- específico;
- informado;
- granular;
- revogável;
- registrado;
- não coercitivo;
- compreensível.

---

## 29. Revogação

Ao revogar:

- parar o uso futuro;
- atualizar preferências;
- avaliar exclusão;
- propagar restrições;
- registrar a mudança;
- informar consequências funcionais.

---

## 30. Transparência sobre fornecedores

Quando adequado, informar:

- que um fornecedor de IA é utilizado;
- quais categorias de dados são enviadas;
- finalidade;
- retenção;
- região;
- limitações;
- controles.

---

## 31. Transparência sobre automação

Quando a IA influenciar uma ação:

- indicar que houve automação;
- permitir revisão;
- registrar a decisão;
- evitar ação irreversível sem confirmação;
- oferecer cancelamento quando possível.

---

## 32. Ações de alto impacto

Ações que possam afetar:

- saúde;
- atendimento;
- acesso;
- conta;
- dados;
- cobrança;
- segurança;
- profissional;

devem exigir controles adicionais e, quando necessário, revisão humana.

---

## 33. Dark patterns

É proibido:

- esconder opção de recusa;
- dificultar exclusão;
- pressionar consentimento;
- usar linguagem ambígua;
- preselecionar opções sensíveis;
- sugerir que IA é obrigatória;
- usar medo para induzir ação.

---

## 34. Transparência progressiva

Não sobrecarregar o usuário.

A interface deve oferecer:

- resumo imediato;
- detalhes sob demanda;
- fontes;
- histórico;
- explicação técnica quando necessário.

---

## 35. Acessibilidade

Explicações devem considerar:

- leitura simples;
- contraste;
- navegação;
- leitores de tela;
- linguagem inclusiva;
- estrutura clara;
- tradução quando disponível;
- alternativas não visuais.

---

## 36. Histórico de alterações

O usuário deve poder saber, quando relevante:

- que o resultado mudou;
- por que mudou;
- quais dados foram corrigidos;
- qual versão gerou;
- se houve revisão humana.

---

## 37. Explicação de versão

Resultados persistentes devem registrar:

- output_id;
- prompt_version;
- model_version;
- data;
- dados de origem;
- status;
- revisão;
- substituição.

---

## 38. Feedback

O usuário deve poder indicar:

- útil;
- não útil;
- incorreto;
- desatualizado;
- inseguro;
- ofensivo;
- não compreendido;
- outra questão.

---

## 39. Uso do feedback

O feedback deve:

- ter finalidade;
- ser triado;
- alimentar melhoria;
- gerar incidente quando necessário;
- respeitar privacidade;
- evitar reutilização indevida.

---

## 40. Explicação para profissionais

Profissionais autorizados podem receber maior detalhe sobre:

- dados;
- fontes;
- versões;
- confiança;
- limitações;
- alertas;
- histórico;
- revisão;
- mudanças.

---

## 41. Explicação técnica interna

A equipe deve poder consultar:

- execution_id;
- correlation_id;
- prompt;
- modelo;
- schema;
- guardrails;
- fontes;
- memória;
- flags;
- métricas;
- incidentes.

---

## 42. Limites da explicabilidade

O Higeia não deve afirmar que consegue explicar integralmente o raciocínio interno de modelos complexos.

A explicação deve se concentrar em:

- dados utilizados;
- regras;
- fontes;
- fatores relevantes;
- limitações;
- confiança;
- controles;
- processo.

---

## 43. Segurança da explicação

Não revelar:

- segredos;
- prompts protegidos integralmente;
- controles vulneráveis;
- credenciais;
- dados de terceiros;
- informações de outro usuário;
- detalhes que facilitem abuso.

---

## 44. Métricas

Monitorar:

- explanation open rate;
- correction rate;
- dispute rate;
- memory deletion rate;
- user comprehension;
- human review rate;
- unresolved disputes;
- source click rate;
- feedback rate;
- explanation-related incidents.

---

## 45. Testes

Testar:

- entendimento;
- acessibilidade;
- correção;
- contestação;
- memória;
- fonte;
- incerteza;
- linguagem;
- fluxo de revisão;
- propagação de correção.

---

## 46. Gates antes do Alpha

- [ ] conteúdo de IA identificado;
- [ ] fatos e inferências separados;
- [ ] confiança exibida quando necessária;
- [ ] fontes rastreáveis;
- [ ] limitações apresentadas;
- [ ] correção disponível;
- [ ] contestação disponível;
- [ ] painel de memória definido;
- [ ] exclusão de memória testada;
- [ ] revisão humana definida;
- [ ] feedback estruturado;
- [ ] linguagem revisada;
- [ ] acessibilidade testada;
- [ ] histórico de versão disponível.

---

## 47. Responsabilidades

### Product

Define experiência e linguagem.

### UX

Projeta transparência e controle.

### AI Owner

Define explicações técnicas e limitações.

### Engineering

Implementa controles, histórico e propagação.

### Privacy

Valida consentimento, direitos e transparência.

### Safety

Valida comunicação de risco.

### Clinical Reviewer

Valida linguagem clínica.

### Support

Opera correções e contestações.

---

## 48. Questões abertas

1. Como será o painel de memória?
2. Quais explicações entram no MVP?
3. Qual escala de confiança?
4. Como mostrar fontes?
5. Como contestar?
6. Qual SLA de revisão?
7. Quais fluxos exigem humano?
8. Como versionar resultados?
9. Como evitar sobrecarga?
10. Quais preferências serão controláveis?
11. Como registrar revogação?
12. Como medir compreensão?

---

## 49. Histórico

| Versão | Data | Alteração |
|---|---|---|
| 0.1 | 19/07/2026 | Criação da estrutura inicial de explicabilidade, transparência e controle. |
