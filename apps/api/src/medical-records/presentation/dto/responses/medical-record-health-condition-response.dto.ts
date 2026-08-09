import {
  ApiProperty,
  ApiPropertyOptional,
} from '@nestjs/swagger';

import {
  HealthConditionStatus,
} from '../../../domain/entities/medical-record-health-condition.entity';

export class MedicalRecordHealthConditionResponseDto {
  @ApiProperty({
    format: 'uuid',
  })
  id!: string;

  @ApiProperty({
    format: 'uuid',
  })
  organizationId!: string;

  @ApiProperty({
    format: 'uuid',
  })
  medicalRecordId!: string;

  @ApiProperty({
    format: 'uuid',
  })
  patientId!: string;

  @ApiProperty({
    example: 'Hipertensão arterial',
  })
  name!: string;

  @ApiProperty({
    enum: HealthConditionStatus,
  })
  status!: HealthConditionStatus;

  @ApiPropertyOptional({
    nullable: true,
    example: '2024-05-10',
  })
  diagnosedAt!: string | null;

  @ApiPropertyOptional({
    nullable: true,
    example: null,
  })
  resolvedAt!: string | null;

  @ApiPropertyOptional({
    nullable: true,
    example: 'Controlada com acompanhamento clínico.',
  })
  notes!: string | null;

  @ApiProperty()
  createdAt!: string;

  @ApiProperty()
  updatedAt!: string;
}