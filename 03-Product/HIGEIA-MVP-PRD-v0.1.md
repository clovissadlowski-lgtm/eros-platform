# Higeia — Product Requirements Document

**Documento:** Higeia MVP PRD  
**Versão:** 0.1  
**Status:** Rascunho funcional oficial  
**Data:** 13 de julho de 2026  
**Projeto interno:** Projeto Eros  
**Produto:** Higeia  
**Fundador:** Clovis Sadlowski  

---

## 1. Objetivo

Definir o primeiro produto construível do Higeia.

Este documento traduz a visão fundadora em:

- problema;
- público;
- proposta de valor;
- escopo;
- funcionalidades;
- fluxos;
- telas;
- regras de negócio;
- critérios de aceite;
- métricas;
- riscos;
- plano de validação.

---

## 2. Resumo do produto

O Higeia será inicialmente uma aplicação web responsiva B2C para pessoas que buscam emagrecimento personalizado.

O produto deverá ajudar o usuário a compreender como rotina, comportamento, alimentação, sono, atividade física e contexto influenciam sua evolução.

O primeiro momento de valor será a geração do **Perfil de Inteligência Pessoal**, criado após uma anamnese adaptativa.

---

## 3. Problema

Pessoas que desejam emagrecer frequentemente recebem orientações genéricas ou planos pouco compatíveis com sua realidade.

As principais dificuldades incluem:

- rotina variável;
- falta de tempo;
- baixa preparação alimentar;
- sono insuficiente;
- estresse;
- histórico de tentativas frustradas;
- pouca compreensão sobre padrões pessoais;
- dificuldade de manter consistência.

O problema não é apenas falta de conhecimento. Muitas pessoas sabem o que deveriam fazer, mas não entendem por que não conseguem sustentar a estratégia.

---

## 4. Hipótese de valor

> Se o usuário compreender melhor seus próprios padrões, barreiras e fatores de influência, terá maior capacidade de construir estratégias sustentáveis de emagrecimento.

---

## 5. Público-alvo inicial

### Persona principal

Pessoa adulta que:

- deseja emagrecer;
- já tentou outras estratégias;
- possui rotina relativamente corrida;
- usa smartphone;
- aceita responder perguntas sobre hábitos e rotina;
- valoriza personalização;
- não busca diagnóstico médico;
- pode ou não estar acompanhada por profissional.

### Perfil exemplo

**Nome fictício:** Marina  
**Idade:** 32 anos  
**Objetivo:** perder gordura corporal  
**Contexto:** trabalha em horário comercial, treina algumas vezes por semana, já tentou dietas restritivas e tem dificuldade de manter consistência aos finais de semana.

---

## 6. Proposta de valor

### Mensagem principal

> Entenda como sua rotina, seus hábitos e seu comportamento influenciam seu emagrecimento.

### Benefícios esperados

- maior autoconhecimento;
- identificação de barreiras;
- percepção de padrões;
- acompanhamento contínuo;
- visualização de evolução;
- orientações comportamentais de baixo risco;
- preparação mais qualificada para conversar com profissionais.

---

## 7. Princípios de produto

1. Compreensão antes da recomendação.
2. Hipóteses não são fatos.
3. Toda análise relevante deve ser explicável.
4. O usuário deve saber quais dados foram utilizados.
5. O produto não deve diagnosticar ou prescrever.
6. O produto deve reconhecer quando há dados insuficientes.
7. A experiência deve ser simples, apesar da complexidade interna.
8. O usuário deve manter controle sobre seus dados.
9. O MVP deve provar valor antes de expandir escopo.
10. O produto não deve prometer emagrecimento.

---

## 8. Escopo do MVP

### Incluído

1. Página inicial pública.
2. Criação de conta.
3. Login e recuperação de acesso.
4. Consentimentos básicos.
5. Anamnese adaptativa.
6. Coleta de dados estruturados.
7. Perguntas conversacionais de aprofundamento.
8. Geração do Perfil de Inteligência Pessoal.
9. Dashboard inicial.
10. Check-in semanal.
11. Linha do tempo básica.
12. Visualização de evolução.
13. Assistente Higeia de escopo controlado.
14. Registro de hipóteses e evidências.
15. Configurações de privacidade.
16. Exclusão de conta.
17. Registro de feedback do usuário.
18. Painel administrativo mínimo.
19. Auditoria básica de respostas da IA.

