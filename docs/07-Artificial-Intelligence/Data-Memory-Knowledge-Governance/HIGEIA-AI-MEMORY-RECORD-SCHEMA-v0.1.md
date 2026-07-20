# Higeia — AI Memory Record Schema

**Versão:** 0.1

## Campos

| Field | Required | Description |
|---|---|---|
| memory_id | Yes | Identificador único |
| subject_id | Yes | Identificador pseudonimizado |
| category | Yes | Tipo de memória |
| value | Yes | Conteúdo estruturado |
| source_type | Yes | Origem |
| source_id | No | Referência à origem |
| truth_type | Yes | Declared, measured, inferred etc. |
| confidence | Yes | High, medium, low, unknown |
| sensitivity | Yes | Classificação |
| purpose | Yes | Finalidade |
| created_at | Yes | Criação |
| updated_at | Yes | Atualização |
| expires_at | No | Expiração |
| status | Yes | Estado |
| model_id | No | Modelo que derivou |
| prompt_id | No | Prompt que derivou |
| correction_of | No | Memória corrigida |
| superseded_by | No | Nova memória |
| deletion_status | Yes | Estado de exclusão |

## Regras

- Toda memória deve ter finalidade.
- Memória inferida deve ser marcada.
- Dados temporais devem expirar.
- Correções devem propagar.
- Exclusão deve incluir derivados.
