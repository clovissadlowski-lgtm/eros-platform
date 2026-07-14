# Higeia — Jornada do Usuário

**Documento:** Higeia User Journey  
**Versão:** 0.1  
**Status:** Rascunho funcional oficial  
**Data:** 13 de julho de 2026  
**Projeto interno:** Projeto Eros  
**Produto:** Higeia  
**Fundador:** Clovis Sadlowski  

---

## 1. Objetivo

Descrever, passo a passo, a experiência do usuário no Higeia desde o primeiro contato com a marca até os primeiros ciclos de acompanhamento.

Este documento orientará:

- wireframes;
- protótipo;
- interface;
- textos;
- notificações;
- fluxos;
- requisitos;
- métricas;
- testes de usabilidade.

---

## 2. Escopo

A jornada descrita cobre:

1. descoberta;
2. avaliação da proposta;
3. cadastro;
4. consentimento;
5. anamnese adaptativa;
6. geração do perfil;
7. apresentação do valor;
8. primeiro check-in;
9. segundo check-in;
10. continuidade;
11. cancelamento ou exclusão.

Não cobre ainda:

- jornada de nutricionistas;
- jornada administrativa detalhada;
- pagamentos reais;
- integração com profissionais;
- aplicativo nativo.

---

## 3. Persona de referência

**Nome fictício:** Marina  
**Idade:** 32 anos  
**Objetivo:** emagrecer de forma sustentável  
**Rotina:** trabalho em horário comercial, treina 3 vezes por semana, pouco tempo para cozinhar  
**Histórico:** já tentou dietas restritivas e perdeu motivação após poucas semanas  
**Expectativa:** entender por que não consegue manter consistência  
**Medos:** julgamento, excesso de perguntas, respostas genéricas, exposição de dados  
**Critério de valor:** sentir que o Higeia realmente compreendeu sua realidade  

---

## 4. Princípios da jornada

1. O usuário deve entender o valor antes de entregar muitos dados.
2. Cada pergunta sensível deve explicar por que é necessária.
3. O progresso deve ser visível.
4. O usuário deve poder pausar e continuar.
5. O Higeia deve diferenciar fato, relato, inferência e hipótese.
6. O usuário deve poder corrigir interpretações.
7. A experiência não deve simular diagnóstico.
8. O primeiro valor deve aparecer imediatamente após a anamnese.
9. O acompanhamento deve ser leve.
10. O usuário deve manter controle sobre seus dados.

---

# 5. Mapa geral

```text
Descoberta
  ↓
Landing Page
  ↓
Cadastro
  ↓
Consentimento
  ↓
Boas-vindas
  ↓
Anamnese Adaptativa
  ↓
Revisão
  ↓
Processamento
  ↓
Perfil de Inteligência Pessoal
  ↓
Dashboard
  ↓
Primeiro Check-in
  ↓
Atualização do Perfil
  ↓
Segundo Check-in
  ↓
Acompanhamento Contínuo
```

---

# 6. Fase 1 — Descoberta

## Objetivo do usuário
Entender rapidamente o que é o Higeia e se parece confiável.

## Canais possíveis
- anúncio;
- indicação;
- conteúdo;
- busca;
- rede social;
- profissional;
- convite.

## Perguntas do usuário
- O que isso faz?
- É um aplicativo de dieta?
- Vai montar dieta?
- É seguro?
- Usa meus dados?
- É gratuito?
- Preciso de nutricionista?

## Mensagem principal

> Entenda como sua rotina, seus hábitos e seu comportamento influenciam seu emagrecimento.

## Ação esperada
Clicar em “Conhecer meu perfil”.

## Riscos
- parecer promessa de emagrecimento;
- parecer chatbot genérico;
- gerar desconfiança;
- comunicação abstrata.

## Métricas
- taxa de clique;
- tempo na página;
- rolagem;
- abandono;
- origem do tráfego.

---

# 7. Fase 2 — Landing Page

## Objetivo
Converter interesse em início de cadastro.

## Blocos

1. proposta de valor;
2. como funciona;
3. o que o usuário recebe;
4. o que o Higeia não faz;
5. privacidade;
6. perguntas frequentes;
7. chamada para ação.

## Microcopy sugerida

### Título
> Seu emagrecimento começa pela compreensão de como você funciona.

