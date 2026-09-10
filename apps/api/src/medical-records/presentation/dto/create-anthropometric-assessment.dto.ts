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
  AnthropometricCircumferenceMeasurementDto,
} from './anthropometric-circumference-measurement.dto';

import {
  AnthropometricSkinfoldMeasurementDto,
} from './anthropometric-skinfold-measurement.dto';

export class CreateAnthropometricAssessmentDto {
  @IsDateString()
  measuredAt!:
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
    number;

  @IsOptional()
  @IsNumber()
  @Min(
    20,
  )
  @Max(
    300,
  )
  heightCm?:
    number;

  @IsOptional()
  @IsNumber()
  @Min(
    0,
  )
  @Max(
    100,
  )
  bodyFatPercentage?:
    number;

  @IsOptional()
  @IsNumber()
  @Min(
    0,
  )
  @Max(
    500,
  )
  fatMassKg?:
    number;

  @IsOptional()
  @IsNumber()
  @Min(
    0,
  )
  @Max(
    500,
  )
  leanMassKg?:
    number;

  @IsOptional()
  @IsNumber()
  @Min(
    0,
  )
  @Max(
    500,
  )
  muscleMassKg?:
    number;

  @IsOptional()
  @IsNumber()
  @Min(
    1,
  )
  @Max(
    500,
  )
  waistCircumferenceCm?:
    number;

  @IsOptional()
  @IsNumber()
  @Min(
    1,
  )
  @Max(
    500,
  )
  hipCircumferenceCm?:
    number;

  @IsOptional()
  @IsNumber()
  @Min(
    1,
  )
  @Max(
    500,
  )
  abdomenCircumferenceCm?:
    number;

  @IsOptional()
  @IsNumber()
  @Min(
    1,
  )
  @Max(
    500,
  )
  chestCircumferenceCm?:
    number;

  @IsOptional()
  @IsNumber()
  @Min(
    1,
  )
  @Max(
    500,
  )
  armCircumferenceCm?:
    number;

  @IsOptional()
  @IsNumber()
  @Min(
    1,
  )
  @Max(
    500,
  )
  thighCircumferenceCm?:
    number;

  @IsOptional()
  @IsNumber()
  @Min(
    1,
  )
  @Max(
    500,
  )
  calfCircumferenceCm?:
    number;

  @IsOptional()
  @IsEnum(
    BodyCompositionMethod,
  )
  bodyCompositionMethod?:
    BodyCompositionMethod;

  @IsOptional()
  @IsEnum(
    SkinfoldProtocol,
  )
  skinfoldProtocol?:
    SkinfoldProtocol;

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
  @IsArray()
  @ValidateNested({
    each:
      true,
  })
  @Type(
    () =>
      AnthropometricCircumferenceMeasurementDto,
  )
  circumferenceMeasurements?:
    AnthropometricCircumferenceMeasurementDto[];

  @IsOptional()
  @IsString()
  @MaxLength(
    5000,
  )
  notes?:
    string;
}