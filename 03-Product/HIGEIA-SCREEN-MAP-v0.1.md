# Higeia — Mapa de Telas e Navegação

**Documento:** Higeia Screen Map  
**Versão:** 0.1  
**Status:** Rascunho funcional oficial  
**Data:** 13 de julho de 2026  
**Projeto interno:** Projeto Eros  
**Produto:** Higeia  
**Fundador:** Clovis Sadlowski  

---

## 1. Objetivo

Definir a arquitetura de navegação do MVP Higeia.

Este documento transforma o PRD e a Jornada do Usuário em:

- telas;
- rotas;
- estados;
- modais;
- ações;
- transições;
- dependências;
- critérios de navegação.

Ele será a base para:

- wireframes;
- protótipo no Figma;
- desenvolvimento front-end;
- testes de usabilidade;
- analytics;
- acessibilidade;
- QA.

---

## 2. Escopo

O mapa cobre a experiência B2C do MVP:

1. área pública;
2. autenticação;
3. consentimento;
4. onboarding;
5. anamnese;
6. processamento;
7. perfil;
8. dashboard;
9. check-ins;
10. timeline;
11. assistente;
12. configurações;
13. privacidade;
14. feedback;
15. administração mínima.

Não cobre:

- módulo profissional;
- marketplace;
- pagamentos completos;
- aplicativo nativo;
- integrações externas;
- portal clínico.

---

## 3. Convenções

### Tipos de tela

- **P:** página completa;
- **M:** modal;
- **D:** drawer ou painel lateral;
- **E:** estado de tela;
- **S:** sistema;
- **A:** tela administrativa.

### Estados padrão

Toda tela deve prever, quando aplicável:

- carregando;
- vazia;
- sucesso;
- erro;
- indisponível;
- offline;
- dados insuficientes;
- conteúdo bloqueado;
- acesso negado;
- processamento;
- manutenção.

---

# 4. Mapa macro

```text
Área Pública
  ├── Landing
  ├── Como Funciona
  ├── Privacidade
  ├── Termos
  └── FAQ

Autenticação
  ├── Cadastro
  ├── Login
  ├── Verificação de E-mail
  ├── Recuperação de Senha
  └── Nova Senha

Onboarding
  ├── Consentimentos
  ├── Boas-vindas
  ├── Introdução à Anamnese
  └── Anamnese Adaptativa

Inteligência
  ├── Revisão
  ├── Processamento
  ├── Perfil de Inteligência Pessoal
  ├── Detalhe de Hipótese
  └── Feedback do Perfil

Acompanhamento
  ├── Dashboard
  ├── Check-in
  ├── Resultado do Check-in
  ├── Timeline
  └── Assistente

Conta
  ├── Perfil
  ├── Preferências
  ├── Notificações
  ├── Privacidade
  ├── Dados
  ├── Pausa
  └── Exclusão

Admin
  ├── Login
  ├── Dashboard
  ├── Usuários
  ├── Feedback
  ├── Respostas Sinalizadas
  └── Incidentes
```

---

# 5. Rotas sugeridas

## Área pública

- `/`
- `/como-funciona`
- `/privacidade`
- `/termos`
- `/faq`

## Autenticação

- `/cadastro`
- `/login`
- `/verificar-email`
- `/recuperar-senha`
- `/nova-senha`

## Onboarding

- `/onboarding/consentimentos`
- `/onboarding/boas-vindas`
- `/onboarding/anamnese`
- `/onboarding/revisao`
- `/onboarding/processamento`

## Produto

- `/app`
- `/app/perfil`
- `/app/perfil/hipotese/:id`
- `/app/check-in`
- `/app/check-in/resultado`
- `/app/timeline`
- `/app/assistente`
- `/app/configuracoes`
- `/app/configuracoes/privacidade`
- `/app/configuracoes/dados`
- `/app/configuracoes/notificacoes`

## Administração

- `/admin/login`
- `/admin`
- `/admin/usuarios`
- `/admin/feedback`
- `/admin/respostas-sinalizadas`
- `/admin/incidentes`

---

# 6. Inventário de telas

## P-001 — Landing Page

### Objetivo
Explicar a proposta e converter o visitante em cadastro.

### Componentes
- hero;
- proposta de valor;
- como funciona;
- benefício principal;
- limites;
- privacidade;
- FAQ;
- CTA.

### Ações
- criar conta;
- entrar;
- conhecer funcionamento;
- ler privacidade;
- ler termos.

### Estados
- padrão;
- carregando;
- erro parcial;
- cookie consent.

---

## P-002 — Como Funciona

### Objetivo
Explicar o fluxo do Higeia.

### Seções
1. anamnese;
2. perfil;
3. check-ins;
4. evolução;
5. limites.

