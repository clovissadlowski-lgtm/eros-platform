import { DomainError } from '../../../common/errors/domain-error';

export class InvalidAppointmentStatusTransitionError
  extends DomainError
{
  constructor() {
    super({
      code:
        'INVALID_APPOINTMENT_STATUS_TRANSITION',
      message:
        'The requested appointment status transition is not allowed.',
      statusCode: 422,
    });

    this.name =
      'InvalidAppointmentStatusTransitionError';
  }
}