### Não incluído

- aplicativo nativo;
- prescrição de dieta;
- prescrição de treino;
- diagnóstico;
- teleconsulta;
- integração com wearables;
- marketplace;
- rede social;
- prontuário médico;
- pagamentos complexos;
- múltiplos profissionais;
- modelo fundacional próprio;
- automação clínica;
- recomendação medicamentosa.

---

## 9. Fluxo principal

```text
Landing Page
    ↓
Cadastro
    ↓
Consentimento
    ↓
Anamnese Adaptativa
    ↓
Revisão das respostas
    ↓
Processamento HIE
    ↓
Perfil de Inteligência Pessoal
    ↓
Dashboard
    ↓
Check-in semanal
    ↓
Atualização do perfil
    ↓
Evolução longitudinal
```

---

## 10. Jornada inicial do usuário

### Etapa 1 — Descoberta

O usuário acessa a página inicial e entende:

- o que é o Higeia;
- o que ele entrega;
- o que ele não faz;
- como seus dados serão utilizados.

### Etapa 2 — Cadastro

O usuário cria conta com:

- nome;
- e-mail;
- senha;
- confirmação de idade mínima;
- aceite de termos;
- aceite de política de privacidade.

### Etapa 3 — Consentimento

O usuário escolhe:

- participar da análise personalizada;
- permitir armazenamento de histórico;
- permitir uso anonimizado futuro, quando aplicável;
- receber notificações.

### Etapa 4 — Anamnese

O usuário responde blocos de perguntas.

### Etapa 5 — Aprofundamento

O Higeia identifica respostas que exigem contexto adicional.

### Etapa 6 — Perfil inicial

O usuário recebe:

- resumo;
- pontos fortes;
- barreiras;
- fatores de influência;
- hipóteses;
- lacunas;
- próximos aspectos a observar.

### Etapa 7 — Acompanhamento

O usuário recebe check-ins periódicos e visualiza evolução.

---

## 11. Módulos

# 11.1 Identity

### Objetivo
Gerenciar conta, autenticação, consentimentos e preferências.

### Funcionalidades
- cadastro;
- login;
- recuperação de senha;
- edição de perfil;
- exclusão de conta;
- gestão de consentimento;
- exportação futura de dados.

### Critérios de aceite
- usuário consegue criar conta;
- e-mail é validado;
- senha atende requisitos mínimos;
- consentimentos são registrados com data;
- usuário consegue solicitar exclusão.

---

# 11.2 Assessment

### Objetivo
Coletar informações iniciais de forma estruturada e adaptativa.

### Blocos iniciais
1. Identidade básica.
2. Objetivo.
3. Histórico de peso.
4. Alimentação.
5. Rotina.
6. Sono.
7. Atividade física.
8. Estresse percebido.
9. Dificuldades.
10. Tentativas anteriores.
11. Preferências.
12. Restrições.
13. Saúde declarada.
14. Medicações declaradas.
15. Expectativas.

### Regras
- perguntas sensíveis devem explicar por que são feitas;
- usuário pode pular perguntas não obrigatórias;
- respostas críticas podem acionar aviso para buscar profissional;
- perguntas adaptativas devem ser limitadas para evitar fadiga;
- progresso deve ficar visível;
- respostas devem ser revisáveis.

### Critérios de aceite
- usuário conclui anamnese;
- progresso é salvo;
- pode sair e continuar depois;
- respostas estruturadas e livres são armazenadas;
- perguntas adaptativas são registradas com origem.

---

# 11.3 Personal Intelligence Profile

### Objetivo
Entregar o primeiro momento de valor.

### Seções
1. Quem você é neste momento.
2. Seu objetivo.
3. Pontos fortes.
4. Barreiras.
5. Fatores de influência.
6. Padrões possíveis.
7. Hipóteses iniciais.
8. Informações insuficientes.
9. Próximos aspectos a observar.
10. Avisos de segurança.

