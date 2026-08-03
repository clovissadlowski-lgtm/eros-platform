import { Organization } from '../entities/organization.entity';

export abstract class OrganizationsRepository {
  abstract create(
    organization: Organization,
  ): Promise<Organization>;

  abstract findById(
    id: string,
  ): Promise<Organization | null>;

  abstract findBySlug(
    slug: string,
  ): Promise<Organization | null>;

  abstract list(): Promise<Organization[]>;
}