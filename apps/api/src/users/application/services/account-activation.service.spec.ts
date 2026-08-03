import { randomUUID } from 'node:crypto';

import { PasswordHasher } from '../../../auth/domain/services/password-hasher';
import { DefaultPasswordPolicy } from '../../../auth/infrastructure/security/default-password-policy';
import {
  User,
  UserStatus,
} from '../../domain/entities/user.entity';
import { UserActivationNotAllowedError } from '../../domain/errors/user-activation-not-allowed.error';
import { UserNotFoundError } from '../../domain/errors/user-not-found.error';
import { WeakPasswordError } from '../../domain/errors/weak-password.error';
import { InMemoryUsersRepository } from '../../infrastructure/repositories/in-memory-users.repository';
import { AccountActivationService } from './account-activation.service';

class FakePasswordHasher
  implements PasswordHasher
{
  async hash(
    plainPassword: string,
  ): Promise<string> {
    return `hashed:${plainPassword}`;
  }

  async compare(
    plainPassword: string,
    passwordHash: string,
  ): Promise<boolean> {
    return (
      passwordHash ===
      `hashed:${plainPassword}`
    );
  }
}

describe('AccountActivationService', () => {
  let usersRepository: InMemoryUsersRepository;
  let passwordHasher: FakePasswordHasher;
  let passwordPolicy: DefaultPasswordPolicy;
  let service: AccountActivationService;

  beforeEach(() => {
    usersRepository =
      new InMemoryUsersRepository();

    passwordHasher =
      new FakePasswordHasher();

    passwordPolicy =
      new DefaultPasswordPolicy();

    service = new AccountActivationService(
      usersRepository,
      passwordHasher,
      passwordPolicy,
    );
  });

  it('activates an invited user with a strong password', async () => {
    const user = createUser();

    await usersRepository.create(user);

    const activatedUser =
      await service.activateInvitedUser({
        userId: user.id,
        plainPassword:
          'StrongPassword#2026',
      });

    expect(activatedUser.status).toBe(
      UserStatus.ACTIVE,
    );

    expect(
      activatedUser.passwordHash,
    ).toBe(
      'hashed:StrongPassword#2026',
    );

    expect(activatedUser.updatedAt).not.toBe(
      user.updatedAt,
    );
  });

  it('persists the activated user', async () => {
    const user = createUser();

    await usersRepository.create(user);

    await service.activateInvitedUser({
      userId: user.id,
      plainPassword:
        'StrongPassword#2026',
    });

    const storedUser =
      await usersRepository.findById(
        user.id,
      );

    expect(storedUser?.status).toBe(
      UserStatus.ACTIVE,
    );

    expect(storedUser?.passwordHash).toBe(
      'hashed:StrongPassword#2026',
    );
  });

  it('throws when the user does not exist', async () => {
    await expect(
      service.activateInvitedUser({
        userId: randomUUID(),
        plainPassword:
          'StrongPassword#2026',
      }),
    ).rejects.toBeInstanceOf(
      UserNotFoundError,
    );
  });

  it('rejects a weak password', async () => {
    const user = createUser();

    await usersRepository.create(user);

    await expect(
      service.activateInvitedUser({
        userId: user.id,
        plainPassword: 'weak',
      }),
    ).rejects.toBeInstanceOf(
      WeakPasswordError,
    );
  });

  it('does not modify the user when the password is weak', async () => {
    const user = createUser();

    await usersRepository.create(user);

    try {
      await service.activateInvitedUser({
        userId: user.id,
        plainPassword: 'weak',
      });
    } catch {
      // O erro é esperado neste teste.
    }

    const storedUser =
      await usersRepository.findById(
        user.id,
      );

    expect(storedUser).toEqual(user);
  });

  it('does not activate an already active user', async () => {
    const user = createUser({
      status: UserStatus.ACTIVE,
      passwordHash: 'existing-hash',
    });

    await usersRepository.create(user);

    await expect(
      service.activateInvitedUser({
        userId: user.id,
        plainPassword:
          'StrongPassword#2026',
      }),
    ).rejects.toBeInstanceOf(
      UserActivationNotAllowedError,
    );
  });

  it('does not activate a blocked user', async () => {
    const user = createUser({
      status: UserStatus.BLOCKED,
    });

    await usersRepository.create(user);

    await expect(
      service.activateInvitedUser({
        userId: user.id,
        plainPassword:
          'StrongPassword#2026',
      }),
    ).rejects.toBeInstanceOf(
      UserActivationNotAllowedError,
    );
  });

  it('does not activate an invited user that already has a password hash', async () => {
    const user = createUser({
      status: UserStatus.INVITED,
      passwordHash: 'unexpected-hash',
    });

    await usersRepository.create(user);

    await expect(
      service.activateInvitedUser({
        userId: user.id,
        plainPassword:
          'StrongPassword#2026',
      }),
    ).rejects.toBeInstanceOf(
      UserActivationNotAllowedError,
    );
  });

  function createUser(
    overrides: Partial<User> = {},
  ): User {
    const timestamp =
      '2026-07-31T22:00:00.000Z';

    return {
      id: randomUUID(),
      name: 'Invited User',
      email: `activation-${randomUUID()}@higeia.test`,
      passwordHash: null,
      status: UserStatus.INVITED,
      lastLoginAt: null,
      createdAt: timestamp,
      updatedAt: timestamp,
      ...overrides,
    };
  }
});