### Subtítulo
> O Higeia analisa rotina, hábitos, dificuldades e evolução para criar um perfil pessoal e acompanhar sua jornada.

### Limite
> O Higeia não substitui profissionais e não realiza diagnóstico.

## Critério de aceite
O usuário deve compreender a proposta em até 20 segundos.

---

# 8. Fase 3 — Cadastro

## Objetivo do usuário
Criar conta com o mínimo de esforço.

## Campos
- nome;
- e-mail;
- senha;
- confirmação de idade;
- aceite de termos;
- aceite de política de privacidade.

## Decisões de UX
- cadastro em uma única tela;
- explicar requisitos de senha;
- confirmação de e-mail;
- opção futura de login social.

## Riscos
- excesso de campos;
- linguagem jurídica;
- insegurança.

## Métricas
- cadastro iniciado;
- cadastro concluído;
- erro por campo;
- abandono.

---

# 9. Fase 4 — Consentimento

## Objetivo do usuário
Entender que dados serão usados e para quê.

## Consentimentos
- análise personalizada;
- armazenamento do histórico;
- notificações;
- uso anonimizado futuro, separado e opcional;
- compartilhamento futuro com profissional, separado e opcional.

## Princípios
- linguagem simples;
- caixas não pré-marcadas;
- registros versionados;
- possibilidade de revogação.

## Mensagem sugerida

> Seus dados serão usados para construir e atualizar seu perfil. Você poderá revisar, corrigir e excluir suas informações.

---

# 10. Fase 5 — Boas-vindas

## Objetivo
Preparar o usuário para a anamnese.

## Conteúdo
- duração estimada;
- possibilidade de pausar;
- explicação sobre perguntas adaptativas;
- aviso sobre temas sensíveis;
- reforço de privacidade.

## Mensagem sugerida

> Quanto melhor entendermos sua rotina, mais útil será seu perfil. Você pode pausar e continuar depois.

## Critério de aceite
O usuário sabe o que acontecerá e quanto esforço será necessário.

---

# 11. Fase 6 — Anamnese Adaptativa

## Objetivo do usuário
Responder perguntas sem sentir que está preenchendo um formulário burocrático.

## Estrutura por blocos

1. objetivo;
2. histórico;
3. rotina;
4. alimentação;
5. sono;
6. treino;
7. estresse;
8. dificuldades;
9. preferências;
10. saúde declarada;
11. expectativas.

## Padrão de tela
- título do bloco;
- explicação;
- progresso;
- pergunta;
- ajuda;
- botão continuar;
- salvar e sair.

## Perguntas adaptativas

O sistema pode aprofundar quando:

- resposta é vaga;
- existe contradição;
- tema é relevante;
- informação é insuficiente;
- o usuário sinaliza dificuldade.

## Limites
- máximo inicial de 2 aprofundamentos por tema;
- permitir pular perguntas não essenciais;
- evitar sequência longa de perguntas sensíveis;
- mostrar progresso real.

## Experiência desejada
“Estão tentando entender minha realidade.”

## Riscos
- fadiga;
- sensação invasiva;
- abandono;
- respostas socialmente desejáveis;
- excesso de texto.

## Métricas
- conclusão por bloco;
- tempo por bloco;
- perguntas puladas;
- abandono;
- aprofundamentos acionados.

---

# 12. Fase 7 — Revisão das respostas

## Objetivo
Permitir correção antes do processamento.

## Conteúdo
- resumo por bloco;
- editar;
- confirmar;
- dados não respondidos;
- aviso de que hipóteses dependerão dessas informações.

## Critério de aceite
O usuário consegue corrigir qualquer resposta.

---

# 13. Fase 8 — Processamento

## Objetivo
Manter confiança enquanto o perfil é gerado.

## Elementos
- mensagem de processamento;
- explicação breve;
- etapas visuais;
- aviso sobre limitações.

## Etapas visuais
1. organizando informações;
2. identificando contexto;
3. verificando consistência;
4. construindo perfil;
5. preparando explicações.

## Limite
Não simular “pensamento humano”.

## Mensagem sugerida

> Estamos organizando suas respostas e identificando fatores que merecem atenção. O resultado será uma interpretação inicial, não um diagnóstico.

---

