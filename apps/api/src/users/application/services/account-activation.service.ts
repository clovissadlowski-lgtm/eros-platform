import { Injectable } from '@nestjs/common';

import { PasswordHasher } from '../../../auth/domain/services/password-hasher';
import { PasswordPolicy } from '../../../auth/domain/services/password-policy';
import {
  User,
  UserStatus,
} from '../../domain/entities/user.entity';
import { UserActivationNotAllowedError } from '../../domain/errors/user-activation-not-allowed.error';
import { UserNotFoundError } from '../../domain/errors/user-not-found.error';
import { WeakPasswordError } from '../../domain/errors/weak-password.error';
import { UsersRepository } from '../../domain/repositories/users.repository';

export interface ActivateInvitedUserInput {
  userId: string;
  plainPassword: string;
}

@Injectable()
export class AccountActivationService {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly passwordHasher: PasswordHasher,
    private readonly passwordPolicy: PasswordPolicy,
  ) {}

  async activateInvitedUser(
    input: ActivateInvitedUserInput,
  ): Promise<User> {
    const user =
      await this.usersRepository.findById(
        input.userId,
      );

    if (!user) {
      throw new UserNotFoundError();
    }

    if (
      user.status !== UserStatus.INVITED ||
      user.passwordHash !== null
    ) {
      throw new UserActivationNotAllowedError(
        user.id,
        user.status,
      );
    }

    const passwordValidation =
      this.passwordPolicy.validate(
        input.plainPassword,
      );

    if (!passwordValidation.valid) {
      throw new WeakPasswordError(
        passwordValidation.violations,
      );
    }

    const passwordHash =
      await this.passwordHasher.hash(
        input.plainPassword,
      );

    const activatedUser: User = {
      ...user,
      passwordHash,
      status: UserStatus.ACTIVE,
      updatedAt: new Date().toISOString(),
    };

    return this.usersRepository.update(
      activatedUser,
    );
  }
}