import { ScryptPasswordHasher } from './scrypt-password-hasher';

describe('ScryptPasswordHasher', () => {
  let passwordHasher: ScryptPasswordHasher;

  beforeEach(() => {
    passwordHasher =
      new ScryptPasswordHasher();
  });

  it('hashes a password without exposing the plain value', async () => {
    const password =
      'StrongPassword#2026';

    const passwordHash =
      await passwordHasher.hash(password);

    expect(passwordHash).toBeDefined();

    expect(passwordHash).not.toBe(
      password,
    );

    expect(passwordHash).not.toContain(
      password,
    );

    expect(passwordHash).toMatch(
      /^scrypt\$1\$/,
    );
  });

  it('generates different hashes for the same password', async () => {
    const password =
      'StrongPassword#2026';

    const firstHash =
      await passwordHasher.hash(password);

    const secondHash =
      await passwordHasher.hash(password);

    expect(firstHash).not.toBe(
      secondHash,
    );
  });

  it('accepts the correct password', async () => {
    const password =
      'StrongPassword#2026';

    const passwordHash =
      await passwordHasher.hash(password);

    const matches =
      await passwordHasher.compare(
        password,
        passwordHash,
      );

    expect(matches).toBe(true);
  });

  it('rejects an incorrect password', async () => {
    const passwordHash =
      await passwordHasher.hash(
        'CorrectPassword#2026',
      );

    const matches =
      await passwordHasher.compare(
        'WrongPassword#2026',
        passwordHash,
      );

    expect(matches).toBe(false);
  });

  it('rejects an invalid hash format', async () => {
    const matches =
      await passwordHasher.compare(
        'StrongPassword#2026',
        'invalid-password-hash',
      );

    expect(matches).toBe(false);
  });

  it('rejects a hash with an unsupported algorithm', async () => {
    const matches =
      await passwordHasher.compare(
        'StrongPassword#2026',
        'unknown$1$c2FsdA==$a2V5',
      );

    expect(matches).toBe(false);
  });

  it('rejects a hash with an unsupported version', async () => {
    const passwordHash =
      await passwordHasher.hash(
        'StrongPassword#2026',
      );

    const unsupportedVersionHash =
      passwordHash.replace(
        'scrypt$1$',
        'scrypt$999$',
      );

    const matches =
      await passwordHasher.compare(
        'StrongPassword#2026',
        unsupportedVersionHash,
      );

    expect(matches).toBe(false);
  });
});