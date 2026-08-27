import {
  IsDateString,
  IsEnum,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

import {
  BiomarkerReferenceContext,
} from '../../../biomarker-catalog/domain/entities/biomarker-reference-range.entity';

export class UpdateLaboratoryExamDto {
  @IsOptional()
  @IsString()
  @MaxLength(200)
  name?: string;

  @IsOptional()
  @IsString()
  @MaxLength(200)
  laboratoryName?: string | null;

  @IsOptional()
  @IsDateString()
  collectedAt?: string | null;

  @IsOptional()
  @IsDateString()
  resultedAt?: string | null;

  @IsOptional()
  @IsEnum(
    BiomarkerReferenceContext,
  )
  collectionContext?:
    BiomarkerReferenceContext | null;

  @IsOptional()
  @IsString()
  @MaxLength(5000)
  notes?: string | null;
}