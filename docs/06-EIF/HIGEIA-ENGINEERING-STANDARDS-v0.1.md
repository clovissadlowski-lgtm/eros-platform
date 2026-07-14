# Higeia — Engineering Standards

**Documento:** Higeia Engineering Standards  
**Versão:** 0.1  
**Status:** Rascunho técnico oficial  
**Data:** 13 de julho de 2026  
**Projeto interno:** Projeto Eros  
**Produto:** Higeia  
**Fundador:** Clovis Sadlowski  

---

## 1. Objetivo

Definir os padrões mínimos de engenharia do Higeia.

Este documento orienta:

- organização do código;
- convenções;
- branches;
- commits;
- pull requests;
- testes;
- segurança;
- documentação;
- revisão;
- CI/CD;
- gestão de dependências;
- observabilidade;
- qualidade;
- Definition of Ready;
- Definition of Done.

---

## 2. Princípios

1. Código deve ser compreensível antes de ser sofisticado.
2. Simplicidade é preferível a abstração prematura.
3. Toda regra crítica deve ser testada.
4. Segurança não é etapa final.
5. Mudanças devem ser pequenas e revisáveis.
6. Documentação deve acompanhar o código.
7. Produção deve ser observável.
8. Toda decisão relevante deve ser registrada.
9. Falhas devem ser tratadas de forma explícita.
10. O projeto deve permanecer executável por pessoas além do autor original.

---

## 3. Organização do repositório

Estrutura sugerida:

```text
eros-platform/
  apps/
    web/
    api/
    worker/
  packages/
    ui/
    config/
    types/
    validation/
    hie/
    database/
  docs/
  scripts/
  tests/
  .github/
```

Para uma versão full-stack inicial:

```text
eros-platform/
  src/
    app/
    components/
    features/
    lib/
    services/
    server/
    types/
  prisma/
  public/
  docs/
  tests/
```

A estrutura final dependerá da decisão Next.js full-stack ou backend separado.

---

## 4. Organização por domínio

O código deve ser agrupado por domínio quando possível.

Domínios iniciais:

- identity;
- consent;
- assessment;
- profile;
- checkin;
- conversation;
- memory;
- safety;
- audit;
- admin.

Exemplo:

```text
features/
  assessment/
    components/
    services/
    schemas/
    tests/
    types/
```

---

## 5. Linguagem

### Principal
TypeScript.

### Regras
- `strict` habilitado;
- evitar `any`;
- tipos compartilhados centralizados;
- schemas validados em runtime;
- nullable e optional tratados explicitamente.

---

## 6. Convenções de nomes

### Arquivos
- `kebab-case.ts`
- `kebab-case.tsx`

### Componentes
- `PascalCase`

### Funções e variáveis
- `camelCase`

### Constantes
- `UPPER_SNAKE_CASE`

### Tipos
- `PascalCase`

### Banco
- `snake_case`

### Rotas
- `kebab-case`

---

## 7. Estilo de código

### Ferramentas
- ESLint;
- Prettier;
- TypeScript;
- editorconfig.

### Regras
- sem código morto;
- sem imports não usados;
- sem comentários redundantes;
- funções pequenas;
- nomes descritivos;
- early return quando útil;
- tratamento explícito de erro.

---

## 8. Funções

Funções devem:

- ter responsabilidade única;
- receber entradas claras;
- retornar tipo previsível;
- evitar efeitos colaterais ocultos;
- tratar falhas;
- ser testáveis.

Evitar:

- funções com muitos parâmetros;
- lógica de negócio em componentes visuais;
- chamadas externas misturadas a regras centrais;
- estados globais desnecessários.

---

## 9. Componentes de interface

Componentes devem ser:

- acessíveis;
- reutilizáveis quando fizer sentido;
- pequenos;
- responsivos;
- independentes de regra crítica;
- testáveis.

Separar:

- apresentação;
- estado;
- acesso a dados;
- validação;
- analytics.

---

## 10. Validação

Toda entrada deve ser validada no servidor.

### Ferramenta sugerida
Zod.

### Aplicações
- formulários;
- parâmetros;
- respostas de API;
- saídas de IA;
- variáveis de ambiente;
- eventos;
- filas.

---

## 11. Tratamento de erros

Erros devem possuir:

- código;
- mensagem;
- contexto;
- correlation ID;
- nível;
- ação esperada.

Exemplo:

```json
{
  "code": "PROFILE_GENERATION_FAILED",
  "message": "Não foi possível gerar o perfil.",
  "correlation_id": "..."
}
```

Nunca expor:

- stack trace;
- segredo;
- SQL;
- dados sensíveis;
- detalhe interno desnecessário.

---

## 12. Logging

Logs devem ser:

- estruturados;
- mínimos;
- úteis;
- correlacionados;
- classificados.

Níveis:

- debug;
- info;
- warn;
- error;
- critical.

Não registrar:

- senhas;
- tokens;
- documentos completos;
- dados sensíveis sem necessidade;
- prompts completos com PII em produção.

