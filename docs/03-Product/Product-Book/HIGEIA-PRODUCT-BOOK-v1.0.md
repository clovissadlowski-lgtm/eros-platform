# Higeia — Product Book

**Documento:** Higeia Product Book  
**Versão:** 1.0  
**Status:** Documento mestre inicial do produto  
**Data:** 20 de julho de 2026  
**Projeto interno:** Projeto Eros  
**Produto:** Higeia  
**Fundador:** Clovis Sadlowski  

---

## 1. Objetivo

Consolidar a definição do produto Higeia, incluindo:

- problema central;
- usuários;
- proposta de valor;
- visão do produto;
- escopo do MVP;
- escopo do Alpha;
- casos de uso;
- jornadas;
- funcionalidades;
- restrições;
- métricas;
- hipóteses;
- riscos;
- critérios de sucesso;
- critérios de interrupção;
- itens incluídos, excluídos e adiados.

---

## 2. Visão do produto

O Higeia é uma plataforma de acompanhamento de saúde assistida por inteligência artificial, inicialmente focada em nutrição e evolução física.

Seu objetivo é ajudar profissionais e usuários a transformar informações dispersas em acompanhamento estruturado, longitudinal, contextualizado e acionável.

A IA deve funcionar como assistente, nunca como substituta autônoma de profissionais de saúde.

---

## 3. Problema central

Profissionais de saúde recebem informações extensas, fragmentadas e difíceis de consolidar.

Entre os problemas observados:

- anamnese longa e pouco estruturada;
- dificuldade de cruzar variáveis;
- informações espalhadas;
- pouco acompanhamento entre consultas;
- baixa capacidade de observar evolução longitudinal;
- dependência de planilhas;
- perda de contexto;
- carga operacional elevada;
- dificuldade de personalização contínua;
- decisões baseadas em fotografia isolada do paciente.

---

## 4. Usuários iniciais

### Usuário primário

Nutricionista.

### Usuário secundário

Paciente acompanhado pelo nutricionista.

### Usuários futuros

- personal trainer;
- médico;
- fisioterapeuta;
- psicólogo;
- clínica;
- operadora;
- equipe multiprofissional.

---

## 5. Proposta de valor

### Para o nutricionista

- reduzir tempo de coleta e organização;
- melhorar qualidade da anamnese;
- consolidar evolução;
- reduzir retrabalho;
- apoiar acompanhamento longitudinal;
- destacar mudanças relevantes;
- melhorar preparação da consulta.

### Para o paciente

- facilitar check-ins;
- acompanhar evolução;
- organizar informações;
- visualizar progresso;
- melhorar continuidade;
- reduzir repetição de dados;
- oferecer experiência mais personalizada.

---

## 6. Princípios de produto

1. Problema antes da tecnologia.
2. Assistência, não substituição profissional.
3. Evidência antes de escala.
4. Segurança antes de conveniência.
5. Transparência antes de automação.
6. Menor dado necessário.
7. Controle do usuário.
8. Revisão humana onde necessário.
9. Escopo limitado no Alpha.
10. Valor comprovado antes de expansão.

---

## 7. Hipótese principal

Se o Higeia organizar a coleta, consolidação e evolução de dados do paciente de forma assistida por IA, então o nutricionista poderá reduzir esforço operacional e melhorar a qualidade do acompanhamento, sem aumentar risco clínico, privacidade ou dependência indevida da IA.

---

## 8. MVP

O MVP deve provar três capacidades:

### Capability 1 — Structured Intake

Coleta estruturada e progressiva de informações.

### Capability 2 — Weekly Check-in

Check-in simples com medidas, relato e evolução.

### Capability 3 — Professional Summary

Resumo longitudinal para revisão do profissional.

---

## 9. Escopo inicial do Alpha

### Incluído

- cadastro do profissional;
- cadastro do paciente;
- convite do paciente;
- anamnese estruturada;
- check-in semanal;
- registro de peso e medidas;
- relato textual;
- upload limitado de fotos;
- resumo assistido por IA;
- painel básico do profissional;
- histórico longitudinal;
- revisão humana obrigatória;
- feedback do profissional;
- logs e monitoramento básicos.

### Excluído

