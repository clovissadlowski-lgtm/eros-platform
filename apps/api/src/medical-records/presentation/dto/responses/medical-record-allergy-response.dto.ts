import {
  ApiProperty,
  ApiPropertyOptional,
} from '@nestjs/swagger';

import {
  AllergySeverity,
  AllergyStatus,
  AllergyType,
} from '../../../domain/entities/medical-record-allergy.entity';

export class MedicalRecordAllergyResponseDto {
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
    example: 'Dipirona',
  })
  substance!: string;

  @ApiProperty({
    enum: AllergyType,
    example: AllergyType.MEDICATION,
  })
  type!: AllergyType;

  @ApiPropertyOptional({
    nullable: true,
    example: 'Urticária',
  })
  reaction!: string | null;

  @ApiPropertyOptional({
    enum: AllergySeverity,
    nullable: true,
    example: AllergySeverity.MODERATE,
  })
  severity!: AllergySeverity | null;

  @ApiProperty({
    enum: AllergyStatus,
    example: AllergyStatus.ACTIVE,
  })
  status!: AllergyStatus;

  @ApiPropertyOptional({
    nullable: true,
    example: '2024-05-10',
  })
  identifiedAt!: string | null;

  @ApiPropertyOptional({
    nullable: true,
    example:
      'Reação observada após uso do medicamento.',
  })
  notes!: string | null;

  @ApiProperty()
  createdAt!: string;

  @ApiProperty()
  updatedAt!: string;
}