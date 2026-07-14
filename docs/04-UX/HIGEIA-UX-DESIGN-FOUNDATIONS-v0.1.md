# Higeia — UX Principles and Design System Foundations

**Documento:** Higeia UX Principles and Design System Foundations  
**Versão:** 0.1  
**Status:** Rascunho oficial de UX  
**Data:** 13 de julho de 2026  
**Projeto interno:** Projeto Eros  
**Produto:** Higeia  
**Fundador:** Clovis Sadlowski  

---

## 1. Objetivo

Definir os princípios de experiência do usuário e as fundações do futuro design system do Higeia.

Este documento orienta:

- hierarquia visual;
- acessibilidade;
- tom da interface;
- componentes;
- estados;
- formulários;
- relatórios;
- confiança;
- explicabilidade;
- feedback;
- mobile-first;
- consistência entre telas.

---

## 2. Princípios de UX

1. Clareza antes de sofisticação.
2. Confiança antes de encantamento.
3. Uma ação principal por tela.
4. Explicar o porquê de perguntas sensíveis.
5. Mostrar progresso.
6. Reduzir ansiedade.
7. Não punir o usuário.
8. Diferenciar fato, hipótese e lacuna.
9. Permitir correção.
10. Projetar para uso mobile.
11. Tratar estados de erro como parte do produto.
12. Evitar sobrecarga cognitiva.

---

## 3. Personalidade da interface

A interface deve transmitir:

- inteligência;
- serenidade;
- confiança;
- acolhimento;
- rigor;
- simplicidade.

A interface não deve parecer:

- hospitalar;
- infantil;
- excessivamente fitness;
- alarmista;
- fria;
- motivacional demais;
- mística;
- gamificada de forma agressiva.

---

## 4. Linguagem visual

## Direção

- limpa;
- contemporânea;
- leve;
- sóbria;
- humana;
- premium;
- funcional.

## Evitar

- excesso de gradientes;
- excesso de sombras;
- ilustrações caricatas;
- ícones ambíguos;
- cores de alerta usadas decorativamente;
- gráficos sem explicação;
- dados em excesso.

---

## 5. Hierarquia

Cada tela deve responder:

1. Onde estou?
2. O que preciso entender?
3. Qual é a ação principal?
4. O que acontece depois?

## Estrutura padrão

- título;
- contexto;
- conteúdo principal;
- evidência ou detalhe;
- ação principal;
- ação secundária;
- ajuda.

---

## 6. Mobile-first

Regras:

- conteúdo principal antes de navegação secundária;
- botões com área de toque adequada;
- texto legível;
- formulários simples;
- evitar tabelas largas;
- cards empilhados;
- detalhes sob demanda;
- barra inferior para ações frequentes.

---

## 7. Acessibilidade

## Requisitos mínimos

- contraste adequado;
- navegação por teclado;
- foco visível;
- labels;
- mensagens de erro claras;
- texto alternativo;
- sem dependência apenas de cor;
- suporte a zoom;
- linguagem simples;
- ordem lógica.

## Meta

Seguir WCAG 2.2 nível AA como referência.

---

## 8. Tipografia

## Princípios

- alta legibilidade;
- boa leitura em telas pequenas;
- poucos estilos;
- hierarquia consistente.

## Escala inicial

- Display;
- H1;
- H2;
- H3;
- Body;
- Small;
- Caption;
- Label.

## Regras

- evitar textos muito claros;
- limitar largura de leitura;
- usar negrito com moderação;
- não usar caixa alta em textos longos.

---

## 9. Cores

A paleta definitiva será definida no Brand Book.

## Categorias funcionais

- background;
- surface;
- text-primary;
- text-secondary;
- border;
- action-primary;
- action-secondary;
- success;
- warning;
- danger;
- information;
- neutral.

## Regra

Cores funcionais devem possuir significado consistente.

---

## 10. Espaçamento

Usar escala consistente.

Sugestão:

```text
4
8
12
16
24
32
48
64
```

Evitar valores aleatórios.

---

## 11. Bordas e elevação

## Bordas

- discretas;
- consistentes;
- maior raio em cards;
- menor raio em campos.

## Sombras

- leves;
- apenas para hierarquia;
- não como decoração principal.

---

## 12. Ícones

Regras:

- simples;
- consistentes;
- acompanhados de texto quando ambíguos;
- não usar emojis como padrão de interface;
- estados críticos precisam de texto.

---

## 13. Botões

Tipos:

- primário;
- secundário;
- terciário;
- destrutivo;
- link.

Estados:

- default;
- hover;
- focus;
- pressed;
- disabled;
- loading.

