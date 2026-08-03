import { DomainError } from '../../../common/errors/domain-error';

export class ProfessionalScheduleBlockNotFoundError
  extends DomainError
{
  constructor() {
    super({
      code:
        'PROFESSIONAL_SCHEDULE_BLOCK_NOT_FOUND',
      message:
        'Professional schedule block was not found.',
      statusCode: 404,
    });

    this.name =
      'ProfessionalScheduleBlockNotFoundError';
  }
}