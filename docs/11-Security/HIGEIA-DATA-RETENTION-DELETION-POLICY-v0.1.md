# Higeia — Data Retention and Deletion Policy

**Documento:** Higeia Data Retention and Deletion Policy  
**Versão:** 0.1  
**Status:** Política operacional preliminar  
**Data:** 19 de julho de 2026  
**Projeto interno:** Projeto Eros  
**Produto:** Higeia  
**Fundador:** Clovis Sadlowski  

---

## 1. Objetivo

Definir como o Higeia armazenará, arquivará, anonimizará e excluirá dados pessoais e dados derivados ao longo de todo o ciclo de vida do usuário.

Esta política orienta:

- produto;
- engenharia;
- banco de dados;
- inteligência artificial;
- suporte;
- segurança;
- fornecedores;
- operações;
- atendimento aos titulares;
- desligamento de contas;
- resposta a incidentes.

Este documento deverá ser revisado por profissional jurídico antes de uso com usuários reais.

---

## 2. Princípios

1. Dados não devem ser armazenados por prazo indefinido sem justificativa.
2. Cada categoria deve possuir finalidade e critério de retenção.
3. A exclusão deve alcançar dados diretamente identificáveis e derivados, quando aplicável.
4. Backups e logs devem seguir política própria.
5. Dados bloqueados não podem continuar sendo usados para novas finalidades.
6. A retenção deve ser proporcional ao risco.
7. Dados sensíveis exigem prazos e acessos mais restritos.
8. A exclusão deve ser auditável.
9. O usuário deve receber confirmação do processo.
10. Exceções legais devem ser documentadas e segregadas.

---

## 3. Escopo

Esta política cobre:

- conta;
- perfil;
- cadastro;
- consentimentos;
- anamnese;
- respostas;
- Health Signals;
- check-ins;
- memórias;
- hipóteses;
- evidências;
- trajetória;
- Perfil de Inteligência;
- mensagens;
- feedback;
- arquivos;
- logs;
- incidentes;
- backups;
- dados em fornecedores;
- dados agregados;
- dados anonimizados;
- dados de teste derivados de produção, que serão proibidos sem processo formal.

---

## 4. Estados do dado

Cada registro deve estar em um dos estados:

- active;
- inactive;
- archived;
- blocked;
- anonymized;
- deletion_pending;
- deleted;
- legal_hold.

### Active

Dado utilizado na finalidade atual.

### Inactive

Dado ainda armazenado, mas fora do uso principal.

### Archived

Dado preservado por histórico ou obrigação documentada.

### Blocked

Dado temporariamente impedido de novos tratamentos.

### Anonymized

Dado transformado de modo a não permitir vinculação razoável ao titular.

### Deletion Pending

Dado marcado para exclusão.

### Deleted

Dado removido do ambiente ativo.

### Legal Hold

Dado preservado por obrigação legal, regulatória, contratual ou defesa de direito, com acesso segregado.

---

## 5. Classes de retenção

### R0 — Transitória

Retenção por minutos, horas ou poucos dias.

Exemplos:

- cache;
- sessão;
- arquivos temporários;
- working memory;
- resultados intermediários.

### R1 — Curta

Retenção por até 90 dias.

Exemplos:

- logs técnicos comuns;
- falhas transitórias;
- dados de suporte de baixa criticidade.

### R2 — Operacional

Retenção durante a conta ativa e período limitado após encerramento.

Exemplos:

- perfil;
- respostas;
- check-ins;
- preferências;
- timeline.

### R3 — Segurança e auditoria

Retenção conforme risco, necessidade de investigação e política aprovada.

Exemplos:

- logs de acesso;
- incidentes;
- alterações de consentimento;
- auditoria.

### R4 — Obrigação documentada

Retenção pelo período necessário à obrigação legal, contratual, regulatória ou exercício de direitos.

### R5 — Anônimo ou agregado

Retenção possível após anonimização efetiva e avaliação de reidentificação.

---

## 6. Matriz preliminar de retenção

Os prazos abaixo são propostas internas e deverão ser validados antes do Alpha fechado.

