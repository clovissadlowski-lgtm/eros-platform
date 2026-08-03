import { DomainError } from '../../../common/errors/domain-error';

export class InvalidAvailabilityDateError
  extends DomainError
{
  constructor() {
    super({
      code: 'INVALID_AVAILABILITY_DATE',
      message:
        'Availability date must be a valid date in YYYY-MM-DD format.',
      statusCode: 422,
    });

    this.name =
      'InvalidAvailabilityDateError';
  }
}