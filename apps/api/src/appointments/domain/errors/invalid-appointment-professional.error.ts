import { DomainError } from '../../../common/errors/domain-error';

export class InvalidAppointmentProfessionalError extends DomainError {
  constructor() {
    super({
      code:
        'INVALID_APPOINTMENT_PROFESSIONAL',
      message:
        'The selected professional is not available for this appointment.',
      statusCode: 422,
    });

    this.name =
      'InvalidAppointmentProfessionalError';
  }
}