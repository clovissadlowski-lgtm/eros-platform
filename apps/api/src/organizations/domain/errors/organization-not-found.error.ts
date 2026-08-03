import { DomainError } from '../../../common/errors/domain-error';

export class OrganizationNotFoundError extends DomainError {
  constructor() {
    super({
      code: 'ORGANIZATION_NOT_FOUND',
      message: 'Organization not found.',
      statusCode: 404,
    });

    this.name = 'OrganizationNotFoundError';
  }
}