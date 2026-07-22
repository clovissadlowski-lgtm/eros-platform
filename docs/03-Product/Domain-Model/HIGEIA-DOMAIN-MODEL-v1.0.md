# Higeia Domain Model v1.0

**Status:** Baseline aprovada  
**Produto:** Higeia  
**Codinome interno:** Projeto Eros  
**Responsáveis:** Produto e Arquitetura  
**Data:** 2026-07-22

## 1. Finalidade

Este documento define a linguagem comum, os contextos de domínio, as entidades, os relacionamentos, as regras fundamentais e o escopo inicial da Higeia.

Ele não é um esquema de banco de dados. É a referência que orienta produto, engenharia, segurança, IA e futuras integrações.

## 2. Visão do domínio

A Higeia é uma plataforma de inteligência em saúde voltada ao acompanhamento contínuo e individualizado. O foco inicial é apoiar profissionais e pacientes em nutrição, treinamento físico e evolução longitudinal.

A plataforma deve permitir:

- coleta estruturada de contexto;
- anamnese aprofundada;
- acompanhamento histórico;
- criação e versionamento de planos;
- análises assistidas por IA;
- revisão profissional;
- rastreabilidade;
- proteção de dados sensíveis;
- isolamento entre organizações.

## 3. Linguagem oficial

- **Organization:** clínica, consultório, empresa ou prática profissional que utiliza a plataforma.
- **Professional:** pessoa habilitada a acompanhar pacientes.
- **Patient:** pessoa que recebe acompanhamento.
- **Assessment:** avaliação estruturada, incluindo anamnese, hábitos, sintomas, objetivos e histórico.
- **Care Plan:** plano profissional com recomendações, metas e intervenções.
- **Check-in:** registro periódico de evolução.
- **AI Analysis:** análise gerada por IA a partir de contexto autorizado.
- **Professional Review:** revisão humana de uma saída de IA.
- **Consent:** registro versionado da concordância do paciente.
- **Tenant:** fronteira lógica de isolamento, inicialmente representada por `organizationId`.

## 4. Contextos delimitados

### 4.1 Identity and Access

Responsável por autenticação, autorização, sessões, papéis e permissões.

Papéis iniciais:

- ADMIN
- PROFESSIONAL
- PATIENT

Especializações profissionais futuras:

- NUTRITIONIST
- PERSONAL_TRAINER
- DOCTOR
- PSYCHOLOGIST
- CLINIC_MANAGER

### 4.2 Organizations

Responsável por organizações, membros, configurações e fronteira de tenant.

Regras:

- todo dado de negócio pertence direta ou indiretamente a uma organização;
- um profissional pode participar de mais de uma organização;
- acesso cruzado entre organizações é proibido por padrão.

### 4.3 Professionals

Responsável por perfil profissional, especialidades, credenciais e vínculo com pacientes.

Uma conta de usuário não é automaticamente um perfil profissional.

### 4.4 Patients

Responsável por identidade, dados demográficos, contatos, status e vínculos.

Informações clínicas e comportamentais não devem ser concentradas em uma entidade gigante de paciente. Elas devem ser históricas e separadas por finalidade.

### 4.5 Assessments

Responsável por templates, seções, perguntas, respostas, anamnese, conclusão e revisão.

Status:

- DRAFT
- IN_PROGRESS
- COMPLETED
- REVIEWED
- ARCHIVED

Regras:

- cada avaliação usa uma versão específica de template;
- respostas concluídas devem ser preservadas;
- a IA não substitui os dados originais;
- correções relevantes devem ser versionadas ou auditadas.

### 4.6 Care Plans

Responsável por planos, versões e recomendações.

Regras:

- plano publicado não é sobrescrito;
- alteração material cria nova versão;
- publicação exige autoria e responsabilidade profissional;
- IA pode auxiliar, mas não publicar autonomamente.

### 4.7 Progress Tracking

Responsável por check-ins, medidas, fotos, sintomas, adesão, sono, energia, estresse e feedback.

Medições são históricas. Tendências são calculadas a partir da série temporal.

