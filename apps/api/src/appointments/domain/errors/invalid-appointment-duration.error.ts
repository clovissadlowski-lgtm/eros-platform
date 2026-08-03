import { DomainError } from '../../../common/errors/domain-error';

export class InvalidAppointmentDurationError extends DomainError {
  constructor() {
    super({
      code: 'INVALID_APPOINTMENT_DURATION',
      message:
        'Appointment duration must be between 15 and 480 minutes.',
      statusCode: 422,
    });

    this.name =
      'InvalidAppointmentDurationError';
  }
}