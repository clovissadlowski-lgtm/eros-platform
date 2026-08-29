import {
  IsEnum,
  IsInt,
  IsNumber,
  IsOptional,
  Max,
  Min,
} from 'class-validator';

import {
  SkinfoldMeasurementSide,
  SkinfoldSite,
} from '../../domain/entities/anthropometric-assessment.entity';

export class AnthropometricSkinfoldMeasurementDto {
  @IsEnum(
    SkinfoldSite,
  )
  site!:
    SkinfoldSite;

  @IsOptional()
  @IsEnum(
    SkinfoldMeasurementSide,
  )
  side?:
    SkinfoldMeasurementSide;

  @IsInt()
  @Min(
    1,
  )
  @Max(
    3,
  )
  readingNumber!:
    number;

  @IsNumber()
  @Min(
    0.1,
  )
  @Max(
    100,
  )
  valueMm!:
    number;
}