---

## 13. Branches

Estratégia sugerida:

- `main` — produção;
- `develop` — opcional;
- `feature/...`;
- `fix/...`;
- `docs/...`;
- `chore/...`;
- `hotfix/...`.

Para equipe pequena, trunk-based development com branches curtas é preferível.

---

## 14. Commits

Usar padrão semântico:

```text
feat:
fix:
docs:
refactor:
test:
chore:
perf:
ci:
build:
```

Exemplos:

```text
feat: add adaptive assessment progress
fix: prevent duplicate profile generation
docs: update HIE architecture
```

Regras:

- um propósito por commit;
- mensagem clara;
- evitar commits gigantes;
- não versionar segredos;
- código deve compilar.

---

## 15. Pull Requests

Toda PR deve conter:

- objetivo;
- contexto;
- alterações;
- testes;
- riscos;
- screenshots quando aplicável;
- impacto em dados;
- impacto em segurança;
- documentação alterada;
- plano de rollback.

PRs devem ser pequenas sempre que possível.

---

## 16. Revisão de código

Revisar:

- correção;
- clareza;
- segurança;
- testes;
- performance;
- acessibilidade;
- privacidade;
- observabilidade;
- impacto arquitetural;
- documentação.

Bloqueadores:

- falha crítica;
- falta de teste em regra central;
- vazamento;
- regra duplicada;
- ausência de migration;
- quebra de compatibilidade sem plano.

---

## 17. Definition of Ready

Uma tarefa está pronta para desenvolvimento quando possui:

- problema claro;
- usuário;
- objetivo;
- requisito;
- critério de aceite;
- dependências;
- risco;
- referência documental;
- design ou fluxo quando necessário;
- regra de negócio;
- eventos analíticos.

---

## 18. Definition of Done

Uma tarefa está pronta quando:

- código concluído;
- testes aprovados;
- lint aprovado;
- typecheck aprovado;
- build aprovado;
- critérios de aceite atendidos;
- segurança revisada;
- analytics implementado;
- logs implementados;
- documentação atualizada;
- migration criada quando necessária;
- rollback possível;
- deploy em staging validado.

---

## 19. Testes

### Unitários
Regras isoladas.

### Integração
Banco, API, filas, serviços.

### End-to-end
Fluxos críticos.

### Contrato
Integrações e saídas estruturadas.

### Segurança
Auth, permissões, limites.

### IA
Prompts, safety, regressão, factualidade.

### Acessibilidade
Teclado, labels, contraste, navegação.

---

## 20. Cobertura

Cobertura não deve ser única métrica.

Priorizar:

- regras críticas;
- consentimento;
- exclusão;
- geração de perfil;
- safety;
- autorização;
- correção;
- auditoria.

---

## 21. Test data

Dados de teste devem ser:

- fictícios;
- controlados;
- reproduzíveis;
- sem PII real.

Proibido usar dados reais em desenvolvimento sem processo formal.

---

## 22. Test fixtures

Criar cenários:

- usuário novo;
- assessment incompleto;
- assessment completo;
- dados conflitantes;
- safety flag;
- perfil gerado;
- erro de IA;
- exclusão solicitada.

---

## 23. Segurança

Toda feature deve verificar:

- autenticação;
- autorização;
- validação;
- rate limiting;
- exposição de dados;
- logs;
- segredos;
- input malicioso;
- prompt injection quando aplicável.

---

## 24. Dependências

Regras:

- adicionar somente quando necessário;
- revisar licença;
- revisar manutenção;
- evitar duplicidade;
- atualizar regularmente;
- bloquear dependências vulneráveis;
- usar lockfile.

---

## 25. Segredos

Segredos devem ficar em:

- variáveis de ambiente;
- secret manager;
- ambiente de deploy.

Nunca em:

- código;
- commit;
- screenshot;
- documentação pública;
- issue.

---

## 26. Banco de dados

Toda mudança deve:

- ter migration;
- ser reversível quando possível;
- preservar dados;
- ter teste;
- atualizar modelo;
- revisar índices;
- revisar privacidade.

---

## 27. APIs

Padrões:

- versionamento;
- schemas;
- autenticação;
- erros padronizados;
- paginação;
- idempotência;
- correlation ID;
- documentação.

---

## 28. Idempotência

Obrigatória em:

- geração de perfil;
- criação de job;
- pagamentos futuros;
- exclusão;
- notificações;
- integrações.

---

## 29. Jobs e filas

Jobs devem possuir:

- ID;
- tipo;
- status;
- tentativas;
- timeout;
- retry;
- dead-letter;
- correlation ID;
- idempotency key.

---

## 30. Código de IA

Todo fluxo de IA deve registrar:

- prompt version;
- model version;
- HIE version;
- input schema;
- output schema;
- safety status;
- custo;
- latência;
- feedback.

---

## 31. Prompts

Prompts devem:

