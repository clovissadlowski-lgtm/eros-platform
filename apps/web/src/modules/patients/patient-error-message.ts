import {
  ApiError,
} from '@/lib/api/api-error';

export function getPatientErrorMessage(
  error: unknown,
  fallbackMessage:
    string,
): string {
  if (
    !(error instanceof ApiError)
  ) {
    return fallbackMessage;
  }

  if (
    error.code ===
    'PATIENT_EMAIL_ALREADY_EXISTS'
  ) {
    return 'Já existe um paciente com este e-mail nesta organização.';
  }

  const normalizedMessage =
    error.message
      .trim()
      .toLowerCase();

  if (
    normalizedMessage.includes(
      'cpf inválido',
    )
  ) {
    return 'CPF inválido. Verifique o número informado.';
  }

  if (
    normalizedMessage.includes(
      'já existe um paciente com este cpf',
    )
  ) {
    return 'Já existe um paciente com este CPF nesta organização.';
  }

  if (
    normalizedMessage.includes(
      'a patient with this email already exists',
    )
  ) {
    return 'Já existe um paciente com este e-mail nesta organização.';
  }

  if (
    error.code ===
      'VALIDATION_ERROR' &&
    Array.isArray(
      error.details,
    )
  ) {
    const details =
      error.details
        .filter(
          (
            detail,
          ): detail is string =>
            typeof detail ===
            'string',
        )
        .join(
          ' ',
        )
        .toLowerCase();

    if (
      details.includes(
        'cpf',
      )
    ) {
      return 'O CPF informado não possui um formato válido.';
    }

    if (
      details.includes(
        'email',
      )
    ) {
      return 'O e-mail informado não é válido.';
    }

    if (
      details.includes(
        'phone',
      )
    ) {
      return 'O telefone informado não é válido.';
    }

    if (
      details.includes(
        'birthdate',
      )
    ) {
      return 'A data de nascimento informada não é válida.';
    }
  }

  return fallbackMessage;
}