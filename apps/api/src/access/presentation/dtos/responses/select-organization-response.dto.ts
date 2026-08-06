import { ApiProperty } from '@nestjs/swagger';

export class SelectOrganizationResponseDto {
  @ApiProperty({
    description:
      'Novo JWT contendo o contexto da organização.',
  })
  accessToken!: string;

  @ApiProperty({
    example: 'Bearer',
  })
  tokenType!: string;

  @ApiProperty({
    example: 900,
  })
  expiresIn!: number;

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
    example: 'OWNER',
  })
  role!: string;
}