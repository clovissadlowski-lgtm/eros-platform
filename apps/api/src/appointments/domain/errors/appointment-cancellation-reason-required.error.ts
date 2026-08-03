import { DomainError } from '../../../common/errors/domain-error';

export class AppointmentCancellationReasonRequiredError
  extends DomainError
{
  constructor() {
    super({
      code:
        'APPOINTMENT_CANCELLATION_REASON_REQUIRED',
      message:
        'A cancellation reason is required.',
      statusCode: 422,
    });

    this.name =
      'AppointmentCancellationReasonRequiredError';
  }
}