Regra:

Uma tela deve ter uma ação primária clara.

---

## 14. Formulários

## Princípios

- uma pergunta por vez quando possível;
- agrupamento lógico;
- labels visíveis;
- ajuda sob demanda;
- validação próxima ao campo;
- salvar automaticamente;
- progressão clara.

## Erros

- explicar o problema;
- indicar correção;
- preservar respostas;
- não culpar.

---

## 15. Anamnese

## Padrão

- título do bloco;
- explicação;
- progresso;
- pergunta;
- resposta;
- ajuda;
- continuar;
- salvar e sair.

## Sensibilidade

Perguntas sensíveis devem mostrar:

- por que são feitas;
- como serão usadas;
- se são opcionais;
- como os dados são protegidos.

---

## 16. Progress bar

Deve:

- refletir progresso real;
- não regredir sem explicação;
- indicar blocos;
- mostrar possibilidade de pausa.

Evitar:

- percentuais falsos;
- animação enganosa;
- progresso indefinido em tarefas curtas.

---

## 17. Cards

Tipos:

- insight;
- hipótese;
- evidência;
- ponto forte;
- barreira;
- timeline;
- safety;
- empty state.

Cada card deve possuir:

- título;
- resumo;
- contexto;
- status;
- ação quando aplicável.

---

## 18. Hipótese Card

Campos:

- título;
- formulação;
- confiança qualitativa;
- evidências;
- lacunas;
- próximo aspecto;
- status.

Regra:

Nunca parecer diagnóstico.

---

## 19. Evidence Card

Campos:

- tipo;
- origem;
- data;
- relação;
- limitação.

Regra:

Origem deve ser visível.

---

## 20. Confidence Badge

Valores:

- baixa;
- moderada;
- alta;
- dados insuficientes.

Regras:

- não usar vermelho para baixa confiança;
- explicar significado;
- não exibir percentual no MVP.

---

## 21. Safety Banner

Tipos:

- informação;
- cautela;
- redirecionamento;
- urgência.

Conteúdo:

- mensagem;
- limite;
- ação;
- contato quando aplicável.

Regra:

Não esconder em modal secundário.

---

## 22. Empty States

Devem explicar:

- por que não há conteúdo;
- o que será mostrado;
- qual o próximo passo.

Exemplo:

> Ainda não há histórico suficiente para identificar uma trajetória. Complete seu primeiro check-in.

---

## 23. Loading States

Usar:

- skeleton;
- progresso real;
- mensagem clara.

Evitar:

- spinner sem contexto;
- simulação de “pensamento”;
- etapas falsas.

---

## 24. Error States

Devem conter:

- o que aconteceu;
- se os dados foram salvos;
- o que fazer;
- suporte;
- correlation ID quando necessário.

---

## 25. Offline

Quando possível:

- salvar localmente;
- informar status;
- sincronizar depois;
- evitar perda.

---

## 26. Dashboard

## Prioridades

1. próximo passo;
2. resumo atual;
3. mudanças;
4. fatores em observação;
5. histórico;
6. assistente.

## Regra

Não mostrar gráficos vazios ou sem contexto.

---

## 27. Perfil de Inteligência

## Estrutura visual

- resumo executivo;
- pontos fortes;
- barreiras;
- fatores;
- hipóteses;
- lacunas;
- próximos aspectos;
- feedback.

## Padrão

Resumo primeiro, detalhes depois.

---

## 28. Timeline

Cada evento deve mostrar:

- data;
- tipo;
- resumo;
- origem;
- impacto;
- ação de detalhe.

Filtros simples.

---

## 29. Assistente

## Interface

- histórico;
- campo;
- atalhos;
- aviso de escopo;
- reportar resposta.

## Regras

- não simular digitação excessiva;
- não fingir emoção;
- mostrar limite;
- destacar redirecionamentos;
- permitir correção.

---

## 30. Microcopy

## Tom

- claro;
- respeitoso;
- acolhedor;
- objetivo;
- não técnico.

## Exemplos

Em vez de:
> Falha na adesão.

Usar:
> Sua consistência foi menor nesta semana.

Em vez de:
> Você está atrasado.

Usar:
> Seu check-in está disponível.

---

## 31. Linguagem proibida

- “Você falhou.”
- “Você não tem disciplina.”
- “Seu problema é...”
- “A causa é...”
- “Garantido.”
- “Perfeito.”
- “Certo ou errado.”
- “Você precisa fazer isso.”

---

## 32. Notificações

Devem ser:

- úteis;
- opcionais;
- curtas;
- não punitivas;
- com ação clara.

