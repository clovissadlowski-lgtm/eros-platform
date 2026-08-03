import { Injectable } from '@nestjs/common';

import { PrismaService } from '../../../common/database/prisma.service';
import { UserStatus as PrismaUserStatus } from '../../../generated/prisma/enums';
import {
  User,
  UserStatus,
} from '../../domain/entities/user.entity';
import { UsersRepository } from '../../domain/repositories/users.repository';

interface PrismaUserRecord {
  id: string;
  name: string;
  email: string;
  passwordHash: string | null;
  status: PrismaUserStatus;
  lastLoginAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

@Injectable()
export class PrismaUsersRepository
  implements UsersRepository
{
  constructor(
    private readonly prisma: PrismaService,
  ) {}

  async create(user: User): Promise<User> {
    const createdUser =
      await this.prisma.user.create({
        data: {
          id: user.id,
          name: user.name,
          email: user.email,
          passwordHash: user.passwordHash,
          status: this.toPrismaStatus(
            user.status,
          ),
          lastLoginAt: user.lastLoginAt
            ? new Date(user.lastLoginAt)
            : null,
          createdAt: new Date(user.createdAt),
          updatedAt: new Date(user.updatedAt),
        },
      });

    return this.toDomain(createdUser);
  }

  async findById(
    userId: string,
  ): Promise<User | null> {
    const user =
      await this.prisma.user.findUnique({
        where: {
          id: userId,
        },
      });

    return user
      ? this.toDomain(user)
      : null;
  }

  async findByEmail(
    email: string,
  ): Promise<User | null> {
    const normalizedEmail =
      email.trim().toLowerCase();

    const user =
      await this.prisma.user.findUnique({
        where: {
          email: normalizedEmail,
        },
      });

    return user
      ? this.toDomain(user)
      : null;
  }

  async list(): Promise<User[]> {
    const users =
      await this.prisma.user.findMany({
        orderBy: {
          createdAt: 'asc',
        },
      });

    return users.map((user) =>
      this.toDomain(user),
    );
  }

  async update(user: User): Promise<User> {
    const updatedUser =
      await this.prisma.user.update({
        where: {
          id: user.id,
        },
        data: {
          name: user.name,
          email: user.email,
          passwordHash: user.passwordHash,
          status: this.toPrismaStatus(
            user.status,
          ),
          lastLoginAt: user.lastLoginAt
            ? new Date(user.lastLoginAt)
            : null,
          updatedAt: new Date(user.updatedAt),
        },
      });

    return this.toDomain(updatedUser);
  }

  private toDomain(
    user: PrismaUserRecord,
  ): User {
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      passwordHash: user.passwordHash,
      status: this.toDomainStatus(
        user.status,
      ),
      lastLoginAt:
        user.lastLoginAt?.toISOString() ??
        null,
      createdAt: user.createdAt.toISOString(),
      updatedAt: user.updatedAt.toISOString(),
    };
  }

  private toPrismaStatus(
    status: UserStatus,
  ): PrismaUserStatus {
    return status as PrismaUserStatus;
  }

  private toDomainStatus(
    status: PrismaUserStatus,
  ): UserStatus {
    return status as UserStatus;
  }
}