| Categoria | Classe | Retenção proposta | Ação final |
|---|---|---:|---|
| Conta ativa | R2 | Enquanto ativa | Manter |
| Conta encerrada | R2 | Até 30 dias para processamento | Excluir ou anonimizar |
| Perfil básico | R2 | Conta ativa | Excluir com a conta |
| Anamnese | R2 | Conta ativa | Excluir com a conta |
| Check-ins | R2 | Conta ativa | Excluir com a conta |
| Mensagens | R2 | Conta ativa ou prazo menor | Excluir ou resumir |
| Memória longitudinal | R2 | Conta ativa | Excluir ou anonimizar |
| Hipóteses e evidências | R2 | Conta ativa | Excluir ou anonimizar |
| Arquivos enviados | R2 | Conta ativa | Excluir do storage |
| Consentimentos | R3/R4 | Prazo aprovado | Arquivar de forma restrita |
| Logs técnicos | R1/R3 | 30 a 180 dias | Excluir |
| Logs de segurança | R3 | 180 dias ou prazo aprovado | Excluir ou arquivar |
| Incidentes | R3/R4 | Conforme política aprovada | Arquivar |
| Backups | R3 | Ciclo definido | Expirar |
| Dados de cobrança futuros | R4 | Conforme obrigação aplicável | Arquivar |
| Dados anonimizados | R5 | Conforme finalidade | Manter se irreversível |
| Analytics identificáveis | R1/R2 | Prazo curto | Agregar ou excluir |

---

## 7. Retenção durante conta ativa

Enquanto a conta estiver ativa, o Higeia poderá manter apenas os dados necessários para:

- prestar o serviço;
- manter continuidade;
- produzir histórico;
- garantir segurança;
- atender direitos;
- operar suporte;
- cumprir obrigações documentadas.

### Regra

O fato de a conta estar ativa não autoriza retenção ilimitada de todos os dados.

---

## 8. Inatividade

Uma conta poderá ser classificada como inativa quando não houver uso por período definido.

Antes de qualquer exclusão automática, o processo deverá prever:

- aviso;
- canal de retorno;
- exportação quando aplicável;
- confirmação;
- exceções;
- registro.

### Status

A regra automática de inatividade ainda não está aprovada.

---

## 9. Exclusão solicitada pelo usuário

Fluxo:

1. receber pedido;
2. autenticar;
3. emitir protocolo;
4. bloquear novos tratamentos incompatíveis;
5. marcar conta como `deletion_pending`;
6. localizar dados;
7. excluir dados ativos;
8. excluir arquivos;
9. remover chaves de busca;
10. revisar memórias;
11. revisar hipóteses e derivados;
12. solicitar exclusão em fornecedores;
13. registrar exceções;
14. concluir;
15. comunicar o titular.

---

## 10. Exclusão de dados derivados

Dados derivados incluem:

- hipóteses;
- estados;
- trajetória;
- Perfil de Inteligência;
- resumos;
- embeddings futuros;
- classificações;
- sinais de segurança;
- features.

### Regra

Se o dado derivado puder ser vinculado ao titular, ele deverá ser incluído no fluxo de exclusão.

### Exceção

Dados anonimizados de forma efetiva poderão ser mantidos, desde que a anonimização seja comprovável e o risco de reidentificação avaliado.

---

## 11. Exclusão de memória

A exclusão deve alcançar:

- factual memory;
- contextual memory;
- behavioral memory;
- evolution memory;
- preference memory;
- strategy memory;
- safety memory;
- session memory persistida;
- working memory persistida;
- embeddings;
- índices;
- caches;
- resumos.

---

## 12. Mensagens e conversas

Mensagens não devem ser retidas automaticamente por prazo indefinido.

Opções futuras:

- retenção integral por prazo limitado;
- resumo estruturado;
- exclusão de conteúdo bruto;
- preservação apenas de eventos relevantes;
- separação entre mensagem e memória.

### Regra

A retenção de conversas completas deverá ser justificada por finalidade específica.

---

## 13. Arquivos

Arquivos enviados devem possuir:

- owner;
- finalidade;
- sensitivity;
- checksum;
- storage key;
- upload date;
- retention class;
- deletion status.

### Exclusão

A exclusão deve remover:

- objeto;
- miniaturas;
- versões;
- previews;
- cache;
- referências;
- índices;
- derivados;
- cópias em processamento.

---

## 14. Logs

### Logs de aplicação

Retenção curta.

### Logs de segurança

Retenção proporcional ao risco.

### Logs de auditoria

Retenção conforme finalidade e obrigação.

### Regra

Nenhum log deve manter conteúdo sensível integral sem justificativa.

---

## 15. Backups

Backups devem possuir:

- periodicidade;
- janela;
- retenção;
- criptografia;
- acesso;
- teste de restauração;
- expiração automática;
- procedimento de exclusão diferida.

### Exclusão e backup

Quando um dado for excluído:

