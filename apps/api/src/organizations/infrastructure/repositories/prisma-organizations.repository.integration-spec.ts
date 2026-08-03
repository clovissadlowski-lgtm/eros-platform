import { randomUUID } from 'node:crypto';

import { PrismaService } from '../../../common/database/prisma.service';
import {
  Organization,
  OrganizationStatus,
} from '../../domain/entities/organization.entity';
import { PrismaOrganizationsRepository } from './prisma-organizations.repository';

describe(
  'PrismaOrganizationsRepository integration',
  () => {
    let prisma: PrismaService;
    let repository: PrismaOrganizationsRepository;

    const organizationIds: string[] = [];

    beforeAll(async () => {
      prisma = new PrismaService();

      repository =
        new PrismaOrganizationsRepository(
          prisma,
        );

      await prisma.$connect();
    });

    beforeEach(async () => {
      await clearOrganizations();
    });

    afterAll(async () => {
      await clearOrganizations();
      await prisma.$disconnect();
    });

    it('creates and returns an organization', async () => {
      const organization =
        createOrganization();

      const createdOrganization =
        await repository.create(
          organization,
        );

      expect(createdOrganization).toEqual(
        organization,
      );

      const storedOrganization =
        await prisma.organization.findUnique({
          where: {
            id: organization.id,
          },
        });

      expect(storedOrganization).not.toBeNull();
      expect(storedOrganization?.name).toBe(
        organization.name,
      );
      expect(storedOrganization?.slug).toBe(
        organization.slug,
      );
      expect(storedOrganization?.status).toBe(
        'ACTIVE',
      );
    });

    it('finds an organization by id', async () => {
      const organization =
        createOrganization();

      await repository.create(organization);

      const foundOrganization =
        await repository.findById(
          organization.id,
        );

      expect(foundOrganization).toEqual(
        organization,
      );
    });

    it('returns null when the id does not exist', async () => {
      const foundOrganization =
        await repository.findById(
          randomUUID(),
        );

      expect(foundOrganization).toBeNull();
    });

    it('finds an organization by slug', async () => {
      const organization =
        createOrganization({
          slug: createUniqueSlug(
            'find-by-slug',
          ),
        });

      await repository.create(organization);

      const foundOrganization =
        await repository.findBySlug(
          organization.slug,
        );

      expect(foundOrganization).toEqual(
        organization,
      );
    });

    it('returns null when the slug does not exist', async () => {
      const foundOrganization =
        await repository.findBySlug(
          createUniqueSlug(
            'slug-does-not-exist',
          ),
        );

      expect(foundOrganization).toBeNull();
    });

    it('lists stored organizations', async () => {
      const firstOrganization =
        createOrganization({
          name: 'First Integration Organization',
          slug: createUniqueSlug(
            'first-integration-organization',
          ),
        });

      const secondOrganization =
        createOrganization({
          name: 'Second Integration Organization',
          slug: createUniqueSlug(
            'second-integration-organization',
          ),
        });

      await repository.create(
        firstOrganization,
      );

      await repository.create(
        secondOrganization,
      );

      const organizations =
        await repository.list();

      expect(
        organizations.some(
          (organization) =>
            organization.id ===
            firstOrganization.id,
        ),
      ).toBe(true);

      expect(
        organizations.some(
          (organization) =>
            organization.id ===
            secondOrganization.id,
        ),
      ).toBe(true);
    });

    function createOrganization(
      overrides: Partial<Organization> = {},
    ): Organization {
      const id = randomUUID();

      organizationIds.push(id);

      const timestamp =
        '2026-07-31T22:30:00.000Z';

      return {
        id,
        name: 'Integration Organization',
        slug: createUniqueSlug(
          'integration-organization',
        ),
        status: OrganizationStatus.ACTIVE,
        createdAt: timestamp,
        updatedAt: timestamp,
        ...overrides,
      };
    }

    function createUniqueSlug(
      prefix: string,
    ): string {
      return `${prefix}-${randomUUID()}`;
    }

    async function clearOrganizations(): Promise<void> {
      if (organizationIds.length === 0) {
        return;
      }

      await prisma.organization.deleteMany({
        where: {
          id: {
            in: organizationIds,
          },
        },
      });

      organizationIds.length = 0;
    }
  },
);