# 14. Fase 9 — Perfil de Inteligência Pessoal

## Objetivo
Entregar o primeiro momento de valor.

## Estrutura

### 14.1 Resumo
Quem é o usuário neste momento.

### 14.2 Objetivo
O que ele deseja alcançar.

### 14.3 Pontos fortes
Recursos que favorecem a evolução.

### 14.4 Barreiras
Fatores que dificultam consistência.

### 14.5 Fatores de influência
Sono, rotina, alimentação, treino, estresse e contexto.

### 14.6 Hipóteses iniciais
Interpretações provisórias.

### 14.7 Evidências
Dados que sustentam cada hipótese.

### 14.8 Lacunas
Informações ainda insuficientes.

### 14.9 Próximos aspectos a observar
Temas para check-ins.

### 14.10 Feedback
“Isso representa você?”

## Ações
- concordar;
- parcialmente;
- discordar;
- corrigir;
- aprofundar;
- salvar.

## Critério de valor
O usuário deve reconhecer sua realidade no perfil.

## Métricas
- perfil visualizado;
- tempo de leitura;
- hipóteses abertas;
- feedback;
- correções;
- utilidade percebida.

---

# 15. Fase 10 — Conversão

## Objetivo
Apresentar acompanhamento contínuo sem interromper o valor inicial.

## Momento
Após o usuário visualizar o perfil.

## Mensagem

> Seu perfil é apenas o ponto de partida. O Higeia pode acompanhar mudanças, identificar padrões e atualizar sua compreensão ao longo do tempo.

## Oferta inicial
- versão gratuita limitada;
- assinatura futura;
- lista de espera no Alpha.

## Regra
O usuário deve receber valor antes da oferta.

---

# 16. Fase 11 — Dashboard

## Objetivo
Dar orientação clara sobre o próximo passo.

## Elementos
- resumo do perfil;
- fatores em observação;
- progresso;
- próximo check-in;
- mudanças recentes;
- assistente;
- linha do tempo.

## Estado inicial
- perfil concluído;
- nenhum check-in ainda;
- convite para primeiro check-in.

## Regra
Não sobrecarregar com gráficos antes de existir histórico.

---

# 17. Fase 12 — Primeiro Check-in

## Momento
Sete dias após o perfil inicial.

## Objetivo
Obter nova informação com esforço baixo.

## Perguntas
- como foi a semana;
- alimentação;
- fome;
- sono;
- energia;
- treino;
- estresse;
- maior dificuldade;
- maior conquista;
- mudança de rotina;
- observação livre.

## Tempo-alvo
Até 5 minutos.

## Experiência desejada
“É rápido e me ajuda a refletir.”

## Resultado
- resumo da semana;
- comparação com linha de base;
- mudança relevante;
- próxima observação.

---

# 18. Fase 13 — Atualização do perfil

## Objetivo
Mostrar que o sistema aprende com o tempo.

## Mudanças possíveis
- reforçar hipótese;
- enfraquecer hipótese;
- adicionar nova barreira;
- registrar ponto forte;
- identificar mudança;
- declarar dados insuficientes.

## Mensagem
> Seu perfil foi atualizado com base no check-in desta semana.

## Regra
Explicar o que mudou e por quê.

---

# 19. Fase 14 — Segundo Check-in

## Momento
Sete dias após o primeiro.

## Objetivo
Testar retenção e repetição.

## Diferença
Perguntas podem ser adaptadas ao primeiro check-in.

## Exemplos
- “A dificuldade relatada na semana passada continuou?”
- “A mudança de rotina teve efeito na sua alimentação?”
- “Você percebeu diferença no sono?”

## Valor esperado
Primeira percepção de padrão longitudinal.

---

# 20. Fase 15 — Assistente Higeia

## Objetivo
Permitir interação entre check-ins.

## Casos de uso
- registrar dificuldade;
- registrar conquista;
- explicar o perfil;
- esclarecer funcionamento;
- refletir sobre padrões;
- lembrar próximo check-in.

## Fluxo de segurança
1. detectar tema;
2. avaliar escopo;
3. responder ou redirecionar;
4. registrar;
5. sinalizar para auditoria quando necessário.

## Temas sensíveis
- sintomas graves;
- transtornos alimentares;
- automutilação;
- emergência;
- medicação;
- gravidez;
- menores;
- diagnóstico.

