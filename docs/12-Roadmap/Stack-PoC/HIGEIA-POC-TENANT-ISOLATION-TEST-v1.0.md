# Higeia — PoC Tenant Isolation Test

## Objetivo

Provar conceitualmente que recursos pertencentes ao tenant A não podem ser acessados pelo tenant B.

## Dados sintéticos

```text
tenant-test-a
tenant-test-b
patient-test-a-001
```

## Cenário positivo

Usuário do tenant A solicita paciente do tenant A.

Resultado esperado:

```text
200 / allowed
```

## Cenário negativo

Usuário do tenant B solicita paciente do tenant A.

Resultado esperado:

```text
403 / denied
```

## Evidência mínima

- teste automatizado;
- saída do teste;
- regra de autorização;
- nenhum dado do paciente retornado no cenário negativo.

## Observação

O teste da PoC não substitui o teste completo de segurança do MVP.
