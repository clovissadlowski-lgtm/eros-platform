import { DomainError } from '../../../common/errors/domain-error';

export class MedicalRecordAlreadyExistsError extends DomainError {
  constructor() {
    super({
      code: 'MEDICAL_RECORD_ALREADY_EXISTS',
      message:
        'A medical record already exists for this patient.',
      statusCode: 409,
    });

    this.name =
      'MedicalRecordAlreadyExistsError';
  }
}