### Regras
- separar fatos de inferências;
- indicar origem das informações;
- não usar linguagem diagnóstica;
- não prometer resultado;
- não apresentar confiança numérica sem método validado;
- permitir feedback do usuário.

### Critérios de aceite
- perfil é gerado após conclusão da anamnese;
- cada hipótese apresenta evidências;
- usuário pode marcar informação como incorreta;
- sistema registra feedback;
- relatório pode ser revisitado.

---

# 11.4 Dashboard

### Objetivo
Apresentar visão simples da situação atual e próximos passos.

### Elementos
- saudação;
- resumo do perfil;
- progresso da semana;
- próximo check-in;
- mudanças recentes;
- fatores em observação;
- atalhos;
- aviso de escopo.

### Critérios de aceite
- dashboard carrega em dispositivos móveis;
- usuário visualiza último perfil;
- usuário vê próximo check-in;
- mudanças recentes aparecem;
- dados insuficientes são explicitados.

---

# 11.5 Check-in semanal

### Objetivo
Atualizar o contexto do usuário.

### Campos iniciais
- peso opcional;
- qualidade da semana;
- alimentação;
- fome;
- sono;
- energia;
- atividade física;
- estresse;
- maior dificuldade;
- maior conquista;
- mudança de rotina;
- observação livre.

### Regras
- duração ideal inferior a 5 minutos;
- dados anteriores podem ser comparados;
- perguntas adaptativas devem ser curtas;
- usuário pode pular itens opcionais.

### Critérios de aceite
- check-in é salvo;
- usuário recebe confirmação;
- linha do tempo é atualizada;
- perfil pode ser recalculado;
- mudanças relevantes são destacadas.

---

# 11.6 Assistente Higeia

### Objetivo
Permitir interação contínua de baixo risco.

### Pode fazer
- coletar contexto;
- lembrar metas;
- explicar o funcionamento do produto;
- ajudar o usuário a refletir;
- sugerir organização;
- apresentar informações do próprio histórico;
- incentivar busca de profissional quando necessário.

### Não pode fazer
- diagnosticar;
- prescrever dieta;
- prescrever exercício;
- indicar medicamentos;
- contradizer orientação profissional;
- garantir causa ou resultado;
- tratar emergência.

### Critérios de aceite
- respostas fora de escopo são redirecionadas;
- temas sensíveis acionam fluxo seguro;
- respostas são auditáveis;
- o assistente informa suas limitações.

---

# 11.7 Timeline

### Objetivo
Organizar histórico longitudinal.

### Eventos
- conclusão de anamnese;
- geração de perfil;
- check-ins;
- mudanças de objetivo;
- peso;
- medidas;
- feedback;
- alertas;
- atualização de consentimento.

### Critérios de aceite
- eventos aparecem em ordem cronológica;
- origem é exibida;
- usuário pode abrir detalhes;
- eventos sensíveis respeitam permissões.

---

# 11.8 Feedback

### Objetivo
Medir utilidade e corrigir erros.

### Tipos
- informação incorreta;
- interpretação inadequada;
- pergunta confusa;
- resposta insegura;
- insight útil;
- sugestão.

### Critérios de aceite
- feedback é registrado;
- possui contexto da tela;
- pode ser revisado por administrador;
- dados pessoais são protegidos.

---

# 11.9 Admin

### Objetivo
Permitir operação mínima.

### Funcionalidades
- listar usuários;
- visualizar status de onboarding;
- visualizar erros;
- revisar feedback;
- revisar respostas sinalizadas;
- suspender conta;
- registrar incidentes.

### Limite
Não deve expor dados sensíveis sem necessidade.

---

## 12. Telas do MVP

