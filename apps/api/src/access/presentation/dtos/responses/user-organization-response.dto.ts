import { ApiProperty } from '@nestjs/swagger';

import {
  MembershipRole,
  MembershipStatus,
} from '../../../../users/domain/entities/membership.entity';

export class UserOrganizationResponseDto {
  @ApiProperty({
    example:
      '7181fc2f-7a27-462e-aa75-16565a036509',
    format: 'uuid',
  })
  organizationId!: string;

  @ApiProperty({
    example: 'Clínica Higeia',
  })
  organizationName!: string;

  @ApiProperty({
    example: 'clinica-higeia',
  })
  organizationSlug!: string;

  @ApiProperty({
    example:
      '7249a9fd-35b2-4cf2-8626-78deef6727a1',
    format: 'uuid',
  })
  membershipId!: string;

  @ApiProperty({
    enum: MembershipRole,
  })
  role!: MembershipRole;

  @ApiProperty({
    enum: MembershipStatus,
  })
  status!: MembershipStatus;
}