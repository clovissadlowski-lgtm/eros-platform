import { DomainError } from '../../../common/errors/domain-error';

export class AppointmentNotFoundError extends DomainError {
  constructor() {
    super({
      code: 'APPOINTMENT_NOT_FOUND',
      message: 'Appointment not found.',
      statusCode: 404,
    });

    this.name = 'AppointmentNotFoundError';
  }
}