1. Landing Page.
2. Cadastro.
3. Login.
4. Recuperação de senha.
5. Consentimentos.
6. Boas-vindas.
7. Introdução à anamnese.
8. Anamnese por blocos.
9. Pergunta adaptativa.
10. Revisão das respostas.
11. Tela de processamento.
12. Perfil de Inteligência Pessoal.
13. Dashboard.
14. Check-in semanal.
15. Resultado do check-in.
16. Linha do tempo.
17. Detalhes de hipótese.
18. Assistente Higeia.
19. Configurações.
20. Privacidade e dados.
21. Feedback.
22. Exclusão de conta.
23. Admin login.
24. Admin dashboard.
25. Admin feedback review.

---

## 13. Requisitos funcionais

### RF-001
O sistema deve permitir cadastro por e-mail.

### RF-002
O sistema deve validar o e-mail.

### RF-003
O sistema deve registrar consentimentos com versão, data e origem.

### RF-004
O sistema deve permitir salvar e continuar a anamnese.

### RF-005
O sistema deve suportar perguntas estruturadas e livres.

### RF-006
O sistema deve registrar quais perguntas foram geradas adaptativamente.

### RF-007
O sistema deve gerar um perfil após a conclusão.

### RF-008
O sistema deve distinguir fatos, relatos, inferências e hipóteses.

### RF-009
O sistema deve exibir evidências associadas a hipóteses.

### RF-010
O sistema deve permitir contestar informações.

### RF-011
O sistema deve registrar check-ins.

### RF-012
O sistema deve criar linha do tempo.

### RF-013
O sistema deve permitir interação com o assistente.

### RF-014
O sistema deve limitar respostas fora do escopo.

### RF-015
O sistema deve permitir exclusão de conta.

### RF-016
O sistema deve registrar feedback.

### RF-017
O sistema deve manter logs de respostas da IA.

### RF-018
O sistema deve oferecer painel administrativo mínimo.

---

## 14. Requisitos não funcionais

### RNF-001 — Responsividade
A aplicação deve funcionar em smartphone, tablet e desktop.

### RNF-002 — Segurança
Dados sensíveis devem ser protegidos em trânsito e em repouso.

### RNF-003 — Privacidade
Coleta deve seguir minimização de dados.

### RNF-004 — Disponibilidade
Meta inicial de 99,5% após lançamento público.

### RNF-005 — Desempenho
Páginas principais devem carregar em até 3 segundos em conexão móvel razoável.

### RNF-006 — Auditabilidade
Respostas da IA devem ser rastreáveis.

### RNF-007 — Explicabilidade
Hipóteses devem apresentar base e limitações.

### RNF-008 — Acessibilidade
Interface deve seguir princípios básicos de acessibilidade.

### RNF-009 — Versionamento
Prompts, regras, termos e consentimentos devem ser versionados.

### RNF-010 — Observabilidade
Erros e falhas devem ser registráveis.

---

## 15. Regras de negócio

### RB-001
O usuário deve possuir idade mínima definida juridicamente.

### RB-002
O Higeia não deve iniciar análise sem consentimento.

### RB-003
Perguntas não essenciais devem ser opcionais.

### RB-004
Informações críticas devem gerar orientação segura.

### RB-005
Hipóteses não podem ser exibidas como fatos.

### RB-006
Confiança numérica não será usada no MVP sem validação.

### RB-007
O usuário poderá corrigir dados.

### RB-008
A exclusão de conta deverá iniciar processo de remoção conforme política.

### RB-009
O assistente deve reconhecer limitações.

### RB-010
Informações de terceiros não devem ser coletadas sem necessidade.

---

## 16. Critérios de sucesso do MVP

### Produto
- 60% dos usuários iniciados concluem a anamnese.
- 70% dos concluintes visualizam o perfil completo.
- 40% retornam para o primeiro check-in.
- 25% retornam para o segundo check-in.
- nota média de utilidade do perfil igual ou superior a 7/10.

### Segurança
- zero respostas críticas não tratadas em testes controlados;
- 100% das respostas sinalizadas auditáveis;
- taxa de hipóteses contestadas monitorada;
- nenhum diagnóstico ou prescrição indevida em cenários de teste aprovados.

### Negócio
- pelo menos 20% manifestam interesse em continuar;
- pelo menos 10% demonstram disposição inicial a pagar;
- custo de aquisição ainda será medido em experimento separado.

