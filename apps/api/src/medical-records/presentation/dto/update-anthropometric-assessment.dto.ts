import {
  Type,
} from 'class-transformer';

import {
  IsArray,
  IsDateString,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
  ValidateNested,
} from 'class-validator';

import {
  BodyCompositionMethod,
  SkinfoldProtocol,
} from '../../domain/entities/anthropometric-assessment.entity';

import {
  AnthropometricSkinfoldMeasurementDto,
} from './anthropometric-skinfold-measurement.dto';

export class UpdateAnthropometricAssessmentDto {
  @IsOptional()
  @IsDateString()
  measuredAt?:
    string;

  @IsOptional()
  @IsNumber()
  @Min(
    0.1,
  )
  @Max(
    500,
  )
  weightKg?:
    number | null;

  @IsOptional()
  @IsNumber()
  @Min(
    20,
  )
  @Max(
    300,
  )
  heightCm?:
    number | null;

  @IsOptional()
  @IsNumber()
  @Min(
    0,
  )
  @Max(
    100,
  )
  bodyFatPercentage?:
    number | null;

  @IsOptional()
  @IsNumber()
  @Min(
    0,
  )
  @Max(
    500,
  )
  fatMassKg?:
    number | null;

  @IsOptional()
  @IsNumber()
  @Min(
    0,
  )
  @Max(
    500,
  )
  leanMassKg?:
    number | null;

  @IsOptional()
  @IsNumber()
  @Min(
    0,
  )
  @Max(
    500,
  )
  muscleMassKg?:
    number | null;

  @IsOptional()
  @IsNumber()
  @Min(
    1,
  )
  @Max(
    500,
  )
  waistCircumferenceCm?:
    number | null;

  @IsOptional()
  @IsNumber()
  @Min(
    1,
  )
  @Max(
    500,
  )
  hipCircumferenceCm?:
    number | null;

  @IsOptional()
  @IsNumber()
  @Min(
    1,
  )
  @Max(
    500,
  )
  abdomenCircumferenceCm?:
    number | null;

  @IsOptional()
  @IsNumber()
  @Min(
    1,
  )
  @Max(
    500,
  )
  chestCircumferenceCm?:
    number | null;

  @IsOptional()
  @IsNumber()
  @Min(
    1,
  )
  @Max(
    500,
  )
  armCircumferenceCm?:
    number | null;

  @IsOptional()
  @IsNumber()
  @Min(
    1,
  )
  @Max(
    500,
  )
  thighCircumferenceCm?:
    number | null;

  @IsOptional()
  @IsNumber()
  @Min(
    1,
  )
  @Max(
    500,
  )
  calfCircumferenceCm?:
    number | null;

  @IsOptional()
  @IsEnum(
    BodyCompositionMethod,
  )
  bodyCompositionMethod?:
    BodyCompositionMethod | null;

  @IsOptional()
  @IsEnum(
    SkinfoldProtocol,
  )
  skinfoldProtocol?:
    SkinfoldProtocol | null;

  @IsOptional()
  @IsArray()
  @ValidateNested({
    each:
      true,
  })
  @Type(
    () =>
      AnthropometricSkinfoldMeasurementDto,
  )
  skinfoldMeasurements?:
    AnthropometricSkinfoldMeasurementDto[];

  @IsOptional()
  @IsString()
  @MaxLength(
    5000,
  )
  notes?:
    string | null;
}