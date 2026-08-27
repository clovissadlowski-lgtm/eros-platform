import {
  ApiProperty,
  ApiPropertyOptional,
} from '@nestjs/swagger';

import {
  DietaryRestrictionAction,
  DietaryRestrictionRisk,
  DietaryRestrictionSource,
  DietaryRestrictionStatus,
  DietaryRestrictionType,
} from '../../../domain/entities/medical-record-dietary-restriction.entity';

export class MedicalRecordDietaryRestrictionResponseDto {
  @ApiProperty({
    format:
      'uuid',
  })
  id!: string;

  @ApiProperty({
    format:
      'uuid',
  })
  organizationId!: string;

  @ApiProperty({
    format:
      'uuid',
  })
  medicalRecordId!: string;

  @ApiProperty({
    format:
      'uuid',
  })
  patientId!: string;

  @ApiPropertyOptional({
    format:
      'uuid',

    nullable:
      true,

    description:
      'Identificador canônico do alimento, nutriente, componente ou ingrediente no catálogo alimentar.',
  })
  dietaryItemCatalogId!:
    string | null;

  @ApiProperty({
    example:
      'Lactose',

    description:
      'Snapshot do nome do alimento, nutriente, substância ou item relacionado à preferência ou restrição.',
  })
  item!: string;

  @ApiProperty({
    enum:
      DietaryRestrictionType,

    example:
      DietaryRestrictionType.INTOLERANCE,
  })
  type!:
    DietaryRestrictionType;

  @ApiProperty({
    enum:
      DietaryRestrictionAction,

    example:
      DietaryRestrictionAction.LIMIT,
  })
  action!:
    DietaryRestrictionAction;

  @ApiProperty({
    enum:
      DietaryRestrictionRisk,

    example:
      DietaryRestrictionRisk.MODERATE,
  })
  risk!:
    DietaryRestrictionRisk;

  @ApiProperty({
    enum:
      DietaryRestrictionSource,

    example:
      DietaryRestrictionSource.PATIENT_REPORTED,
  })
  source!:
    DietaryRestrictionSource;

  @ApiPropertyOptional({
    nullable:
      true,

    example:
      'Paciente relata desconforto gastrointestinal após consumo.',
  })
  reason!:
    string | null;

  @ApiPropertyOptional({
    nullable:
      true,

    format:
      'date',

    example:
      '2026-08-12',
  })
  identifiedAt!:
    string | null;

  @ApiProperty({
    enum:
      DietaryRestrictionStatus,

    example:
      DietaryRestrictionStatus.ACTIVE,
  })
  status!:
    DietaryRestrictionStatus;

  @ApiPropertyOptional({
    nullable:
      true,

    example:
      'Avaliar tolerância individual e alternativas alimentares.',
  })
  notes!:
    string | null;

  @ApiProperty({
    format:
      'date-time',
  })
  createdAt!: string;

  @ApiProperty({
    format:
      'date-time',
  })
  updatedAt!: string;
}