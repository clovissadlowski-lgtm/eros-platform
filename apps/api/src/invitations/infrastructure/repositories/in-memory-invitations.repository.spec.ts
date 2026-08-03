import { randomUUID } from 'node:crypto';

import {
  Invitation,
  InvitationStatus,
} from '../../domain/entities/invitation.entity';
import { MembershipRole } from '../../../users/domain/entities/membership.entity';
import { InMemoryInvitationsRepository } from './in-memory-invitations.repository';

describe(
  'InMemoryInvitationsRepository',
  () => {
    let repository: InMemoryInvitationsRepository;

    beforeEach(() => {
      repository =
        new InMemoryInvitationsRepository();
    });

    it('creates an invitation', async () => {
      const invitation =
        createInvitation();

      const createdInvitation =
        await repository.create(
          invitation,
        );

      expect(createdInvitation).toEqual(
        invitation,
      );

      const storedInvitation =
        await repository.findById(
          invitation.id,
        );

      expect(storedInvitation).toEqual(
        invitation,
      );
    });

    it('finds an invitation by id', async () => {
      const invitation =
        createInvitation();

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
      const invitation =
        createInvitation({
          tokenHash:
            'hashed-invitation-token',
        });

      await repository.create(invitation);

      const foundInvitation =
        await repository.findByTokenHash(
          'hashed-invitation-token',
        );

      expect(foundInvitation).toEqual(
        invitation,
      );
    });

    it('returns null when the token hash does not exist', async () => {
      const foundInvitation =
        await repository.findByTokenHash(
          'not-found-token-hash',
        );

      expect(foundInvitation).toBeNull();
    });

    it('finds a pending invitation by normalized email and organization', async () => {
      const invitation =
        createInvitation({
          email: 'nutritionist@higeia.com',
        });

      await repository.create(invitation);

      const foundInvitation =
        await repository.findPendingByEmailAndOrganization(
          '  NUTRITIONIST@HIGEIA.COM  ',
          invitation.organizationId,
        );

      expect(foundInvitation).toEqual(
        invitation,
      );
    });

    it('does not return an accepted invitation as pending', async () => {
      const invitation =
        createInvitation({
          status:
            InvitationStatus.ACCEPTED,
          acceptedAt:
            '2026-07-31T23:30:00.000Z',
        });

      await repository.create(invitation);

      const foundInvitation =
        await repository.findPendingByEmailAndOrganization(
          invitation.email,
          invitation.organizationId,
        );

      expect(foundInvitation).toBeNull();
    });

    it('does not return an invitation from another organization', async () => {
      const invitation =
        createInvitation();

      await repository.create(invitation);

      const foundInvitation =
        await repository.findPendingByEmailAndOrganization(
          invitation.email,
          randomUUID(),
        );

      expect(foundInvitation).toBeNull();
    });

    it('lists invitations by organization', async () => {
      const organizationId =
        randomUUID();

      const firstInvitation =
        createInvitation({
          organizationId,
          email: 'first@higeia.com',
        });

      const secondInvitation =
        createInvitation({
          organizationId,
          email: 'second@higeia.com',
        });

      const anotherInvitation =
        createInvitation({
          organizationId: randomUUID(),
          email: 'another@higeia.com',
        });

      await repository.create(
        firstInvitation,
      );

      await repository.create(
        secondInvitation,
      );

      await repository.create(
        anotherInvitation,
      );

      const invitations =
        await repository.listByOrganization(
          organizationId,
        );

      expect(invitations).toEqual([
        firstInvitation,
        secondInvitation,
      ]);
    });

    it('updates an invitation', async () => {
      const invitation =
        createInvitation();

      await repository.create(invitation);

      const updatedInvitation: Invitation = {
        ...invitation,
        status:
          InvitationStatus.REVOKED,
        revokedAt:
          '2026-07-31T23:45:00.000Z',
        updatedAt:
          '2026-07-31T23:45:00.000Z',
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

    function createInvitation(
      overrides: Partial<Invitation> = {},
    ): Invitation {
      const timestamp =
        '2026-07-31T22:00:00.000Z';

      return {
        id: randomUUID(),
        organizationId: randomUUID(),
        userId: randomUUID(),
        membershipId: randomUUID(),
        email: `invitation-${randomUUID()}@higeia.test`,
        role:
          MembershipRole.NUTRITIONIST,
        tokenHash:
          `token-hash-${randomUUID()}`,
        status:
          InvitationStatus.PENDING,
        expiresAt:
          '2026-08-03T22:00:00.000Z',
        acceptedAt: null,
        revokedAt: null,
        createdByMembershipId:
          randomUUID(),
        createdAt: timestamp,
        updatedAt: timestamp,
        ...overrides,
      };
    }
  },
);