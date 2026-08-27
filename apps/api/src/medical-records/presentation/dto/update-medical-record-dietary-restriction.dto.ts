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

export class UpdateMedicalRecordDietaryRestrictionDto {
  @IsOptional()
  @IsUUID()
  dietaryItemCatalogId?:
    string | null;

  @IsOptional()
  @IsString()
  @MaxLength(200)
  item?: string;

  @IsOptional()
  @IsEnum(
    DietaryRestrictionType,
  )
  type?:
    DietaryRestrictionType;

  @IsOptional()
  @IsEnum(
    DietaryRestrictionAction,
  )
  action?:
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
  reason?:
    string | null;

  @IsOptional()
  @IsDateString()
  identifiedAt?:
    string | null;

  @IsOptional()
  @IsEnum(
    DietaryRestrictionStatus,
  )
  status?:
    DietaryRestrictionStatus;

  @IsOptional()
  @IsString()
  @MaxLength(5000)
  notes?:
    string | null;
}