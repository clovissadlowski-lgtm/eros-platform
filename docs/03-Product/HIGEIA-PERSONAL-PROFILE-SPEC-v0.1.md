# Higeia — Especificação do Perfil de Inteligência Pessoal

**Documento:** Higeia Personal Intelligence Profile Specification  
**Versão:** 0.1  
**Status:** Rascunho funcional oficial  
**Data:** 13 de julho de 2026  
**Projeto interno:** Projeto Eros  
**Produto:** Higeia  
**Fundador:** Clovis Sadlowski  

---

## 1. Objetivo

Definir como o Higeia transforma os dados da anamnese adaptativa no primeiro entregável de valor ao usuário: o **Perfil de Inteligência Pessoal**.

Este documento especifica:

- finalidade;
- estrutura;
- tipos de informação;
- linguagem;
- regras de explicabilidade;
- critérios de geração;
- níveis de confiança;
- feedback;
- atualização longitudinal;
- critérios de qualidade;
- riscos;
- critérios de aceite.

---

## 2. Papel no produto

O Perfil de Inteligência Pessoal é o primeiro momento em que o usuário percebe valor real no Higeia.

Ele deve responder:

1. Quem sou eu neste momento?
2. O que está favorecendo minha evolução?
3. O que está dificultando?
4. Quais fatores parecem influenciar meus resultados?
5. O que ainda não sabemos?
6. O que deve ser observado nas próximas semanas?

---

## 3. Princípios

1. O perfil não é diagnóstico.
2. O perfil não é prescrição.
3. O perfil deve distinguir fato, relato, inferência e hipótese.
4. Toda hipótese deve estar ligada a evidências.
5. Toda limitação deve ser visível.
6. O perfil deve ser legível em poucos minutos.
7. O aprofundamento deve estar disponível sob demanda.
8. O usuário deve poder corrigir informações.
9. O perfil deve reconhecer pontos fortes, não apenas dificuldades.
10. O perfil deve evoluir com novos dados.

---

## 4. Estrutura macro

```text
Resumo Pessoal
  ↓
Objetivo Atual
  ↓
Pontos Fortes
  ↓
Barreiras
  ↓
Fatores de Influência
  ↓
Hipóteses Iniciais
  ↓
Evidências
  ↓
Lacunas
  ↓
Próximos Aspectos a Observar
  ↓
Feedback do Usuário
```

---

# 5. Seção 1 — Resumo Pessoal

## Objetivo
Apresentar uma narrativa curta e reconhecível.

## Estrutura
- situação atual;
- objetivo;
- contexto predominante;
- padrão geral;
- principal tensão;
- principal recurso.

## Exemplo

> Você demonstra boa capacidade de manter treinos quando sua rotina está organizada, mas sua alimentação tende a ficar mais instável em períodos de maior carga de trabalho. Seu principal objetivo é emagrecer com mais consistência, evitando estratégias muito restritivas.

## Regras
- máximo de 120 palavras;
- linguagem simples;
- sem julgamento;
- sem diagnóstico;
- sem afirmar causalidade;
- citar somente informações disponíveis.

---

# 6. Seção 2 — Objetivo Atual

## Conteúdo
- objetivo principal;
- importância percebida;
- prazo desejado;
- motivação declarada;
- expectativas;
- possíveis conflitos.

## Exemplo

**Objetivo principal:** emagrecimento.  
**Importância declarada:** 9/10.  
**Motivação:** sentir mais disposição e melhorar a relação com o próprio corpo.  
**Ponto de atenção:** prazo esperado pode ser mais curto do que o processo normalmente permite.

## Regra
Expectativas irreais devem ser apresentadas com cautela e sem desmotivar.

---

# 7. Seção 3 — Pontos Fortes

## Objetivo
Destacar recursos favoráveis.

## Possíveis categorias
- disciplina;
- consciência;
- apoio social;
- disponibilidade;
- experiência anterior;
- consistência no treino;
- abertura para mudança;
- capacidade de planejamento;
- autonomia;
- estabilidade de rotina.

## Regras
- usar evidências concretas;
- evitar elogios genéricos;
- limitar a 3–5 pontos;
- permitir aprofundamento.

## Exemplo

### Consistência com atividade física
Você relata treinar 3 vezes por semana com regularidade.

### Clareza sobre dificuldades
Você identifica falta de tempo e refeições fora de casa como barreiras recorrentes.

---

# 8. Seção 4 — Barreiras

## Objetivo
Mostrar fatores que dificultam consistência.

## Tipos
- práticas;
- comportamentais;
- contextuais;
- ambientais;
- emocionais percebidas;
- financeiras;
- sociais;
- relacionadas à rotina.

## Regras
- não rotular personalidade;
- não culpabilizar;
- diferenciar barreira atual de padrão recorrente;
- apresentar evidências;
- limitar a 3–5 prioridades.

## Exemplo

### Baixa preparação alimentar
Você informou pouco tempo para cozinhar e consumo frequente de refeições prontas em dias de trabalho intenso.

---

