import { DomainError } from '../../../common/errors/domain-error';

export class InvalidTimeZoneError
  extends DomainError
{
  constructor() {
    super({
      code:
        'INVALID_TIME_ZONE',
      message:
        'The supplied time zone is invalid.',
      statusCode: 422,
    });

    this.name =
      'InvalidTimeZoneError';
  }
}