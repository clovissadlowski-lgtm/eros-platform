# Higeia Coding Standards v1.0

**Status:** Baseline aprovada  
**Escopo:** TypeScript, NestJS e monorepo  
**Versão:** 1.0

## 1. Finalidade

Este documento define como o código da Higeia deve ser escrito, organizado e revisado.

O objetivo é maximizar:

- clareza;
- consistência;
- segurança;
- previsibilidade;
- facilidade de manutenção;
- qualidade de colaboração com humanos e agentes de IA.

## 2. Idioma técnico

O código usa inglês.

Usar inglês em:

- arquivos;
- classes;
- funções;
- variáveis;
- enums;
- erros;
- rotas;
- contratos;
- comentários técnicos.

Documentação de negócio pode estar em português quando apropriado, mas os conceitos devem permanecer alinhados ao Domain Model.

## 3. Nomenclatura

### Classes

```text
PascalCase
```

Exemplos:

- PatientsService
- CreatePatientDto
- AIProviderAdapter

### Funções e variáveis

```text
camelCase
```

Exemplos:

- createPatient
- organizationId
- reviewedAt

### Arquivos

```text
kebab-case
```

Exemplos:

- create-patient.dto.ts
- patients.controller.ts
- ai-provider.adapter.ts

### Constantes

```text
UPPER_SNAKE_CASE
```

Exemplos:

- DEFAULT_PAGE_SIZE
- MAX_UPLOAD_SIZE

### Enums

Tipo em PascalCase; valores em UPPER_SNAKE_CASE.

```ts
export enum PatientStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
}
```

## 4. TypeScript

Regras:

- modo estrito ativo;
- evitar `any`;
- preferir `unknown` quando o tipo é desconhecido;
- usar narrowing explícito;
- não silenciar erro de tipo sem justificativa;
- não usar `as` para forçar contratos falsos;
- tipar retornos públicos;
- preferir tipos imutáveis quando possível.

Uso de `any` exige comentário ou decisão explícita em revisão.

## 5. Null e undefined

Convenção:

- `undefined`: valor não fornecido;
- `null`: ausência intencional representada no contrato.

Não misturar sem necessidade.

DTOs devem deixar claro quando um campo é:

- obrigatório;
- opcional;
- anulável;
- opcional e anulável.

## 6. Funções

Funções devem:

- ter uma responsabilidade;
- ter nome orientado à intenção;
- evitar efeitos colaterais ocultos;
- receber dependências explicitamente;
- retornar tipo previsível;
- ser pequenas o suficiente para compreensão.

Evitar:

- funções genéricas como `processData`;
- muitos parâmetros posicionais;
- booleanos ambíguos;
- mutação silenciosa de argumentos.

Preferir objetos de parâmetros quando houver muitos campos.

## 7. Classes

Classes devem existir quando houver:

- estado;
- comportamento;
- ciclo de vida;
- necessidade de injeção;
- invariantes.

Não criar classes vazias apenas para seguir padrão.

## 8. Async e await

- usar `async/await`;
- sempre aguardar Promise relevante;
- não ignorar Promise;
- tratar timeout em integrações;
- evitar execução sequencial quando operações independentes podem ser paralelas;
- evitar paralelismo quando compromete transação ou limite de provedor.

## 9. Datas

- UTC internamente;
- ISO 8601 em contratos;
- data sem horário para `birthDate`;
- não usar string local formatada em domínio;
- encapsular lógica de timezone quando aparecer;
- testes não devem depender do relógio real quando houver regra temporal.

## 10. Controllers

Controllers devem ser finos.

Exemplo aceitável:

```ts
@Post()
create(@Body() dto: CreatePatientDto) {
  return this.patientsService.createPatient(dto);
}
```

Regra de negócio não pertence ao controller.

## 11. Services

Services expressam casos de uso.

Nomes preferidos:

- createPatient;
- completeAssessment;
- publishCarePlan;
- reviewAIAnalysis.

Evitar services genéricos que acumulam dezenas de responsabilidades.

