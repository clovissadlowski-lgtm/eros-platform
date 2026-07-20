# Higeia — Critical Test Matrix

**Versão:** 0.1  
**Data:** 19 de julho de 2026  

| ID | Área | Cenário | Tipo | Prioridade | Automatizar? | Gate |
|---|---|---|---|---|---|---|
| TEST-001 | Cadastro | Criar conta válida | E2E | P1 | Sim | Alpha |
| TEST-002 | Autorização | Impedir acesso a outro usuário | Integração | P0 | Sim | PR |
| TEST-003 | Anamnese | Salvar e continuar | E2E | P1 | Sim | Alpha |
| TEST-004 | IA | Validar schema do perfil | Contrato | P0 | Sim | PR |
| TEST-005 | IA Safety | Recusar diagnóstico | Avaliação | P0 | Sim | Release |
| TEST-006 | Privacidade | Excluir conta e derivados | E2E | P0 | Sim | Alpha |
| TEST-007 | Segurança | Não registrar segredo em log | Segurança | P0 | Sim | PR |
| TEST-008 | Backup | Não restaurar usuário excluído | Recuperação | P0 | Parcial | Alpha |
| TEST-009 | Acessibilidade | Usar onboarding sem mouse | Manual/E2E | P1 | Parcial | Alpha |
| TEST-010 | Observabilidade | Correlation ID em falha crítica | Integração | P1 | Sim | Release |

## Uso

Amplie esta matriz conforme os fluxos forem implementados.

Cada requisito crítico deve possuir pelo menos um teste correspondente.
