# Higeia — Especificação da Anamnese Adaptativa

**Documento:** Higeia Assessment Specification  
**Versão:** 0.1  
**Status:** Rascunho funcional oficial  
**Data:** 13 de julho de 2026  
**Projeto interno:** Projeto Eros  
**Produto:** Higeia  
**Fundador:** Clovis Sadlowski  

---

## 1. Objetivo

Definir a estrutura funcional da anamnese adaptativa do Higeia.

Este documento especifica:

- blocos de perguntas;
- objetivos de cada bloco;
- tipos de resposta;
- obrigatoriedade;
- lógica adaptativa;
- critérios de aprofundamento;
- sinais de segurança;
- critérios de conclusão;
- dados produzidos;
- vínculo com o Perfil de Inteligência Pessoal;
- requisitos de UX;
- requisitos de auditoria.

---

## 2. Princípios

1. A anamnese deve compreender antes de recomendar.
2. O usuário deve saber por que perguntas sensíveis são feitas.
3. Perguntas devem ser claras e não julgadoras.
4. Respostas livres não devem substituir dados estruturados essenciais.
5. O sistema deve evitar perguntas redundantes.
6. Aprofundamentos devem ser limitados para reduzir fadiga.
7. O usuário deve poder pausar e continuar.
8. O usuário deve poder corrigir respostas.
9. Informações críticas devem acionar fluxo de segurança.
10. O Higeia não deve interpretar respostas como diagnóstico.

---

## 3. Estrutura geral

A anamnese será dividida em 12 blocos:

1. Identidade e contexto básico.
2. Objetivo principal.
3. Histórico de peso e tentativas anteriores.
4. Rotina e disponibilidade.
5. Alimentação atual.
6. Fome, saciedade e episódios de descontrole.
7. Sono e recuperação.
8. Atividade física e treinamento.
9. Estresse, motivação e percepção emocional.
10. Saúde declarada, sintomas e medicações.
11. Preferências, restrições e recursos.
12. Expectativas e prontidão para mudança.

---

## 4. Tipos de resposta

- resposta única;
- múltipla escolha;
- escala de 0 a 10;
- escala de frequência;
- número;
- data;
- texto curto;
- texto longo;
- sim/não;
- sim/não/não sei;
- seletor de tempo;
- upload futuro;
- resposta opcional;
- resposta obrigatória.

---

## 5. Níveis de obrigatoriedade

### Obrigatória
Necessária para gerar o perfil inicial.

### Recomendada
Aumenta a qualidade da análise.

### Opcional
Pode ser ignorada sem impedir conclusão.

### Sensível
Exige explicação de uso e opção de pular.

---

# 6. Bloco 1 — Identidade e contexto básico

## Objetivo
Criar a linha de base mínima do usuário.

## Perguntas

### Q1.1 — Nome
- tipo: texto curto;
- obrigatória: sim.

### Q1.2 — Data de nascimento
- tipo: data;
- obrigatória: sim;
- regra: validar idade mínima.

### Q1.3 — Sexo biológico informado
- tipo: seleção;
- obrigatória: recomendada;
- sensível: sim;
- justificativa: pode influenciar referências fisiológicas;
- opção: prefiro não informar.

### Q1.4 — Altura
- tipo: número;
- unidade: cm;
- obrigatória: recomendada.

### Q1.5 — Peso atual
- tipo: número;
- unidade: kg;
- obrigatória: recomendada;
- validação: faixa plausível e confirmação de erro.

### Q1.6 — Profissão ou principal ocupação
- tipo: texto curto;
- obrigatória: recomendada.

### Q1.7 — Formato de trabalho
- tipo: múltipla escolha;
- opções:
  - presencial;
  - remoto;
  - híbrido;
  - turnos;
  - autônomo;
  - desempregado;
  - outro.

### Q1.8 — Com quem mora
- tipo: múltipla escolha;
- obrigatória: opcional.

### Sinais produzidos
- idade;
- altura;
- peso;
- ocupação;
- estrutura de rotina;
- contexto domiciliar.

---

# 7. Bloco 2 — Objetivo principal

## Objetivo
Entender o que o usuário deseja e por quê.

## Perguntas

### Q2.1 — Qual é seu principal objetivo?
- tipo: resposta única;
- opções:
  - emagrecer;
  - melhorar composição corporal;
  - ganhar massa;
  - melhorar condicionamento;
  - melhorar saúde;
  - outro.

### Q2.2 — Quanto esse objetivo é importante para você hoje?
- tipo: escala 0–10.

### Q2.3 — Por que esse objetivo é importante?
- tipo: texto longo;
- obrigatória: recomendada.

