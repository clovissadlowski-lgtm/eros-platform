import { ApiProperty } from '@nestjs/swagger';

import { OrganizationStatus } from '../../../domain/entities/organization.entity';

export class OrganizationResponseDto {
  @ApiProperty({
    description:
      'Identificador único da organização.',
    format: 'uuid',
    example:
      '7181fc2f-7a27-462e-aa75-16565a036509',
  })
  id!: string;

  @ApiProperty({
    description:
      'Nome público da organização.',
    example: 'Clínica Higeia',
  })
  name!: string;

  @ApiProperty({
    description:
      'Identificador amigável e exclusivo usado em URLs.',
    example: 'clinica-higeia',
  })
  slug!: string;

  @ApiProperty({
    description:
      'Situação atual da organização.',
    enum: OrganizationStatus,
    example: OrganizationStatus.ACTIVE,
  })
  status!: OrganizationStatus;

  @ApiProperty({
    description:
      'Data e horário de criação.',
    format: 'date-time',
    example:
      '2026-08-04T13:44:08.849Z',
  })
  createdAt!: string;

  @ApiProperty({
    description:
      'Data e horário da última atualização.',
    format: 'date-time',
    example:
      '2026-08-04T13:44:08.849Z',
  })
  updatedAt!: string;
}