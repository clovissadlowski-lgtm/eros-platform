import { randomUUID } from 'node:crypto';

import {
  Organization,
  OrganizationStatus,
} from '../../../organizations/domain/entities/organization.entity';
import { OrganizationNotFoundError } from '../../../organizations/domain/errors/organization-not-found.error';
import { InMemoryOrganizationsRepository } from '../../../organizations/infrastructure/repositories/in-memory-organizations.repository';
import {
  Membership,
  MembershipRole,
  MembershipStatus,
} from '../../../users/domain/entities/membership.entity';
import {
  User,
  UserStatus,
} from '../../../users/domain/entities/user.entity';
import { MembershipNotFoundError } from '../../../users/domain/errors/membership-not-found.error';
import { InMemoryMembershipsRepository } from '../../../users/infrastructure/repositories/in-memory-memberships.repository';
import { InMemoryUsersRepository } from '../../../users/infrastructure/repositories/in-memory-users.repository';
import { InvitationAlreadyExistsError } from '../../domain/errors/invitation-already-exists.error';
import { InvitationCreatorNotAuthorizedError } from '../../domain/errors/invitation-creator-not-authorized.error';
import { InvitationUserConflictError } from '../../domain/errors/invitation-user-conflict.error';
import { InvitationTokenGenerator } from '../../domain/services/invitation-token-generator';
import { InvitationTokenHasher } from '../../domain/services/invitation-token-hasher';
import { InMemoryInvitationsRepository } from '../../infrastructure/repositories/in-memory-invitations.repository';
import { CreateInvitationService } from './create-invitation.service';

class FakeInvitationTokenGenerator
  implements InvitationTokenGenerator
{
  generate(): string {
    return 'plain-invitation-token';
  }
}

class FakeInvitationTokenHasher
  implements InvitationTokenHasher
{
  hash(token: string): string {
    return `hashed:${token}`;
  }

  compare(
    token: string,
    tokenHash: string,
  ): boolean {
    return tokenHash === `hashed:${token}`;
  }
}