### Q2.4 — Existe prazo desejado?
- tipo: data ou “sem prazo”;
- obrigatória: opcional.

### Q2.5 — O que mudaria na sua vida se alcançasse esse objetivo?
- tipo: texto longo;
- obrigatória: opcional.

## Lógica adaptativa
Se importância < 5:
- perguntar o que reduz prioridade.

Se prazo muito curto:
- apresentar aviso de expectativa realista.

Se objetivo envolver peso específico:
- perguntar origem da meta.

---

# 8. Bloco 3 — Histórico de peso e tentativas anteriores

## Objetivo
Compreender padrões passados e estratégias já testadas.

## Perguntas

### Q3.1 — Seu peso mudou nos últimos 12 meses?
- opções:
  - aumentou;
  - diminuiu;
  - oscilou;
  - permaneceu estável;
  - não sei.

### Q3.2 — Maior peso adulto conhecido
- tipo: número;
- opcional.

### Q3.3 — Menor peso adulto conhecido
- tipo: número;
- opcional.

### Q3.4 — Já tentou emagrecer antes?
- tipo: sim/não.

### Q3.5 — Quais estratégias já tentou?
- múltipla escolha:
  - dieta prescrita;
  - restrição por conta própria;
  - jejum;
  - contagem de calorias;
  - medicamentos;
  - suplementos;
  - treino;
  - outro.

### Q3.6 — O que funcionou melhor?
- texto longo.

### Q3.7 — O que fez abandonar?
- múltipla escolha + texto:
  - fome;
  - rotina;
  - custo;
  - falta de resultado;
  - restrição;
  - cansaço;
  - eventos sociais;
  - questão emocional;
  - outro.

## Lógica adaptativa
Se várias tentativas com abandono:
- perguntar padrão recorrente.

Se uso de medicação:
- encaminhar pergunta ao bloco de saúde.

---

# 9. Bloco 4 — Rotina e disponibilidade

## Objetivo
Avaliar viabilidade prática.

## Perguntas

### Q4.1 — Horário habitual de acordar
### Q4.2 — Horário habitual de dormir
### Q4.3 — Jornada de trabalho
### Q4.4 — Tempo de deslocamento
### Q4.5 — Quantas refeições costuma fazer?
### Q4.6 — Quanto tempo tem para preparar alimentos?
### Q4.7 — Com que frequência come fora?
### Q4.8 — Sua rotina varia muito?
### Q4.9 — Há dias especialmente difíceis?
### Q4.10 — Quais responsabilidades competem pelo seu tempo?
- trabalho;
- filhos;
- estudos;
- cuidados familiares;
- deslocamento;
- outro.

## Lógica adaptativa
Se tempo para cozinhar for muito baixo:
- perguntar acesso a refeições prontas;
- perguntar disponibilidade financeira;
- perguntar ajuda de terceiros.

Se rotina em turnos:
- aprofundar horários e variação.

---

# 10. Bloco 5 — Alimentação atual

## Objetivo
Compreender padrão alimentar e ambiente.

## Perguntas

### Q5.1 — Como descreve sua alimentação atual?
- escala de percepção 0–10;
- texto opcional.

### Q5.2 — Onde faz a maior parte das refeições?
### Q5.3 — Quem prepara os alimentos?
### Q5.4 — Frequência de frutas e vegetais
### Q5.5 — Frequência de proteínas
### Q5.6 — Frequência de ultraprocessados
### Q5.7 — Frequência de bebidas açucaradas
### Q5.8 — Consumo de álcool
### Q5.9 — Hidratação percebida
### Q5.10 — Há horários de maior dificuldade?
### Q5.11 — Há alimentos que evita?
### Q5.12 — Há alimentos indispensáveis?
### Q5.13 — Como são os finais de semana?

## Lógica adaptativa
Se alimentação muito variável:
- perguntar principais causas.

Se álcool frequente:
- perguntar contexto e quantidade aproximada.

Se restrições:
- diferenciar preferência, alergia, intolerância e orientação profissional.

---

# 11. Bloco 6 — Fome, saciedade e episódios de descontrole

## Objetivo
Identificar padrões de fome e possíveis sinais de risco.

## Perguntas

### Q6.1 — Sente fome intensa com frequência?
### Q6.2 — Em quais horários?
### Q6.3 — Costuma comer sem fome física?
### Q6.4 — Já sentiu perda de controle ao comer?
### Q6.5 — Isso acontece com que frequência?
### Q6.6 — Há culpa ou sofrimento depois?
### Q6.7 — Já recebeu diagnóstico relacionado à alimentação?
### Q6.8 — Está em acompanhamento profissional?

## Segurança
Respostas que indiquem possível transtorno alimentar não devem gerar aconselhamento autônomo.

