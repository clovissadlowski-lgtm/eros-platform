import { Injectable } from '@nestjs/common';

import { User } from '../../domain/entities/user.entity';
import { UsersRepository } from '../../domain/repositories/users.repository';

@Injectable()
export class InMemoryUsersRepository
  implements UsersRepository
{
  private readonly users: User[] = [];

  async create(user: User): Promise<User> {
    this.users.push(user);

    return user;
  }

  async findById(
    userId: string,
  ): Promise<User | null> {
    return (
      this.users.find(
        (user) => user.id === userId,
      ) ?? null
    );
  }

  async findByEmail(
    email: string,
  ): Promise<User | null> {
    const normalizedEmail =
      email.trim().toLowerCase();

    return (
      this.users.find(
        (user) =>
          user.email.toLowerCase() ===
          normalizedEmail,
      ) ?? null
    );
  }

  async list(): Promise<User[]> {
    return [...this.users];
  }

  async update(user: User): Promise<User> {
    const userIndex = this.users.findIndex(
      (storedUser) =>
        storedUser.id === user.id,
    );

    if (userIndex === -1) {
      this.users.push(user);

      return user;
    }

    this.users[userIndex] = user;

    return user;
  }
}