### CTA
“Conhecer meu perfil”.

---

## P-003 — Política de Privacidade

### Objetivo
Apresentar tratamento de dados.

### Requisitos
- texto versionado;
- data de vigência;
- linguagem acessível;
- link para contato.

---

## P-004 — Termos de Uso

### Objetivo
Apresentar regras de uso.

### Requisitos
- texto versionado;
- aceite rastreável;
- limites de responsabilidade;
- idade mínima.

---

## P-005 — FAQ

### Objetivo
Reduzir dúvidas e insegurança.

### Perguntas
- O Higeia monta dieta?
- Substitui nutricionista?
- Meus dados estão seguros?
- Quanto tempo leva?
- Posso excluir meus dados?
- O que é Digital Twin?

---

# 7. Autenticação

## P-006 — Cadastro

### Campos
- nome;
- e-mail;
- senha;
- confirmação de idade;
- aceite de termos;
- aceite de privacidade.

### Ações
- criar conta;
- ir para login.

### Validações
- formato de e-mail;
- força mínima da senha;
- idade mínima;
- termos obrigatórios.

### Estados
- padrão;
- validação;
- e-mail já cadastrado;
- erro de servidor;
- sucesso.

---

## P-007 — Login

### Campos
- e-mail;
- senha.

### Ações
- entrar;
- recuperar senha;
- criar conta.

### Estados
- padrão;
- credenciais inválidas;
- conta bloqueada;
- e-mail não verificado;
- erro.

---

## P-008 — Verificação de E-mail

### Objetivo
Confirmar identidade básica.

### Ações
- reenviar e-mail;
- confirmar;
- alterar e-mail.

### Estados
- aguardando;
- sucesso;
- token expirado;
- erro.

---

## P-009 — Recuperação de Senha

### Campos
- e-mail.

### Estados
- padrão;
- enviado;
- e-mail não encontrado;
- erro.

---

## P-010 — Nova Senha

### Campos
- nova senha;
- confirmação.

### Estados
- válido;
- token expirado;
- erro;
- sucesso.

---

# 8. Consentimento e onboarding

## P-011 — Consentimentos

### Objetivo
Registrar autorizações.

### Blocos
- análise personalizada;
- armazenamento de histórico;
- notificações;
- uso anonimizado futuro;
- compartilhamento futuro com profissional.

### Regras
- consentimentos opcionais separados;
- caixas desmarcadas;
- links para detalhes;
- versão registrada.

### Ações
- aceitar e continuar;
- revisar;
- sair.

---

## P-012 — Boas-vindas

### Objetivo
Preparar o usuário.

### Conteúdo
- duração;
- possibilidade de pausa;
- explicação de perguntas adaptativas;
- aviso de segurança.

### CTA
“Iniciar minha avaliação”.

---

## P-013 — Introdução à Anamnese

### Objetivo
Explicar estrutura por blocos.

### Componentes
- lista de temas;
- tempo estimado;
- progresso;
- privacidade;
- botão iniciar.

---

## P-014 — Anamnese por Bloco

### Objetivo
Coletar respostas.

### Elementos
- título;
- explicação;
- progresso;
- pergunta;
- resposta;
- ajuda;
- continuar;
- voltar;
- salvar e sair.

### Estados
- pergunta objetiva;
- múltipla escolha;
- escala;
- texto livre;
- data;
- número;
- opcional;
- obrigatória;
- erro de validação.

---

## P-015 — Pergunta Adaptativa

### Objetivo
Aprofundar contexto.

### Elementos
- conexão com resposta anterior;
- pergunta;
- opção de não responder;
- justificativa.

### Regra
Máximo inicial de 2 aprofundamentos por tema.

---

## M-001 — Por que perguntamos isso?

### Objetivo
Explicar relevância de pergunta sensível.

### Conteúdo
- finalidade;
- uso;
- privacidade;
- possibilidade de pular.

---

## M-002 — Salvar e Sair

### Objetivo
Confirmar pausa.

### Ações
- salvar;
- continuar;
- sair sem salvar.

---

## P-016 — Revisão das Respostas

### Objetivo
Permitir correções.

### Estrutura
- resumo por bloco;
- editar;
- itens faltantes;
- confirmação final.

### CTA
“Gerar meu perfil”.

---

# 9. Processamento e inteligência

## P-017 — Processamento

### Objetivo
Mostrar progresso sem simular consciência.

### Etapas
- organizando;
- verificando;
- contextualizando;
- construindo;
- preparando.

### Estados
- processando;
- demora;
- falha;
- reprocessar;
- indisponível.

---

## E-001 — Falha no Processamento

### Mensagem
> Não foi possível gerar seu perfil agora. Suas respostas estão salvas.

