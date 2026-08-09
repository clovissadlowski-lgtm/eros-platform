import {
  IsDateString,
  IsEnum,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
} from 'class-validator';

import {
  MedicationRoute,
  MedicationStatus,
} from '../../domain/entities/medical-record-medication.entity';

export class CreateMedicalRecordMedicationDto {
  @IsUUID()
  medicationCatalogId!: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  dosage?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  frequency?: string;

  @IsOptional()
  @IsEnum(MedicationRoute)
  route?: MedicationRoute;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  indication?: string;

  @IsOptional()
  @IsDateString()
  startedAt?: string;

  @IsOptional()
  @IsDateString()
  endedAt?: string;

  @IsOptional()
  @IsEnum(MedicationStatus)
  status?: MedicationStatus;

  @IsOptional()
  @IsString()
  @MaxLength(5000)
  notes?: string;
}