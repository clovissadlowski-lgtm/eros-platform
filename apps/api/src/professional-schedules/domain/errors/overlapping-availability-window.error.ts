import { DomainError } from '../../../common/errors/domain-error';

export class OverlappingAvailabilityWindowError
  extends DomainError
{
  constructor() {
    super({
      code:
        'OVERLAPPING_AVAILABILITY_WINDOW',
      message:
        'Availability windows for the same weekday cannot overlap.',
      statusCode: 422,
    });

    this.name =
      'OverlappingAvailabilityWindowError';
  }
}