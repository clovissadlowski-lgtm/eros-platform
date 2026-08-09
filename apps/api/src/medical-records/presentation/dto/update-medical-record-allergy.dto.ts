import {
  IsDateString,
  IsEnum,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
} from 'class-validator';

import {
  AllergySeverity,
  AllergyStatus,
} from '../../domain/entities/medical-record-allergy.entity';

export class UpdateMedicalRecordAllergyDto {
  @IsOptional()
  @IsUUID()
  allergenCatalogId?: string;

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