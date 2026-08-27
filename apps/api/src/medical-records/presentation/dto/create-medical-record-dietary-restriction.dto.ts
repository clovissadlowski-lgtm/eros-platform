import {
  IsDateString,
  IsEnum,
  IsNotIn,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
} from 'class-validator';

import {
  DietaryRestrictionAction,
  DietaryRestrictionRisk,
  DietaryRestrictionSource,
  DietaryRestrictionStatus,
  DietaryRestrictionType,
} from '../../domain/entities/medical-record-dietary-restriction.entity';

export class CreateMedicalRecordDietaryRestrictionDto {
  @IsOptional()
  @IsUUID()
  dietaryItemCatalogId?: string;

  @IsString()
  @MaxLength(200)
  item!: string;

  @IsEnum(
    DietaryRestrictionType,
  )
  type!:
    DietaryRestrictionType;

  @IsEnum(
    DietaryRestrictionAction,
  )
  action!:
    DietaryRestrictionAction;

  @IsOptional()
  @IsEnum(
    DietaryRestrictionRisk,
  )
  risk?:
    DietaryRestrictionRisk;

  @IsOptional()
  @IsEnum(
    DietaryRestrictionSource,
  )
  @IsNotIn(
    [
      DietaryRestrictionSource.SYSTEM_DERIVED,
    ],
  )
  source?:
    DietaryRestrictionSource;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  reason?: string;

  @IsOptional()
  @IsDateString()
  identifiedAt?: string;

  @IsOptional()
  @IsEnum(
    DietaryRestrictionStatus,
  )
  status?:
    DietaryRestrictionStatus;

  @IsOptional()
  @IsString()
  @MaxLength(5000)
  notes?: string;
}