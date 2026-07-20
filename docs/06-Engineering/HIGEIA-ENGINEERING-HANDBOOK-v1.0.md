# Higeia — Engineering Handbook

**Documento:** Higeia Engineering Handbook  
**Versão:** 1.0  
**Status:** Norma inicial de engenharia  
**Data:** 19 de julho de 2026  
**Projeto interno:** Projeto Eros  
**Produto:** Higeia  
**Fundador:** Clovis Sadlowski  

---

## 1. Objetivo

Estabelecer o padrão oficial de engenharia do Higeia.

Este manual deve orientar qualquer pessoa que trabalhe no projeto, incluindo:

- desenvolvedores;
- arquitetos;
- profissionais de dados;
- especialistas em IA;
- designers técnicos;
- revisores de segurança;
- colaboradores assistidos por inteligência artificial.

---

## 2. Princípios de engenharia

1. Clareza antes de sofisticação.
2. Segurança antes de velocidade.
3. Simplicidade antes de abstração.
4. Código testável antes de código “inteligente”.
5. Mudanças pequenas antes de grandes refatorações.
6. Documentação junto com a decisão.
7. Observabilidade desde o início.
8. Privacidade como requisito de arquitetura.
9. IA deve ser auditável e limitada.
10. Nenhuma funcionalidade é considerada pronta apenas porque funciona localmente.

---

## 3. Organização do código

A organização deve seguir domínios do produto.

Estrutura inicial recomendada:

```text
src/
├── app/
├── components/
├── features/
│   ├── identity/
│   ├── consent/
│   ├── assessment/
│   ├── profile/
│   ├── checkin/
│   ├── conversation/
│   ├── memory/
│   ├── safety/
│   └── admin/
├── lib/
├── services/
├── server/
├── types/
└── validation/
```

Cada domínio deve conter apenas o código relacionado à sua responsabilidade.

---

## 4. Linguagem principal

A linguagem principal será TypeScript.

Regras:

- modo `strict` habilitado;
- evitar `any`;
- tratar `null` e `undefined` explicitamente;
- validar entradas em runtime;
- usar tipos compartilhados apenas quando realmente compartilhados;
- não esconder erros por meio de casting inseguro.

---

## 5. Convenções de nomes

### Arquivos

```text
kebab-case.ts
kebab-case.tsx
```

### Componentes

```text
PascalCase
```

### Funções e variáveis

```text
camelCase
```

### Constantes

```text
UPPER_SNAKE_CASE
```

### Tabelas e colunas

```text
snake_case
```

### Rotas

```text
kebab-case
```

### Commits

Usar inglês técnico simples e direto.

---

## 6. Estilo de código

Ferramentas mínimas:

- ESLint;
- Prettier;
- TypeScript;
- EditorConfig.

Regras:

- remover código morto;
- remover imports não utilizados;
- evitar funções longas;
- evitar múltiplas responsabilidades;
- preferir retornos antecipados;
- usar nomes descritivos;
- não comentar o óbvio;
- comentar decisões e limitações relevantes.

---

## 7. Funções

Uma função deve:

- ter uma responsabilidade clara;
- receber entradas previsíveis;
- retornar um tipo previsível;
- tratar falhas;
- evitar efeitos colaterais ocultos;
- ser testável isoladamente.

Evitar:

- funções com muitos parâmetros;
- funções que leem e alteram múltiplos estados;
- lógica de negócio dentro da interface;
- chamadas externas diretamente misturadas com regras centrais.

---

## 8. Componentes de interface

Um componente deve:

- ser acessível;
- funcionar em dispositivos móveis;
- possuir estados de carregamento, erro e vazio;
- evitar regras críticas no cliente;
- possuir responsabilidade visual clara;
- ser reutilizado somente quando houver real reutilização.

---

## 9. Validação

Toda entrada deve ser validada no servidor.

Aplicações:

- formulários;
- variáveis de ambiente;
- parâmetros de rota;
- respostas de API;
- eventos;
- filas;
- saídas de IA;
- dados importados.

Ferramenta inicial recomendada:

```text
Zod
```

---

## 10. Tratamento de erros

Todo erro relevante deve possuir:

- código;
- mensagem segura;
- contexto interno;
- nível;
- correlation ID;
- ação recomendada.

Exemplo:

```json
{
  "code": "PROFILE_GENERATION_FAILED",
  "message": "Não foi possível gerar seu perfil agora.",
  "correlation_id": "abc123"
}
```

Nunca expor ao usuário:

- stack trace;
- SQL;
- segredo;
- token;
- caminho interno;
- dado sensível;
- resposta bruta de provedor.

---

## 11. Logs

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

Nunca registrar:

- senha;
- token;
- chave de API;
- documentos completos;
- dados sensíveis sem necessidade;
- prompts completos com dados pessoais em produção.

---

## 12. Estratégia de branches

Para uma equipe pequena, usar branches curtas.

Padrões:

