export interface PasswordValidationResult {
  valid: boolean;
  violations: string[];
}

export abstract class PasswordPolicy {
  abstract validate(
    plainPassword: string,
  ): PasswordValidationResult;
}