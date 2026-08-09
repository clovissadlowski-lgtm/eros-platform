import {
  IsDateString,
  IsEnum,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
} from 'class-validator';

import {
  HealthConditionStatus,
} from '../../domain/entities/medical-record-health-condition.entity';

export class CreateMedicalRecordHealthConditionDto {
  @IsUUID()
  clinicalConditionId!: string;

  @IsOptional()
  @IsEnum(
    HealthConditionStatus,
  )
  status?:
    HealthConditionStatus;

  @IsOptional()
  @IsDateString()
  diagnosedAt?: string;

  @IsOptional()
  @IsDateString()
  resolvedAt?: string;

  @IsOptional()
  @IsString()
  @MaxLength(5000)
  notes?: string;
}