```text
feature/<nome>
fix/<nome>
docs/<nome>
chore/<nome>
hotfix/<nome>
```

A branch `main` deve permanecer estável.

---

## 13. Commits

Padrão:

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
feat: add assessment progress persistence
fix: prevent duplicate profile generation
docs: add engineering handbook
```

Regras:

- um objetivo principal por commit;
- mensagem clara;
- não misturar reorganização com funcionalidade;
- não versionar segredos;
- o código deve compilar antes do commit.

---

## 14. Pull Requests

Toda Pull Request deve conter:

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

PRs pequenas são preferíveis.

---

## 15. Revisão de código

A revisão deve verificar:

- correção;
- clareza;
- segurança;
- privacidade;
- testes;
- acessibilidade;
- observabilidade;
- performance;
- impacto arquitetural;
- documentação.

Bloqueadores:

- vazamento de dados;
- ausência de teste em regra crítica;
- mudança de banco sem migration;
- regra duplicada;
- falha de autorização;
- resposta de IA sem validação;
- ausência de rollback em mudança sensível.

---

## 16. Definition of Ready

Uma tarefa está pronta para desenvolvimento quando possui:

- problema claro;
- usuário;
- objetivo;
- escopo;
- critério de aceite;
- dependências;
- riscos;
- referência documental;
- evento analítico, quando necessário;
- fluxo ou design, quando necessário.

---

## 17. Definition of Done

Uma funcionalidade está pronta quando:

- código concluído;
- critérios de aceite atendidos;
- testes aprovados;
- lint aprovado;
- typecheck aprovado;
- build aprovado;
- segurança revisada;
- logs implementados;
- analytics implementado quando necessário;
- documentação atualizada;
- migration criada quando aplicável;
- rollback possível;
- staging validado;
- erros conhecidos registrados.

---

## 18. Estratégia de testes

### Unitários

Para regras isoladas.

### Integração

Para banco, API, filas e serviços.

### End-to-end

Para fluxos críticos.

### Contrato

Para integrações e saídas estruturadas.

### Segurança

Para autenticação, autorização, privacidade e limites.

### IA

Para factualidade, escopo, safety, regressão e explicabilidade.

### Acessibilidade

Para teclado, foco, labels e mensagens.

---

## 19. Fluxos obrigatórios de teste

- cadastro;
- login;
- consentimento;
- anamnese;
- salvar e continuar;
- geração de perfil;
- feedback;
- check-in;
- redirecionamento de segurança;
- exclusão da conta;
- recuperação após falha.

---

## 20. Dados de teste

Dados de teste devem ser:

- fictícios;
- reproduzíveis;
- não identificáveis;
- separados por ambiente.

É proibido usar dados pessoais reais em desenvolvimento sem processo formal.

---

## 21. Banco de dados

Toda mudança deve:

- possuir migration;
- possuir rollback quando possível;
- preservar dados;
- revisar índices;
- revisar privacidade;
- atualizar documentação;
- possuir teste.

Nunca alterar produção manualmente sem registro.

---

## 22. APIs

Padrões:

- versionamento;
- autenticação;
- autorização;
- schemas;
- erros padronizados;
- paginação;
- idempotência;
- correlation ID;
- documentação.

---

## 23. Filas e jobs

Todo job deve possuir:

- identificador;
- tipo;
- status;
- tentativas;
- timeout;
- retry;
- backoff;
- dead-letter;
- correlation ID;
- idempotency key.

---

## 24. Código de IA

Todo fluxo de IA deve registrar:

- versão do prompt;
- versão do modelo;
- versão do HIE;
- schema de entrada;
- schema de saída;
- safety status;
- latência;
- custo;
- feedback;
- execution ID.

---

## 25. Prompts

Prompts devem:

- possuir arquivo próprio;
- possuir versão;
- possuir objetivo;
- possuir owner;
- possuir exemplos;
- definir limites;
- produzir saída estruturada;
- possuir testes de regressão.

Prompts não devem ficar espalhados em componentes ou rotas.

---

## 26. Saídas de IA

Saídas de IA devem ser:

- estruturadas;
- validadas;
- classificadas;
- filtradas por segurança;
- registradas para auditoria;
- apresentadas com incerteza adequada.

Nenhuma resposta crítica deve ser exibida diretamente sem pós-validação.

---

## 27. Feature flags

Funções sensíveis devem ser liberadas por flag.

Exemplos:

- assistente;
- novo modelo;
- nova versão do perfil;
- upload de documentos;
- compartilhamento profissional.

---

## 28. Dependências

Antes de adicionar uma biblioteca:

- verificar necessidade;
- verificar manutenção;
- verificar licença;
- verificar vulnerabilidades;
- verificar alternativas já instaladas;
- verificar impacto no bundle.

---

## 29. Segredos

Segredos devem existir apenas em:

- variáveis de ambiente;
- secret manager;
- plataforma de deploy.

Nunca em:

- código;
- commit;
- documentação;
- screenshot;
- issue;
- log.

---

## 30. Observabilidade

Toda funcionalidade crítica deve produzir:

- logs;
- métricas;
- eventos;
- alertas quando aplicável;
- correlation ID.

Sem observabilidade, a funcionalidade não está pronta.

---

## 31. Performance

Processo:

1. medir;
2. localizar;
3. corrigir;
4. medir novamente.

Evitar otimização prematura.

---

## 32. Acessibilidade

Requisitos mínimos:

- navegação por teclado;
- foco visível;
- labels;
- contraste;
- mensagens de erro acessíveis;
- suporte a zoom;
- ausência de dependência exclusiva de cor;
- respeito a reduced motion.

---

## 33. Segurança

Toda funcionalidade deve verificar:

- autenticação;
- autorização;
- validação;
- rate limiting;
- exposição de dados;
- logs;
- segredos;
- input malicioso;
- prompt injection quando aplicável;
- dependências;
- permissões.

---

## 34. Privacidade

Toda funcionalidade que trata dados pessoais deve responder:

- qual dado é coletado?
- por que é necessário?
- qual base de tratamento?
- onde é armazenado?
- quem acessa?
- por quanto tempo?
- como corrigir?
- como excluir?
- quais derivados são produzidos?

---

## 35. Documentação

Atualizar documentação quando houver mudança em:

- API;
- schema;
- fluxo;
- arquitetura;
- segurança;
- IA;
- consentimento;
- operação;
- regras de negócio.

---

## 36. ADRs

Criar ADR para:

- tecnologia principal;
- banco;
- autenticação;
- fila;
- storage;
- provedor de IA;
- mudança arquitetural;
- integração;
- alteração de dados sensíveis;
- mudança de estratégia de deploy.

---

## 37. Gestão de bugs

Todo bug deve registrar:

- ambiente;
- passos;
- resultado esperado;
- resultado real;
- evidência;
- severidade;
- impacto;
- versão;
- correlation ID quando disponível.

---

## 38. Severidade de bugs

- P0 — sistema indisponível ou risco grave;
- P1 — fluxo crítico comprometido;
- P2 — problema importante com alternativa;
- P3 — problema moderado;
- P4 — melhoria futura.

---

## 39. Releases

Cada release deve possuir:

- versão;
- changelog;
- migrations;
- testes;
- riscos;
- rollback;
- aprovador;
- monitoramento;
- critérios de liberação.

---

## 40. Versionamento

Usar SemVer:

```text
MAJOR.MINOR.PATCH
```

Exemplo:

```text
0.1.0
```

---

## 41. CI

Pipeline mínimo:

1. instalar dependências;
2. lint;
3. typecheck;
4. testes unitários;
5. testes de integração;
6. security scan;
7. build.

---

## 42. CD

Produção deve exigir:

- branch protegida;
- checks aprovados;
- revisão;
- staging validado;
- changelog;
- rollback disponível;
- aprovação de release.

---

## 43. Dívida técnica

Toda dívida deve registrar:

- descrição;
- causa;
- impacto;
- risco;
- prioridade;
- plano;
- responsável.

Dívida invisível é mais perigosa do que dívida conhecida.

---

## 44. Uso de IA no desenvolvimento

Ferramentas de IA podem ajudar a:

- escrever código;
- gerar testes;
- revisar;
- documentar;
- explicar erros;
- criar protótipos.

Mas toda saída deve ser:

- revisada;
- testada;
- validada;
- compreendida antes do commit.

Código gerado por IA segue os mesmos padrões do código humano.

---

## 45. Regra para o fundador

Como o fundador não é programador, toda tarefa técnica deve ser entregue com:

- objetivo;
- pré-requisitos;
- passos;
- comandos;
- resultado esperado;
- possíveis erros;
- como validar;
- mensagem de commit;
- momento de parar e pedir revisão.

---

## 46. Checklist antes do commit

- [ ] Entendi o que foi alterado.
- [ ] O projeto executa.
- [ ] Não há segredos.
- [ ] Os arquivos corretos estão selecionados.
- [ ] A alteração possui um único objetivo.
- [ ] A documentação foi atualizada.
- [ ] O commit possui mensagem clara.

---

## 47. Checklist antes da Pull Request

- [ ] Critérios de aceite atendidos.
- [ ] Testes aprovados.
- [ ] Lint e typecheck aprovados.
- [ ] Build aprovado.
- [ ] Segurança revisada.
- [ ] Logs e métricas avaliados.
- [ ] Impacto em dados avaliado.
- [ ] Rollback definido.
- [ ] Documentação atualizada.

---

## 48. Critério de revisão deste manual

Este manual deve ser revisado quando:

- a equipe crescer;
- a stack mudar;
- ocorrer incidente;
- surgir nova exigência regulatória;
- o processo impedir velocidade sem reduzir risco;
- novas práticas forem adotadas.

---

## 49. Histórico

| Versão | Data | Alteração |
|---|---|---|
| 1.0 | 19/07/2026 | Criação do manual oficial inicial de engenharia. |