---

## 17. Eventos analíticos

- landing_viewed;
- signup_started;
- signup_completed;
- consent_completed;
- assessment_started;
- assessment_section_completed;
- assessment_abandoned;
- assessment_completed;
- profile_generated;
- profile_viewed;
- hypothesis_opened;
- feedback_submitted;
- checkin_started;
- checkin_completed;
- assistant_opened;
- assistant_message_sent;
- safety_redirect_triggered;
- subscription_interest_clicked;
- account_deletion_requested.

---

## 18. Dependências

- serviço de autenticação;
- banco de dados;
- provedor de IA;
- camada HIE inicial;
- biblioteca de formulários;
- hospedagem;
- serviço de e-mail;
- sistema de logs;
- política de privacidade;
- termos de uso;
- revisão jurídica;
- avaliação de segurança.

---

## 19. Riscos

### R-001
Anamnese longa causar abandono.

### R-002
Perfil parecer genérico.

### R-003
Usuário interpretar hipótese como diagnóstico.

### R-004
IA responder fora do escopo.

### R-005
Custo por uso de IA inviável.

### R-006
Baixa retenção semanal.

### R-007
Dificuldade de aquisição B2C.

### R-008
Insegurança jurídica.

### R-009
Coleta excessiva de dados.

### R-010
Digital Twin gerar expectativa exagerada.

---

## 20. Mitigações

- anamnese dividida em etapas;
- progresso visível;
- perfil baseado em evidências do usuário;
- linguagem de incerteza;
- testes de segurança;
- limites de uso;
- resumos antes de aprofundamento;
- revisão jurídica;
- minimização de dados;
- explicação clara do Digital Twin.

---

## 21. Plano de validação

### Teste 1 — Compreensão da proposta
Mostrar landing page a 10 usuários.

### Teste 2 — Anamnese
Observar 5 usuários preenchendo.

### Teste 3 — Perfil
Avaliar utilidade e correção percebida.

### Teste 4 — Check-in
Medir retorno após 7 dias.

### Teste 5 — Assistente
Executar cenários seguros e inseguros.

### Teste 6 — Monetização
Apresentar oferta simulada.

---

## 22. Critério de pronto

O MVP será considerado pronto para alpha fechado quando:

- fluxo completo funcionar;
- perfil for gerado;
- check-in atualizar histórico;
- assistente respeitar limites;
- feedback funcionar;
- logs estiverem ativos;
- exclusão de conta estiver disponível;
- testes de segurança forem concluídos;
- política de privacidade e termos estiverem revisados;
- 5 usuários internos completarem o fluxo sem bloqueio crítico.

---

## 23. Roadmap resumido

### Alpha 0.1
Cadastro, anamnese, perfil, dashboard e check-in.

### Alpha 0.2
Assistente, timeline, feedback e segurança ampliada.

### Beta
Assinatura, melhorias de retenção, dados de evolução e testes externos.

### Futuro
Nutricionistas, treinamento, integrações e módulos profissionais.

---

## 24. Questões abertas

1. Qual idade mínima?
2. Quais perguntas serão obrigatórias?
3. Quanto tempo máximo para a anamnese?
4. Qual provedor de IA?
5. Qual modelo de assinatura?
6. Quais dados corporais serão coletados?
7. Fotos serão incluídas no Alpha?
8. Como tratar relatos de transtorno alimentar?
9. Como tratar menores de idade?
10. Qual país será o primeiro mercado?
11. Como será a revisão humana das respostas?
12. Quais termos públicos serão usados para Digital Twin?

---

## 25. Próximos documentos

1. Jornada do usuário.
2. Mapa de telas.
3. Especificação da anamnese.
4. Especificação do Perfil de Inteligência Pessoal.
5. Higeia Knowledge Model.
6. Arquitetura do HIE.
7. Modelo de dados.
8. Segurança e LGPD.

---

## 26. Histórico

| Versão | Data | Alteração |
|---|---|---|
| 0.1 | 13/07/2026 | Primeira especificação funcional do MVP Higeia. |