### Ações
- tentar novamente;
- voltar;
- suporte.

---

## P-018 — Perfil de Inteligência Pessoal

### Objetivo
Entregar o momento de valor.

### Seções
- resumo;
- objetivo;
- pontos fortes;
- barreiras;
- fatores de influência;
- hipóteses;
- lacunas;
- próximos aspectos;
- aviso de escopo.

### Ações
- abrir hipótese;
- concordar;
- discordar;
- corrigir;
- ir ao dashboard;
- enviar feedback.

---

## D-001 — Detalhe de Hipótese

### Conteúdo
- descrição;
- status;
- evidências favoráveis;
- evidências contrárias;
- dados ausentes;
- confiança qualitativa;
- limitações;
- última atualização.

### Ações
- concordar;
- contestar;
- adicionar contexto.

---

## M-003 — Corrigir Informação

### Campos
- o que está incorreto;
- valor correto;
- comentário.

---

## M-004 — Feedback do Perfil

### Campos
- utilidade;
- identificação;
- clareza;
- comentário;
- informação preocupante.

---

# 10. Área autenticada

## P-019 — Dashboard

### Objetivo
Apresentar situação atual e próximo passo.

### Blocos
- saudação;
- resumo;
- fatores em observação;
- próximo check-in;
- mudanças;
- timeline resumida;
- assistente;
- ações rápidas.

### Estados
- primeiro acesso;
- sem check-in;
- perfil desatualizado;
- dados insuficientes;
- alerta;
- pausa.

---

## P-020 — Check-in Semanal

### Objetivo
Atualizar contexto.

### Campos
- semana;
- alimentação;
- fome;
- sono;
- energia;
- treino;
- estresse;
- dificuldade;
- conquista;
- mudança;
- observação.

### Ações
- salvar;
- continuar depois;
- enviar.

### Estados
- primeira vez;
- recorrente;
- atrasado;
- já concluído;
- indisponível.

---

## P-021 — Resultado do Check-in

### Conteúdo
- resumo;
- comparação;
- mudança relevante;
- observação;
- perfil atualizado;
- próximo check-in.

### Ações
- ver perfil;
- abrir timeline;
- conversar.

---

## P-022 — Timeline

### Objetivo
Exibir histórico.

### Filtros
- todos;
- check-ins;
- perfil;
- peso;
- eventos;
- hipóteses;
- feedback.

### Estados
- vazia;
- poucos eventos;
- longa;
- erro.

---

## P-023 — Detalhe de Evento

### Conteúdo
- tipo;
- data;
- origem;
- valor;
- relação;
- impacto;
- observação.

---

## P-024 — Assistente Higeia

### Objetivo
Permitir interação de baixo risco.

### Componentes
- histórico;
- campo de mensagem;
- atalhos;
- aviso de escopo;
- reportar resposta.

### Atalhos
- registrar dificuldade;
- registrar conquista;
- explicar meu perfil;
- revisar uma hipótese;
- falar sobre a semana.

### Estados
- padrão;
- digitando;
- resposta;
- fora de escopo;
- segurança;
- indisponível;
- limite de uso.

---

## M-005 — Resposta Fora de Escopo

### Conteúdo
- explicação;
- orientação;
- busca de profissional;
- emergência quando aplicável.

---

## M-006 — Reportar Resposta

### Motivos
- incorreta;
- insegura;
- ofensiva;
- fora de contexto;
- prescritiva;
- outro.

---

# 11. Conta e preferências

## P-025 — Configurações

### Itens
- perfil;
- notificações;
- privacidade;
- dados;
- segurança;
- pausa;
- exclusão;
- sair.

---

## P-026 — Perfil da Conta

### Campos
- nome;
- e-mail;
- data de nascimento;
- preferências.

---

## P-027 — Notificações

### Controles
- check-in;
- perfil atualizado;
- lembretes;
- novidades;
- canal.

---

## P-028 — Privacidade

### Controles
- análise personalizada;
- histórico;
- uso anonimizado;
- compartilhamento futuro;
- revogar consentimento.

---

## P-029 — Meus Dados

### Ações
- visualizar dados;
- solicitar exportação;
- corrigir;
- baixar;
- ver histórico de consentimentos.

---

## P-030 — Pausar Acompanhamento

### Opções
- 1 semana;
- 1 mês;
- até eu voltar;
- pausar notificações;
- manter dados.

---

## M-007 — Confirmar Pausa

### Conteúdo
- efeito;
- duração;
- reativação.

---

## P-031 — Excluir Conta

### Etapas
- informar consequências;
- autenticar;
- confirmar;
- registrar solicitação.

---

## M-008 — Confirmação de Exclusão

### Requisito
Confirmação explícita.

