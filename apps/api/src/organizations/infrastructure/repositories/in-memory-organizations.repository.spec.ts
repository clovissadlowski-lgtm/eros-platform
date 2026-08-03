import { randomUUID } from 'node:crypto';

import {
  Organization,
  OrganizationStatus,
} from '../../domain/entities/organization.entity';
import { InMemoryOrganizationsRepository } from './in-memory-organizations.repository';

describe(
  'InMemoryOrganizationsRepository',
  () => {
    let repository: InMemoryOrganizationsRepository;

    beforeEach(() => {
      repository =
        new InMemoryOrganizationsRepository();
    });

    it('creates an organization', async () => {
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
        await repository.findById(
          organization.id,
        );

      expect(storedOrganization).toEqual(
        organization,
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
          slug: 'clinica-vida',
        });

      await repository.create(organization);

      const foundOrganization =
        await repository.findBySlug(
          'clinica-vida',
        );

      expect(foundOrganization).toEqual(
        organization,
      );
    });

    it('returns null when the slug does not exist', async () => {
      const foundOrganization =
        await repository.findBySlug(
          'organization-does-not-exist',
        );

      expect(foundOrganization).toBeNull();
    });

    it('lists all organizations', async () => {
      const firstOrganization =
        createOrganization({
          name: 'First Organization',
          slug: 'first-organization',
        });

      const secondOrganization =
        createOrganization({
          name: 'Second Organization',
          slug: 'second-organization',
        });

      await repository.create(
        firstOrganization,
      );

      await repository.create(
        secondOrganization,
      );

      const organizations =
        await repository.list();

      expect(organizations).toEqual([
        firstOrganization,
        secondOrganization,
      ]);
    });

    function createOrganization(
      overrides: Partial<Organization> = {},
    ): Organization {
      const timestamp =
        '2026-07-26T21:00:00.000Z';

      return {
        id: randomUUID(),
        name: 'Test Organization',
        slug: 'test-organization',
        status: OrganizationStatus.ACTIVE,
        createdAt: timestamp,
        updatedAt: timestamp,
        ...overrides,
      };
    }
  },
);