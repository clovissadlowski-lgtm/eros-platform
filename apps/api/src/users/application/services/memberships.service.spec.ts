import { randomUUID } from 'node:crypto';

import {
  Organization,
  OrganizationStatus,
} from '../../../organizations/domain/entities/organization.entity';
import { OrganizationNotFoundError } from '../../../organizations/domain/errors/organization-not-found.error';
import { InMemoryOrganizationsRepository } from '../../../organizations/infrastructure/repositories/in-memory-organizations.repository';
import {
  MembershipRole,
  MembershipStatus,
} from '../../domain/entities/membership.entity';
import {
  User,
  UserStatus,
} from '../../domain/entities/user.entity';
import { MembershipAlreadyExistsError } from '../../domain/errors/membership-already-exists.error';
import { MembershipNotFoundError } from '../../domain/errors/membership-not-found.error';
import { UserNotFoundError } from '../../domain/errors/user-not-found.error';
import { InMemoryMembershipsRepository } from '../../infrastructure/repositories/in-memory-memberships.repository';
import { InMemoryUsersRepository } from '../../infrastructure/repositories/in-memory-users.repository';
import { MembershipsService } from './memberships.service';

describe('MembershipsService', () => {
  let membershipsRepository: InMemoryMembershipsRepository;
  let usersRepository: InMemoryUsersRepository;
  let organizationsRepository: InMemoryOrganizationsRepository;
  let service: MembershipsService;

  beforeEach(() => {
    membershipsRepository =
      new InMemoryMembershipsRepository();

    usersRepository =
      new InMemoryUsersRepository();

    organizationsRepository =
      new InMemoryOrganizationsRepository();

    service = new MembershipsService(
      membershipsRepository,
      usersRepository,
      organizationsRepository,
    );
  });

  it('creates an invited membership', async () => {
    const user = createUser();
    const organization =
      createOrganization();

    await usersRepository.create(user);

    await organizationsRepository.create(
      organization,
    );

    const membership =
      await service.createInvitedMembership({
        userId: user.id,
        organizationId: organization.id,
        role: MembershipRole.NUTRITIONIST,
      });

    expect(membership.id).toBeDefined();
    expect(membership.userId).toBe(
      user.id,
    );
    expect(membership.organizationId).toBe(
      organization.id,
    );
    expect(membership.role).toBe(
      MembershipRole.NUTRITIONIST,
    );
    expect(membership.status).toBe(
      MembershipStatus.INVITED,
    );
    expect(membership.createdAt).toBeDefined();
    expect(membership.updatedAt).toBeDefined();
  });

  it('does not create a membership for a missing user', async () => {
    const organization =
      createOrganization();

    await organizationsRepository.create(
      organization,
    );

    await expect(
      service.createInvitedMembership({
        userId: randomUUID(),
        organizationId: organization.id,
        role: MembershipRole.ADMIN,
      }),
    ).rejects.toBeInstanceOf(
      UserNotFoundError,
    );
  });

  it('does not create a membership for a missing organization', async () => {
    const user = createUser();

    await usersRepository.create(user);

    await expect(
      service.createInvitedMembership({
        userId: user.id,
        organizationId: randomUUID(),
        role: MembershipRole.ADMIN,
      }),
    ).rejects.toBeInstanceOf(
      OrganizationNotFoundError,
    );
  });

  it('does not allow a duplicated membership', async () => {
    const user = createUser();
    const organization =
      createOrganization();

    await usersRepository.create(user);

    await organizationsRepository.create(
      organization,
    );

    await service.createInvitedMembership({
      userId: user.id,
      organizationId: organization.id,
      role: MembershipRole.NUTRITIONIST,
    });

    await expect(
      service.createInvitedMembership({
        userId: user.id,
        organizationId: organization.id,
        role: MembershipRole.ADMIN,
      }),
    ).rejects.toBeInstanceOf(
      MembershipAlreadyExistsError,
    );
  });

  it('gets a membership by id', async () => {
    const user = createUser();
    const organization =
      createOrganization();

    await usersRepository.create(user);

    await organizationsRepository.create(
      organization,
    );

    const createdMembership =
      await service.createInvitedMembership({
        userId: user.id,
        organizationId: organization.id,
        role: MembershipRole.OWNER,
      });

    const membership =
      await service.getMembershipById(
        createdMembership.id,
      );

    expect(membership).toEqual(
      createdMembership,
    );
  });

  it('throws when a membership id does not exist', async () => {
    await expect(
      service.getMembershipById(
        randomUUID(),
      ),
    ).rejects.toBeInstanceOf(
      MembershipNotFoundError,
    );
  });

  it('lists memberships by user', async () => {
    const user = createUser();

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

    await usersRepository.create(user);

    await organizationsRepository.create(
      firstOrganization,
    );

    await organizationsRepository.create(
      secondOrganization,
    );

    await service.createInvitedMembership({
      userId: user.id,
      organizationId:
        firstOrganization.id,
      role: MembershipRole.OWNER,
    });

    await service.createInvitedMembership({
      userId: user.id,
      organizationId:
        secondOrganization.id,
      role: MembershipRole.NUTRITIONIST,
    });

    const memberships =
      await service.listMembershipsByUser(
        user.id,
      );

    expect(memberships).toHaveLength(2);
  });

  it('throws when listing memberships for a missing user', async () => {
    await expect(
      service.listMembershipsByUser(
        randomUUID(),
      ),
    ).rejects.toBeInstanceOf(
      UserNotFoundError,
    );
  });

  it('lists memberships by organization', async () => {
    const firstUser = createUser({
      name: 'First User',
      email: 'first@higeia.com',
    });

    const secondUser = createUser({
      name: 'Second User',
      email: 'second@higeia.com',
    });

    const organization =
      createOrganization();

    await usersRepository.create(firstUser);
    await usersRepository.create(secondUser);

    await organizationsRepository.create(
      organization,
    );

    await service.createInvitedMembership({
      userId: firstUser.id,
      organizationId: organization.id,
      role: MembershipRole.OWNER,
    });

    await service.createInvitedMembership({
      userId: secondUser.id,
      organizationId: organization.id,
      role: MembershipRole.ASSISTANT,
    });

    const memberships =
      await service.listMembershipsByOrganization(
        organization.id,
      );

    expect(memberships).toHaveLength(2);
  });

  it('throws when listing memberships for a missing organization', async () => {
    await expect(
      service.listMembershipsByOrganization(
        randomUUID(),
      ),
    ).rejects.toBeInstanceOf(
      OrganizationNotFoundError,
    );
  });

  function createUser(
    overrides: Partial<User> = {},
  ): User {
    const timestamp =
      '2026-07-31T22:00:00.000Z';

    return {
      id: randomUUID(),
      name: 'Membership Test User',
      email: `membership-${randomUUID()}@higeia.com`,
      passwordHash: null,
      status: UserStatus.INVITED,
      lastLoginAt: null,
      createdAt: timestamp,
      updatedAt: timestamp,
      ...overrides,
    };
  }

  function createOrganization(
    overrides: Partial<Organization> = {},
  ): Organization {
    const timestamp =
      '2026-07-31T22:00:00.000Z';

    return {
      id: randomUUID(),
      name: 'Membership Test Organization',
      slug: `membership-${randomUUID()}`,
      status: OrganizationStatus.ACTIVE,
      createdAt: timestamp,
      updatedAt: timestamp,
      ...overrides,
    };
  }
});