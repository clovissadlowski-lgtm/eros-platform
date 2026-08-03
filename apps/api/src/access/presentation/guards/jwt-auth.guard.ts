import {
  CanActivate,
  ExecutionContext,
  Injectable,
} from '@nestjs/common';
import type { Request } from 'express';

import {
  Membership,
  MembershipStatus,
} from '../../../users/domain/entities/membership.entity';
import {
  User,
  UserStatus,
} from '../../../users/domain/entities/user.entity';
import { MembershipsRepository } from '../../../users/domain/repositories/memberships.repository';
import { UsersRepository } from '../../../users/domain/repositories/users.repository';
import { Session } from '../../domain/entities/session.entity';
import { InvalidAccessTokenError } from '../../domain/errors/invalid-access-token.error';
import { SessionsRepository } from '../../domain/repositories/sessions.repository';
import {
  AccessTokenPayload,
  AccessTokenProvider,
} from '../../domain/tokens/access-token-provider';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    private readonly accessTokenProvider: AccessTokenProvider,
    private readonly sessionsRepository: SessionsRepository,
    private readonly usersRepository: UsersRepository,
    private readonly membershipsRepository: MembershipsRepository,
  ) {}

  async canActivate(
    context: ExecutionContext,
  ): Promise<boolean> {
    const request =
      context.switchToHttp().getRequest<Request>();

    const accessToken =
      this.extractBearerToken(request);

    if (!accessToken) {
      throw new InvalidAccessTokenError();
    }

    let payload: AccessTokenPayload;

    try {
      payload =
        await this.accessTokenProvider.verify(
          accessToken,
        );
    } catch {
      throw new InvalidAccessTokenError();
    }

    this.ensurePayloadIsValid(payload);

    const session =
      await this.sessionsRepository.findById(
        payload.sessionId,
      );

    this.ensureSessionIsActive(
      session,
      payload,
    );

    const user =
      await this.usersRepository.findById(
        payload.sub,
      );

    this.ensureUserIsActive(
      user,
      payload,
    );

    const membership =
      await this.resolveMembership(payload);

    request.auth = {
      userId: user.id,
      sessionId: session.id,
      email: user.email,
      organizationId:
        membership?.organizationId ?? null,
      membershipId:
        membership?.id ?? null,
      role: membership?.role ?? null,
    };

    return true;
  }

  private extractBearerToken(
    request: Request,
  ): string | null {
    const authorization =
      request.headers.authorization;

    if (!authorization) {
      return null;
    }

    const parts =
      authorization.trim().split(/\s+/);

    if (
      parts.length !== 2 ||
      parts[0].toLowerCase() !== 'bearer' ||
      !parts[1]
    ) {
      return null;
    }

    return parts[1];
  }

  private ensurePayloadIsValid(
    payload: AccessTokenPayload,
  ): void {
    const isValid =
      typeof payload.sub === 'string' &&
      payload.sub.length > 0 &&
      typeof payload.sessionId === 'string' &&
      payload.sessionId.length > 0 &&
      typeof payload.email === 'string' &&
      payload.email.length > 0;

    if (!isValid) {
      throw new InvalidAccessTokenError();
    }
  }

  private ensureSessionIsActive(
    session: Session | null,
    payload: AccessTokenPayload,
  ): asserts session is Session {
    if (!session) {
      throw new InvalidAccessTokenError();
    }

    const isExpired =
      new Date(
        session.expiresAt,
      ).getTime() <= Date.now();

    const belongsToUser =
      session.userId === payload.sub;

    if (
      session.revokedAt !== null ||
      isExpired ||
      !belongsToUser
    ) {
      throw new InvalidAccessTokenError();
    }
  }

  private ensureUserIsActive(
    user: User | null,
    payload: AccessTokenPayload,
  ): asserts user is User {
    const isValid =
      user !== null &&
      user.status === UserStatus.ACTIVE &&
      user.id === payload.sub &&
      user.email.toLowerCase() ===
        payload.email.toLowerCase();

    if (!isValid) {
      throw new InvalidAccessTokenError();
    }
  }

  private async resolveMembership(
    payload: AccessTokenPayload,
  ): Promise<Membership | null> {
    const tenantClaims = [
      payload.organizationId,
      payload.membershipId,
      payload.role,
    ];

    const tenantClaimCount =
      tenantClaims.filter(
        (claim) =>
          claim !== undefined &&
          claim !== null,
      ).length;

    if (tenantClaimCount === 0) {
      return null;
    }

    if (tenantClaimCount !== 3) {
      throw new InvalidAccessTokenError();
    }

    const membership =
      await this.membershipsRepository.findById(
        payload.membershipId!,
      );

    const isValid =
      membership !== null &&
      membership.status ===
        MembershipStatus.ACTIVE &&
      membership.userId === payload.sub &&
      membership.organizationId ===
        payload.organizationId &&
      membership.role === payload.role;

    if (!isValid) {
      throw new InvalidAccessTokenError();
    }

    return membership;
  }
}