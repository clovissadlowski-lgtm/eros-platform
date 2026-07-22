# Higeia Testing Strategy v1.0

**Status:** Baseline aprovada  
**Escopo:** Backend, contratos, segurança e integrações  
**Versão:** 1.0

## 1. Finalidade

A estratégia de testes da Higeia deve proteger:

- regras de negócio;
- contratos da API;
- isolamento de tenant;
- segurança;
- integrações;
- fluxos críticos;
- evolução do código.

O objetivo não é maximizar cobertura numérica. É reduzir risco de regressão e provar comportamentos importantes.

## 2. Pirâmide de testes

### Base: testes unitários

Maior volume.

Usados para:

- regras de domínio;
- services;
- value objects;
- mappers;
- políticas;
- estados;
- erros.

### Meio: testes de integração

Usados para:

- repositórios;
- banco;
- migrations;
- adapters;
- integração entre módulos;
- configuração.

### Topo: testes E2E

Menor volume.

Usados para jornadas críticas:

- criar paciente;
- consultar paciente;
- concluir avaliação;
- solicitar análise de IA;
- revisar análise;
- verificar isolamento entre organizações.

## 3. Tipos de teste

### 3.1 Unitário

Sem rede e sem banco real.

Deve ser:

- rápido;
- determinístico;
- isolado;
- focado em comportamento.

### 3.2 Integração

Pode usar:

- banco de teste;
- container;
- implementação real de repositório;
- adapter de teste;
- configuração próxima da produção.

### 3.3 API / E2E

Executa a aplicação e chama HTTP.

Valida:

- rotas;
- DTOs;
- pipes;
- filters;
- status;
- resposta;
- autenticação;
- tenant.

### 3.4 Contrato

Valida contratos entre:

- frontend e API;
- API e provedores;
- módulos;
- eventos.

### 3.5 Segurança

Valida:

- acesso não autenticado;
- permissão;
- tenant isolation;
- input malicioso;
- upload;
- exposição de dados.

### 3.6 AI Provider Adapter

Valida:

- contrato do adapter;
- timeout;
- erro;
- resposta inválida;
- parsing estruturado;
- troca de provedor;
- ausência de dado sensível indevido.

## 4. O que deve ter teste unitário

- regra de estado;
- cálculo;
- validação de domínio;
- política de publicação;
- revisão de IA;
- transição de assessment;
- transformação de dados;
- error mapping;
- tenant-aware service.

CRUD trivial pode ter menos testes unitários, desde que API e integração cubram o risco.

## 5. O que deve ter teste de integração

- migrations;
- repositório Prisma;
- unique constraints;
- transações;
- filtros de organizationId;
- storage;
- Cognito adapter;
- AI adapter;
- audit persistence.

## 6. O que deve ter teste E2E

Jornadas mínimas do MVP:

1. criar paciente válido;
2. rejeitar paciente inválido;
3. listar pacientes do tenant;
4. retornar paciente por ID;
5. retornar 404;
6. impedir acesso cruzado;
7. criar avaliação;
8. concluir avaliação;
9. gerar análise de IA simulada;
10. revisar análise.

## 7. Dados de teste

Regras:

- nunca usar dado real de paciente;
- usar fixtures sintéticas;
- evitar CPF, telefone e email reais;
- identificar claramente dados fictícios;
- limpar estado entre testes;
- evitar dependência de ordem;
- evitar dependência do relógio real.

## 8. Mocks

Usar mock para:

- provedor externo;
- relógio;
- UUID;
- email;
- storage;
- IA.

Não mockar o objeto sob teste.

Evitar mocks profundos que reproduzem implementação.

## 9. Banco de teste

Quando PostgreSQL entrar:

- usar banco isolado;
- aplicar migrations;
- limpar por suite;
- nunca apontar para produção;
- usar credenciais próprias;
- permitir execução local e CI.

Container de teste é preferível quando a infraestrutura estiver madura.

## 10. Tenant Isolation Tests

Obrigatórios em módulos com dado de tenant.

Teste mínimo:

- criar recurso no tenant A;
- autenticar como tenant B;
- buscar o recurso;
- confirmar ausência de acesso;
- confirmar ausência de vazamento por lista, filtro ou erro.

Também testar:

- update;
- delete;
- relações;
- upload;
- exportação.

## 11. Cobertura

Cobertura é indicador, não objetivo isolado.

Metas iniciais sugeridas:

- regras críticas: 90% ou mais;
- services de domínio: 80% ou mais;
- projeto total: acompanhar tendência, sem bloquear por número arbitrário no início.

Nenhuma regra crítica deve ficar sem teste apenas porque a cobertura global está alta.

## 12. Determinismo

Testes devem controlar:

- horário;
- IDs;
- aleatoriedade;
- resposta de provedor;
- locale;
- timezone.

Evitar `setTimeout` real.

## 13. Nomenclatura de testes

Usar comportamento.

Exemplo:

```text
creates a patient for the current organization
returns not found when patient belongs to another organization
rejects completion when assessment is already completed
```

## 14. Estrutura AAA

Preferir:

- Arrange;
- Act;
- Assert.

Um teste deve validar um comportamento principal.

## 15. CI

Pipeline mínimo:

1. install;
2. lint;
3. format check;
4. type check/build;
5. unit tests;
6. integration tests;
7. E2E crítico;
8. security checks;
9. artifact/evidence.

## 16. Testes de regressão

Todo bug importante corrigido deve ganhar teste que falha antes da correção e passa depois.

## 17. Testes de IA

Não validar “qualidade clínica” apenas com snapshot textual.

Separar:

- contrato técnico;
- estrutura;
- segurança;
- completude;
- avaliação humana;
- dataset de referência;
- comportamento por versão de prompt.

Saídas de IA são probabilísticas. O teste deve controlar provedor ou usar resposta gravada quando apropriado.

## 18. Evidências da PoC

Para cada gate técnico registrar:

- comando;
- data;
- versão;
- resultado;
- screenshot ou log;
- commit;
- decisão;
- pendências.

Local sugerido:

```text
evidence/stack-poc/
```

## 19. Definição de pronto para testes

Uma feature só está pronta quando:

- comportamento feliz está coberto;
- erro principal está coberto;
- tenant está coberto;
- validação está coberta;
- integração crítica está coberta;
- testes passam localmente;
- testes passam na CI;
- não dependem de dado real;
- evidência foi registrada quando exigida.

## 20. Primeiro checklist para Patients

- service cria paciente;
- ID é gerado;
- timestamps são definidos;
- status inicial é ACTIVE;
- DTO inválido retorna 400;
- lista contém apenas tenant atual;
- consulta por ID funciona;
- outro tenant recebe 404;
- paciente inexistente retorna PATIENT_NOT_FOUND;
- resposta não expõe campo interno.
