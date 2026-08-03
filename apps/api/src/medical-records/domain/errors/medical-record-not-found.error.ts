import { DomainError } from '../../../common/errors/domain-error';

export class MedicalRecordNotFoundError extends DomainError {
  constructor() {
    super({
      code: 'MEDICAL_RECORD_NOT_FOUND',
      message: 'Medical record not found.',
      statusCode: 404,
    });

    this.name = 'MedicalRecordNotFoundError';
  }
}