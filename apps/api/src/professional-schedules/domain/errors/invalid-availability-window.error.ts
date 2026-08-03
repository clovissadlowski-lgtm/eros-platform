import { DomainError } from '../../../common/errors/domain-error';

export class InvalidAvailabilityWindowError
  extends DomainError
{
  constructor() {
    super({
      code:
        'INVALID_AVAILABILITY_WINDOW',
      message:
        'The availability window is invalid.',
      statusCode: 422,
    });

    this.name =
      'InvalidAvailabilityWindowError';
  }
}