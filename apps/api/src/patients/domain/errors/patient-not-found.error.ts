import { DomainError } from '../../../common/errors/domain-error';

export class PatientNotFoundError extends DomainError {
  constructor() {
    super({
      code: 'PATIENT_NOT_FOUND',
      message: 'Patient not found.',
      statusCode: 404,
    });

    this.name = 'PatientNotFoundError';
  }
}