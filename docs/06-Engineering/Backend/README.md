# Higeia Backend Engineering Book

**Versão:** 1.0  
**Status:** Baseline inicial

## Finalidade

Este conjunto de documentos é o manual operacional da engenharia de backend da Higeia.

Ele serve para:

- orientar desenvolvedores e agentes de IA;
- manter consistência;
- reduzir retrabalho;
- apoiar revisão de código;
- proteger limites de domínio;
- tornar segurança e multi-tenancy explícitos;
- registrar quando uma decisão exige ADR.

## Ordem recomendada de leitura

1. Domain Model
2. Backend Architecture
3. Module Guidelines
4. API Conventions
5. Error Handling
6. Coding Standards
7. Testing Strategy
8. Security and Tenancy
9. ADRs aplicáveis

Os quatro últimos documentos serão incluídos na Entrega 2.

## Índice

- `HIGEIA-DOMAIN-MODEL-v1.0.md`: conceitos, regras e escopo.
- `HIGEIA-BACKEND-ARCHITECTURE-v1.0.md`: arquitetura e dependências.
- `HIGEIA-MODULE-GUIDELINES-v1.0.md`: criação e evolução de módulos.
- `HIGEIA-API-CONVENTIONS-v1.0.md`: padrão HTTP/JSON.

## Hierarquia das decisões

1. legislação, privacidade e segurança;
2. ADR aprovado;
3. Domain Model;
4. Backend Architecture;
5. Security and Tenancy;
6. API Conventions;
7. Module Guidelines;
8. Coding Standards;
9. preferência local de implementação.

## Quando criar ADR

Crie um ADR quando houver mudança relevante em:

- stack;
- cloud ou implantação;
- banco ou mensageria;
- limites do monólito modular;
- autenticação;
- estratégia de tenant;
- provedor de IA;
- versionamento público;
- integração externa com risco operacional.

## Processo de mudança

1. identificar documentos afetados;
2. decidir se exige ADR;
3. atualizar documentação;
4. implementar;
5. testar;
6. revisar segurança e tenancy;
7. registrar evidências;
8. fazer commit e revisão.

A documentação deve ser útil, não burocrática.
