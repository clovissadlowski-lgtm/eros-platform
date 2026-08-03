import { Injectable } from '@nestjs/common';

import { Organization } from '../../domain/entities/organization.entity';
import { OrganizationsRepository } from '../../domain/repositories/organizations.repository';

@Injectable()
export class InMemoryOrganizationsRepository
  implements OrganizationsRepository
{
  private readonly organizations: Organization[] =
    [];

  async create(
    organization: Organization,
  ): Promise<Organization> {
    this.organizations.push(organization);

    return organization;
  }

  async findById(
    id: string,
  ): Promise<Organization | null> {
    return (
      this.organizations.find(
        (organization) =>
          organization.id === id,
      ) ?? null
    );
  }

  async findBySlug(
    slug: string,
  ): Promise<Organization | null> {
    return (
      this.organizations.find(
        (organization) =>
          organization.slug === slug,
      ) ?? null
    );
  }

  async list(): Promise<Organization[]> {
    return [...this.organizations];
  }
}