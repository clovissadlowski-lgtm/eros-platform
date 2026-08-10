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

export class UpdateLaboratoryResultDto {
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
  value?: string | null;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  textValue?: string | null;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  unit?: string | null;

  @IsOptional()
  @IsString()
  @MaxLength(200)
  referenceRange?: string | null;

  @IsOptional()
  @IsEnum(
    LaboratoryResultInterpretation,
  )
  interpretation?:
    LaboratoryResultInterpretation | null;
}