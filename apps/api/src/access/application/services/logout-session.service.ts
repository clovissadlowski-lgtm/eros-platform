import { Injectable } from '@nestjs/common';

import { SessionsRepository } from '../../domain/repositories/sessions.repository';
import { RefreshTokenHasher } from '../../domain/tokens/refresh-token-hasher';

export interface LogoutSessionInput {
  refreshToken: string;
}

@Injectable()
export class LogoutSessionService {
  constructor(
    private readonly sessionsRepository: SessionsRepository,
    private readonly refreshTokenHasher: RefreshTokenHasher,
  ) {}

  async execute(
    input: LogoutSessionInput,
  ): Promise<void> {
    const refreshToken =
      input.refreshToken.trim();

    if (!refreshToken) {
      return;
    }

    const refreshTokenHash =
      this.refreshTokenHasher.hash(
        refreshToken,
      );

    const session =
      await this.sessionsRepository.findByRefreshTokenHash(
        refreshTokenHash,
      );

    if (
      !session ||
      session.revokedAt !== null
    ) {
      return;
    }

    const timestamp =
      new Date().toISOString();

    await this.sessionsRepository.update({
      ...session,
      revokedAt: timestamp,
      updatedAt: timestamp,
    });
  }
}