---

# 21. Fase 16 — Notificações

## Objetivo
Aumentar retorno sem gerar pressão.

## Tipos
- lembrete de check-in;
- perfil atualizado;
- informação incompleta;
- mensagem de segurança;
- convite para retornar.

## Tom
Neutro, acolhedor e não punitivo.

## Exemplo
> Seu check-in está disponível. Leva poucos minutos e ajuda o Higeia a compreender sua semana.

## Evitar
- “Você falhou.”
- “Você está atrasado.”
- “Não perca sua sequência.”

---

# 22. Fase 17 — Pausa

## Objetivo
Permitir interrupção sem culpa.

## Ações
- pausar notificações;
- pausar acompanhamento;
- manter dados;
- retomar depois.

## Mensagem
> Você pode pausar e retomar quando fizer sentido.

---

# 23. Fase 18 — Exclusão

## Objetivo
Garantir controle dos dados.

## Fluxo
1. solicitar exclusão;
2. explicar consequências;
3. confirmar identidade;
4. iniciar processo;
5. informar prazo;
6. registrar conclusão.

## Regra
Não dificultar artificialmente a saída.

---

# 24. Estados alternativos

## Usuário abandona o cadastro
Enviar lembrete opcional.

## Usuário abandona a anamnese
Salvar progresso e permitir retorno.

## Usuário não reconhece o perfil
Permitir correção e coletar feedback.

## Usuário apresenta sinal de risco
Redirecionar para atendimento apropriado.

## Usuário não retorna
Reduzir notificações e oferecer pausa.

## Falha da IA
Mostrar mensagem transparente e não inventar resultado.

---

# 25. Blueprint de serviço

| Etapa | Ação do usuário | Interface | Processo interno | Risco |
|---|---|---|---|---|
| Descoberta | acessa página | landing | analytics | promessa excessiva |
| Cadastro | cria conta | formulário | autenticação | abandono |
| Consentimento | autoriza | tela legal | registro versionado | falta de clareza |
| Anamnese | responde | fluxo adaptativo | armazenamento | fadiga |
| Processamento | aguarda | progresso | HIE | alucinação |
| Perfil | lê | relatório | explicabilidade | generalidade |
| Check-in | atualiza | formulário | memória | baixa retenção |
| Assistente | conversa | chat | safety layer | resposta insegura |
| Exclusão | solicita | configurações | workflow LGPD | falha operacional |

---

# 26. Métricas da jornada

## Aquisição
- visita;
- clique;
- cadastro iniciado;
- cadastro concluído.

## Ativação
- anamnese iniciada;
- anamnese concluída;
- perfil gerado;
- perfil visualizado.

## Valor
- utilidade percebida;
- reconhecimento do perfil;
- correções;
- compartilhamento.

## Retenção
- primeiro check-in;
- segundo check-in;
- retorno semanal;
- uso do assistente.

## Segurança
- redirecionamentos;
- respostas sinalizadas;
- hipóteses contestadas;
- incidentes.

---

# 27. Momentos críticos

1. compreensão da proposta;
2. consentimento;
3. início da anamnese;
4. metade da anamnese;
5. espera pelo perfil;
6. leitura da primeira hipótese;
7. feedback sobre o perfil;
8. primeiro check-in;
9. resposta sensível do assistente;
10. decisão de continuar.

---

# 28. Critérios de aceite da jornada

A jornada será considerada adequada para prototipação quando:

- não houver etapa sem objetivo claro;
- o usuário compreender o produto;
- a anamnese puder ser pausada;
- o perfil diferenciar fatos e hipóteses;
- feedback estiver disponível;
- check-in durar até 5 minutos;
- temas sensíveis tiverem fluxo seguro;
- exclusão estiver acessível;
- métricas estiverem definidas.

---

# 29. Próximo documento

O próximo documento será:

> Higeia Screen Map v0.1.

Ele transformará esta jornada em:

- mapa de navegação;
- hierarquia de telas;
- estados;
- modais;
- componentes;
- ligações entre páginas.

---

# 30. Histórico

| Versão | Data | Alteração |
|---|---|---|
| 0.1 | 13/07/2026 | Primeira jornada completa do usuário B2C. |