### 4.8 Artificial Intelligence

Responsável por adaptação de provedores, prompts, execução, validação, armazenamento e revisão.

Status:

- GENERATED
- PENDING_REVIEW
- APPROVED
- REJECTED
- SUPERSEDED
- FAILED

Regras:

- IA é assistiva;
- provedores são chamados por adaptadores;
- modelo, provedor, prompt, horário, contexto e revisão são rastreáveis;
- dados sensíveis enviados a provedores seguem consentimento e minimização.

### 4.9 Audit and Compliance

Responsável por auditoria, acessos, consentimentos, exportação, exclusão e retenção.

Eventos relevantes registram ator, organização, ação, alvo, horário e identificador da requisição.

## 5. Agregados iniciais

- Organization
- ProfessionalProfile
- Patient
- Assessment
- AssessmentTemplate
- CarePlan
- CheckIn
- AIAnalysis
- ConsentRecord

## 6. Relacionamentos principais

```text
Organization
├── possui membros
├── possui profissionais
└── possui pacientes

Professional
├── pertence a organizações
├── acompanha pacientes
├── cria ou revisa avaliações
├── cria planos
└── revisa análises de IA

Patient
├── pertence a uma organização
├── possui avaliações
├── possui check-ins
├── possui medidas
├── recebe planos
├── possui análises de IA
└── possui consentimentos
```

## 7. Regras fundamentais

### Isolamento de tenant

Toda busca de recurso deve considerar identificador e organização:

```text
resource.id = requestedId
AND
resource.organizationId = authenticatedOrganizationId
```

### Integridade histórica

Avaliações, medidas, planos, revisões e consentimentos preservam histórico.

### Supervisão profissional

Saída de IA não é conduta definitiva antes do fluxo de revisão aplicável.

### Minimização de dados

Apenas dados necessários para a finalidade autorizada devem ser coletados, exibidos, registrados ou enviados.

### Rastreabilidade

Decisões relevantes devem ser ligadas a ator, tenant, paciente, fonte, versão, horário e estado de revisão.

### Ciclos de vida explícitos

Fluxos importantes usam estados explícitos, não combinações implícitas de campos nulos.

## 8. Eventos de domínio candidatos

- PatientCreated
- PatientUpdated
- AssessmentCreated
- AssessmentCompleted
- AssessmentReviewed
- CheckInSubmitted
- MeasurementRecorded
- CarePlanVersionPublished
- AIAnalysisRequested
- AIAnalysisGenerated
- AIAnalysisReviewed
- ConsentGranted
- ConsentRevoked

Eventos só devem ser implementados quando apoiarem desacoplamento, auditoria ou reação de negócio.

## 9. Primeira fatia vertical do MVP

1. profissional cria paciente;
2. profissional lista pacientes da organização;
3. profissional consulta um paciente;
4. profissional cria avaliação;
5. respostas são registradas;
6. avaliação é concluída;
7. resumo estruturado é gerado;
8. adaptador de IA é acionado;
9. análise é armazenada;
10. profissional revisa o resultado.

O primeiro incremento técnico implementa apenas criação, listagem e consulta de pacientes, com validação, erros e preparação para tenant.

## 10. Fora do primeiro MVP

- faturamento;
- telemedicina;
- marketplace;
- integração hospitalar;
- dispositivos médicos;
- prescrição eletrônica completa;
- diagnóstico autônomo;
- decisão clínica autônoma;
- motor completo de dieta;
- motor completo de periodização de treino.

## 11. Quando criar um ADR

Uma alteração exige avaliação arquitetural quando muda:

- contexto delimitado;
- propriedade de agregados;
- estratégia de tenant;
- responsabilidade de revisão de IA;
- fluxo de dado sensível;
- ciclo de vida;
- contrato público;
- consentimento ou retenção.

ADRs ficam em `docs/16-Decisions/`.

## 12. Definição de pronto para mudanças de domínio

Uma mudança só está pronta quando código, testes, documentação, autorização, auditoria, modelo de dados e impacto de IA estão alinhados.