describe('CreateInvitationService', () => {
  let invitationsRepository: InMemoryInvitationsRepository;
  let usersRepository: InMemoryUsersRepository;
  let membershipsRepository: InMemoryMembershipsRepository;
  let organizationsRepository: InMemoryOrganizationsRepository;
  let service: CreateInvitationService;

  beforeEach(() => {
    invitationsRepository =
      new InMemoryInvitationsRepository();

    usersRepository =
      new InMemoryUsersRepository();

    membershipsRepository =
      new InMemoryMembershipsRepository();

    organizationsRepository =
      new InMemoryOrganizationsRepository();

    service = new CreateInvitationService(
      invitationsRepository,
      usersRepository,
      membershipsRepository,
      organizationsRepository,
      new FakeInvitationTokenGenerator(),
      new FakeInvitationTokenHasher(),
    );
  });

  it('creates a user, membership and invitation', async () => {
    const organization =
      createOrganization();

    const creator =
      createCreatorMembership({
        organizationId: organization.id,
      });

    await organizationsRepository.create(
      organization,
    );

    await membershipsRepository.create(
      creator,
    );

    const result = await service.execute({
      organizationId: organization.id,
      email:
        '  NUTRITIONIST@HIGEIA.COM  ',
      name: '  Nutritionist User  ',
      role: MembershipRole.NUTRITIONIST,
      createdByMembershipId: creator.id,
    });

    expect(result.user.email).toBe(
      'nutritionist@higeia.com',
    );

    expect(result.user.name).toBe(
      'Nutritionist User',
    );

    expect(result.user.status).toBe(
      UserStatus.INVITED,
    );

    expect(result.membership.status).toBe(
      MembershipStatus.INVITED,
    );

    expect(
      result.invitation.tokenHash,
    ).toBe(
      'hashed:plain-invitation-token',
    );

    expect(result.invitationToken).toBe(
      'plain-invitation-token',
    );
  });

  it('reuses an existing user from another organization', async () => {
    const organization =
      createOrganization();

    const existingUser = createUser({
      email: 'existing@higeia.com',
      status: UserStatus.ACTIVE,
      passwordHash: 'existing-hash',
    });

    const creator =
      createCreatorMembership({
        organizationId: organization.id,
      });

    await organizationsRepository.create(
      organization,
    );

    await usersRepository.create(
      existingUser,
    );

    await membershipsRepository.create(
      creator,
    );

    const result = await service.execute({
      organizationId: organization.id,
      email: 'existing@higeia.com',
      name: 'Existing User',
      role: MembershipRole.ADMIN,
      createdByMembershipId: creator.id,
    });

    expect(result.user.id).toBe(
      existingUser.id,
    );

    expect(result.membership.userId).toBe(
      existingUser.id,
    );
  });

  it('rejects a missing organization', async () => {
    await expect(
      service.execute({
        organizationId: randomUUID(),
        email: 'user@higeia.com',
        name: 'User',
        role: MembershipRole.ADMIN,
        createdByMembershipId:
          randomUUID(),
      }),
    ).rejects.toBeInstanceOf(
      OrganizationNotFoundError,
    );
  });

  it('rejects a missing creator membership', async () => {
    const organization =
      createOrganization();

    await organizationsRepository.create(
      organization,
    );

    await expect(
      service.execute({
        organizationId: organization.id,
        email: 'user@higeia.com',
        name: 'User',
        role: MembershipRole.ADMIN,
        createdByMembershipId:
          randomUUID(),
      }),
    ).rejects.toBeInstanceOf(
      MembershipNotFoundError,
    );
  });

  it('rejects an unauthorized creator', async () => {
    const organization =
      createOrganization();

    const creator =
      createCreatorMembership({
        organizationId: organization.id,
        role:
          MembershipRole.NUTRITIONIST,
      });

    await organizationsRepository.create(
      organization,
    );

    await membershipsRepository.create(
      creator,
    );

    await expect(
      service.execute({
        organizationId: organization.id,
        email: 'user@higeia.com',
        name: 'User',
        role: MembershipRole.ASSISTANT,
        createdByMembershipId: creator.id,
      }),
    ).rejects.toBeInstanceOf(
      InvitationCreatorNotAuthorizedError,
    );
  });

  it('rejects a creator from another organization', async () => {
    const organization =
      createOrganization();

    const creator =
      createCreatorMembership({
        organizationId: randomUUID(),
      });

    await organizationsRepository.create(
      organization,
    );

    await membershipsRepository.create(
      creator,
    );

    await expect(
      service.execute({
        organizationId: organization.id,
        email: 'user@higeia.com',
        name: 'User',
        role: MembershipRole.ASSISTANT,
        createdByMembershipId: creator.id,
      }),
    ).rejects.toBeInstanceOf(
      InvitationCreatorNotAuthorizedError,
    );
  });

  it('rejects a duplicated pending invitation', async () => {
    const organization =
      createOrganization();

    const creator =
      createCreatorMembership({
        organizationId: organization.id,
      });

    await organizationsRepository.create(
      organization,
    );

    await membershipsRepository.create(
      creator,
    );

    const input = {
      organizationId: organization.id,
      email: 'duplicated@higeia.com',
      name: 'Duplicated User',
      role: MembershipRole.ASSISTANT,
      createdByMembershipId: creator.id,
    };

    await service.execute(input);

    await expect(
      service.execute(input),
    ).rejects.toBeInstanceOf(
      InvitationAlreadyExistsError,
    );
  });

  it('rejects a user that already belongs to the organization', async () => {
    const organization =
      createOrganization();

    const user = createUser();

    const creator =
      createCreatorMembership({
        organizationId: organization.id,
      });

    const existingMembership: Membership = {
      id: randomUUID(),
      userId: user.id,
      organizationId: organization.id,
      role: MembershipRole.NUTRITIONIST,
      status: MembershipStatus.ACTIVE,
      createdAt:
        '2026-07-31T22:00:00.000Z',
      updatedAt:
        '2026-07-31T22:00:00.000Z',
    };

    await organizationsRepository.create(
      organization,
    );

    await usersRepository.create(user);

    await membershipsRepository.create(
      creator,
    );

    await membershipsRepository.create(
      existingMembership,
    );

    await expect(
      service.execute({
        organizationId: organization.id,
        email: user.email,
        name: user.name,
        role: MembershipRole.ADMIN,
        createdByMembershipId: creator.id,
      }),
    ).rejects.toBeInstanceOf(
      InvitationUserConflictError,
    );
  });

  function createOrganization(): Organization {
    const timestamp =
      '2026-07-31T22:00:00.000Z';

    return {
      id: randomUUID(),
      name: 'Test Organization',
      slug: `test-${randomUUID()}`,
      status: OrganizationStatus.ACTIVE,
      createdAt: timestamp,
      updatedAt: timestamp,
    };
  }

  function createUser(
    overrides: Partial<User> = {},
  ): User {
    const timestamp =
      '2026-07-31T22:00:00.000Z';

    return {
      id: randomUUID(),
      name: 'Existing User',
      email: `user-${randomUUID()}@higeia.test`,
      passwordHash: null,
      status: UserStatus.INVITED,
      lastLoginAt: null,
      createdAt: timestamp,
      updatedAt: timestamp,
      ...overrides,
    };
  }

  function createCreatorMembership(
    overrides: Partial<Membership> = {},
  ): Membership {
    const timestamp =
      '2026-07-31T22:00:00.000Z';

    return {
      id: randomUUID(),
      userId: randomUUID(),
      organizationId: randomUUID(),
      role: MembershipRole.OWNER,
      status: MembershipStatus.ACTIVE,
      createdAt: timestamp,
      updatedAt: timestamp,
      ...overrides,
    };
  }
});