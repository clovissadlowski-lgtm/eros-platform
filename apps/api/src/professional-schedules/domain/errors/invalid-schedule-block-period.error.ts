import { DomainError } from '../../../common/errors/domain-error';

export class InvalidScheduleBlockPeriodError
  extends DomainError
{
  constructor() {
    super({
      code:
        'INVALID_SCHEDULE_BLOCK_PERIOD',
      message:
        'Schedule block end must be after its start.',
      statusCode: 422,
    });

    this.name =
      'InvalidScheduleBlockPeriodError';
  }
}