- ele deve ser removido dos sistemas ativos;
- não deve voltar ao ativo após restauração;
- pode permanecer temporariamente em backup protegido;
- deve expirar pelo ciclo normal;
- o processo deve documentar a limitação.

---

## 16. Fornecedores

Cada fornecedor deve ser avaliado quanto a:

- retenção;
- exclusão;
- backup;
- suboperadores;
- logs;
- treinamento;
- exportação;
- prazo de remoção;
- confirmação de exclusão.

### Regra

O fluxo de exclusão não termina no banco principal.

---

## 17. Legal Hold

Quando houver necessidade de preservação:

- o dado deve ser segregado;
- o acesso deve ser limitado;
- o motivo deve ser registrado;
- o prazo deve ser revisto;
- o dado não deve ser usado para produto, IA ou marketing;
- o titular deve ser informado quando juridicamente aplicável.

---

## 18. Anonimização

A anonimização deve:

- remover identificadores;
- reduzir granularidade;
- avaliar combinação de atributos;
- impedir ligação razoável;
- revisar risco;
- possuir registro técnico.

### Proibido

Chamar pseudonimização de anonimização.

---

## 19. Analytics

Preferências:

- eventos mínimos;
- IDs pseudônimos;
- agregação;
- retenção curta;
- exclusão de identificadores;
- separação entre produto e marketing.

---

## 20. Dados de pesquisa

Retenção separada deverá ser definida para cada estudo.

Não reutilizar automaticamente dados do produto para pesquisa.

---

## 21. Dados de menores

Enquanto menores não forem aceitos, qualquer conta identificada como menor deve:

- interromper onboarding;
- limitar coleta;
- gerar fluxo de revisão;
- evitar processamento;
- definir exclusão segura.

---

## 22. Exclusão técnica

Processo técnico recomendado:

1. criar pedido;
2. gerar data map;
3. bloquear conta;
4. remover relações;
5. remover arquivos;
6. remover dados derivados;
7. invalidar sessões;
8. invalidar cache;
9. comunicar operadores;
10. registrar execução;
11. confirmar consistência;
12. finalizar.

---

## 23. Idempotência

O processo deve ser idempotente.

Executar a mesma solicitação novamente não pode:

- recriar dados;
- gerar conflito;
- falhar por estado anterior;
- duplicar confirmação;
- perder auditoria.

---

## 24. Auditoria da exclusão

Registrar:

- request ID;
- user ID;
- data;
- solicitante;
- autenticação;
- sistemas;
- fornecedores;
- dados excluídos;
- dados retidos;
- motivo;
- responsável;
- resultado;
- conclusão.

### Regra

O log de auditoria não deve reter o conteúdo excluído.

---

## 25. Testes obrigatórios

Antes do Alpha fechado:

- exclusão de conta;
- exclusão de arquivos;
- exclusão de memória;
- exclusão de hipóteses;
- exclusão de sessões;
- exclusão em fornecedor;
- expiração de logs;
- restauração de backup sem reativar dado excluído;
- reexecução idempotente;
- exceção de legal hold.

---

## 26. Métricas

- pedidos recebidos;
- tempo de conclusão;
- falhas;
- dados retidos;
- fornecedores pendentes;
- pedidos reabertos;
- erros de restauração;
- incidentes relacionados;
- volume por categoria.

---

## 27. Responsabilidades

### Produto

Definir finalidade e necessidade.

### Engenharia

Implementar lifecycle, estados, jobs e auditoria.

### Segurança

Revisar riscos e acessos.

### Privacidade/Jurídico

Validar prazos, exceções e comunicações.

### Operações

Acompanhar pedidos.

### Fornecedores

Cumprir instruções contratuais.

---

## 28. Critérios de aprovação

A política estará pronta para Alpha quando:

- matriz for validada;
- prazos forem aprovados;
- fornecedores estiverem mapeados;
- exclusão estiver implementada;
- testes passarem;
- backups estiverem documentados;
- direitos do titular estiverem integrados;
- revisão jurídica estiver concluída.

---

## 29. Questões abertas

1. Prazo final de conta inativa.
2. Prazo final de logs.
3. Prazo de consentimentos.
4. Tratamento de backups.
5. Tratamento de embeddings.
6. Retenção de conversas.
7. Retenção de incidentes.
8. Retenção de billing.
9. Política de legal hold.
10. Processo em fornecedores.
11. Limite para dados anonimizados.
12. Exportação antes da exclusão.

---

## 30. Histórico

| Versão | Data | Alteração |
|---|---|---|
| 0.1 | 19/07/2026 | Criação da política preliminar de retenção e exclusão. |
