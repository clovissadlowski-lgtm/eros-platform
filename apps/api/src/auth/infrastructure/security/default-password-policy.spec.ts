import { DefaultPasswordPolicy } from './default-password-policy';

describe('DefaultPasswordPolicy', () => {
  let passwordPolicy: DefaultPasswordPolicy;

  beforeEach(() => {
    passwordPolicy =
      new DefaultPasswordPolicy();
  });

  it('accepts a strong password', () => {
    const result = passwordPolicy.validate(
      'StrongPassword#2026',
    );

    expect(result.valid).toBe(true);
    expect(result.violations).toEqual([]);
  });

  it('rejects a password shorter than 12 characters', () => {
    const result = passwordPolicy.validate(
      'Short#2026',
    );

    expect(result.valid).toBe(false);

    expect(result.violations).toContain(
      'Password must contain at least 12 characters.',
    );
  });

  it('rejects a password without lowercase letters', () => {
    const result = passwordPolicy.validate(
      'STRONGPASSWORD#2026',
    );

    expect(result.valid).toBe(false);

    expect(result.violations).toContain(
      'Password must contain at least one lowercase letter.',
    );
  });

  it('rejects a password without uppercase letters', () => {
    const result = passwordPolicy.validate(
      'strongpassword#2026',
    );

    expect(result.valid).toBe(false);

    expect(result.violations).toContain(
      'Password must contain at least one uppercase letter.',
    );
  });

  it('rejects a password without numbers', () => {
    const result = passwordPolicy.validate(
      'StrongPassword#',
    );

    expect(result.valid).toBe(false);

    expect(result.violations).toContain(
      'Password must contain at least one number.',
    );
  });

  it('rejects a password without special characters', () => {
    const result = passwordPolicy.validate(
      'StrongPassword2026',
    );

    expect(result.valid).toBe(false);

    expect(result.violations).toContain(
      'Password must contain at least one special character.',
    );
  });

  it('returns all detected violations', () => {
    const result =
      passwordPolicy.validate('password');

    expect(result.valid).toBe(false);

    expect(result.violations).toEqual(
      expect.arrayContaining([
        'Password must contain at least 12 characters.',
        'Password must contain at least one uppercase letter.',
        'Password must contain at least one number.',
        'Password must contain at least one special character.',
      ]),
    );
  });
});