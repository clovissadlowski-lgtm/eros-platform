import { DomainError } from '../../../common/errors/domain-error';

export class ProfessionalScheduleNotFoundError
  extends DomainError
{
  constructor() {
    super({
      code:
        'PROFESSIONAL_SCHEDULE_NOT_FOUND',
      message:
        'Professional schedule not found.',
      statusCode: 404,
    });

    this.name =
      'ProfessionalScheduleNotFoundError';
  }
}