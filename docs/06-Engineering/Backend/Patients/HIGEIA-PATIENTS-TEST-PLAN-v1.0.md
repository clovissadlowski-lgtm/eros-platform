# Higeia Patients Test Plan v1.0

**Escopo:** Primeira implementação em memória  
**Status:** Plano aprovado

## 1. Objetivo

Comprovar que o módulo Patients respeita:

- regras de criação;
- validação;
- consulta;
- listagem;
- tenant;
- erros;
- IDs;
- timestamps;
- contrato HTTP.

## 2. Testes unitários do service

### Deve criar paciente

Verificar:

- ID gerado;
- organizationId correto;
- status ACTIVE;
- createdAt;
- updatedAt;
- campos preservados.

### Deve listar pacientes do tenant

Criar pacientes em tenants diferentes.

Confirmar que a lista contém apenas o tenant solicitado.

### Deve retornar paciente por ID

Confirmar que o recurso correto é retornado.

### Deve retornar not found

Para ID inexistente:

```text
PATIENT_NOT_FOUND
```

### Deve ocultar outro tenant

Criar no tenant A e buscar no tenant B.

Resultado:

```text
PATIENT_NOT_FOUND
```

## 3. Testes E2E

### POST válido

```text
201 Created
```

### POST inválido

Casos:

- name ausente;
- name vazio;
- email inválido;
- birthDate inválida;
- campo extra;
- phone inválido.

Resultado:

```text
400 Bad Request
```

### GET list

```text
200 OK
```

### GET by ID

```text
200 OK
```

### GET inexistente

```text
404 Not Found
```

## 4. Testes de segurança

- organizationId enviado no body deve ser rejeitado;
- tenant não pode ser alterado pelo cliente;
- outro tenant não pode acessar;
- erro não revela organização proprietária;
- resposta não contém campo secreto.

## 5. Determinismo

Controlar quando necessário:

- geração de ID;
- relógio;
- ordem da lista.

## 6. Dados de teste

Usar apenas dados fictícios.

Exemplo:

```text
Maria da Silva
maria@example.com
+5547999999999
1990-05-14
```

## 7. Evidência

Registrar:

- comando;
- resultado;
- commit;
- data;
- screenshot opcional.

Local:

```text
evidence/stack-poc/patients/
```

## 8. Gate de aprovação

A implementação só avança para banco quando:

- todos os testes passam;
- build passa;
- lint passa;
- endpoint funciona localmente;
- tenant está coberto;
- contrato está estável;
- erros estão previsíveis.
