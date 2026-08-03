import { randomUUID } from 'node:crypto';

import { UserStatus } from '../../domain/entities/user.entity';
import { UserEmailAlreadyExistsError } from '../../domain/errors/user-email-already-exists.error';
import { UserNotFoundError } from '../../domain/errors/user-not-found.error';
import { InMemoryUsersRepository } from '../../infrastructure/repositories/in-memory-users.repository';
import { UsersService } from './users.service';

describe('UsersService', () => {
  let repository: InMemoryUsersRepository;
  let service: UsersService;

  beforeEach(() => {
    repository =
      new InMemoryUsersRepository();

    service = new UsersService(repository);
  });

  it('creates an invited user', async () => {
    const user =
      await service.createInvitedUser({
        name: 'Clóvis Sadlowski',
        email: 'clovis@higeia.com',
      });

    expect(user.id).toBeDefined();
    expect(user.name).toBe(
      'Clóvis Sadlowski',
    );
    expect(user.email).toBe(
      'clovis@higeia.com',
    );
    expect(user.passwordHash).toBeNull();
    expect(user.status).toBe(
      UserStatus.INVITED,
    );
    expect(user.lastLoginAt).toBeNull();
    expect(user.createdAt).toBeDefined();
    expect(user.updatedAt).toBeDefined();
  });

  it('trims the user name', async () => {
    const user =
      await service.createInvitedUser({
        name: '  Clóvis Sadlowski  ',
        email: 'clovis@higeia.com',
      });

    expect(user.name).toBe(
      'Clóvis Sadlowski',
    );
  });

  it('normalizes the user email', async () => {
    const user =
      await service.createInvitedUser({
        name: 'Clóvis Sadlowski',
        email:
          '  CLOVIS@HIGEIA.COM  ',
      });

    expect(user.email).toBe(
      'clovis@higeia.com',
    );
  });

  it('does not allow a duplicated normalized email', async () => {
    await service.createInvitedUser({
      name: 'First User',
      email: 'clovis@higeia.com',
    });

    await expect(
      service.createInvitedUser({
        name: 'Second User',
        email:
          '  CLOVIS@HIGEIA.COM  ',
      }),
    ).rejects.toBeInstanceOf(
      UserEmailAlreadyExistsError,
    );
  });

  it('lists users', async () => {
    await service.createInvitedUser({
      name: 'First User',
      email: 'first@higeia.com',
    });

    await service.createInvitedUser({
      name: 'Second User',
      email: 'second@higeia.com',
    });

    const users =
      await service.listUsers();

    expect(users).toHaveLength(2);
  });

  it('gets a user by id', async () => {
    const createdUser =
      await service.createInvitedUser({
        name: 'Test User',
        email: 'test@higeia.com',
      });

    const user =
      await service.getUserById(
        createdUser.id,
      );

    expect(user).toEqual(createdUser);
  });

  it('throws when a user id does not exist', async () => {
    await expect(
      service.getUserById(randomUUID()),
    ).rejects.toBeInstanceOf(
      UserNotFoundError,
    );
  });

  it('gets a user by normalized email', async () => {
    const createdUser =
      await service.createInvitedUser({
        name: 'Test User',
        email: 'test@higeia.com',
      });

    const user =
      await service.getUserByEmail(
        '  TEST@HIGEIA.COM  ',
      );

    expect(user).toEqual(createdUser);
  });

  it('throws when an email does not exist', async () => {
    await expect(
      service.getUserByEmail(
        'not-found@higeia.com',
      ),
    ).rejects.toBeInstanceOf(
      UserNotFoundError,
    );
  });
});