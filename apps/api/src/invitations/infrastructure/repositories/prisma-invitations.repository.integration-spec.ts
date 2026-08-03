import { randomUUID } from 'node:crypto';

import { PrismaService } from '../../../common/database/prisma.service';
import {
  MembershipRole,
  MembershipStatus,
} from '../../../users/domain/entities/membership.entity';
import { UserStatus } from '../../../users/domain/entities/user.entity';
import {
  Invitation,
  InvitationStatus,
} from '../../domain/entities/invitation.entity';
import { PrismaInvitationsRepository } from './prisma-invitations.repository';

describe(
  'PrismaInvitationsRepository integration',
  () => {
    const organizationId =
      '44444444-4444-4444-8444-444444444444';

    let prisma: PrismaService;
    let repository: PrismaInvitationsRepository;

    const createdInvitationIds: string[] = [];
    const createdMembershipIds: string[] = [];
    const createdUserIds: string[] = [];

    beforeAll(async () => {
      prisma = new PrismaService();

      repository =
        new PrismaInvitationsRepository(prisma);

      await prisma.$connect();
    });

    beforeEach(async () => {
      await clearTestData();
      await ensureOrganizationExists();
    });

    afterAll(async () => {
      await clearTestData();

      await prisma.organization.deleteMany({
        where: {
          id: organizationId,
        },
      });

      await prisma.$disconnect();
    });

    it('creates and returns an invitation', async () => {
      const relations =
        await createInvitationRelations();

      const invitation = createInvitation({
        userId: relations.invitedUserId,
        membershipId:
          relations.invitedMembershipId,
        createdByMembershipId:
          relations.creatorMembershipId,
      });

      const createdInvitation =
        await repository.create(invitation);

      expect(createdInvitation).toEqual(
        invitation,
      );

      const storedInvitation =
        await prisma.invitation.findUnique({
          where: {
            id: invitation.id,
          },
        });

      expect(storedInvitation).not.toBeNull();

      expect(
        storedInvitation?.organizationId,
      ).toBe(organizationId);

      expect(storedInvitation?.userId).toBe(
        relations.invitedUserId,
      );

      expect(
        storedInvitation?.membershipId,
      ).toBe(
        relations.invitedMembershipId,
      );

      expect(
        storedInvitation
          ?.createdByMembershipId,
      ).toBe(
        relations.creatorMembershipId,
      );

      expect(storedInvitation?.status).toBe(
        'PENDING',
      );

      expect(storedInvitation?.role).toBe(
        'NUTRITIONIST',
      );
    });

    it('finds an invitation by id', async () => {
      const relations =
        await createInvitationRelations();

      const invitation = createInvitation({
        userId: relations.invitedUserId,
        membershipId:
          relations.invitedMembershipId,
        createdByMembershipId:
          relations.creatorMembershipId,
      });

      await repository.create(invitation);

      const foundInvitation =
        await repository.findById(
          invitation.id,
        );

      expect(foundInvitation).toEqual(
        invitation,
      );
    });

    it('returns null when the invitation id does not exist', async () => {
      const foundInvitation =
        await repository.findById(
          randomUUID(),
        );

      expect(foundInvitation).toBeNull();
    });

    it('finds an invitation by token hash', async () => {
      const relations =
        await createInvitationRelations();

      const invitation = createInvitation({
        userId: relations.invitedUserId,
        membershipId:
          relations.invitedMembershipId,
        createdByMembershipId:
          relations.creatorMembershipId,
        tokenHash: createTokenHash(),
      });

      await repository.create(invitation);

      const foundInvitation =
        await repository.findByTokenHash(
          invitation.tokenHash,
        );

      expect(foundInvitation).toEqual(
        invitation,
      );
    });

    it('returns null when the token hash does not exist', async () => {
      const foundInvitation =
        await repository.findByTokenHash(
          createTokenHash(),
        );

      expect(foundInvitation).toBeNull();
    });

    it('finds a pending invitation by normalized email and organization', async () => {
      const relations =
        await createInvitationRelations();

      const invitation = createInvitation({
        userId: relations.invitedUserId,
        membershipId:
          relations.invitedMembershipId,
        createdByMembershipId:
          relations.creatorMembershipId,
        email:
          'nutritionist-integration@higeia.test',
      });

      await repository.create(invitation);

      const foundInvitation =
        await repository.findPendingByEmailAndOrganization(
          '  NUTRITIONIST-INTEGRATION@HIGEIA.TEST  ',
          organizationId,
        );

      expect(foundInvitation).toEqual(
        invitation,
      );
    });

    it('does not return an accepted invitation as pending', async () => {
      const relations =
        await createInvitationRelations();

      const invitation = createInvitation({
        userId: relations.invitedUserId,
        membershipId:
          relations.invitedMembershipId,
        createdByMembershipId:
          relations.creatorMembershipId,
        status: InvitationStatus.ACCEPTED,
        acceptedAt:
          '2026-08-01T03:00:00.000Z',
        updatedAt:
          '2026-08-01T03:00:00.000Z',
      });

      await repository.create(invitation);

      const foundInvitation =
        await repository.findPendingByEmailAndOrganization(
          invitation.email,
          organizationId,
        );

      expect(foundInvitation).toBeNull();
    });

    it('does not return an invitation from another organization', async () => {
      const relations =
        await createInvitationRelations();

      const invitation = createInvitation({
        userId: relations.invitedUserId,
        membershipId:
          relations.invitedMembershipId,
        createdByMembershipId:
          relations.creatorMembershipId,
      });

      await repository.create(invitation);

      const foundInvitation =
        await repository.findPendingByEmailAndOrganization(
          invitation.email,
          randomUUID(),
        );

      expect(foundInvitation).toBeNull();
    });

    it('lists invitations by organization', async () => {
      const firstRelations =
        await createInvitationRelations();

      const secondRelations =
        await createInvitationRelations();

      const firstInvitation =
        createInvitation({
          userId:
            firstRelations.invitedUserId,
          membershipId:
            firstRelations.invitedMembershipId,
          createdByMembershipId:
            firstRelations.creatorMembershipId,
          email: createUniqueEmail('first'),
          createdAt:
            '2026-08-01T01:00:00.000Z',
          updatedAt:
            '2026-08-01T01:00:00.000Z',
        });

      const secondInvitation =
        createInvitation({
          userId:
            secondRelations.invitedUserId,
          membershipId:
            secondRelations.invitedMembershipId,
          createdByMembershipId:
            secondRelations.creatorMembershipId,
          email: createUniqueEmail('second'),
          createdAt:
            '2026-08-01T02:00:00.000Z',
          updatedAt:
            '2026-08-01T02:00:00.000Z',
        });

      await repository.create(
        firstInvitation,
      );

      await repository.create(
        secondInvitation,
      );

      const invitations =
        await repository.listByOrganization(
          organizationId,
        );

      const testInvitations =
        invitations.filter(
          (invitation) =>
            invitation.id ===
              firstInvitation.id ||
            invitation.id ===
              secondInvitation.id,
        );

      expect(testInvitations).toEqual([
        firstInvitation,
        secondInvitation,
      ]);
    });

    it('updates an existing invitation', async () => {
      const relations =
        await createInvitationRelations();

      const invitation = createInvitation({
        userId: relations.invitedUserId,
        membershipId:
          relations.invitedMembershipId,
        createdByMembershipId:
          relations.creatorMembershipId,
      });

      await repository.create(invitation);

      const updatedInvitation: Invitation = {
        ...invitation,
        status: InvitationStatus.REVOKED,
        revokedAt:
          '2026-08-01T04:00:00.000Z',
        updatedAt:
          '2026-08-01T04:00:00.000Z',
      };

      const result =
        await repository.update(
          updatedInvitation,
        );

      expect(result).toEqual(
        updatedInvitation,
      );

      const storedInvitation =
        await repository.findById(
          invitation.id,
        );

      expect(storedInvitation).toEqual(
        updatedInvitation,
      );
    });

    async function ensureOrganizationExists(): Promise<void> {
      await prisma.organization.upsert({
        where: {
          id: organizationId,
        },
        update: {
          name:
            'Invitation Integration Organization',
          slug:
            'invitation-integration-organization',
          status: 'ACTIVE',
        },
        create: {
          id: organizationId,
          name:
            'Invitation Integration Organization',
          slug:
            'invitation-integration-organization',
          status: 'ACTIVE',
        },
      });
    }

    async function createInvitationRelations(): Promise<{
      invitedUserId: string;
      invitedMembershipId: string;
      creatorMembershipId: string;
    }> {
      const invitedUserId = randomUUID();
      const creatorUserId = randomUUID();

      const invitedMembershipId =
        randomUUID();

      const creatorMembershipId =
        randomUUID();

      createdUserIds.push(
        invitedUserId,
        creatorUserId,
      );

      createdMembershipIds.push(
        invitedMembershipId,
        creatorMembershipId,
      );

      await prisma.user.createMany({
        data: [
          {
            id: invitedUserId,
            name:
              'Invited Integration User',
            email:
              createUniqueEmail('invited'),
            passwordHash: null,
            status: UserStatus.INVITED,
            lastLoginAt: null,
            createdAt: new Date(
              '2026-08-01T00:00:00.000Z',
            ),
            updatedAt: new Date(
              '2026-08-01T00:00:00.000Z',
            ),
          },
          {
            id: creatorUserId,
            name:
              'Creator Integration User',
            email:
              createUniqueEmail('creator'),
            passwordHash:
              'integration-password-hash',
            status: UserStatus.ACTIVE,
            lastLoginAt: null,
            createdAt: new Date(
              '2026-08-01T00:00:00.000Z',
            ),
            updatedAt: new Date(
              '2026-08-01T00:00:00.000Z',
            ),
          },
        ],
      });

      await prisma.membership.createMany({
        data: [
          {
            id: invitedMembershipId,
            userId: invitedUserId,
            organizationId,
            role:
              MembershipRole.NUTRITIONIST,
            status:
              MembershipStatus.INVITED,
            createdAt: new Date(
              '2026-08-01T00:00:00.000Z',
            ),
            updatedAt: new Date(
              '2026-08-01T00:00:00.000Z',
            ),
          },
          {
            id: creatorMembershipId,
            userId: creatorUserId,
            organizationId,
            role: MembershipRole.OWNER,
            status:
              MembershipStatus.ACTIVE,
            createdAt: new Date(
              '2026-08-01T00:00:00.000Z',
            ),
            updatedAt: new Date(
              '2026-08-01T00:00:00.000Z',
            ),
          },
        ],
      });

      return {
        invitedUserId,
        invitedMembershipId,
        creatorMembershipId,
      };
    }

    function createInvitation(
      overrides: Partial<Invitation> = {},
    ): Invitation {
      const id = randomUUID();

      createdInvitationIds.push(id);

      return {
        id,
        organizationId,
        userId: randomUUID(),
        membershipId: randomUUID(),
        email:
          createUniqueEmail('invitation'),
        role:
          MembershipRole.NUTRITIONIST,
        tokenHash: createTokenHash(),
        status: InvitationStatus.PENDING,
        expiresAt:
          '2026-08-04T00:00:00.000Z',
        acceptedAt: null,
        revokedAt: null,
        createdByMembershipId:
          randomUUID(),
        createdAt:
          '2026-08-01T00:00:00.000Z',
        updatedAt:
          '2026-08-01T00:00:00.000Z',
        ...overrides,
      };
    }

    function createUniqueEmail(
      prefix: string,
    ): string {
      return `${prefix}-${randomUUID()}@higeia.test`;
    }

    function createTokenHash(): string {
      return randomUUID()
        .replace(/-/g, '')
        .padEnd(64, '0')
        .slice(0, 64);
    }

    async function clearTestData(): Promise<void> {
      /*
       * A limpeza começa pelas invitations porque elas
       * possuem foreign keys para memberships, users e
       * organizations.
       */
      await prisma.invitation.deleteMany({
        where: {
          organizationId,
        },
      });

      /*
       * Depois removemos todos os memberships vinculados
       * à organização exclusiva desta suíte.
       */
      await prisma.membership.deleteMany({
        where: {
          organizationId,
        },
      });

      /*
       * Por segurança, removemos também memberships
       * ligados aos usuários registrados pela suíte,
       * mesmo que algum deles não esteja mais associado
       * à organização principal do teste.
       */
      if (createdUserIds.length > 0) {
        await prisma.membership.deleteMany({
          where: {
            userId: {
              in: createdUserIds,
            },
          },
        });

        await prisma.user.deleteMany({
          where: {
            id: {
              in: createdUserIds,
            },
          },
        });
      }

      createdInvitationIds.length = 0;
      createdMembershipIds.length = 0;
      createdUserIds.length = 0;
    }
  },
);