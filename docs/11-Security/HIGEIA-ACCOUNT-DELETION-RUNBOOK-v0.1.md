# Higeia — Account Deletion Runbook

**Versão:** 0.1  
**Status:** Procedimento preliminar  
**Data:** 19 de julho de 2026  

## 1. Objetivo

Executar uma solicitação de exclusão de conta de forma segura, completa, auditável e repetível.

## 2. Checklist operacional

### Recebimento

- [ ] Pedido recebido.
- [ ] Identidade autenticada.
- [ ] Protocolo criado.
- [ ] Prazo interno iniciado.
- [ ] Conta marcada como `deletion_pending`.

### Bloqueio

- [ ] Sessões revogadas quando aplicável.
- [ ] Novos processamentos bloqueados.
- [ ] Novas mensagens bloqueadas.
- [ ] Novos jobs bloqueados.
- [ ] Campanhas bloqueadas.

### Mapeamento

- [ ] Conta.
- [ ] Perfil.
- [ ] Consentimentos.
- [ ] Anamnese.
- [ ] Respostas.
- [ ] Health Signals.
- [ ] Eventos.
- [ ] Estados.
- [ ] Memórias.
- [ ] Hipóteses.
- [ ] Evidências.
- [ ] Trajetórias.
- [ ] Perfis gerados.
- [ ] Check-ins.
- [ ] Conversas.
- [ ] Arquivos.
- [ ] Feedback.
- [ ] Safety flags.
- [ ] Embeddings.
- [ ] Cache.
- [ ] Fornecedores.
- [ ] Analytics identificáveis.

### Execução

- [ ] Dados ativos excluídos.
- [ ] Arquivos excluídos.
- [ ] Índices excluídos.
- [ ] Cache invalidado.
- [ ] Jobs cancelados.
- [ ] Fornecedores acionados.
- [ ] Dados derivados revisados.
- [ ] Exceções segregadas.

### Validação

- [ ] Conta não autentica.
- [ ] Dados não aparecem na aplicação.
- [ ] Busca não retorna o usuário.
- [ ] Jobs não recriam dados.
- [ ] Backup restore test não reativa dados.
- [ ] Processo idempotente.

### Conclusão

- [ ] Registro de auditoria finalizado.
- [ ] Exceções documentadas.
- [ ] Titular informado.
- [ ] Pedido encerrado.

## 3. Regra

Nunca registrar no log final o conteúdo dos dados que foram excluídos.
