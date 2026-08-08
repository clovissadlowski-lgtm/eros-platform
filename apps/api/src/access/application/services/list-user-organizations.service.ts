import {
  Injectable,
} from '@nestjs/common';

import {
  OrganizationsService,
} from '../../../organizations/application/services/organizations.service';
import {
  MembershipRole,
  MembershipStatus,
} from '../../../users/domain/entities/membership.entity';
import {
  MembershipsService,
} from '../../../users/application/services/memberships.service';

export interface UserOrganizationResult {
  organizationId: string;
  organizationName: string;
  organizationSlug: string;
  membershipId: string;
  role: MembershipRole;
  status: MembershipStatus;
}

@Injectable()
export class ListUserOrganizationsService {
  constructor(
    private readonly membershipsService:
      MembershipsService,
    private readonly organizationsService:
      OrganizationsService,
  ) {}

  async execute(
    userId: string,
  ): Promise<UserOrganizationResult[]> {
    const memberships =
      await this.membershipsService.listMembershipsByUser(
        userId,
      );

    const activeMemberships =
      memberships.filter(
        (membership) =>
          membership.status ===
          MembershipStatus.ACTIVE,
      );

    return Promise.all(
      activeMemberships.map(
        async (
          membership,
        ): Promise<UserOrganizationResult> => {
          const organization =
            await this.organizationsService.getOrganizationById(
              membership.organizationId,
            );

          return {
            organizationId:
              organization.id,
            organizationName:
              organization.name,
            organizationSlug:
              organization.slug,
            membershipId:
              membership.id,
            role:
              membership.role,
            status:
              membership.status,
          };
        },
      ),
    );
  }
}