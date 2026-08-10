import {
  IsEnum,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
} from 'class-validator';

import {
  LaboratoryResultInterpretation,
} from '../../domain/entities/laboratory-result.entity';

export class CreateLaboratoryResultDto {
  @IsOptional()
  @IsUUID()
  biomarkerCatalogId?: string;

  @IsOptional()
  @IsString()
  @MaxLength(200)
  name?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  value?: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  textValue?: string;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  unit?: string;

  @IsOptional()
  @IsString()
  @MaxLength(200)
  referenceRange?: string;

  @IsOptional()
  @IsEnum(
    LaboratoryResultInterpretation,
  )
  interpretation?:
    LaboratoryResultInterpretation;
}