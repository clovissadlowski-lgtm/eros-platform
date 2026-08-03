import { DomainError } from '../../../common/errors/domain-error';

export class OverlappingScheduleBlockError
  extends DomainError
{
  constructor() {
    super({
      code:
        'OVERLAPPING_SCHEDULE_BLOCK',
      message:
        'The schedule block overlaps an existing block.',
      statusCode: 409,
    });

    this.name =
      'OverlappingScheduleBlockError';
  }
}