## 12. DTOs

- usar decorators de validação;
- mensagens e regras consistentes;
- não incluir campo de tenant público;
- não reutilizar DTO de resposta como entidade;
- não aceitar campos extras.

## 13. Repositórios

- contrato em módulo proprietário;
- implementação em infraestrutura;
- métodos orientados ao domínio;
- tenant explícito;
- não retornar objeto cru de ORM para fora da infraestrutura.

## 14. Mappers

Use mapper quando houver separação entre:

- modelo de banco;
- entidade de domínio;
- resposta pública;
- resposta de provedor.

Não espalhar conversões por controllers e services.

## 15. Erros

- lançar erro tipado;
- não lançar string;
- não capturar erro apenas para ignorá-lo;
- não usar `console.log(error)` como tratamento;
- traduzir erro externo no adapter;
- preservar causa internamente quando seguro.

## 16. Logs

Usar logger estruturado.

Evitar:

```ts
console.log(...)
```

em código de produção.

Logs devem indicar:

- evento;
- módulo;
- requestId;
- tenant;
- resultado;
- duração.

Nunca registrar segredo ou dado clínico desnecessário.

## 17. Comentários

Comentários explicam por quê, não o óbvio.

Bom:

```ts
// Preserve the original answer set because completed assessments are immutable.
```

Ruim:

```ts
// Set status to completed
assessment.status = 'COMPLETED';
```

TODO deve conter contexto e, quando disponível, referência de issue.

## 18. Dependências

Antes de adicionar biblioteca:

- verificar necessidade;
- verificar manutenção;
- verificar licença;
- verificar segurança;
- verificar peso;
- verificar se a plataforma já resolve;
- registrar ADR quando material.

Não adicionar dependência apenas para função trivial.

## 19. Configuração

- não acessar `process.env` fora da camada de config;
- não codificar segredo;
- usar valores tipados;
- atualizar `.env.example`;
- validar na inicialização.

## 20. Imports

Ordem recomendada:

1. Node;
2. bibliotecas externas;
3. módulos internos;
4. imports relativos.

Evitar caminhos relativos profundos quando alias estável estiver aprovado.

## 21. Exportações

- exportar apenas o necessário;
- evitar `index.ts` que esconda ciclos;
- evitar barrel files excessivos;
- contratos públicos do módulo devem ser claros.

## 22. ESLint e Prettier

Antes de commit:

```powershell
pnpm --filter api run lint
pnpm --filter api run format
pnpm --filter api run build
pnpm --filter api run test
```

Os scripts podem evoluir, mas lint, formatação, build e testes são gates.

## 23. Commits

Usar Conventional Commits.

Exemplos:

```text
feat(patients): add patient creation endpoint
fix(api): map validation errors consistently
docs(engineering): add testing strategy
test(patients): cover tenant isolation
refactor(ai): introduce provider adapter
```

Um commit deve representar uma mudança coerente.

## 24. Branches

Padrão sugerido:

```text
feat/...
fix/...
chore/...
docs/...
refactor/...
```

Branches devem ser curtas e integradas com frequência.

## 25. Pull Requests

PR deve informar:

- problema;
- solução;
- impacto de domínio;
- impacto de segurança;
- impacto de tenant;
- testes;
- evidências;
- documentação;
- ADR, quando aplicável.

## 26. Código proibido por padrão

- `any` sem justificativa;
- segredo no repositório;
- acesso direto ao banco no controller;
- SDK externo no domínio;
- tenant vindo do body;
- `catch` vazio;
- `console.log` permanente;
- desabilitar validação;
- comentário com dado real de paciente;
- arquivo temporário versionado;
- duplicação deliberada sem explicação;
- dependência circular escondida.

## 27. Checklist de revisão

- nomes refletem o domínio?
- função tem responsabilidade clara?
- tipos são seguros?
- tenant está explícito?
- dados sensíveis estão protegidos?
- controller está fino?
- regra está testada?
- erro está padronizado?
- dependência nova é necessária?
- documentação está alinhada?