# 9. Seção 5 — Fatores de Influência

## Objetivo
Organizar dimensões que parecem influenciar a evolução.

## Dimensões iniciais
- alimentação;
- sono;
- atividade física;
- rotina;
- estresse percebido;
- ambiente;
- apoio social;
- histórico;
- preferências;
- recursos.

## Representação
Cada fator pode ser classificado como:

- favorável;
- desfavorável;
- variável;
- ainda desconhecido.

## Regra
Não usar pontuação arbitrária de 0 a 100 no MVP.

---

# 10. Seção 6 — Hipóteses Iniciais

## Objetivo
Apresentar explicações provisórias.

## Estrutura de cada hipótese

### Título
Descrição curta.

### Formulação
Frase com linguagem probabilística.

### Evidências favoráveis
Dados que sustentam.

### Evidências contrárias
Dados que enfraquecem.

### Dados ausentes
O que falta saber.

### Confiança qualitativa
- baixa;
- moderada;
- alta;
- insuficiente.

### Próximo passo
O que observar.

## Exemplo

### Hipótese: sobrecarga de rotina pode reduzir consistência alimentar

**Formulação:** sua rotina profissional parece estar associada a maior dificuldade de organização alimentar.

**Evidências favoráveis:**
- pouco tempo para cozinhar;
- refeições fora de casa em dias longos;
- histórico de maior dificuldade durante semanas intensas.

**Evidências contrárias:**
- você mantém treinos mesmo em semanas ocupadas.

**Dados ausentes:**
- padrão real ao longo de várias semanas.

**Confiança:** moderada.

**Próximo passo:** observar relação entre carga de trabalho e refeições improvisadas nos próximos check-ins.

---

# 11. Seção 7 — Evidências

## Objetivo
Dar transparência.

## Tipos
- autorrelato;
- dado estruturado;
- histórico;
- comparação;
- contradição;
- ausência;
- evento;
- observação futura.

## Regras
- mostrar origem;
- mostrar data quando relevante;
- não esconder conflitos;
- permitir abrir detalhes.

---

# 12. Seção 8 — Lacunas

## Objetivo
Mostrar o que ainda não é conhecido.

## Exemplos
- poucas informações sobre finais de semana;
- sono relatado sem histórico;
- ausência de medidas;
- sem dados sobre fome;
- sem acompanhamento temporal.

## Regra
A ausência de dados deve reduzir a confiança.

---

# 13. Seção 9 — Próximos Aspectos a Observar

## Objetivo
Preparar acompanhamento.

## Exemplos
- relação entre sono e fome;
- consistência alimentar em dias de trabalho intenso;
- alimentação aos finais de semana;
- efeito de preparação antecipada;
- mudanças de energia.

## Limite
Não apresentar como prescrição.

---

# 14. Seção 10 — Avisos de Segurança

## Objetivo
Deixar limites claros.

## Conteúdo padrão

> Este perfil é uma interpretação inicial baseada nas informações fornecidas. Ele não substitui avaliação profissional, diagnóstico ou prescrição.

## Avisos específicos
Podem aparecer quando houver:

- possível transtorno alimentar;
- sintomas relevantes;
- gravidez;
- medicação;
- condição médica;
- dor ou limitação;
- menor de idade;
- sofrimento emocional importante.

---

# 15. Seção 11 — Feedback do Usuário

## Perguntas

### F1
Quanto este perfil representa sua realidade?
- 0–10.

### F2
O que mais fez sentido?
- texto.

### F3
O que não representa você?
- texto.

### F4
Há algo importante que ficou de fora?
- texto.

### F5
Este perfil ajudou você a se compreender melhor?
- sim;
- parcialmente;
- não.

## Ações
- corrigir;
- contestar hipótese;
- adicionar contexto;
- reportar preocupação.

---

# 16. Tipos de informação

## Fato declarado
Exemplo:
> Você informou dormir cerca de 6 horas.

## Dado estruturado
Exemplo:
> Peso registrado: 82 kg.

## Inferência
Exemplo:
> Sua rotina parece limitar o tempo disponível para preparo alimentar.

## Hipótese
Exemplo:
> A baixa preparação pode contribuir para maior consumo de refeições prontas.

## Lacuna
Exemplo:
> Ainda não existem dados suficientes sobre finais de semana.

## Recomendação de investigação
Exemplo:
> Observe se semanas de maior trabalho coincidem com maior dificuldade alimentar.

---

# 17. Regras de linguagem

## Usar

- “pode estar relacionado”;
- “parece indicar”;
- “com base nas informações disponíveis”;
- “ainda não há dados suficientes”;
- “vale observar”;
- “você relatou”.

## Evitar

- “a causa é”;
- “você tem”;
- “isso prova”;
- “você deve”;
- “o problema é”;
- “certamente”;
- “sempre”;
- “nunca”.

---

# 18. Confiança

## Modelo inicial
Qualitativo:

- baixa;
- moderada;
- alta;
- dados insuficientes.

