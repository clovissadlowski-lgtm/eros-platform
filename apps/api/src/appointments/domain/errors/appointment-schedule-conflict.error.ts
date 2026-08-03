import { DomainError } from '../../../common/errors/domain-error';

export class AppointmentScheduleConflictError
  extends DomainError
{
  constructor() {
    super({
      code:
        'APPOINTMENT_SCHEDULE_CONFLICT',
      message:
        'The selected professional already has an appointment during this period.',
      statusCode: 409,
    });

    this.name =
      'AppointmentScheduleConflictError';
  }
}