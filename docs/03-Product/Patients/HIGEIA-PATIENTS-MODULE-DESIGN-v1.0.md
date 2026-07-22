# Higeia Patients Module Design v1.0

**Status:** Baseline de implementação  
**Módulo:** Patients  
**Versão:** 1.0  
**Data:** 2026-07-22

## 1. Finalidade

Este documento define o primeiro módulo funcional de negócio da Higeia.

O módulo `patients` será responsável por representar o paciente como identidade de acompanhamento dentro de uma organização, preservando:

- isolamento de tenant;
- dados mínimos necessários;
- histórico;
- validação;
- regras claras de criação e consulta;
- possibilidade de evolução futura para PostgreSQL e Prisma;
- compatibilidade com assessments, check-ins, plans e AI analyses.

## 2. Responsabilidade do módulo

O módulo controla:

- criação de pacientes;
- consulta por ID;
- listagem por organização;
- status do paciente;
- identidade e dados básicos;
- vínculos futuros com profissionais;
- preparação para persistência real.

O módulo não controla:

- anamnese;
- exames;
- planos;
- fotos;
- IA;
- autenticação;
- organizações;
- agenda;
- faturamento.

## 3. Agregado principal

### Patient

Campos iniciais:

```text
id
organizationId
name
email
phone
birthDate
status
createdAt
updatedAt
```

### Status

```text
ACTIVE
INACTIVE
```

## 4. Regras iniciais

1. Todo paciente pertence a uma organização.
2. `organizationId` não deve ser informado pelo cliente público.
3. O tenant será obtido do contexto autenticado.
4. Durante a PoC, um tenant de desenvolvimento temporário poderá ser utilizado.
5. Nome é obrigatório.
6. Email deve ser válido quando informado.
7. `birthDate` usa formato `YYYY-MM-DD`.
8. ID é opaco.
9. Timestamps são UTC.
10. Listagem retorna apenas pacientes do tenant atual.
11. Consulta por ID sempre aplica tenant.
12. Recurso de outro tenant é tratado como não encontrado.
13. O módulo não armazena histórico clínico dentro de Patient.
14. Atualizações futuras devem preservar rastreabilidade.

## 5. Casos de uso iniciais

### Create Patient

Entrada:

- name;
- email;
- phone;
- birthDate;
- tenant context.

Saída:

- patient criado.

Erros:

- validation error;
- email conflict futuro;
- unauthorized;
- forbidden.

### List Patients

Entrada:

- tenant context;
- paginação futura;
- filtros futuros.

Saída:

- coleção de pacientes do tenant.

### Get Patient by ID

Entrada:

- patientId;
- tenant context.

Saída:

- patient.

Erro:

```text
PATIENT_NOT_FOUND
```

## 6. Estrutura técnica inicial

```text
apps/api/src/patients/
├── dto/
│   └── create-patient.dto.ts
├── entities/
│   └── patient.entity.ts
├── errors/
│   └── patient-not-found.error.ts
├── patients.controller.ts
├── patients.service.ts
├── patients.module.ts
└── patients.service.spec.ts
```

## 7. Armazenamento na PoC

A primeira implementação usará armazenamento em memória.

Objetivos:

- validar controller;
- validar service;
- validar DTO;
- validar tenant;
- validar erros;
- validar testes;
- estabilizar contrato antes do banco.

Limitações conhecidas:

- dados são perdidos ao reiniciar;
- não há concorrência real;
- não há transações;
- não há índices;
- não há persistência distribuída.

Essa limitação é aceita apenas para a PoC.

## 8. Evolução para persistência

Próxima etapa:

```text
PatientsService
    ↓
PatientsRepository
    ↓
PrismaPatientsRepository
    ↓
PostgreSQL
```

A migração para banco não deve alterar o contrato público.

## 9. Integrações futuras

O módulo poderá fornecer:

- query contract para Assessments;
- eventos `PatientCreated` e `PatientUpdated`;
- vínculo com Professionals;
- autorização por organização;
- audit events;
- exportação;
- soft delete;
- consentimento;
- atualização de status.

## 10. Critérios de aceite

O módulo será considerado funcional quando:

- cria paciente válido;
- rejeita payload inválido;
- lista apenas tenant atual;
- consulta por ID;
- retorna 404 para inexistente;
- retorna 404 para outro tenant;
- gera ID;
- gera timestamps;
- status inicial é ACTIVE;
- build passa;
- testes passam;
- documentação está alinhada.
