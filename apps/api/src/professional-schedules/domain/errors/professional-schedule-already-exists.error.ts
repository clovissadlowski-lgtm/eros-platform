import { DomainError } from '../../../common/errors/domain-error';

export class ProfessionalScheduleAlreadyExistsError
  extends DomainError
{
  constructor() {
    super({
      code:
        'PROFESSIONAL_SCHEDULE_ALREADY_EXISTS',
      message:
        'A schedule already exists for this professional.',
      statusCode: 409,
    });

    this.name =
      'ProfessionalScheduleAlreadyExistsError';
  }
}