- diagnóstico;
- prescrição médica;
- prescrição automática;
- alteração autônoma de dieta;
- recomendação medicamentosa;
- interpretação autônoma de exames;
- triagem de emergência;
- integração com prontuário externo;
- wearable integration;
- marketplace;
- pagamento complexo;
- multi-especialidade;
- app nativo completo.

### Restrito

- inferências;
- linguagem clínica;
- alertas sensíveis;
- uso de memória;
- uso de fotos;
- recomendações;
- compartilhamento;
- exportação.

### Manual

- revisão de outputs;
- suporte;
- aprovação de novos usuários;
- análise de incidentes;
- correção de registros;
- ajustes de prompt.

---

## 10. Casos de uso prioritários

### UC-001 — AI-assisted structured anamnesis

Objetivo: apoiar coleta estruturada e reduzir perda de contexto.

### UC-002 — Weekly patient progress summary

Objetivo: consolidar evolução semanal.

### UC-003 — Longitudinal intelligence profile

Objetivo: organizar histórico e contexto longitudinal.

### UC-004 — Safety escalation detection

Objetivo: identificar linguagem que exija encaminhamento ou interrupção, sem substituir avaliação profissional.

---

## 11. Prioridade recomendada

### P0

- consentimento;
- isolamento de dados;
- segurança;
- revisão humana;
- incident response;
- limites clínicos.

### P1

- anamnese estruturada;
- check-in semanal;
- resumo profissional;
- histórico longitudinal.

### P2

- feedback sobre resumos;
- métricas de uso;
- melhorias de UX;
- notificações básicas.

### P3

- automações avançadas;
- personalização ampla;
- integrações;
- múltiplos profissionais.

---

## 12. Jornada do nutricionista

1. Cria conta.
2. Configura perfil.
3. Convida paciente.
4. Acompanha preenchimento.
5. Revisa anamnese.
6. Recebe check-ins.
7. Revisa resumo.
8. Corrige ou aprova.
9. Usa informação na consulta.
10. Acompanha evolução.

---

## 13. Jornada do paciente

1. Recebe convite.
2. Cria acesso.
3. Aceita termos aplicáveis.
4. Preenche anamnese.
5. Envia check-in.
6. Registra medidas.
7. Envia relato.
8. Visualiza evolução permitida.
9. Corrige dados.
10. Solicita exclusão ou suporte quando necessário.

---

## 14. Funcionalidades principais

### Professional Workspace

- patient list;
- patient profile;
- anamnesis review;
- weekly summary;
- longitudinal timeline;
- feedback;
- flags;
- notes.

### Patient Experience

- onboarding;
- consent;
- anamnesis;
- weekly check-in;
- measurements;
- photos;
- text report;
- history;
- privacy controls.

### AI Assistance

- structured questioning;
- summarization;
- change detection;
- missing information identification;
- uncertainty labeling;
- safety flagging;
- source linking where applicable.

---

## 15. Limites do produto

O Higeia não deve:

- diagnosticar;
- prescrever;
- substituir consulta;
- recomendar medicamentos;
- afirmar certeza clínica sem fundamento;
- tomar decisão crítica autônoma;
- ocultar que existe IA;
- memorizar informação sensível sem base;
- usar dados para treinamento sem autorização;
- ignorar contestação do usuário.

---

## 16. Dados mínimos

### Profissional

- nome;
- email;
- registro profissional quando aplicável;
- especialidade;
- consentimentos;
- configurações.

### Paciente

- identificação mínima;
- contato;
- idade/faixa;
- medidas;
- histórico declarado;
- rotina;
- objetivos;
- restrições;
- consentimentos;
- check-ins.

---

## 17. Dados proibidos ou adiados no Alpha

- dados sem finalidade definida;
- dados de terceiros;
- geolocalização precisa;
- áudio contínuo;
- biometria avançada;
- dados de wearable;
- prontuários externos em massa;
- dados para treinamento automático;
- dados clínicos não necessários.

---

## 18. Métricas de produto

### Ativação

- profissional que convida ao menos um paciente;
- paciente que conclui anamnese.

### Engajamento

- check-ins enviados;
- revisões concluídas;
- uso recorrente.

### Valor

