# Higeia Error Handling v1.0

**Status:** Baseline aprovada  
**Escopo:** Backend HTTP, aplicação, domínio e integrações  
**Versão:** 1.0  
**Data:** 2026-07-22

## 1. Finalidade

Este documento define como a Higeia deve:

- identificar erros;
- classificar erros;
- transformar erros internos em respostas HTTP;
- registrar falhas;
- proteger dados sensíveis;
- manter códigos estáveis para frontend, testes e suporte;
- tratar falhas de provedores externos;
- correlacionar erros com requisições.

O objetivo é evitar respostas inconsistentes, vazamento de detalhes internos e tratamento improvisado em cada controller.

## 2. Princípios

1. Erro de domínio não é erro HTTP.
2. Controller não deve decidir sozinho o formato final de erro.
3. Códigos de erro são estáveis e legíveis por máquina.
4. Mensagens públicas devem ser seguras e claras.
5. Stack trace nunca deve ser retornado ao cliente.
6. Detalhes sensíveis não devem aparecer em resposta ou log.
7. Toda falha relevante deve possuir `requestId`.
8. Erros esperados e inesperados devem ser tratados de forma diferente.
9. Erros externos devem ser traduzidos para contratos internos.
10. A API nunca deve retornar `200 OK` com um corpo de erro.

## 3. Categorias de erro

### 3.1 Validation Error

Usado quando a requisição não atende ao contrato esperado.

Código base:

```text
VALIDATION_ERROR
```

Status HTTP:

```text
400
```

Exemplos:

- email inválido;
- campo obrigatório ausente;
- campo desconhecido;
- data inválida;
- tipo incorreto.

### 3.2 Resource Not Found

Usado quando o recurso não existe dentro do escopo autorizado.

Código genérico:

```text
RESOURCE_NOT_FOUND
```

Códigos específicos:

```text
PATIENT_NOT_FOUND
ASSESSMENT_NOT_FOUND
CARE_PLAN_NOT_FOUND
AI_ANALYSIS_NOT_FOUND
```

Status HTTP:

```text
404
```

Por segurança, um recurso de outro tenant pode ser tratado como não encontrado.

### 3.3 Conflict

Usado quando a operação conflita com o estado atual ou com restrição de unicidade.

Exemplos:

```text
PATIENT_EMAIL_CONFLICT
ASSESSMENT_ALREADY_COMPLETED
CARE_PLAN_VERSION_CONFLICT
```

Status HTTP:

```text
409
```

### 3.4 Unauthorized

Usado quando não há identidade autenticada válida.

Código:

```text
UNAUTHORIZED
```

Status HTTP:

```text
401
```

### 3.5 Forbidden

Usado quando o usuário está autenticado, mas não possui permissão.

Códigos:

```text
FORBIDDEN
INSUFFICIENT_PERMISSION
PROFESSIONAL_REVIEW_REQUIRED
```

Status HTTP:

```text
403
```

### 3.6 Business Rule Violation

Usado quando a requisição é válida, mas viola uma regra de domínio.

Exemplos:

```text
ASSESSMENT_CANNOT_BE_REOPENED
AI_ANALYSIS_NOT_REVIEWABLE
CARE_PLAN_CANNOT_BE_PUBLISHED
```

Status preferencial:

```text
422
```

Pode ser `409` quando o problema for explicitamente conflito de estado.

### 3.7 External Provider Error

Usado para falhas de IA, identidade, storage, email ou outras integrações.

Códigos:

```text
AI_PROVIDER_UNAVAILABLE
AI_PROVIDER_TIMEOUT
IDENTITY_PROVIDER_ERROR
OBJECT_STORAGE_ERROR
```

Status possíveis:

```text
502
503
504
```

### 3.8 Internal Error

Usado para falhas inesperadas.

Código público:

```text
INTERNAL_ERROR
```

Status HTTP:

```text
500
```

A resposta pública é genérica. O log interno registra contexto técnico seguro.

## 4. Formato padrão de resposta

```json
{
  "statusCode": 404,
  "code": "PATIENT_NOT_FOUND",
  "message": "Patient not found.",
  "details": null,
  "requestId": "01J3...",
  "timestamp": "2026-07-22T21:30:00.000Z",
  "path": "/api/patients/patient-id"
}
```

Campos:

- `statusCode`: status HTTP;
- `code`: código estável;
- `message`: mensagem pública segura;
- `details`: detalhes estruturados não sensíveis;
- `requestId`: correlação;
- `timestamp`: UTC ISO 8601;
- `path`: rota requisitada.

