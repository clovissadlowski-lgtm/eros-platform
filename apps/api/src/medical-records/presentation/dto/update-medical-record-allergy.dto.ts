import {
  IsDateString,
  IsEnum,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

import {
  AllergySeverity,
  AllergyStatus,
  AllergyType,
} from '../../domain/entities/medical-record-allergy.entity';

export class UpdateMedicalRecordAllergyDto {
  @IsOptional()
  @IsString()
  @MinLength(2)
  @MaxLength(200)
  substance?: string;

  @IsOptional()
  @IsEnum(AllergyType)
  type?: AllergyType;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  reaction?: string | null;

  @IsOptional()
  @IsEnum(AllergySeverity)
  severity?: AllergySeverity | null;

  @IsOptional()
  @IsEnum(AllergyStatus)
  status?: AllergyStatus;

  @IsOptional()
  @IsDateString()
  identifiedAt?: string | null;

  @IsOptional()
  @IsString()
  @MaxLength(5000)
  notes?: string | null;
}