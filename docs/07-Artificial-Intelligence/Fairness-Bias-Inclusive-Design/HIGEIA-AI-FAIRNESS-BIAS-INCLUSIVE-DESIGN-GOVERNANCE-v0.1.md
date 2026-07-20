# Higeia — AI Fairness, Bias and Inclusive Design Governance

**Documento:** Higeia AI Fairness, Bias and Inclusive Design Governance  
**Versão:** 0.1  
**Status:** Estrutura inicial oficial  
**Data:** 19 de julho de 2026  
**Projeto interno:** Projeto Eros  
**Produto:** Higeia  
**Fundador:** Clovis Sadlowski  

---

## 1. Objetivo

Definir como o Higeia identificará, avaliará, reduzirá, monitorará e documentará riscos de viés, tratamento desigual e exclusão em funcionalidades de inteligência artificial.

Este framework estabelece requisitos para:

- fairness;
- viés;
- representatividade;
- desempenho entre grupos;
- linguagem inclusiva;
- acessibilidade;
- letramento em saúde;
- inclusão digital;
- design inclusivo;
- contestação;
- revisão humana;
- monitoramento;
- documentação;
- limites éticos.

---

## 2. Princípio central

O Higeia não deve oferecer qualidade, segurança ou oportunidade de uso significativamente inferior a determinados usuários sem justificativa legítima, proporcional e documentada.

Ao mesmo tempo, o sistema não deve:

- inferir atributos sensíveis sem necessidade;
- criar perfis discriminatórios;
- usar proxies indevidos;
- reforçar estereótipos;
- tratar diferenças clínicas legítimas como discriminação;
- tratar igualdade absoluta como objetivo quando o contexto exige adaptação segura.

---

## 3. Escopo

Aplica-se a:

- anamnese;
- Perfil de Inteligência;
- recomendações;
- classificação de risco;
- safety;
- alertas;
- memória;
- linguagem;
- conteúdo;
- RAG;
- modelos;
- prompts;
- datasets;
- profissionais;
- interfaces;
- notificações;
- suporte;
- automações;
- acessibilidade.

---

## 4. Conceitos

### Fairness

Tratamento adequado, justificável e não arbitrariamente desigual.

### Bias

Padrão sistemático que produz distorção, exclusão ou desempenho desigual.

### Inclusion

Capacidade de diferentes pessoas compreenderem, acessarem e usarem o produto.

### Accessibility

Uso por pessoas com diferentes capacidades físicas, sensoriais, cognitivas ou tecnológicas.

### Representativeness

Cobertura suficiente da diversidade relevante nos testes e dados.

---

## 5. Dimensões de análise

Quando legítimo e autorizado, avaliar diferenças relacionadas a:

- idade;
- sexo biológico quando clinicamente relevante;
- identidade de gênero quando necessária e apropriada;
- região;
- idioma;
- nível de letramento;
- condição socioeconômica;
- deficiência;
- acesso digital;
- conectividade;
- dispositivo;
- raça e etnia somente quando houver fundamento e controle apropriado;
- gestação;
- condições clínicas;
- hábitos;
- contexto cultural;
- disponibilidade de alimentos;
- rotina de trabalho.

---

## 6. Atributos sensíveis

Atributos sensíveis não devem ser coletados ou inferidos apenas para produzir estatísticas.

Antes de utilizá-los, verificar:

- finalidade;
- necessidade;
- base aplicável;
- minimização;
- segurança;
- transparência;
- risco;
- possibilidade de alternativa;
- aprovação.

---

## 7. Proxies

Dados aparentemente neutros podem funcionar como proxies.

Exemplos:

- CEP;
- tipo de aparelho;
- padrão de escrita;
- horário de acesso;
- renda estimada;
- localização;
- profissão;
- nível educacional;
- histórico de compras.

O uso de proxies deve ser avaliado quando influenciar recomendações ou acesso.

---

## 8. Diferença legítima versus injustificada

Uma diferença pode ser legítima quando:

- clinicamente necessária;
- baseada em evidência;
- proporcional ao risco;
- transparente;
- revisável;
- não estereotipada;
- limitada à finalidade.

