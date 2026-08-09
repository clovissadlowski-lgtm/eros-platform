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

  @ApiPropertyOptional({
    format: 'uuid',
    nullable: true,
    example: null,
  })
  allergenCatalogId!: string | null;

  @ApiProperty({
    example: 'Ácaros da poeira doméstica',
  })
  substance!: string;

  @ApiProperty({
    enum: AllergyType,
    example: AllergyType.ENVIRONMENTAL,
  })
  type!: AllergyType;

  @ApiPropertyOptional({
    nullable: true,
    example: 'Espirros, coriza e irritação nasal',
  })
  reaction!: string | null;

  @ApiPropertyOptional({
    enum: AllergySeverity,
    nullable: true,
    example: AllergySeverity.MILD,
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
      'Reação observada após exposição frequente à poeira doméstica.',
  })
  notes!: string | null;

  @ApiProperty({
    example: '2026-08-09T18:00:00.000Z',
  })
  createdAt!: string;

  @ApiProperty({
    example: '2026-08-09T18:00:00.000Z',
  })
  updatedAt!: string;
}