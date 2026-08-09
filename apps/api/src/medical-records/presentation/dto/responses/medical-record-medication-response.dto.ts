import {
  ApiProperty,
  ApiPropertyOptional,
} from '@nestjs/swagger';

import {
  MedicationRoute,
  MedicationStatus,
} from '../../../domain/entities/medical-record-medication.entity';

export class MedicalRecordMedicationResponseDto {
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
    example: 'Losartana',
  })
  name!: string;

  @ApiPropertyOptional({
    nullable: true,
    example: '50 mg',
  })
  dosage!: string | null;

  @ApiPropertyOptional({
    nullable: true,
    example: '1x ao dia',
  })
  frequency!: string | null;

  @ApiPropertyOptional({
    enum: MedicationRoute,
    nullable: true,
    example: MedicationRoute.ORAL,
  })
  route!: MedicationRoute | null;

  @ApiPropertyOptional({
    nullable: true,
    example: 'Hipertensão arterial',
  })
  indication!: string | null;

  @ApiPropertyOptional({
    nullable: true,
    example: '2025-01-10',
  })
  startedAt!: string | null;

  @ApiPropertyOptional({
    nullable: true,
    example: null,
  })
  endedAt!: string | null;

  @ApiProperty({
    enum: MedicationStatus,
  })
  status!: MedicationStatus;

  @ApiPropertyOptional({
    nullable: true,
    example: 'Uso contínuo.',
  })
  notes!: string | null;

  @ApiProperty()
  createdAt!: string;

  @ApiProperty()
  updatedAt!: string;
}