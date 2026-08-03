import { OrganizationStatus } from '../../domain/entities/organization.entity';
import { OrganizationNotFoundError } from '../../domain/errors/organization-not-found.error';
import { OrganizationSlugAlreadyExistsError } from '../../domain/errors/organization-slug-already-exists.error';
import { InMemoryOrganizationsRepository } from '../../infrastructure/repositories/in-memory-organizations.repository';
import { OrganizationsService } from './organizations.service';

describe('OrganizationsService', () => {
  let repository: InMemoryOrganizationsRepository;
  let service: OrganizationsService;

  beforeEach(() => {
    repository =
      new InMemoryOrganizationsRepository();

    service = new OrganizationsService(
      repository,
    );
  });

  it('creates an active organization', async () => {
    const organization =
      await service.createOrganization({
        name: 'Clínica Vida',
        slug: 'clinica-vida',
      });

    expect(organization.id).toBeDefined();
    expect(organization.name).toBe(
      'Clínica Vida',
    );
    expect(organization.slug).toBe(
      'clinica-vida',
    );
    expect(organization.status).toBe(
      OrganizationStatus.ACTIVE,
    );
    expect(organization.createdAt).toBeDefined();
    expect(organization.updatedAt).toBeDefined();
  });

  it('trims the organization name', async () => {
    const organization =
      await service.createOrganization({
        name: '  Clínica Vida  ',
        slug: 'clinica-vida',
      });

    expect(organization.name).toBe(
      'Clínica Vida',
    );
  });

  it('normalizes the organization slug', async () => {
    const organization =
      await service.createOrganization({
        name: 'Nutrição e Saúde',
        slug: '  Nutrição & Saúde  ',
      });

    expect(organization.slug).toBe(
      'nutricao-saude',
    );
  });

  it('does not allow a duplicated slug', async () => {
    await service.createOrganization({
      name: 'First Organization',
      slug: 'same-slug',
    });

    await expect(
      service.createOrganization({
        name: 'Second Organization',
        slug: 'same-slug',
      }),
    ).rejects.toBeInstanceOf(
      OrganizationSlugAlreadyExistsError,
    );
  });

  it('lists organizations', async () => {
    await service.createOrganization({
      name: 'First Organization',
      slug: 'first-organization',
    });

    await service.createOrganization({
      name: 'Second Organization',
      slug: 'second-organization',
    });

    const organizations =
      await service.listOrganizations();

    expect(organizations).toHaveLength(2);
  });

  it('gets an organization by id', async () => {
    const createdOrganization =
      await service.createOrganization({
        name: 'Test Organization',
        slug: 'test-organization',
      });

    const organization =
      await service.getOrganizationById(
        createdOrganization.id,
      );

    expect(organization).toEqual(
      createdOrganization,
    );
  });

  it('throws when an organization id does not exist', async () => {
    await expect(
      service.getOrganizationById(
        '11111111-1111-4111-8111-111111111111',
      ),
    ).rejects.toBeInstanceOf(
      OrganizationNotFoundError,
    );
  });

  it('gets an organization by normalized slug', async () => {
    const createdOrganization =
      await service.createOrganization({
        name: 'Clínica Vida',
        slug: 'clinica-vida',
      });

    const organization =
      await service.getOrganizationBySlug(
        '  CLÍNICA VIDA  ',
      );

    expect(organization).toEqual(
      createdOrganization,
    );
  });

  it('throws when a slug does not exist', async () => {
    await expect(
      service.getOrganizationBySlug(
        'not-found',
      ),
    ).rejects.toBeInstanceOf(
      OrganizationNotFoundError,
    );
  });
});