## 5. Erros de validação

Formato:

```json
{
  "statusCode": 400,
  "code": "VALIDATION_ERROR",
  "message": "Request validation failed.",
  "details": [
    {
      "field": "email",
      "constraints": [
        "must be an email"
      ]
    }
  ],
  "requestId": "01J3...",
  "timestamp": "2026-07-22T21:30:00.000Z",
  "path": "/api/patients"
}
```

Regras:

- não expor nomes internos de classes;
- não expor estrutura de banco;
- manter nomes de campo compatíveis com o contrato público;
- ordenar os detalhes de forma previsível quando possível.

## 6. Exceções de domínio

Erros de domínio devem representar regras de negócio, por exemplo:

```ts
export class PatientNotFoundError extends Error {
  readonly code = 'PATIENT_NOT_FOUND';

  constructor() {
    super('Patient not found.');
  }
}
```

A exceção de domínio não deve importar `HttpException`.

A tradução para HTTP é responsabilidade de filter ou mapper.

## 7. Exception Filter global

A API deverá possuir um filter global responsável por:

- identificar tipos de erro;
- definir status;
- aplicar formato padrão;
- anexar `requestId`;
- registrar falha;
- ocultar detalhes internos;
- preservar erros conhecidos;
- transformar erros desconhecidos em `INTERNAL_ERROR`.

## 8. Request ID

Cada requisição deve possuir um identificador único.

Fontes possíveis:

1. header confiável de gateway;
2. header interno validado;
3. geração no início da requisição.

Header de resposta recomendado:

```text
X-Request-Id
```

O mesmo identificador deve aparecer em:

- logs;
- traces;
- resposta de erro;
- eventos de auditoria quando aplicável;
- chamadas externas correlacionadas.

## 9. Logs de erro

Um log de erro pode conter:

- requestId;
- tenantId;
- userId;
- módulo;
- operação;
- código interno;
- status;
- duração;
- nome do provedor;
- stack trace em ambiente controlado.

Não deve conter por padrão:

- corpo completo da anamnese;
- exames;
- senha;
- token;
- cookie;
- prompt com dado sensível;
- resposta completa de IA com dado pessoal;
- chave de API;
- número de cartão;
- arquivo clínico.

## 10. Erros de provedores externos

O adapter deve traduzir falhas do SDK.

Exemplo:

```text
OpenAI timeout
        ↓
AI_PROVIDER_TIMEOUT
        ↓
504 Gateway Timeout
```

A aplicação não deve depender de códigos específicos do provedor.

O log interno pode registrar:

- provedor;
- modelo;
- tempo;
- número de tentativa;
- código do provedor;
- requestId externo.

## 11. Retentativas

Retentativa só deve existir quando:

- a operação é segura;
- o erro é transitório;
- existe limite;
- há backoff;
- há observabilidade;
- não há risco de duplicação.

Criação crítica pode exigir idempotência.

Não retentar automaticamente:

- erro de validação;
- erro de permissão;
- regra de negócio;
- falha permanente de configuração.

## 12. Mensagens públicas

Mensagens devem:

- ser claras;
- evitar informação sensível;
- não revelar existência de recurso de outro tenant;
- não revelar SQL, stack, caminho interno ou versão de infraestrutura;
- permitir tradução futura.

Exemplo seguro:

```text
Patient not found.
```

Exemplo inseguro:

```text
Patient 123 exists but belongs to organization 999.
```

## 13. Códigos por módulo

Cada módulo mantém um catálogo estável.

Exemplo para Patients:

```text
PATIENT_NOT_FOUND
PATIENT_EMAIL_CONFLICT
PATIENT_INACTIVE
PATIENT_UPDATE_NOT_ALLOWED
```

Mudanças incompatíveis em códigos públicos devem ser tratadas como mudança de contrato.

## 14. Ambientes

### Development

- log técnico detalhado;
- stack trace apenas no log;
- resposta pública continua segura.

### Test

- respostas determinísticas;
- logs reduzidos;
- fácil asserção de códigos.

### Production

- resposta mínima e segura;
- logs estruturados;
- integração com observabilidade;
- alertas para falhas críticas.

## 15. Checklist

Antes de concluir um caso de uso:

- erros esperados foram identificados?
- código estável foi definido?
- status HTTP está correto?
- mensagem pública é segura?
- requestId está presente?
- dados sensíveis ficaram fora do log?
- erro externo foi traduzido?
- teste cobre erro principal?
- outro tenant recebe 404 ou 403 conforme política?
