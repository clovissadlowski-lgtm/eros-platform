import { Injectable } from '@nestjs/common';

import {
  PasswordPolicy,
  PasswordValidationResult,
} from '../../domain/services/password-policy';

@Injectable()
export class DefaultPasswordPolicy
  implements PasswordPolicy
{
  private static readonly MINIMUM_LENGTH = 12;

  private static readonly MAXIMUM_LENGTH = 128;

  validate(
    plainPassword: string,
  ): PasswordValidationResult {
    const violations: string[] = [];

    if (
      plainPassword.length <
      DefaultPasswordPolicy.MINIMUM_LENGTH
    ) {
      violations.push(
        'Password must contain at least 12 characters.',
      );
    }

    if (
      plainPassword.length >
      DefaultPasswordPolicy.MAXIMUM_LENGTH
    ) {
      violations.push(
        'Password must contain at most 128 characters.',
      );
    }

    if (!/[a-z]/.test(plainPassword)) {
      violations.push(
        'Password must contain at least one lowercase letter.',
      );
    }

    if (!/[A-Z]/.test(plainPassword)) {
      violations.push(
        'Password must contain at least one uppercase letter.',
      );
    }

    if (!/[0-9]/.test(plainPassword)) {
      violations.push(
        'Password must contain at least one number.',
      );
    }

    if (!/[^a-zA-Z0-9]/.test(plainPassword)) {
      violations.push(
        'Password must contain at least one special character.',
      );
    }

    return {
      valid: violations.length === 0,
      violations,
    };
  }
}