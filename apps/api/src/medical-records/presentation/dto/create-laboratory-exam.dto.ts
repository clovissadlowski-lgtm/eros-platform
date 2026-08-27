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

export class CreateLaboratoryExamDto {
  @IsString()
  @MaxLength(200)
  name!: string;

  @IsOptional()
  @IsString()
  @MaxLength(200)
  laboratoryName?: string;

  @IsOptional()
  @IsDateString()
  collectedAt?: string;

  @IsOptional()
  @IsDateString()
  resultedAt?: string;

  @IsOptional()
  @IsEnum(
    BiomarkerReferenceContext,
  )
  collectionContext?:
    BiomarkerReferenceContext;

  @IsOptional()
  @IsString()
  @MaxLength(5000)
  notes?: string;
}