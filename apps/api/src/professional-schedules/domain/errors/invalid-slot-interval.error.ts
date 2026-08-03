import { DomainError } from '../../../common/errors/domain-error';

export class InvalidSlotIntervalError
  extends DomainError
{
  constructor() {
    super({
      code:
        'INVALID_SLOT_INTERVAL',
      message:
        'Slot interval must be between 5 and 240 minutes.',
      statusCode: 422,
    });

    this.name =
      'InvalidSlotIntervalError';
  }
}