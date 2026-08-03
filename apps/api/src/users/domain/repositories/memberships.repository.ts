import { Membership } from '../entities/membership.entity';

export abstract class MembershipsRepository {
  abstract create(
    membership: Membership,
  ): Promise<Membership>;

  abstract findById(
    membershipId: string,
  ): Promise<Membership | null>;

  abstract findByUserAndOrganization(
    userId: string,
    organizationId: string,
  ): Promise<Membership | null>;

  abstract listByUser(
    userId: string,
  ): Promise<Membership[]>;

  abstract listByOrganization(
    organizationId: string,
  ): Promise<Membership[]>;

  abstract update(
    membership: Membership,
  ): Promise<Membership>;
}
