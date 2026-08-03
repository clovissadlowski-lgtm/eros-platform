import { DomainError } from '../../../common/errors/domain-error';

export class PatientEmailAlreadyExistsError extends DomainError {
  constructor() {
    super({
      code: 'PATIENT_EMAIL_ALREADY_EXISTS',
      message:
        'A patient with this email already exists in the organization.',
      statusCode: 409,
    });

    this.name =
      'PatientEmailAlreadyExistsError';
  }
}