Uma diferença pode ser injustificada quando:

- não possui evidência;
- usa atributo irrelevante;
- reduz qualidade sem razão;
- bloqueia acesso;
- aumenta risco;
- reforça estereótipos;
- decorre de baixa representação.

---

## 9. Fontes de viés

Possíveis fontes:

- dataset;
- prompt;
- modelo;
- conhecimento;
- rotulagem;
- schema;
- interface;
- tradução;
- regra;
- threshold;
- memória;
- feedback;
- revisor;
- fornecedor;
- distribuição de usuários;
- condições de uso.

---

## 10. Viés de dados

Pode ocorrer por:

- sub-representação;
- dados históricos;
- rotulagem inconsistente;
- qualidade desigual;
- ausência de contexto;
- viés de seleção;
- sobrevivência;
- exclusão digital;
- documentação clínica desigual.

---

## 11. Viés de modelo

Pode ocorrer quando o modelo:

- responde pior para determinados estilos de linguagem;
- interpreta incorretamente expressões regionais;
- associa atributos a estereótipos;
- apresenta segurança desigual;
- produz linguagem ofensiva;
- recusa de forma desproporcional;
- erra mais em determinados grupos.

---

## 12. Viés de produto

Pode ocorrer quando:

- a interface exige alto letramento;
- o fluxo depende de internet rápida;
- o conteúdo presume alta renda;
- a recomendação ignora disponibilidade local;
- o produto não funciona bem em celulares simples;
- formulários excluem realidades diversas;
- notificações não consideram acessibilidade.

---

## 13. Viés de automação

Pode ocorrer quando:

- a IA recebe autoridade excessiva;
- profissionais seguem a saída sem revisão;
- usuários não conseguem contestar;
- scores influenciam decisões;
- alertas geram tratamento desigual;
- recomendações se tornam obrigatórias.

---

## 14. Linguagem inclusiva

A linguagem deve:

- ser respeitosa;
- evitar estereótipos;
- evitar julgamento moral;
- evitar culpabilização;
- considerar diferentes níveis de compreensão;
- explicar termos técnicos;
- permitir adaptação;
- não infantilizar.

---

## 15. Letramento em saúde

O conteúdo deve poder ser compreendido por pessoas com diferentes níveis de conhecimento.

Práticas:

- frases curtas;
- termos simples;
- explicação de jargão;
- exemplos;
- passos claros;
- informação prioritária primeiro;
- confirmação de entendimento;
- recursos visuais acessíveis.

---

## 16. Inclusão socioeconômica

Recomendações devem considerar:

- custo;
- disponibilidade;
- tempo;
- transporte;
- acesso a alimentos;
- infraestrutura;
- equipamentos;
- rotina;
- dependentes;
- trabalho.

Evitar recomendações que presumam recursos elevados.

---

## 17. Inclusão regional e cultural

Considerar:

- alimentos locais;
- hábitos;
- linguagem;
- clima;
- acesso;
- serviços disponíveis;
- contexto cultural;
- unidades de medida;
- fuso e rotina.

Não transformar cultura em estereótipo.

---

## 18. Inclusão por dispositivo

O produto deve funcionar em:

- smartphones de entrada;
- telas menores;
- redes lentas;
- sessões interrompidas;
- baixo armazenamento;
- navegadores compatíveis.

---

## 19. Acessibilidade digital

Avaliar:

- teclado;
- leitores de tela;
- contraste;
- foco;
- tamanho de fonte;
- legendas;
- alternativas textuais;
- campos identificados;
- mensagens de erro;
- tempo de interação;
- linguagem;
- navegação.

---

## 20. Adaptação versus discriminação

Personalização é aceitável quando:

- melhora segurança;
- melhora compreensão;
- atende preferência;
- considera restrição legítima;
- é controlável;
- é transparente.

Não é aceitável quando:

- reduz opções sem razão;
- presume incapacidade;
- cria barreira;
- trata atributo como destino;
- reforça estereótipo.

---

## 21. Fairness por fluxo

Cada fluxo crítico deve declarar:

