import {
  ApplicationError,
  ApplicationErrorOptions,
} from './application-error';

export type DomainErrorOptions = Omit<
  ApplicationErrorOptions,
  'statusCode'
> & {
  statusCode?: number;
};

export abstract class DomainError extends ApplicationError {
  constructor(options: DomainErrorOptions) {
    super({
      ...options,
      statusCode: options.statusCode ?? 422,
    });

    this.name = 'DomainError';
  }
}