Evitar:

- urgência artificial;
- culpa;
- sequência como pressão;
- medo de perder progresso.

---

## 33. Feedback

O usuário deve poder:

- concordar;
- discordar;
- corrigir;
- comentar;
- reportar;
- pedir explicação.

Feedback deve ser contextual.

---

## 34. Privacidade na interface

Mostrar:

- por que coletamos;
- como usamos;
- como corrigir;
- como excluir;
- como revogar.

Evitar:

- caixas pré-marcadas;
- linguagem jurídica isolada;
- padrões obscuros;
- dificultar saída.

---

## 35. Componentes iniciais

- Button;
- Input;
- Textarea;
- Select;
- Radio;
- Checkbox;
- Slider;
- ProgressBar;
- Card;
- InsightCard;
- HypothesisCard;
- EvidenceCard;
- SafetyBanner;
- EmptyState;
- Modal;
- Drawer;
- Tooltip;
- Tabs;
- TimelineItem;
- Badge;
- Toast;
- Skeleton.

---

## 36. Design tokens

Categorias:

- color;
- typography;
- spacing;
- radius;
- shadow;
- motion;
- breakpoint;
- z-index.

Devem ser centralizados.

---

## 37. Breakpoints

Sugestão:

```text
sm: 640px
md: 768px
lg: 1024px
xl: 1280px
```

---

## 38. Motion

Princípios:

- discreto;
- funcional;
- rápido;
- respeitar reduced motion.

Usos:

- transições;
- progresso;
- feedback;
- expansão.

Evitar:

- animações longas;
- distração;
- gamificação excessiva.

---

## 39. Conteúdo adaptativo

O nível de detalhe pode variar.

## Resumo

Para leitura rápida.

## Detalhe

Para aprofundamento.

## Regra

Não esconder informação crítica.

---

## 40. Confiança

A interface deve mostrar confiança por:

- clareza;
- consistência;
- origem;
- limites;
- explicação;
- controle;
- privacidade.

Não por:

- excesso de tecnicidade;
- números artificiais;
- autoridade simulada.

---

## 41. Estados de dados

Exibir:

- confirmado;
- declarado;
- inferido;
- hipótese;
- contestado;
- desatualizado;
- dados insuficientes.

---

## 42. UX Writing

Cada texto deve responder:

- o usuário entende?
- sabe o que fazer?
- sabe por que?
- sabe o que acontece depois?
- entende os limites?

---

## 43. Testes de usabilidade

Cenários:

- cadastro;
- consentimento;
- anamnese;
- pausa;
- retomada;
- perfil;
- hipótese;
- correção;
- check-in;
- exclusão.

Métricas:

- sucesso;
- tempo;
- erro;
- compreensão;
- confiança;
- esforço percebido.

---

## 44. Critérios de aceite

Este documento estará pronto quando:

- princípios estiverem definidos;
- hierarquia estiver definida;
- mobile-first estiver definido;
- acessibilidade estiver incorporada;
- componentes iniciais estiverem listados;
- estados estiverem documentados;
- linguagem estiver definida;
- confiança estiver incorporada;
- privacidade estiver visível;
- testes estiverem previstos.

---

## 45. Riscos

1. Interface parecer clínica demais.
2. Interface parecer superficial.
3. Excesso de cards.
4. Texto excessivo.
5. Hipóteses confundidas com fatos.
6. Alertas ignorados.
7. Baixa acessibilidade.
8. Mobile sobrecarregado.
9. Notificações invasivas.
10. Design inconsistente.

---

## 46. Mitigações

- sistema de componentes;
- design tokens;
- testes;
- linguagem padronizada;
- hierarquia;
- estados;
- acessibilidade;
- feedback;
- revisão;
- documentação.

---

## 47. Questões abertas

1. Qual identidade visual?
2. Quais cores?
3. Qual tipografia?
4. Qual biblioteca de componentes?
5. Usar shadcn/ui?
6. Usar Radix?
7. Como representar hipóteses?
8. Como representar confiança?
9. Como mostrar progresso?
10. Como criar wireframes?
11. Qual ferramenta de protótipo?
12. Quando iniciar Figma?

---

## 48. Próximo documento

O próximo documento será:

> Higeia Brand Foundations v0.1.

Ele definirá:

- essência da marca;
- posicionamento;
- promessa;
- personalidade;
- naming;
- arquitetura de marca;
- mensagens;
- voz;
- identidade visual inicial.

---

## 49. Histórico

| Versão | Data | Alteração |
|---|---|---|
| 0.1 | 13/07/2026 | Primeira fundação de UX e design system do Higeia. |