- usuários;
- grupos relevantes;
- risco;
- métrica;
- dataset;
- baseline;
- diferença aceitável;
- justificativa;
- mitigação;
- owner.

---

## 22. Métricas

Possíveis métricas:

- completion rate;
- error rate;
- schema pass rate;
- safety miss rate;
- false positive rate;
- false negative rate;
- human escalation rate;
- correction rate;
- dispute rate;
- satisfaction;
- comprehension;
- abandonment;
- latency;
- accessibility failure;
- recommendation feasibility.

---

## 23. Disparidade

Uma diferença entre grupos deve ser investigada quando:

- persistente;
- material;
- sem justificativa;
- relacionada a risco;
- acompanhada de dano;
- superior ao threshold definido.

---

## 24. Thresholds

Não existe um threshold universal.

Cada fluxo deve definir:

- métrica;
- referência;
- risco;
- tamanho mínimo;
- intervalo de confiança;
- limite;
- ação;
- revisão.

---

## 25. Tamanho de amostra

Não concluir injustiça com amostra insuficiente.

Registrar:

- tamanho;
- distribuição;
- incerteza;
- limitações;
- poder de análise;
- necessidade de mais dados.

---

## 26. Testes qualitativos

Além das métricas, realizar:

- revisão de respostas;
- sessões com usuários;
- entrevistas;
- testes de compreensão;
- análise linguística;
- casos adversariais;
- revisão por especialistas;
- avaliação de acessibilidade.

---

## 27. Testes adversariais

Testar:

- nomes;
- regionalismos;
- erros de escrita;
- baixa escolaridade;
- linguagem informal;
- condições raras;
- múltiplas limitações;
- dispositivos simples;
- conectividade baixa;
- ambiguidades;
- prompts estereotipados.

---

## 28. Counterfactual testing

Alterar apenas um atributo relevante e observar se a resposta muda sem justificativa.

Exemplo:

- mesma situação, nomes diferentes;
- mesma queixa, região diferente;
- mesmo objetivo, renda presumida diferente;
- mesma resposta, estilo de escrita diferente.

---

## 29. Testes de linguagem

Avaliar:

- respeito;
- clareza;
- julgamento;
- estigma;
- complexidade;
- regionalismo;
- ambiguidade;
- inclusão;
- tom;
- chamada à ação.

---

## 30. Testes de acessibilidade

Avaliar:

- leitores de tela;
- navegação por teclado;
- zoom;
- contraste;
- ordem de foco;
- formulários;
- erros;
- tempo;
- mobile;
- conexão lenta.

---

## 31. Datasets de fairness

Datasets devem:

- ter finalidade;
- ser versionados;
- usar dados sintéticos quando possível;
- representar casos relevantes;
- registrar limitações;
- evitar atributos desnecessários;
- ser aprovados;
- não reidentificar usuários.

---

## 32. Rotulagem

Rotuladores devem receber:

- instruções;
- exemplos;
- critérios;
- treinamento;
- revisão;
- mecanismo de discordância;
- controle de qualidade.

---

## 33. Diversidade de revisão

Quando possível, revisões devem incluir perspectivas diversas em:

- clínica;
- linguagem;
- acessibilidade;
- cultura;
- produto;
- segurança;
- usuários.

Não usar diversidade apenas como aparência documental.

---

## 34. Mitigações

Possíveis ações:

- melhorar dataset;
- ajustar prompt;
- revisar linguagem;
- corrigir threshold;
- criar adaptação;
- adicionar revisão humana;
- reduzir automação;
- melhorar interface;
- ampliar fontes;
- criar opção alternativa;
- limitar uso;
- bloquear release.

---

## 35. Risco de overcorrection

Mitigações não devem:

- apagar diferenças clínicas legítimas;
- reduzir segurança;
- criar regras rígidas;
- usar atributos de forma indevida;
- mascarar problemas;
- otimizar somente métrica.

---

## 36. Revisão humana

Revisão humana deve ser exigida quando:

- a disparidade puder gerar dano relevante;
- a IA não explicar a diferença;
- o fluxo for crítico;
- houver contestação recorrente;
- a amostra for pequena;
- a mitigação for incerta.

---

## 37. Contestação

