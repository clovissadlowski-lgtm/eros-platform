import { DomainError } from '../../../common/errors/domain-error';

export class InvalidSlotDurationError
  extends DomainError
{
  constructor() {
    super({
      code: 'INVALID_SLOT_DURATION',
      message:
        'Slot duration must be an integer between 5 and 480 minutes.',
      statusCode: 422,
    });

    this.name =
      'InvalidSlotDurationError';
  }
}