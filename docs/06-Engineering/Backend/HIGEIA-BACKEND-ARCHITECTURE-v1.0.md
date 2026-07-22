# Higeia Backend Architecture v1.0

**Arquitetura:** Monólito modular  
**Framework:** NestJS  
**Linguagem:** TypeScript  
**Banco principal:** PostgreSQL  
**Cloud inicial:** AWS, `sa-east-1`

## 1. Objetivos

O backend deve:

- acelerar o MVP;
- preservar limites de domínio;
- suportar multi-tenancy;
- proteger dados sensíveis;
- manter IA desacoplada;
- ser testável e observável;
- crescer sem microserviços prematuros;
- permitir futura substituição de provedores.

## 2. Stack inicial

- TypeScript
- Node.js
- NestJS
- pnpm workspaces
- PostgreSQL
- Prisma, condicionado à PoC
- AWS
- Cognito
- ECS Fargate
- S3
- OpenTelemetry
- CloudWatch
- GitHub Actions
- Terraform
- AI Provider Adapter
- OpenAI como primeiro provedor

Mudanças materiais exigem ADR.

## 3. Por que monólito modular

A aplicação começa como um único backend implantável, dividido por módulos de domínio.

Vantagens iniciais:

- menor complexidade operacional;
- desenvolvimento local simples;
- custo menor;
- transações locais;
- rastreabilidade mais fácil;
- limites ainda preservados.

Microserviços só entram com evidência, como escala independente, equipe própria, segurança distinta ou disponibilidade diferente.

## 4. Arquitetura conceitual

```text
Clientes
   ↓
Controllers HTTP
   ↓
Application Services
   ↓
Domínio
   ↓
Ports
   ↓
Adapters
   ↓
PostgreSQL / S3 / Cognito / IA
```

Direção de dependência:

```text
Presentation → Application → Domain → Ports ← Infrastructure
```

O domínio não depende de NestJS, Prisma, AWS SDK, OpenAI SDK, HTTP ou variáveis de ambiente.

## 5. Categorias de módulo

### Domínio

- patients
- assessments
- care-plans
- check-ins
- professionals
- organizations
- ai-analysis

### Plataforma

- config
- auth
- audit
- database
- storage
- observability
- health

### Integração

- AI providers
- Cognito
- email
- S3
- integrações futuras

## 6. Comunicação entre módulos

Ordem preferencial:

1. facade ou application service exportado;
2. contrato estável de consulta;
3. evento interno;
4. mensageria assíncrona quando justificada.

Proibido por padrão:

- escrever em tabelas de outro módulo;
- importar repositório interno de outro módulo;
- usar entidades internas de outro módulo para mutação;
- criar dependência circular rotineira;
- chamar provedor externo de dentro de módulo não responsável.

## 7. Persistência

PostgreSQL será o banco principal.

Regras:

- cada módulo controla sua persistência;
- migrations representam toda alteração;
- controller não acessa banco;
- serviços dependem de repositórios ou portas;
- relatórios cruzados usam consultas dedicadas ou read models.

Exemplo:

```text
PatientsService
   ↓
PatientsRepository
   ↓
PrismaPatientsRepository
   ↓
PostgreSQL
```

## 8. Multi-tenancy

Modelo inicial: aplicação e banco compartilhados com isolamento lógico por `organizationId`.

Requisitos:

- todo registro de tenant possui ou deriva `organizationId`;
- tenant vem da identidade autenticada;
- repositórios recebem contexto de tenant;
- restrições únicas consideram tenant quando necessário;
- testes provam isolamento;
- auditoria registra tenant.

## 9. Autenticação e autorização

Cognito será o provedor inicial.

O backend:

- valida tokens;
- resolve usuário;
- resolve organização ativa;
- verifica papéis e permissões;
- registra acessos relevantes.

Autenticação prova identidade. Autorização decide a permissão sobre um recurso.

## 10. Configuração

- acesso a `process.env` fica na camada de configuração;
- startup falha com configuração inválida;
- `.env.example` documenta variáveis locais;
- segredos nunca entram no Git;
- produção usa secret store aprovado.

## 11. Controllers

Podem:

- receber requisições;
- validar DTOs;
- obter contexto autenticado;
- chamar um caso de uso;
- mapear resposta HTTP.

Não podem:

- decidir regra de negócio;
- acessar Prisma;
- chamar IA;
- expor stack trace;
- confiar em `organizationId` do body.

## 12. Application Services

Coordenam casos de uso, por exemplo:

- `createPatient`;
- `completeAssessment`;
- `requestAIAnalysis`;
- `reviewAIAnalysis`.

Podem carregar agregados, aplicar autorização, salvar, publicar eventos e acionar portas externas.

## 13. Integrações externas

Toda integração relevante usa adaptador:

```text
AIProvider
├── OpenAIProviderAdapter
└── FutureProviderAdapter
```

Objetos de SDK não vazam para o domínio.

## 14. Arquitetura de IA

```text
Contexto autorizado
   ↓
Context assembler
   ↓
Prompt versionado
   ↓
AIProvider
   ↓
Adapter
   ↓
Resposta bruta
   ↓
Validação estruturada
   ↓
AIAnalysis
   ↓
Revisão profissional
```

Requisitos:

- provedor, modelo, prompt e horário rastreáveis;
- timeouts e falhas controlados;
- dados minimizados;
- saída validada;
- publicação profissional não é automática.

## 15. Observabilidade

Direção inicial:

- logs estruturados;
- request ID;
- métricas;
- traces com OpenTelemetry;
- CloudWatch;
- ausência de dados sensíveis em logs.

## 16. Implantação

Direção inicial:

- container NestJS;
- ECS Fargate;
- região `sa-east-1`;
- PostgreSQL gerenciado;
- S3;
- CloudWatch;
- Terraform;
- GitHub Actions.

## 17. Atalhos proibidos

- banco no controller;
- SDK de provedor no domínio;
- segredo em código;
- tenant vindo do body;
- sobrescrita destrutiva de histórico;
- publicação autônoma de IA;
- quebra de API sem versão;
- desativação de validação para “fazer funcionar”;
- escrita cruzada entre módulos.

## 18. Checklist arquitetural

- módulo proprietário está claro?
- tenant foi aplicado?
- regra ficou fora do controller?
- DTO está validado?
- integração usa adaptador?
- histórico foi preservado?
- erro é seguro?
- testes foram incluídos?
- auditoria foi considerada?
- documentação foi atualizada?
- exige ADR?
