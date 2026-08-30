import {
  ApiProperty,
  ApiPropertyOptional,
} from '@nestjs/swagger';

import {
  PatientBiologicalSex,
} from '../../../../patients/domain/entities/patient.entity';

import {
  AnthropometricAssessmentResponseDto,
} from './anthropometric-assessment-response.dto';

export class AnthropometricClinicalAgeResponseDto {
  @ApiProperty({
    example:
      36,
  })
  years!: number;

  @ApiProperty({
    example:
      4,
  })
  months!: number;

  @ApiProperty({
    example:
      436,
  })
  totalMonths!: number;
}

export class AnthropometricClinicalContextResponseDto {
  @ApiProperty({
    format:
      'date',

    example:
      '2026-08-29',
  })
  assessmentDate!: string;

  @ApiPropertyOptional({
    enum:
      PatientBiologicalSex,

    nullable:
      true,

    example:
      PatientBiologicalSex.MALE,
  })
  biologicalSex!:
    PatientBiologicalSex | null;

  @ApiPropertyOptional({
    type:
      AnthropometricClinicalAgeResponseDto,

    nullable:
      true,
  })
  age!:
    AnthropometricClinicalAgeResponseDto | null;

  @ApiProperty({
    enum: [
      'ADULT',
      'OLDER_ADULT',
      'CHILD',
      'ADOLESCENT',
      'PREGNANCY',
      'UNKNOWN',
    ],

    example:
      'ADULT',
  })
  population!:
    | 'ADULT'
    | 'OLDER_ADULT'
    | 'CHILD'
    | 'ADOLESCENT'
    | 'PREGNANCY'
    | 'UNKNOWN';

  @ApiProperty({
    example:
      true,
  })
  hasBirthDate!: boolean;

  @ApiProperty({
    example:
      true,
  })
  hasBiologicalSex!: boolean;
}

export class AnthropometricCalculationResponseDto {
  @ApiProperty({
    enum: [
      'BMI',
      'BODY_DENSITY',
      'BODY_FAT_PERCENTAGE',
      'FAT_MASS_KG',
      'LEAN_MASS_KG',
    ],

    example:
      'BMI',
  })
  code!:
    | 'BMI'
    | 'BODY_DENSITY'
    | 'BODY_FAT_PERCENTAGE'
    | 'FAT_MASS_KG'
    | 'LEAN_MASS_KG';

  @ApiProperty({
    example:
      26.64,
  })
  value!: number;

  @ApiProperty({
    enum: [
      'kg/m²',
      'g/mL',
      '%',
      'kg',
    ],

    example:
      'kg/m²',
  })
  unit!:
    | 'kg/m²'
    | 'g/mL'
    | '%'
    | 'kg';

  @ApiProperty({
    enum: [
      'HIGEIA_CALCULATION',
      'PROFESSIONAL_INPUT',
      'DEVICE',
    ],

    example:
      'HIGEIA_CALCULATION',
  })
  source!:
    | 'HIGEIA_CALCULATION'
    | 'PROFESSIONAL_INPUT'
    | 'DEVICE';

  @ApiProperty({
    example:
      'WEIGHT_HEIGHT_BMI',
  })
  method!: string;
}

export class AnthropometricAssessmentResultsResponseDto {
  @ApiProperty({
    type:
      AnthropometricAssessmentResponseDto,
  })
  assessment!:
    AnthropometricAssessmentResponseDto;

  @ApiProperty({
    type:
      AnthropometricClinicalContextResponseDto,
  })
  clinicalContext!:
    AnthropometricClinicalContextResponseDto;

  @ApiProperty({
    type:
      AnthropometricCalculationResponseDto,

    isArray:
      true,
  })
  calculations!:
    AnthropometricCalculationResponseDto[];
}