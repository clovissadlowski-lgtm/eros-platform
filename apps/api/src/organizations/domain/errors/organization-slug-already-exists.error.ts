import { DomainError } from '../../../common/errors/domain-error';

export class OrganizationSlugAlreadyExistsError extends DomainError {
  constructor(
    readonly slug: string,
  ) {
    super({
      code: 'ORGANIZATION_SLUG_ALREADY_EXISTS',
      message:
        'An organization with this slug already exists.',
      statusCode: 409,
      details: {
        slug,
      },
    });

    this.name =
      'OrganizationSlugAlreadyExistsError';
  }
}