### Ação
- informar limite;
- recomendar avaliação profissional;
- registrar sinal sensível;
- evitar linguagem diagnóstica.

---

# 12. Bloco 7 — Sono e recuperação

## Objetivo
Compreender duração, qualidade e impacto percebido.

## Perguntas

### Q7.1 — Quantas horas dorme?
### Q7.2 — Qualidade do sono 0–10
### Q7.3 — Acorda descansado?
### Q7.4 — Tem dificuldade para dormir?
### Q7.5 — Acorda durante a noite?
### Q7.6 — Trabalha em turnos?
### Q7.7 — Usa telas próximo ao sono?
### Q7.8 — Percebe relação entre sono e fome?
### Q7.9 — Percebe relação entre sono e treino?

## Lógica adaptativa
Se sono < 6h:
- perguntar frequência;
- perguntar causa principal;
- perguntar impacto diurno.

---

# 13. Bloco 8 — Atividade física e treinamento

## Objetivo
Entender nível de atividade e consistência.

## Perguntas

### Q8.1 — Pratica atividade física?
### Q8.2 — Quantos dias por semana?
### Q8.3 — Quais modalidades?
### Q8.4 — Duração média?
### Q8.5 — Intensidade percebida?
### Q8.6 — Treina com orientação?
### Q8.7 — Possui lesão ou limitação?
### Q8.8 — O que mais dificulta treinar?
### Q8.9 — Como avalia sua recuperação?
### Q8.10 — Caminha ou se movimenta fora do treino?

## Segurança
Lesão, dor intensa ou sintomas devem gerar orientação para avaliação apropriada.

---

# 14. Bloco 9 — Estresse, motivação e percepção emocional

## Objetivo
Coletar contexto comportamental sem realizar diagnóstico psicológico.

## Perguntas

### Q9.1 — Estresse atual 0–10
### Q9.2 — Energia atual 0–10
### Q9.3 — Motivação atual 0–10
### Q9.4 — Confiança em conseguir mudar 0–10
### Q9.5 — O que mais dificulta manter consistência?
### Q9.6 — O que mais ajuda?
### Q9.7 — Possui apoio de alguém?
### Q9.8 — Alimentação muda em períodos emocionais?
### Q9.9 — Gostaria de informar algo sobre seu estado emocional?

## Segurança
Não rotular ansiedade, depressão ou transtornos.

---

# 15. Bloco 10 — Saúde declarada, sintomas e medicações

## Objetivo
Registrar informações declaradas relevantes para segurança.

## Perguntas

### Q10.1 — Possui diagnóstico médico?
### Q10.2 — Quais?
### Q10.3 — Usa medicamentos?
### Q10.4 — Quais?
### Q10.5 — Usa suplementos?
### Q10.6 — Está grávida ou amamentando?
### Q10.7 — Possui alergias ou intolerâncias?
### Q10.8 — Teve cirurgia recente?
### Q10.9 — Sente sintomas relevantes atualmente?
### Q10.10 — Está sendo acompanhado por profissional?

## Segurança
Determinadas respostas devem bloquear recomendações e orientar busca profissional.

---

# 16. Bloco 11 — Preferências, restrições e recursos

## Objetivo
Compreender o que é viável.

## Perguntas

### Q11.1 — Alimentos preferidos
### Q11.2 — Alimentos rejeitados
### Q11.3 — Restrições culturais ou religiosas
### Q11.4 — Orçamento alimentar percebido
### Q11.5 — Acesso a cozinha
### Q11.6 — Acesso a academia
### Q11.7 — Equipamentos disponíveis
### Q11.8 — Apoio familiar
### Q11.9 — Interesse em cozinhar
### Q11.10 — Grau de flexibilidade desejado

---

# 17. Bloco 12 — Expectativas e prontidão

## Objetivo
Avaliar prontidão e alinhamento.

## Perguntas

### Q12.1 — O que espera do Higeia?
### Q12.2 — O que não gostaria que acontecesse?
### Q12.3 — Quanto está disposto a mudar agora? 0–10
### Q12.4 — Qual pequena mudança parece possível esta semana?
### Q12.5 — Deseja acompanhamento semanal?
### Q12.6 — Deseja receber lembretes?
### Q12.7 — Há algo importante que não foi perguntado?

---

# 18. Lógica adaptativa

## Gatilhos

Aprofundar quando:

- resposta vaga;
- contradição;
- risco;
- forte relevância;
- ausência de informação crítica;
- padrão recorrente;
- expectativa irreal;
- relato de dificuldade.

## Limites

- máximo de 2 perguntas adaptativas por tema;
- máximo de 8 perguntas adaptativas no fluxo inicial;
- usuário pode pular;
- mostrar motivo;
- evitar repetição.