## Critérios conceituais
- quantidade de fontes;
- consistência;
- recência;
- duração;
- contradições;
- qualidade;
- relevância;
- histórico.

## Regra
Não usar percentual no MVP.

---

# 19. Geração

## Pré-condições

- anamnese mínima concluída;
- consentimento válido;
- dados essenciais presentes;
- nenhum bloqueio crítico;
- serviço disponível.

## Pipeline conceitual

```text
Dados
  ↓
Validação
  ↓
Classificação
  ↓
Contextualização
  ↓
Hipóteses
  ↓
Evidências
  ↓
Lacunas
  ↓
Narrativa
  ↓
Safety Check
  ↓
Perfil
```

---

# 20. Regras de qualidade

O perfil deve:

- usar apenas dados disponíveis;
- citar origem;
- reconhecer incerteza;
- evitar repetição;
- não gerar diagnóstico;
- não inventar detalhes;
- não usar linguagem alarmista;
- incluir pontos fortes;
- ser compreensível;
- ser revisável;
- permitir feedback.

---

# 21. Estados da tela

## Gerado
Perfil disponível.

## Dados insuficientes
Explicar o que falta.

## Processando
Mostrar progresso.

## Falha
Permitir tentar novamente.

## Perfil desatualizado
Informar que novos dados aguardam processamento.

## Segurança
Exibir orientação adequada.

## Contestação
Mostrar hipótese em revisão.

---

# 22. Atualização longitudinal

O perfil poderá ser atualizado após:

- check-in;
- correção;
- novo evento;
- nova medida;
- nova informação;
- feedback;
- mudança relevante.

## Tipos de atualização
- reforçar;
- enfraquecer;
- arquivar;
- corrigir;
- adicionar;
- remover;
- marcar inconclusivo.

## Regra
Toda mudança relevante deve mostrar:
- o que mudou;
- por quê;
- quais dados foram usados.

---

# 23. Versionamento

Cada perfil deverá registrar:

- versão;
- data;
- versão do HIE;
- versão do prompt;
- versão do modelo;
- dados utilizados;
- hipóteses;
- safety flags;
- feedback.

---

# 24. Analytics

Eventos:

- profile_generation_started;
- profile_generated;
- profile_failed;
- profile_viewed;
- section_opened;
- hypothesis_opened;
- evidence_opened;
- profile_feedback_submitted;
- profile_correction_requested;
- profile_updated;
- safety_notice_viewed.

---

# 25. Critérios de aceite

O perfil estará pronto para prototipação quando:

- todas as seções estiverem definidas;
- fatos e hipóteses estiverem separados;
- evidências estiverem acessíveis;
- lacunas estiverem visíveis;
- confiança qualitativa estiver definida;
- feedback estiver disponível;
- linguagem proibida estiver documentada;
- segurança estiver incorporada;
- atualização longitudinal estiver prevista;
- versionamento estiver definido.

---

# 26. Critérios de sucesso

## Produto
- usuário reconhece sua realidade;
- utilidade média ≥ 7/10;
- taxa de contestação compreensível e monitorada;
- pelo menos 40% acessam uma hipótese;
- pelo menos 30% enviam feedback.

## Qualidade
- nenhuma informação inventada em testes aprovados;
- nenhuma hipótese sem evidência;
- nenhuma linguagem diagnóstica;
- todos os avisos críticos presentes;
- rastreabilidade completa.

---

# 27. Riscos

1. Perfil genérico.
2. Excesso de texto.
3. Hipótese parecer diagnóstico.
4. Usuário se sentir julgado.
5. Informação incorreta.
6. Ausência de contexto.
7. Confiança indevida.
8. Contradições.
9. Linguagem excessivamente técnica.
10. Perfil não gerar valor percebido.

---

# 28. Mitigações

- usar dados específicos;
- resumo executivo;
- detalhes sob demanda;
- linguagem probabilística;
- feedback;
- correção;
- evidências;
- lacunas;
- safety review;
- testes com usuários;
- revisão profissional.

---

# 29. Questões abertas

1. Quantas hipóteses exibir inicialmente?
2. Qual comprimento ideal do resumo?
3. Quais pontos fortes são seguros de inferir?
4. Qual critério mínimo para confiança alta?
5. Como apresentar contradições?
6. Como tratar discordância do usuário?
7. Quando recalcular o perfil?
8. Qual frequência máxima de atualização?
9. Qual nível de detalhe na tela mobile?
10. O perfil poderá ser exportado?
11. O perfil poderá ser compartilhado com profissional?
12. Quais partes serão gratuitas?

---

# 30. Próximo documento

O próximo documento será:

> Higeia Knowledge Model Specification v0.1.

Ele definirá:

- entidades;
- atributos;
- eventos;
- estados;
- relações;
- hipóteses;
- evidências;
- trajetórias;
- ontologia inicial;
- vínculo com o HIE.

---

# 31. Histórico

| Versão | Data | Alteração |
|---|---|---|
| 0.1 | 13/07/2026 | Primeira especificação do Perfil de Inteligência Pessoal. |
