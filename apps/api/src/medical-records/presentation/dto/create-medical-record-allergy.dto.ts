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

export class CreateMedicalRecordAllergyDto {
  @IsString()
  @MinLength(2)
  @MaxLength(200)
  substance!: string;

  @IsEnum(AllergyType)
  type!: AllergyType;

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