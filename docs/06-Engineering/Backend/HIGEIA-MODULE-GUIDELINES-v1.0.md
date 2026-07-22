# Higeia Module Guidelines v1.0

## 1. Finalidade

Define como os módulos NestJS são criados, organizados, revisados e evoluídos.

Um módulo é uma fronteira de responsabilidade, não apenas uma pasta.

## 2. Quando criar um módulo

Crie um módulo quando ele:

- representa capacidade estável do negócio;
- possui regras próprias;
- controla agregados;
- tem ciclo de vida ou permissão distinta;
- integra uma capacidade externa;
- fornece uma função de plataforma reutilizável.

Não crie um módulo apenas porque existe uma tabela.

## 3. Estrutura mínima

```text
patients/
├── dto/
│   ├── create-patient.dto.ts
│   └── update-patient.dto.ts
├── entities/
│   └── patient.entity.ts
├── patients.controller.ts
├── patients.service.ts
├── patients.module.ts
└── patients.service.spec.ts
```

## 4. Estrutura avançada

Quando a complexidade justificar:

```text
patients/
├── application/
├── domain/
├── infrastructure/
├── presentation/
└── patients.module.ts
```

Não adotar estrutura avançada por estética.

## 5. Nomenclatura

Código técnico em inglês.

- classes: PascalCase;
- funções e variáveis: camelCase;
- arquivos: kebab-case;
- constantes: UPPER_SNAKE_CASE.

Exemplos:

- PatientsModule
- PatientsController
- PatientsService
- CreatePatientDto
- PatientNotFoundError

Use a linguagem do Domain Model.

## 6. Propriedade do módulo

O módulo controla:

- regras;
- entidades;
- escrita;
- mapeamento de persistência;
- eventos;
- códigos de erro;
- contratos exportados.

Não deve expor implementação de persistência.

## 7. Controllers

Devem:

- declarar rotas;
- receber DTOs e parâmetros;
- obter contexto autenticado;
- chamar caso de uso;
- devolver resultado.

Não devem:

- conter regra de negócio;
- usar Prisma;
- chamar IA;
- montar prompts;
- repetir manualmente filtro de tenant;
- ocultar erros amplos.

## 8. Services

Podem coordenar casos de uso e regras simples.

Não devem:

- depender de request/response HTTP;
- retornar objetos de SDK;
- ler `process.env`;
- misturar domínios não relacionados.

Serviços grandes devem ser divididos por caso de uso.

## 9. DTOs

- todo payload de escrita usa DTO;
- validação com `class-validator`;
- transformação com `class-transformer`;
- campos opcionais explícitos;
- propriedades desconhecidas rejeitadas;
- DTO não é entidade de domínio;
- tenant não vem do body público.

## 10. Repositórios

Crie abstração quando entrar persistência real.

Exemplo:

```ts
export interface PatientsRepository {
  create(patient: Patient): Promise<void>;
  findById(
    organizationId: string,
    patientId: string,
  ): Promise<Patient | null>;
  list(organizationId: string): Promise<Patient[]>;
}
```

Tenant faz parte do contrato.

## 11. Exports

Exportar apenas:

- facade;
- query service estável;
- porta;
- contrato de evento.

Evitar exportar:

- Prisma;
- repositório interno;
- entidade mutável;
- helper privado.

## 12. Dependências

Permitido:

- apresentação → aplicação;
- aplicação → domínio e portas;
- infraestrutura → portas e SDKs.

Proibido:

- domínio → NestJS;
- domínio → Prisma;
- domínio → AWS/OpenAI;
- controller → banco;
- módulo → infraestrutura interna de outro módulo;
- ciclos ocultados com `forwardRef` sem revisão.

## 13. Erros

Cada módulo define códigos estáveis:

- PATIENT_NOT_FOUND
- PATIENT_EMAIL_CONFLICT
- ASSESSMENT_ALREADY_COMPLETED
- AI_ANALYSIS_NOT_REVIEWABLE

Erros de banco nunca são expostos diretamente.

## 14. Testes mínimos para Patients

- cria paciente válido;
- rejeita DTO inválido;
- lista pacientes;
- retorna um paciente;
- retorna not found;
- bloqueia outro tenant;
- preserva ID e timestamps.

## 15. Checklist antes de programar

- qual capacidade o módulo controla?
- quais agregados?
- quem é o tenant?
- quais casos de uso?
- quais estados?
- quais dados são sensíveis?
- o que será exportado?
- quais dependências?
- quais eventos?
- quais erros?
- quais testes?

## 16. Primeiro contrato do módulo Patients

Endpoints:

```text
POST /api/patients
GET  /api/patients
GET  /api/patients/:patientId
```

Campos iniciais:

- id
- organizationId
- name
- email
- phone
- birthDate
- status
- createdAt
- updatedAt

Status:

- ACTIVE
- INACTIVE

Durante a PoC em memória, a organização pode vir de um contexto temporário de desenvolvimento. Ela não deve virar campo público definitivo do body.

## 17. Definição de pronto

- caso de uso funciona;
- validação existe;
- erros são previsíveis;
- tenant está explícito;
- testes existem;
- build e lint passam;
- contrato está documentado;
- segurança foi revisada;
- evidência foi registrada quando aplicável.
