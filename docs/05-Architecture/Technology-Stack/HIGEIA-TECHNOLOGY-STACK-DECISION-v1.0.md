# Higeia — Technology Stack Decision

**Versão:** 1.0  
**Status:** Recomendação para aprovação  
**Data:** 20 de julho de 2026  
**Escopo:** MVP e Controlled Alpha  

---

## 1. Objetivo

Selecionar uma stack tecnológica inicial para o Higeia que equilibre:

- segurança;
- simplicidade;
- velocidade;
- disponibilidade de profissionais;
- custo inicial;
- operação no Brasil;
- rastreabilidade;
- capacidade de crescimento;
- baixa dependência de um único fornecedor;
- facilidade de uso de ferramentas de desenvolvimento assistidas por IA.

---

## 2. Recomendação executiva

### Linguagem principal

**TypeScript**

### Frontend

**Next.js**

### Backend

**NestJS**, em arquitetura modular monolith.

### Banco de dados

**PostgreSQL gerenciado no Amazon RDS**

### ORM e migrations

**Prisma ORM**, sujeito à validação técnica por prova de conceito.

### Autenticação

**Amazon Cognito**

### Cloud e região principal

**AWS — sa-east-1, São Paulo**

### Aplicação backend

**Amazon ECS Fargate**, após prova de conceito local e staging.

### Frontend

**Next.js em container no ECS Fargate** ou implantação separada posteriormente, desde que a arquitetura de segurança seja preservada.

### Storage

**Amazon S3**, com criptografia, acesso privado e URLs assinadas.

### Secrets e criptografia

**AWS Secrets Manager e AWS KMS**

### E-mail transacional

**Amazon SES**, sujeito à validação de entregabilidade e configuração.

### IA

**Camada própria de AI Provider Adapter**.

Provedor inicial recomendado para experimentação:

**OpenAI API**, após aprovação contratual, privacy review, configuração adequada de retenção e minimização de dados.

A arquitetura não deve depender exclusivamente da OpenAI.

### Observabilidade

**OpenTelemetry + Amazon CloudWatch**, com possibilidade de adicionar Sentry para erros de interface após privacy review.

### CI/CD

**GitHub Actions**

### Infrastructure as Code

**Terraform**, introduzido de forma gradual.

### Testes

- Jest;
- Supertest;
- Playwright;
- testes de isolamento entre tenants;
- contract tests do AI Adapter.

---

## 3. Por que uma stack TypeScript de ponta a ponta

Usar TypeScript no frontend e backend reduz a quantidade de linguagens que a equipe precisa dominar.

Benefícios:

- compartilhamento de tipos;
- contratação mais simples;
- ferramentas maduras;
- bom suporte de assistentes de programação;
- menor troca de contexto;
- ecossistema amplo;
- validação estática;
- facilidade de evolução do modular monolith.

Risco:

- TypeScript não substitui arquitetura, testes, revisão ou segurança.
- desenvolvimento assistido por IA ainda exige revisão humana competente.

---

## 4. Por que Next.js

Next.js é recomendado para:

- aplicação web responsiva;
- painel profissional;
- jornada do paciente;
- rotas e layouts;
- componentes React;
- TypeScript;
- futura evolução para experiências públicas e privadas.

Decisão de arquitetura:

O Next.js não deve concentrar toda a lógica de negócio sensível.

A lógica central deve permanecer no backend NestJS.

---

## 5. Por que NestJS

NestJS é recomendado porque:

- foi construído para TypeScript;
- fornece módulos;
- controllers;
- providers;
- guards;
- interceptors;
- validação;
- testes;
- organização adequada ao modular monolith.

Ele combina bem com os módulos definidos no Architecture Book.

Exemplo:

```text
modules/
├── identity
├── tenants
├── professionals
├── patients
├── consent
├── anamnesis
├── checkins
├── ai-orchestration
├── review
├── audit
└── operations
```

---

## 6. Por que PostgreSQL

Os dados principais do Higeia são:

- estruturados;
- relacionais;
- transacionais;
- auditáveis;
- conectados por usuários, profissionais, pacientes, consentimentos e revisões.

PostgreSQL oferece:

- integridade referencial;
- transações;
- índices;
- constraints;
- suporte amplo;
- portabilidade;
- maturidade;
- ferramentas de backup e restore.

No Alpha, não há justificativa para usar banco NoSQL como banco principal.

---

## 7. Por que AWS em São Paulo

A região `sa-east-1` permite hospedar os principais componentes no Brasil.

Isso ajuda a:

- reduzir latência para usuários brasileiros;
- simplificar a discussão de localização dos dados;
- usar serviços gerenciados;
- centralizar IAM, logs, storage, banco e criptografia.

A localização no Brasil não elimina obrigações de LGPD, contratos, segurança ou governança de fornecedores.

---

## 8. Por que Cognito

O Amazon Cognito é recomendado para evitar implementar autenticação do zero.

Escopo inicial:

- cadastro controlado;
- login;
- recuperação de senha;
- tokens;
- integração OIDC/OAuth;
- grupos ou claims;
- MFA para usuários privilegiados;
- bloqueio e lifecycle de conta.

A autorização por tenant continua sendo responsabilidade do backend.

Cognito autentica o usuário; não deve ser tratado como substituto do modelo de autorização da aplicação.

---

## 9. Por que ECS Fargate

ECS Fargate permite executar containers sem administrar diretamente servidores.

Vantagens:

- controle de ambiente;
- isolamento;
- integração com AWS;
- deployment versionado;
- health checks;
- escalabilidade;
- logs;
- rollback por versão.

