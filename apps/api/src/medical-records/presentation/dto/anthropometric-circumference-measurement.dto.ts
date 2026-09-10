import {
  IsEnum,
  IsNumber,
  IsOptional,
  Max,
  Min,
} from 'class-validator';

import {
  AnthropometricCircumferenceSite,
  AnthropometricCircumferenceState,
  AnthropometricMeasurementSide,
} from '../../domain/entities/anthropometric-assessment.entity';

export class AnthropometricCircumferenceMeasurementDto {
  @IsEnum(
    AnthropometricCircumferenceSite,
  )
  site!:
    AnthropometricCircumferenceSite;

  @IsOptional()
  @IsEnum(
    AnthropometricMeasurementSide,
  )
  side?:
    AnthropometricMeasurementSide;

  @IsOptional()
  @IsEnum(
    AnthropometricCircumferenceState,
  )
  state?:
    AnthropometricCircumferenceState;

  @IsNumber()
  @Min(
    0.1,
  )
  @Max(
    500,
  )
  valueCm!:
    number;
}