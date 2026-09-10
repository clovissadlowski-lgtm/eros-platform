import {
  ApiProperty,
  ApiPropertyOptional,
} from '@nestjs/swagger';

import {
  AnthropometricCircumferenceSite,
  AnthropometricCircumferenceState,
  AnthropometricMeasurementSide,
  BodyCompositionMethod,
  SkinfoldMeasurementSide,
  SkinfoldProtocol,
  SkinfoldSite,
} from '../../../domain/entities/anthropometric-assessment.entity';

export class AnthropometricSkinfoldMeasurementResponseDto {
  @ApiProperty({
    format:
      'uuid',
  })
  id!: string;

  @ApiProperty({
    format:
      'uuid',
  })
  anthropometricAssessmentId!:
    string;

  @ApiProperty({
    enum:
      SkinfoldSite,

    example:
      SkinfoldSite.TRICEPS,
  })
  site!:
    SkinfoldSite;

  @ApiProperty({
    enum:
      SkinfoldMeasurementSide,

    example:
      SkinfoldMeasurementSide.RIGHT,
  })
  side!:
    SkinfoldMeasurementSide;

  @ApiProperty({
    example:
      1,
  })
  readingNumber!:
    number;

  @ApiProperty({
    example:
      12.4,

    description:
      'Espessura da dobra cutânea em milímetros.',
  })
  valueMm!:
    number;

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

export class AnthropometricCircumferenceMeasurementResponseDto {
  @ApiProperty({
    format:
      'uuid',
  })
  id!: string;

  @ApiProperty({
    format:
      'uuid',
  })
  anthropometricAssessmentId!:
    string;

  @ApiProperty({
    enum:
      AnthropometricCircumferenceSite,

    example:
      AnthropometricCircumferenceSite.ARM,
  })
  site!:
    AnthropometricCircumferenceSite;

  @ApiProperty({
    enum:
      AnthropometricMeasurementSide,

    example:
      AnthropometricMeasurementSide.RIGHT,
  })
  side!:
    AnthropometricMeasurementSide;

  @ApiProperty({
    enum:
      AnthropometricCircumferenceState,

    example:
      AnthropometricCircumferenceState.RELAXED,
  })
  state!:
    AnthropometricCircumferenceState;

  @ApiProperty({
    example:
      35.4,

    description:
      'Circunferência antropométrica em centímetros.',
  })
  valueCm!:
    number;

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

export class AnthropometricAssessmentResponseDto {
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

  @ApiProperty({
    format:
      'date',

    example:
      '2026-08-29',
  })
  measuredAt!: string;

  @ApiPropertyOptional({
    nullable:
      true,

    example:
      76.5,
  })
  weightKg!:
    number | null;

  @ApiPropertyOptional({
    nullable:
      true,

    example:
      170,
  })
  heightCm!:
    number | null;

  @ApiPropertyOptional({
    nullable:
      true,

    example:
      19.1,
  })
  bodyFatPercentage!:
    number | null;

  @ApiPropertyOptional({
    nullable:
      true,

    example:
      14.61,
  })
  fatMassKg!:
    number | null;

  @ApiPropertyOptional({
    nullable:
      true,

    example:
      61.89,
  })
  leanMassKg!:
    number | null;

  @ApiPropertyOptional({
    nullable:
      true,

    example:
      35.2,
  })
  muscleMassKg!:
    number | null;

  @ApiPropertyOptional({
    nullable:
      true,

    example:
      83,
  })
  waistCircumferenceCm!:
    number | null;

  @ApiPropertyOptional({
    nullable:
      true,

    example:
      88.5,
  })
  hipCircumferenceCm!:
    number | null;

  @ApiPropertyOptional({
    nullable:
      true,

    example:
      85,
  })
  abdomenCircumferenceCm!:
    number | null;

  @ApiPropertyOptional({
    nullable:
      true,

    example:
      101,
  })
  chestCircumferenceCm!:
    number | null;

  @ApiPropertyOptional({
    nullable:
      true,

    example:
      36,
  })
  armCircumferenceCm!:
    number | null;

  @ApiPropertyOptional({
    nullable:
      true,

    example:
      58,
  })
  thighCircumferenceCm!:
    number | null;

  @ApiPropertyOptional({
    nullable:
      true,

    example:
      38,
  })
  calfCircumferenceCm!:
    number | null;

  @ApiPropertyOptional({
    enum:
      BodyCompositionMethod,

    nullable:
      true,

    example:
      BodyCompositionMethod.SKINFOLD,
  })
  bodyCompositionMethod!:
    BodyCompositionMethod | null;

  @ApiPropertyOptional({
    enum:
      SkinfoldProtocol,

    nullable:
      true,

    example:
      SkinfoldProtocol.JACKSON_POLLOCK_7,
  })
  skinfoldProtocol!:
    SkinfoldProtocol | null;

  @ApiProperty({
    type:
      AnthropometricSkinfoldMeasurementResponseDto,

    isArray:
      true,
  })
  skinfoldMeasurements!:
    AnthropometricSkinfoldMeasurementResponseDto[];

  @ApiProperty({
    type:
      AnthropometricCircumferenceMeasurementResponseDto,

    isArray:
      true,
  })
  circumferenceMeasurements!:
    AnthropometricCircumferenceMeasurementResponseDto[];

  @ApiPropertyOptional({
    nullable:
      true,

    example:
      'Avaliação antropométrica de acompanhamento.',
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