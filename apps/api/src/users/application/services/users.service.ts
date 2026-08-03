import { Injectable } from '@nestjs/common';
import { randomUUID } from 'node:crypto';

import {
  User,
  UserStatus,
} from '../../domain/entities/user.entity';
import { UserEmailAlreadyExistsError } from '../../domain/errors/user-email-already-exists.error';
import { UserNotFoundError } from '../../domain/errors/user-not-found.error';
import { UsersRepository } from '../../domain/repositories/users.repository';

export interface CreateUserInput {
  name: string;
  email: string;
}

@Injectable()
export class UsersService {
  constructor(
    private readonly usersRepository: UsersRepository,
  ) {}

  async createInvitedUser(
    input: CreateUserInput,
  ): Promise<User> {
    const name = input.name.trim();
    const email = this.normalizeEmail(
      input.email,
    );

    const existingUser =
      await this.usersRepository.findByEmail(
        email,
      );

    if (existingUser) {
      throw new UserEmailAlreadyExistsError(
        email,
      );
    }

    const timestamp = new Date().toISOString();

    const user: User = {
      id: randomUUID(),
      name,
      email,
      passwordHash: null,
      status: UserStatus.INVITED,
      lastLoginAt: null,
      createdAt: timestamp,
      updatedAt: timestamp,
    };

    return this.usersRepository.create(user);
  }

  async listUsers(): Promise<User[]> {
    return this.usersRepository.list();
  }

  async getUserById(
    userId: string,
  ): Promise<User> {
    const user =
      await this.usersRepository.findById(
        userId,
      );

    if (!user) {
      throw new UserNotFoundError();
    }

    return user;
  }

  async getUserByEmail(
    email: string,
  ): Promise<User> {
    const normalizedEmail =
      this.normalizeEmail(email);

    const user =
      await this.usersRepository.findByEmail(
        normalizedEmail,
      );

    if (!user) {
      throw new UserNotFoundError();
    }

    return user;
  }

  private normalizeEmail(
    email: string,
  ): string {
    return email.trim().toLowerCase();
  }
}