Desvantagens:

- configuração inicial mais complexa que plataformas simplificadas;
- necessidade de conhecimento de rede, IAM e containers;
- custo fixo potencialmente maior em baixíssimo volume.

Decisão:

Usar Fargate como alvo de staging e Alpha, mas validar o custo antes de ativar uma arquitetura excessiva.

---

## 10. Por que S3

O S3 será usado para:

- fotos autorizadas;
- arquivos controlados;
- artefatos de evidência quando aplicável;
- exports autorizados.

Regras:

- bucket privado;
- block public access;
- criptografia;
- políticas por ambiente;
- URLs assinadas;
- lifecycle;
- deletion;
- malware validation quando aplicável;
- nenhuma exposição direta permanente.

---

## 11. Estratégia de IA

A aplicação deve possuir uma interface como:

```text
AIProvider
├── generateStructuredOutput()
├── healthCheck()
├── estimateCost()
└── providerMetadata()
```

A implementação concreta pode ser:

```text
OpenAIProviderAdapter
MockAIProviderAdapter
FutureProviderAdapter
```

Nenhum módulo de negócio deve chamar diretamente SDK de fornecedor.

---

## 12. Uso inicial da OpenAI API

A OpenAI API é recomendada apenas como primeiro provedor experimental, não como dependência arquitetural permanente.

Antes de enviar dados reais:

- concluir vendor review;
- revisar termos;
- revisar retenção aplicável;
- configurar projeto e acessos;
- limitar dados;
- evitar fotos no primeiro experimento;
- remover identificadores desnecessários;
- registrar prompt, modelo, custo e trace;
- validar output estruturado;
- exigir human review;
- criar kill switch.

---

## 13. Observabilidade

### OpenTelemetry

Usado como padrão de instrumentação para:

- traces;
- métricas;
- correlação;
- portabilidade.

### CloudWatch

Usado inicialmente para:

- logs;
- métricas;
- alarmes;
- dashboards;
- auditoria operacional.

Regra:

Logs não devem conter dados brutos de saúde por conveniência de debugging.

---

## 14. CI/CD

GitHub Actions será usado para:

- lint;
- type checking;
- testes;
- build;
- secret scanning;
- dependency scanning;
- container build;
- deployment controlado;
- evidências de execução.

Deployments do Alpha devem exigir aprovação.

---

## 15. Infrastructure as Code

Terraform é recomendado para:

- ambientes reproduzíveis;
- revisão;
- histórico;
- redução de configuração manual;
- inventário;
- recuperação.

A adoção deve ser gradual.

Primeiro:

- rede;
- banco;
- storage;
- secrets;
- serviços;
- logs.

---

## 16. Estrutura de repositório recomendada

```text
eros-platform/
├── apps/
│   ├── web/
│   └── api/
├── packages/
│   ├── shared-types/
│   ├── validation/
│   ├── config/
│   └── ai-contracts/
├── infrastructure/
│   └── terraform/
├── tests/
│   ├── e2e/
│   └── security/
├── scripts/
├── docs/
├── package.json
└── README.md
```

Monorepo recomendado:

- `pnpm workspaces`;
- Turborepo apenas se demonstrar benefício real;
- evitar complexidade desnecessária.

---

## 17. Stack resumida

| Camada | Escolha |
|---|---|
| Linguagem | TypeScript |
| Frontend | Next.js |
| Backend | NestJS |
| Arquitetura | Modular monolith |
| Banco | PostgreSQL |
| ORM | Prisma, condicionado a PoC |
| Auth | Amazon Cognito |
| Cloud | AWS |
| Região | sa-east-1 |
| Runtime | ECS Fargate |
| Storage | S3 |
| Secrets | Secrets Manager |
| Criptografia | KMS |
| E-mail | SES |
| IA | Provider Adapter + OpenAI inicial |
| Observabilidade | OpenTelemetry + CloudWatch |
| CI/CD | GitHub Actions |
| IaC | Terraform |
| Unit tests | Jest |
| API tests | Supertest |
| E2E | Playwright |

---

## 18. Decisões deliberadamente adiadas

- aplicativo nativo;
- Kubernetes;
- microservices;
- event streaming complexo;
- data lake;
- vector database dedicado;
- wearable ingestion;
- multi-region;
- service mesh;
- machine learning próprio;
- fine-tuning com dados de pacientes;
- analytics warehouse;
- GraphQL.

---

## 19. Critérios de aprovação

A stack poderá ser aprovada quando:

- Product e Architecture Books estiverem alinhados;
- uma prova de conceito executar localmente;
- autenticação for validada;
- acesso ao PostgreSQL for validado;
- deploy de staging for demonstrado;
- observabilidade básica funcionar;
- AI Adapter funcionar com mock;
- custo inicial for estimado;
- riscos e owners forem registrados;
- um profissional técnico independente revisar a proposta.

---

## 20. Decisão recomendada

**APPROVE WITH CONDITIONS**

Condições:

1. realizar PoC sem dados reais;
2. confirmar custo do AWS sa-east-1;
3. realizar security review;
4. validar Cognito UX;
5. validar Prisma e migrations;
6. validar deployment em Fargate;
7. concluir vendor review da OpenAI;
8. não incluir fotos na primeira chamada de IA;
9. não iniciar memória ou RAG no primeiro incremento;
10. contratar ou designar responsável técnico experiente.

---

## 21. Histórico

| Versão | Alteração |
|---|---|
| 1.0 | Recomendação inicial de stack para MVP e Controlled Alpha. |
