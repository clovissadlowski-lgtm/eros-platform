import { ApiProperty } from '@nestjs/swagger';

import { MembershipRole } from '../../../../users/domain/entities/membership.entity';

export class OrganizationAdminCheckResponseDto {
  @ApiProperty({
    example: true,
  })
  authorized!: true;

  @ApiProperty({
    format: 'uuid',
    example:
      '7181fc2f-7a27-462e-aa75-16565a036509',
  })
  organizationId!: string;

  @ApiProperty({
    format: 'uuid',
    example:
      '7249a9fd-35b2-4cf2-8626-78deef6727a1',
  })
  membershipId!: string;

  @ApiProperty({
    enum: MembershipRole,
    example: MembershipRole.OWNER,
  })
  role!: MembershipRole;
}