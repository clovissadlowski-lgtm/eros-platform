import { randomUUID } from 'node:crypto';

import {
  User,
  UserStatus,
} from '../../domain/entities/user.entity';
import { InMemoryUsersRepository } from './in-memory-users.repository';

describe('InMemoryUsersRepository', () => {
  let repository: InMemoryUsersRepository;

  beforeEach(() => {
    repository =
      new InMemoryUsersRepository();
  });

  it('creates a user', async () => {
    const user = createUser();

    const createdUser =
      await repository.create(user);

    expect(createdUser).toEqual(user);

    const storedUser =
      await repository.findById(user.id);

    expect(storedUser).toEqual(user);
  });

  it('finds a user by id', async () => {
    const user = createUser();

    await repository.create(user);

    const foundUser =
      await repository.findById(user.id);

    expect(foundUser).toEqual(user);
  });

  it('returns null when the id does not exist', async () => {
    const foundUser =
      await repository.findById(
        randomUUID(),
      );

    expect(foundUser).toBeNull();
  });

  it('finds a user by normalized email', async () => {
    const user = createUser({
      email: 'clovis@higeia.com',
    });

    await repository.create(user);

    const foundUser =
      await repository.findByEmail(
        '  CLOVIS@HIGEIA.COM  ',
      );

    expect(foundUser).toEqual(user);
  });

  it('returns null when the email does not exist', async () => {
    const foundUser =
      await repository.findByEmail(
        'not-found@higeia.com',
      );

    expect(foundUser).toBeNull();
  });

  it('lists all users', async () => {
    const firstUser = createUser({
      name: 'First User',
      email: 'first@higeia.com',
    });

    const secondUser = createUser({
      name: 'Second User',
      email: 'second@higeia.com',
    });

    await repository.create(firstUser);
    await repository.create(secondUser);

    const users = await repository.list();

    expect(users).toEqual([
      firstUser,
      secondUser,
    ]);
  });

  it('updates an existing user', async () => {
    const user = createUser();

    await repository.create(user);

    const updatedUser: User = {
      ...user,
      name: 'Updated User',
      status: UserStatus.BLOCKED,
      updatedAt:
        '2026-07-31T23:00:00.000Z',
    };

    const result =
      await repository.update(
        updatedUser,
      );

    expect(result).toEqual(updatedUser);

    const storedUser =
      await repository.findById(user.id);

    expect(storedUser).toEqual(
      updatedUser,
    );
  });

  function createUser(
    overrides: Partial<User> = {},
  ): User {
    const timestamp =
      '2026-07-31T22:00:00.000Z';

    return {
      id: randomUUID(),
      name: 'Test User',
      email: `user-${randomUUID()}@higeia.com`,
      passwordHash: null,
      status: UserStatus.INVITED,
      lastLoginAt: null,
      createdAt: timestamp,
      updatedAt: timestamp,
      ...overrides,
    };
  }
});