---

# 12. Feedback e suporte

## P-032 — Feedback Geral

### Categorias
- bug;
- conteúdo;
- interpretação;
- segurança;
- usabilidade;
- sugestão.

---

## P-033 — Central de Ajuda

### Conteúdo
- FAQ;
- privacidade;
- segurança;
- contato;
- status do sistema.

---

# 13. Administração mínima

## A-001 — Admin Login

### Requisitos
- autenticação forte;
- MFA futuro;
- acesso restrito.

---

## A-002 — Admin Dashboard

### Indicadores
- usuários;
- onboarding;
- anamnese;
- perfis;
- check-ins;
- erros;
- respostas sinalizadas;
- incidentes.

---

## A-003 — Usuários

### Ações
- buscar;
- filtrar;
- visualizar status;
- suspender;
- registrar nota operacional.

### Limite
Exibir mínimo necessário.

---

## A-004 — Feedback

### Ações
- listar;
- classificar;
- atribuir;
- resolver;
- registrar resposta.

---

## A-005 — Respostas Sinalizadas

### Conteúdo
- mensagem;
- contexto;
- classificação;
- risco;
- ação;
- status.

---

## A-006 — Incidentes

### Conteúdo
- data;
- severidade;
- impacto;
- usuário;
- ação;
- resolução;
- aprendizado.

---

# 14. Navegação principal

## Mobile

Barra inferior:

- Início;
- Check-in;
- Assistente;
- Perfil;
- Mais.

## Desktop

Menu lateral:

- Dashboard;
- Perfil;
- Check-ins;
- Timeline;
- Assistente;
- Configurações.

## Regra
A navegação deve priorizar as ações de maior frequência.

---

# 15. Estados globais

## Loading
Skeleton ou progresso real.

## Empty
Explicar por que não há conteúdo e qual o próximo passo.

## Error
Mensagem clara, sem culpar o usuário.

## Offline
Permitir continuar quando possível.

## Data Insufficient
Explicar quais dados faltam.

## Safety
Priorizar orientação adequada.

## Maintenance
Informar indisponibilidade.

---

# 16. Modais e componentes compartilhados

## Modais
- consentimento detalhado;
- explicar pergunta;
- salvar e sair;
- corrigir informação;
- feedback;
- reportar resposta;
- confirmar pausa;
- confirmar exclusão.

## Componentes
- progress bar;
- evidence card;
- hypothesis card;
- confidence badge;
- timeline item;
- insight card;
- consent item;
- warning banner;
- safety banner;
- empty state;
- feedback widget.

---

# 17. Dependências entre telas

- Perfil depende de anamnese concluída.
- Dashboard depende de perfil gerado.
- Resultado do check-in depende de check-in enviado.
- Timeline depende de eventos.
- Detalhe de hipótese depende de hipótese existente.
- Assistente depende de conta ativa e consentimento.
- Admin depende de permissão específica.

---

# 18. Regras de acesso

## Público
Landing, como funciona, FAQ, termos e privacidade.

## Usuário não verificado
Cadastro, login e verificação.

## Usuário em onboarding
Consentimentos e anamnese.

## Usuário ativo
Dashboard, perfil, check-in, timeline, assistente e configurações.

## Usuário pausado
Acesso ao histórico e configurações, sem acompanhamento ativo.

## Usuário suspenso
Acesso limitado e suporte.

## Admin
Acesso conforme função.

---

# 19. Analytics por tela

Cada tela deve registrar:

- page_view;
- tempo;
- ação principal;
- abandono;
- erro;
- conclusão;
- feedback;
- dispositivo;
- origem.

Telas de IA também devem registrar:

- versão do prompt;
- versão do modelo;
- versão do HIE;
- latência;
- custo;
- safety flags;
- feedback.

---

# 20. Critérios de aceite

O mapa estará pronto para wireframes quando:

- todas as telas do PRD estiverem representadas;
- cada tela tiver objetivo;
- ações e estados estiverem definidos;
- rotas estiverem claras;
- dependências estiverem documentadas;
- navegação mobile e desktop estiver definida;
- segurança e privacidade estiverem incorporadas;
- fluxos de erro existirem;
- analytics estiverem mapeados.

---

# 21. Próximo documento

O próximo documento será:

> Higeia Assessment Specification v0.1.

Ele detalhará:

- blocos da anamnese;
- perguntas;
- tipos de resposta;
- obrigatoriedade;
- lógica adaptativa;
- sinais de segurança;
- mapeamento para o HKM;
- critérios de conclusão.

---

# 22. Histórico

| Versão | Data | Alteração |
|---|---|---|
| 0.1 | 13/07/2026 | Primeiro mapa completo de telas do MVP B2C. |