## Exemplo

Resposta:
“Tenho dificuldade à noite.”

Aprofundamentos:
1. “O que costuma acontecer nesse horário?”
2. “A dificuldade parece mais ligada à fome, cansaço, rotina ou vontade específica?”

---

# 19. Contradições

O sistema deve identificar possíveis contradições.

## Exemplo
Usuário informa:

- alimentação 9/10;
- alta frequência de ultraprocessados;
- baixa ingestão de vegetais;
- baixa hidratação.

## Ação
Perguntar:
> “Você avaliou sua alimentação como muito boa. O que considera mais positivo nela?”

## Regra
Não corrigir o usuário de forma julgadora.

---

# 20. Sinais de segurança

## Categorias

### Nível 1 — Atenção
Informação que exige cautela.

### Nível 2 — Redirecionamento
Recomendar avaliação profissional.

### Nível 3 — Urgência
Orientar busca imediata de atendimento apropriado.

## Exemplos
- possível transtorno alimentar;
- sintomas graves;
- gravidez;
- uso de medicação relevante;
- dor intensa;
- desmaio;
- ideação de autoagressão;
- menores de idade;
- condição médica descompensada.

## Regra
O Higeia não deve diagnosticar.

---

# 21. Critérios de conclusão

A anamnese poderá ser concluída quando:

- identidade mínima preenchida;
- objetivo informado;
- rotina básica informada;
- alimentação básica informada;
- sono básico informado;
- atividade física básica informada;
- contexto de saúde básico informado;
- consentimentos válidos;
- revisão concluída.

## Indicador de completude

- mínimo;
- adequado;
- aprofundado.

## Regra
Completude não deve ser confundida com qualidade.

---

# 22. Saídas da anamnese

A anamnese deve produzir:

- fatos declarados;
- sinais estruturados;
- eventos relevantes;
- contexto;
- lacunas;
- contradições;
- hipóteses iniciais;
- evidências;
- sinais de segurança;
- temas para check-in;
- qualidade dos dados.

---

# 23. Mapeamento para o HKM

Cada pergunta deverá, futuramente, mapear para:

- entidade;
- atributo;
- evento;
- estado;
- relação;
- hipótese;
- evidência;
- qualidade;
- origem.

## Exemplo

Pergunta:
“Quantas horas você dorme?”

Mapeamento:
- entidade: sono;
- atributo: duração;
- unidade: horas;
- origem: autorrelato;
- frequência: habitual;
- qualidade: declarada.

---

# 24. UX

## Requisitos

- uma pergunta por vez quando possível;
- progresso visível;
- blocos curtos;
- linguagem simples;
- explicações sob demanda;
- salvar automaticamente;
- retomar;
- revisar;
- corrigir.

## Tempo-alvo

- versão mínima: 10–15 minutos;
- versão aprofundada: até 25 minutos;
- permitir pausa.

---

# 25. Analytics

Eventos:

- assessment_started;
- block_started;
- question_viewed;
- question_answered;
- question_skipped;
- adaptive_question_triggered;
- safety_signal_triggered;
- block_completed;
- assessment_paused;
- assessment_resumed;
- assessment_completed;
- assessment_abandoned.

---

# 26. Critérios de aceite

A especificação estará pronta para prototipação quando:

- todos os blocos tiverem objetivo;
- perguntas essenciais estiverem definidas;
- tipos de resposta estiverem definidos;
- lógica adaptativa estiver documentada;
- sinais de segurança estiverem mapeados;
- critérios de conclusão estiverem claros;
- saídas estiverem definidas;
- vínculo com HKM estiver previsto.

---

# 27. Questões abertas

1. Idade mínima.
2. Lista oficial de condições de segurança.
3. Inclusão de fotos no Alpha.
4. Inclusão de exames no Alpha.
5. Duração máxima aceitável.
6. Quais perguntas são obrigatórias.
7. Critério de completude.
8. Necessidade de revisão profissional.
9. Linguagem para transtornos alimentares.
10. Tratamento de gravidez e lactação.
11. Validação científica das perguntas.
12. Ordem ideal dos blocos.

---

# 28. Próximo documento

O próximo documento será:

> Higeia Personal Intelligence Profile Specification v0.1.

Ele definirá:

- estrutura do perfil;
- fatos;
- hipóteses;
- evidências;
- lacunas;
- linguagem;
- critérios de explicabilidade;
- feedback;
- atualização longitudinal.

---

# 29. Histórico

| Versão | Data | Alteração |
|---|---|---|
| 0.1 | 13/07/2026 | Primeira especificação da anamnese adaptativa. |
