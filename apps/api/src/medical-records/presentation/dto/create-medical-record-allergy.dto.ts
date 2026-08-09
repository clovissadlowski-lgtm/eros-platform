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

export class CreateMedicalRecordAllergyDto {
  @IsUUID()
  allergenCatalogId!: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  reaction?: string;

  @IsOptional()
  @IsEnum(AllergySeverity)
  severity?: AllergySeverity;

  @IsOptional()
  @IsEnum(AllergyStatus)
  status?: AllergyStatus;

  @IsOptional()
  @IsDateString()
  identifiedAt?: string;

  @IsOptional()
  @IsString()
  @MaxLength(5000)
  notes?: string;
}