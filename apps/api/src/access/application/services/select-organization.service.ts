import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import {
  Membership,
  MembershipStatus,
} from '../../../users/domain/entities/membership.entity';
import { MembershipsRepository } from '../../../users/domain/repositories/memberships.repository';
import { MembershipAccessDeniedError } from '../../domain/errors/membership-access-denied.error';
import { AccessTokenProvider } from '../../domain/tokens/access-token-provider';

export interface SelectOrganizationInput {
  userId: string;
  sessionId: string;
  email: string;
  organizationId: string;
}

export interface SelectOrganizationResult {
  accessToken: string;
  tokenType: 'Bearer';
  expiresIn: number;
  context: {
    organizationId: string;
    membershipId: string;
    role: Membership['role'];
  };
}

@Injectable()
export class SelectOrganizationService {
  constructor(
    private readonly membershipsRepository: MembershipsRepository,
    private readonly accessTokenProvider: AccessTokenProvider,
    private readonly configService: ConfigService,
  ) {}

  async execute(
    input: SelectOrganizationInput,
  ): Promise<SelectOrganizationResult> {
    const organizationId =
      input.organizationId.trim();

    const membership =
      await this.membershipsRepository.findByUserAndOrganization(
        input.userId,
        organizationId,
      );

    this.ensureMembershipIsActive(
      membership,
      input.userId,
      organizationId,
    );

    const accessToken =
      await this.accessTokenProvider.generate({
        sub: input.userId,
        sessionId: input.sessionId,
        email: input.email,
        organizationId:
          membership.organizationId,
        membershipId: membership.id,
        role: membership.role,
      });

    const expiresIn =
      this.configService.getOrThrow<number>(
        'JWT_ACCESS_TTL_SECONDS',
      );

    return {
      accessToken,
      tokenType: 'Bearer',
      expiresIn,
      context: {
        organizationId:
          membership.organizationId,
        membershipId: membership.id,
        role: membership.role,
      },
    };
  }

  private ensureMembershipIsActive(
    membership: Membership | null,
    userId: string,
    organizationId: string,
  ): asserts membership is Membership {
    const isValid =
      membership !== null &&
      membership.userId === userId &&
      membership.organizationId ===
        organizationId &&
      membership.status ===
        MembershipStatus.ACTIVE;

    if (!isValid) {
      throw new MembershipAccessDeniedError();
    }
  }
}