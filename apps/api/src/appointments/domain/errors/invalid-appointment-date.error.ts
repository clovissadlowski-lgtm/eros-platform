import { DomainError } from '../../../common/errors/domain-error';

export class InvalidAppointmentDateError extends DomainError {
  constructor() {
    super({
      code: 'INVALID_APPOINTMENT_DATE',
      message:
        'The appointment must be scheduled for a future date.',
      statusCode: 422,
    });

    this.name =
      'InvalidAppointmentDateError';
  }
}