- possuir arquivo próprio;
- ter versão;
- ter owner;
- ter testes;
- ter exemplos;
- definir limites;
- produzir saída estruturada.

Prompts não devem ficar espalhados em componentes.

---

## 32. Feature flags

Novas capacidades sensíveis devem ser liberadas por flag.

Exemplos:

- assistente;
- novo modelo;
- nova anamnese;
- novo perfil;
- upload de fotos.

---

## 33. Observabilidade

Toda feature crítica deve produzir:

- logs;
- métricas;
- eventos;
- alertas quando aplicável.

Sem observabilidade, a feature não está pronta.

---

## 34. Performance

Antes de otimizar:

1. medir;
2. localizar;
3. corrigir;
4. medir novamente.

Evitar otimização prematura.

---

## 35. Acessibilidade

Requisitos mínimos:

- navegação por teclado;
- labels;
- foco visível;
- contraste;
- texto alternativo;
- mensagens de erro acessíveis;
- sem dependência apenas de cor.

---

## 36. Documentação

Atualizar quando houver mudança em:

- API;
- schema;
- fluxo;
- arquitetura;
- segurança;
- IA;
- consentimento;
- operação.

---

## 37. ADRs

Criar ADR para:

- tecnologia principal;
- banco;
- autenticação;
- fila;
- provedor de IA;
- mudança arquitetural;
- nova integração;
- mudança de dados sensíveis.

---

## 38. Issues

Toda issue deve conter:

- título claro;
- contexto;
- objetivo;
- critério de aceite;
- prioridade;
- labels;
- dependências;
- referência documental.

---

## 39. Prioridade

Sugestão:

- P0 — bloqueia operação;
- P1 — crítica;
- P2 — importante;
- P3 — melhoria;
- P4 — futura.

---

## 40. Bugs

Bug deve registrar:

- ambiente;
- passos;
- resultado esperado;
- resultado real;
- evidência;
- severidade;
- impacto;
- versão.

---

## 41. Releases

Cada release deve possuir:

- versão;
- changelog;
- migrations;
- riscos;
- testes;
- rollback;
- aprovador;
- monitoramento.

---

## 42. Versionamento

Sugestão:

SemVer.

```text
MAJOR.MINOR.PATCH
```

Exemplo:

```text
0.1.0
```

---

## 43. Ambientes

Regras:

- nada de dados reais em local;
- variáveis separadas;
- chaves separadas;
- logs separados;
- deploy reproduzível;
- staging obrigatório antes de produção.

---

## 44. CI

Pipeline mínimo:

1. install;
2. lint;
3. typecheck;
4. unit tests;
5. integration tests;
6. security scan;
7. build.

---

## 45. CD

Produção deve exigir:

- branch protegida;
- checks aprovados;
- revisão;
- staging validado;
- changelog;
- rollback disponível.

---

## 46. Code ownership

Futuro:

```text
CODEOWNERS
```

Áreas sensíveis:

- auth;
- privacy;
- safety;
- HIE;
- database;
- billing.

---

## 47. Qualidade de código

Evitar:

- abstração sem uso;
- duplicação;
- acoplamento;
- lógica escondida;
- nomes vagos;
- arquivos enormes;
- componentes com múltiplas responsabilidades;
- bypass de tipos.

---

## 48. Refatoração

Refatorar quando:

- complexidade cresce;
- regra duplica;
- teste fica difícil;
- nome não representa;
- dependência atrapalha;
- manutenção fica arriscada.

Não refatorar sem objetivo claro.

---

## 49. Technical debt

Registrar dívida com:

- descrição;
- impacto;
- risco;
- causa;
- prioridade;
- plano.

Dívida invisível é mais perigosa que dívida registrada.

---

## 50. Critérios de aceite

Este documento estará pronto quando:

- convenções estiverem definidas;
- branches e commits estiverem definidos;
- PR e review estiverem definidos;
- testes estiverem definidos;
- segurança estiver incorporada;
- Definition of Ready existir;
- Definition of Done existir;
- CI/CD estiver previsto;
- documentação estiver integrada.

---

## 51. Questões abertas

1. Monorepo ou repositórios separados?
2. Next.js full-stack ou API separada?
3. Cobertura mínima?
4. Ferramenta de testes E2E?
5. Ferramenta de feature flag?
6. Ferramenta de logs?
7. Ferramenta de analytics?
8. Política de dependências?
9. Política de branches final?
10. Quem aprova PR?
11. Qual SLA de bugs?
12. Como automatizar changelog?

---

## 52. Próximo documento

O próximo documento será:

> Higeia UX Principles and Design System Foundations v0.1.

Ele definirá:

- princípios de experiência;
- hierarquia;
- acessibilidade;
- componentes;
- linguagem;
- estados;
- confiança;
- design do relatório;
- base do futuro design system.

---

## 53. Histórico

| Versão | Data | Alteração |
|---|---|---|
| 0.1 | 13/07/2026 | Primeira versão dos padrões de engenharia do Higeia. |
