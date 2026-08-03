import { DomainError } from '../../../common/errors/domain-error';

export class TenantContextRequiredError extends DomainError {
  constructor() {
    super({
      code: 'TENANT_CONTEXT_REQUIRED',
      message:
        'An active organization must be selected.',
      statusCode: 403,
      details: null,
    });

    this.name = 'TenantContextRequiredError';
  }
}