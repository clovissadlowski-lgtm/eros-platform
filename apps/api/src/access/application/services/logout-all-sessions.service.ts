import { Injectable } from '@nestjs/common';

import { SessionsRepository } from '../../domain/repositories/sessions.repository';

export interface LogoutAllSessionsInput {
  userId: string;
}

@Injectable()
export class LogoutAllSessionsService {
  constructor(
    private readonly sessionsRepository: SessionsRepository,
  ) {}

  async execute(
    input: LogoutAllSessionsInput,
  ): Promise<number> {
    const userId = input.userId.trim();

    if (!userId) {
      return 0;
    }

    const revokedAt =
      new Date().toISOString();

    return this.sessionsRepository.revokeAllByUserId(
      userId,
      revokedAt,
    );
  }
}