Usuários devem poder relatar:

- linguagem ofensiva;
- recomendação inviável;
- estereótipo;
- tratamento desigual;
- falta de acessibilidade;
- incompreensão;
- recusa indevida.

---

## 38. Registro de achado

Cada achado deve conter:

- finding_id;
- fluxo;
- versão;
- grupo ou cenário;
- evidência;
- impacto;
- severidade;
- causa;
- mitigação;
- owner;
- prazo;
- status.

---

## 39. Severidade

### F0

Dano crítico ou exclusão grave.

### F1

Risco alto ou disparidade material.

### F2

Problema relevante.

### F3

Melhoria necessária.

### F4

Observação.

---

## 40. Monitoramento contínuo

Monitorar:

- métricas por fluxo;
- reclamações;
- correções;
- safety;
- acessibilidade;
- abandono;
- linguagem;
- mudanças de distribuição;
- versões;
- fornecedores.

---

## 41. Drift de fairness

Pode ocorrer quando:

- muda a população;
- muda o modelo;
- muda o prompt;
- muda a fonte;
- muda o produto;
- muda o comportamento;
- muda o fornecedor.

---

## 42. Privacy-preserving fairness

A análise deve evitar exposição desnecessária.

Práticas:

- agregação;
- pseudonimização;
- minimização;
- thresholds mínimos;
- acesso restrito;
- dados sintéticos;
- revisão de finalidade.

---

## 43. Transparência

Quando relevante, informar:

- que o sistema foi testado;
- limitações;
- grupos pouco representados;
- necessidade de revisão;
- opções alternativas;
- como reportar problema.

---

## 44. Documentação

Manter:

- plano de avaliação;
- datasets;
- métricas;
- resultados;
- limitações;
- decisões;
- achados;
- mitigação;
- aprovação;
- revisão.

---

## 45. Release gates

Bloquear release quando houver:

- disparidade crítica;
- linguagem discriminatória;
- safety desigual grave;
- falta de acessibilidade essencial;
- recomendação inviável recorrente;
- ausência de mitigação;
- ausência de owner;
- avaliação insuficiente.

---

## 46. Métricas operacionais

Monitorar:

- findings open;
- findings overdue;
- critical disparities;
- accessibility defects;
- fairness regressions;
- mitigation lead time;
- dispute rate;
- re-release rate;
- unresolved group differences.

---

## 47. Gates antes do Alpha

- [ ] fluxos críticos identificados;
- [ ] grupos e cenários relevantes definidos;
- [ ] datasets sintéticos criados;
- [ ] testes de linguagem realizados;
- [ ] testes de acessibilidade realizados;
- [ ] counterfactual tests realizados;
- [ ] métricas mínimas definidas;
- [ ] thresholds iniciais aprovados;
- [ ] achados registrados;
- [ ] mitigações implementadas;
- [ ] contestação disponível;
- [ ] revisão humana definida;
- [ ] limitações documentadas;
- [ ] owners definidos.

---

## 48. Responsabilidades

### Product

Define cenários e impacto.

### UX

Valida inclusão e acessibilidade.

### AI Owner

Avalia modelo, prompt e métricas.

### Data Owner

Avalia representatividade e qualidade.

### Clinical Reviewer

Distingue diferenças legítimas de viés.

### Privacy

Valida uso de atributos sensíveis.

### Safety

Avalia impacto de disparidades.

### Engineering

Implementa mitigação e monitoramento.

### Support

Recebe relatos e contestações.

---

## 49. Questões abertas

1. Quais grupos são relevantes no MVP?
2. Quais atributos podem ser usados?
3. Quais métricas por fluxo?
4. Quais thresholds?
5. Como testar letramento?
6. Como medir viabilidade econômica?
7. Quais padrões de acessibilidade?
8. Como tratar amostras pequenas?
9. Como monitorar drift?
10. Qual processo de contestação?
11. Quais revisores?
12. Qual periodicidade?

---

## 50. Histórico

| Versão | Data | Alteração |
|---|---|---|
| 0.1 | 19/07/2026 | Criação da governança inicial de fairness, viés e design inclusivo. |
