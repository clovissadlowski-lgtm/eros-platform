import { randomUUID } from 'node:crypto';

import {
  Membership,
  MembershipRole,
  MembershipStatus,
} from '../../domain/entities/membership.entity';
import { InMemoryMembershipsRepository } from './in-memory-memberships.repository';

describe(
  'InMemoryMembershipsRepository',
  () => {
    let repository: InMemoryMembershipsRepository;

    beforeEach(() => {
      repository =
        new InMemoryMembershipsRepository();
    });

    it('creates a membership', async () => {
      const membership =
        createMembership();

      const createdMembership =
        await repository.create(
          membership,
        );

      expect(createdMembership).toEqual(
        membership,
      );

      const storedMembership =
        await repository.findById(
          membership.id,
        );

      expect(storedMembership).toEqual(
        membership,
      );
    });

    it('finds a membership by id', async () => {
      const membership =
        createMembership();

      await repository.create(membership);

      const foundMembership =
        await repository.findById(
          membership.id,
        );

      expect(foundMembership).toEqual(
        membership,
      );
    });

    it('returns null when the id does not exist', async () => {
      const foundMembership =
        await repository.findById(
          randomUUID(),
        );

      expect(foundMembership).toBeNull();
    });

    it('finds a membership by user and organization', async () => {
      const membership =
        createMembership();

      await repository.create(membership);

      const foundMembership =
        await repository.findByUserAndOrganization(
          membership.userId,
          membership.organizationId,
        );

      expect(foundMembership).toEqual(
        membership,
      );
    });

    it('returns null when user and organization do not match', async () => {
      const membership =
        createMembership();

      await repository.create(membership);

      const foundMembership =
        await repository.findByUserAndOrganization(
          randomUUID(),
          membership.organizationId,
        );

      expect(foundMembership).toBeNull();
    });

    it('lists memberships by user', async () => {
      const userId = randomUUID();

      const firstMembership =
        createMembership({
          userId,
          organizationId: randomUUID(),
        });

      const secondMembership =
        createMembership({
          userId,
          organizationId: randomUUID(),
        });

      const anotherMembership =
        createMembership({
          userId: randomUUID(),
          organizationId: randomUUID(),
        });

      await repository.create(
        firstMembership,
      );

      await repository.create(
        secondMembership,
      );

      await repository.create(
        anotherMembership,
      );

      const memberships =
        await repository.listByUser(
          userId,
        );

      expect(memberships).toEqual([
        firstMembership,
        secondMembership,
      ]);
    });

    it('lists memberships by organization', async () => {
      const organizationId =
        randomUUID();

      const firstMembership =
        createMembership({
          userId: randomUUID(),
          organizationId,
        });

      const secondMembership =
        createMembership({
          userId: randomUUID(),
          organizationId,
        });

      const anotherMembership =
        createMembership({
          userId: randomUUID(),
          organizationId: randomUUID(),
        });

      await repository.create(
        firstMembership,
      );

      await repository.create(
        secondMembership,
      );

      await repository.create(
        anotherMembership,
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
      const membership =
        createMembership();

      await repository.create(membership);

      const updatedMembership: Membership = {
        ...membership,
        role: MembershipRole.ADMIN,
        status:
          MembershipStatus.SUSPENDED,
        updatedAt:
          '2026-07-31T23:00:00.000Z',
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

    function createMembership(
      overrides: Partial<Membership> = {},
    ): Membership {
      const timestamp =
        '2026-07-31T22:00:00.000Z';

      return {
        id: randomUUID(),
        userId: randomUUID(),
        organizationId: randomUUID(),
        role: MembershipRole.NUTRITIONIST,
        status: MembershipStatus.INVITED,
        createdAt: timestamp,
        updatedAt: timestamp,
        ...overrides,
      };
    }
  },
);