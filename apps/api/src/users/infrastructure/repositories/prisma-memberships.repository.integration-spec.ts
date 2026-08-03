import { randomUUID } from 'node:crypto';

import { PrismaService } from '../../../common/database/prisma.service';
import {
  Membership,
  MembershipRole,
  MembershipStatus,
} from '../../domain/entities/membership.entity';
import {
  User,
  UserStatus,
} from '../../domain/entities/user.entity';
import { PrismaMembershipsRepository } from './prisma-memberships.repository';

describe(
  'PrismaMembershipsRepository integration',
  () => {
    const organizationId =
      '33333333-3333-4333-8333-333333333333';

    let prisma: PrismaService;
    let repository: PrismaMembershipsRepository;

    const createdUserIds: string[] = [];
    const createdMembershipIds: string[] =
      [];

    beforeAll(async () => {
      prisma = new PrismaService();

      repository =
        new PrismaMembershipsRepository(
          prisma,
        );

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

    it('creates and returns a membership', async () => {
      const user = await createStoredUser();

      const membership =
        createMembership({
          userId: user.id,
        });

      const createdMembership =
        await repository.create(
          membership,
        );

      expect(createdMembership).toEqual(
        membership,
      );

      const storedMembership =
        await prisma.membership.findUnique({
          where: {
            id: membership.id,
          },
        });

      expect(storedMembership).not.toBeNull();

      expect(storedMembership?.userId).toBe(
        user.id,
      );

      expect(
        storedMembership?.organizationId,
      ).toBe(organizationId);

      expect(storedMembership?.role).toBe(
        'NUTRITIONIST',
      );

      expect(storedMembership?.status).toBe(
        'INVITED',
      );
    });

    it('finds a membership by id', async () => {
      const user = await createStoredUser();

      const membership =
        createMembership({
          userId: user.id,
        });

      await repository.create(membership);

      const foundMembership =
        await repository.findById(
          membership.id,
        );

      expect(foundMembership).toEqual(
        membership,
      );
    });

    it('returns null when the membership id does not exist', async () => {
      const foundMembership =
        await repository.findById(
          randomUUID(),
        );

      expect(foundMembership).toBeNull();
    });

    it('finds a membership by user and organization', async () => {
      const user = await createStoredUser();

      const membership =
        createMembership({
          userId: user.id,
        });

      await repository.create(membership);

      const foundMembership =
        await repository.findByUserAndOrganization(
          user.id,
          organizationId,
        );

      expect(foundMembership).toEqual(
        membership,
      );
    });

    it('returns null when user and organization do not match', async () => {
      const user = await createStoredUser();

      const membership =
        createMembership({
          userId: user.id,
        });

      await repository.create(membership);

      const foundMembership =
        await repository.findByUserAndOrganization(
          randomUUID(),
          organizationId,
        );

      expect(foundMembership).toBeNull();
    });

    it('lists memberships by user', async () => {
      const user = await createStoredUser();

      const secondOrganizationId =
        randomUUID();

      await prisma.organization.create({
        data: {
          id: secondOrganizationId,
          name:
            'Second Membership Integration Organization',
          slug: `second-membership-${randomUUID()}`,
          status: 'ACTIVE',
        },
      });

      const firstMembership =
        createMembership({
          userId: user.id,
          organizationId,
        });

      const secondMembership =
        createMembership({
          userId: user.id,
          organizationId:
            secondOrganizationId,
        });

      await repository.create(
        firstMembership,
      );

      await repository.create(
        secondMembership,
      );

      const memberships =
        await repository.listByUser(
          user.id,
        );

      expect(memberships).toEqual([
        firstMembership,
        secondMembership,
      ]);

      await prisma.membership.deleteMany({
        where: {
          organizationId:
            secondOrganizationId,
        },
      });

      await prisma.organization.delete({
        where: {
          id: secondOrganizationId,
        },
      });
    });

    it('lists memberships by organization', async () => {
      const firstUser =
        await createStoredUser({
          email:
            createUniqueEmail('first'),
        });

      const secondUser =
        await createStoredUser({
          email:
            createUniqueEmail('second'),
        });

      const firstMembership =
        createMembership({
          userId: firstUser.id,
          role: MembershipRole.OWNER,
        });

      const secondMembership =
        createMembership({
          userId: secondUser.id,
          role: MembershipRole.ASSISTANT,
        });

      await repository.create(
        firstMembership,
      );

      await repository.create(
        secondMembership,
      );

      const memberships =
        await repository.listByOrganization(
          organizationId,
        );

      expect(memberships).toEqual([
        firstMembership,
        secondMembership,
      ]);
    });

    it('updates an existing membership', async () => {
      const user = await createStoredUser();

      const membership =
        createMembership({
          userId: user.id,
        });

      await repository.create(membership);

      const updatedMembership: Membership = {
        ...membership,
        role: MembershipRole.ADMIN,
        status:
          MembershipStatus.SUSPENDED,
        updatedAt:
          '2026-07-31T23:45:00.000Z',
      };

      const result =
        await repository.update(
          updatedMembership,
        );

      expect(result).toEqual(
        updatedMembership,
      );

      const storedMembership =
        await repository.findById(
          membership.id,
        );

      expect(storedMembership).toEqual(
        updatedMembership,
      );
    });

    async function ensureOrganizationExists(): Promise<void> {
      await prisma.organization.upsert({
        where: {
          id: organizationId,
        },
        update: {
          name:
            'Membership Integration Organization',
          slug:
            'membership-integration-organization',
          status: 'ACTIVE',
        },
        create: {
          id: organizationId,
          name:
            'Membership Integration Organization',
          slug:
            'membership-integration-organization',
          status: 'ACTIVE',
        },
      });
    }

    async function createStoredUser(
      overrides: Partial<User> = {},
    ): Promise<User> {
      const user = createUser(overrides);

      await prisma.user.create({
        data: {
          id: user.id,
          name: user.name,
          email: user.email,
          passwordHash: user.passwordHash,
          status: 'INVITED',
          lastLoginAt: null,
          createdAt: new Date(
            user.createdAt,
          ),
          updatedAt: new Date(
            user.updatedAt,
          ),
        },
      });

      return user;
    }

    function createUser(
      overrides: Partial<User> = {},
    ): User {
      const id = randomUUID();

      createdUserIds.push(id);

      const timestamp =
        '2026-07-31T22:00:00.000Z';

      return {
        id,
        name:
          'Membership Integration User',
        email: createUniqueEmail('member'),
        passwordHash: null,
        status: UserStatus.INVITED,
        lastLoginAt: null,
        createdAt: timestamp,
        updatedAt: timestamp,
        ...overrides,
      };
    }

    function createMembership(
      overrides: Partial<Membership> = {},
    ): Membership {
      const id = randomUUID();

      createdMembershipIds.push(id);

      const timestamp =
        '2026-07-31T22:30:00.000Z';

      return {
        id,
        userId: randomUUID(),
        organizationId,
        role:
          MembershipRole.NUTRITIONIST,
        status:
          MembershipStatus.INVITED,
        createdAt: timestamp,
        updatedAt: timestamp,
        ...overrides,
      };
    }

    function createUniqueEmail(
      prefix: string,
    ): string {
      return `${prefix}-${randomUUID()}@higeia.test`;
    }

    async function clearTestData(): Promise<void> {
      if (
        createdMembershipIds.length > 0
      ) {
        await prisma.membership.deleteMany({
          where: {
            id: {
              in: createdMembershipIds,
            },
          },
        });
      }

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

      createdMembershipIds.length = 0;
      createdUserIds.length = 0;
    }
  },
);