import { ConfigService } from '@nestjs/config';
import { randomUUID } from 'node:crypto';

import {
  Membership,
  MembershipRole,
  MembershipStatus,
} from '../../../users/domain/entities/membership.entity';
import { InMemoryMembershipsRepository } from '../../../users/infrastructure/repositories/in-memory-memberships.repository';
import { MembershipAccessDeniedError } from '../../domain/errors/membership-access-denied.error';
import {
  AccessTokenPayload,
  AccessTokenProvider,
} from '../../domain/tokens/access-token-provider';
import { SelectOrganizationService } from './select-organization.service';

class FakeAccessTokenProvider
  implements AccessTokenProvider
{
  generatedPayload:
    | AccessTokenPayload
    | null = null;

  async generate(
    payload: AccessTokenPayload,
  ): Promise<string> {
    this.generatedPayload = payload;

    return 'tenant-access-token';
  }

  async verify(
    _accessToken: string,
  ): Promise<AccessTokenPayload> {
    if (!this.generatedPayload) {
      throw new Error(
        'No access token was generated.',
      );
    }

    return this.generatedPayload;
  }
}

describe(
  'SelectOrganizationService',
  () => {
    let membershipsRepository:
      InMemoryMembershipsRepository;

    let accessTokenProvider:
      FakeAccessTokenProvider;

    let service:
      SelectOrganizationService;

    beforeEach(() => {
      membershipsRepository =
        new InMemoryMembershipsRepository();

      accessTokenProvider =
        new FakeAccessTokenProvider();

      service =
        new SelectOrganizationService(
          membershipsRepository,
          accessTokenProvider,
          new ConfigService({
            JWT_ACCESS_TTL_SECONDS: 900,
          }),
        );
    });

    it('selects an organization through an active membership', async () => {
      const membership =
        createMembership();

      await membershipsRepository.create(
        membership,
      );

      const result = await service.execute({
        userId: membership.userId,
        sessionId: randomUUID(),
        email: 'user@higeia.test',
        organizationId:
          membership.organizationId,
      });

      expect(result.accessToken).toBe(
        'tenant-access-token',
      );

      expect(result.tokenType).toBe(
        'Bearer',
      );

      expect(result.expiresIn).toBe(900);

      expect(result.context).toEqual({
        organizationId:
          membership.organizationId,
        membershipId: membership.id,
        role: membership.role,
      });
    });

    it('includes tenant information in the new access token', async () => {
      const membership =
        createMembership({
          role: MembershipRole.ADMIN,
        });

      await membershipsRepository.create(
        membership,
      );

      const sessionId = randomUUID();

      await service.execute({
        userId: membership.userId,
        sessionId,
        email: 'admin@higeia.test',
        organizationId:
          membership.organizationId,
      });

      expect(
        accessTokenProvider.generatedPayload,
      ).toEqual({
        sub: membership.userId,
        sessionId,
        email: 'admin@higeia.test',
        organizationId:
          membership.organizationId,
        membershipId: membership.id,
        role: MembershipRole.ADMIN,
      });
    });

    it('rejects an unknown membership', async () => {
      await expect(
        service.execute({
          userId: randomUUID(),
          sessionId: randomUUID(),
          email: 'user@higeia.test',
          organizationId: randomUUID(),
        }),
      ).rejects.toBeInstanceOf(
        MembershipAccessDeniedError,
      );
    });

    it.each([
      MembershipStatus.INVITED,
      MembershipStatus.SUSPENDED,
      MembershipStatus.INACTIVE,
    ])(
      'rejects a membership with status %s',
      async (status) => {
        const membership =
          createMembership({
            status,
          });

        await membershipsRepository.create(
          membership,
        );

        await expect(
          service.execute({
            userId: membership.userId,
            sessionId: randomUUID(),
            email: 'user@higeia.test',
            organizationId:
              membership.organizationId,
          }),
        ).rejects.toBeInstanceOf(
          MembershipAccessDeniedError,
        );
      },
    );

    it('rejects access through another user membership', async () => {
      const membership =
        createMembership();

      await membershipsRepository.create(
        membership,
      );

      await expect(
        service.execute({
          userId: randomUUID(),
          sessionId: randomUUID(),
          email: 'other@higeia.test',
          organizationId:
            membership.organizationId,
        }),
      ).rejects.toBeInstanceOf(
        MembershipAccessDeniedError,
      );
    });

    function createMembership(
      overrides: Partial<Membership> = {},
    ): Membership {
      const timestamp =
        '2026-08-01T12:00:00.000Z';

      return {
        id: randomUUID(),
        userId: randomUUID(),
        organizationId: randomUUID(),
        role: MembershipRole.OWNER,
        status:
          MembershipStatus.ACTIVE,
        createdAt: timestamp,
        updatedAt: timestamp,
        ...overrides,
      };
    }
  },
);