- tempo economizado;
- redução de retrabalho;
- qualidade percebida;
- utilidade do resumo;
- satisfação.

### Qualidade

- correções manuais;
- omissões;
- inconsistências;
- taxa de aceitação do resumo.

### Segurança

- unsafe output rate;
- incidentes;
- escalonamentos;
- disputas;
- bloqueios.

### Custo

- custo por check-in;
- custo por resumo;
- custo por usuário ativo.

---

## 19. Critérios iniciais de sucesso

- fluxo completo utilizável;
- profissionais conseguem revisar dados;
- pacientes conseguem concluir check-in;
- resumo reduz esforço;
- outputs incorretos são identificáveis;
- revisão humana funciona;
- nenhum risco crítico permanece aberto;
- rollback e monitoring funcionam;
- custo permanece dentro do limite definido.

---

## 20. Critérios de interrupção

- risco clínico grave;
- falha de isolamento;
- incidente de dados;
- output inseguro recorrente;
- ausência de revisão humana;
- custo descontrolado;
- baixa qualidade persistente;
- baixa utilidade;
- impossibilidade regulatória;
- ausência de suporte.

---

## 21. Alpha population

Proposta inicial:

- nutricionistas convidados;
- pequeno número de pacientes;
- duração limitada;
- suporte próximo;
- feedback estruturado;
- operação geograficamente limitada;
- escopo funcional reduzido.

Os números finais devem ser definidos antes do gate de Alpha.

---

## 22. Hipóteses a validar

1. Nutricionistas têm problema relevante de organização.
2. Pacientes completam check-ins.
3. Resumos reduzem tempo.
4. Profissionais confiam com revisão.
5. O histórico longitudinal gera valor.
6. O custo é sustentável.
7. O fluxo não aumenta risco.
8. O onboarding é compreensível.
9. A proposta é diferenciada.
10. Existe disposição de pagamento.

---

## 23. Riscos de produto

- excesso de escopo;
- baixa adoção;
- confiança excessiva;
- pouca diferenciação;
- alto custo;
- fricção;
- dados incompletos;
- uso inadequado;
- expectativa clínica indevida;
- dificuldade de aquisição.

---

## 24. Itens adiados

- múltiplas especialidades;
- app nativo completo;
- wearables;
- integração hospitalar;
- prescrição assistida;
- marketplace;
- pagamentos avançados;
- seguradoras;
- automação comercial;
- expansão internacional;
- analytics avançado.

---

## 25. Sequência de entrega

1. Account and access.
2. Professional onboarding.
3. Patient invitation.
4. Consent and privacy.
5. Structured anamnesis.
6. Weekly check-in.
7. Measurements and text.
8. AI summary.
9. Professional review.
10. Feedback.
11. Monitoring.
12. Controlled Alpha.

---

## 26. Decision gates

### Product Definition Gate

Problema, usuário e proposta aprovados.

### MVP Scope Gate

Incluído, excluído e adiado definidos.

### Use Case Gate

Hipótese, risco, owner e métrica definidos.

### Prototype Gate

Fluxos principais validados.

### Build Gate

Arquitetura e dados aprovados.

### Alpha Gate

Readiness concluída.

---

## 27. Critérios de mudança de escopo

Mudança deve ocorrer apenas quando:

- problema comprovado;
- valor esperado;
- risco avaliado;
- capacidade disponível;
- impacto no cronograma conhecido;
- decisão registrada.

---

## 28. Source of truth

Este Product Book é a fonte principal para:

- visão;
- usuários;
- MVP;
- Alpha;
- escopo;
- casos de uso;
- métricas;
- limites.

Detalhes operacionais permanecem nos registros específicos.

---

## 29. Próximas decisões obrigatórias

1. Quantos profissionais no Alpha?
2. Quantos pacientes?
3. Qual duração?
4. Qual região?
5. Fotos serão incluídas?
6. Quais medidas?
7. Qual nível de memória?
8. Quais outputs o paciente verá?
9. Qual human review?
10. Qual modelo de cobrança futuro?

---

## 30. Histórico

| Versão | Data | Alteração |
|---|---|---|
| 1.0 | 20/07/2026 | Criação do Product Book inicial. |
