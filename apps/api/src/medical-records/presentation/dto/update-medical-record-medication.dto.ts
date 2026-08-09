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

export class UpdateMedicalRecordMedicationDto {
  @IsOptional()
  @IsUUID()
  medicationCatalogId?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  dosage?: string | null;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  frequency?: string | null;

  @IsOptional()
  @IsEnum(MedicationRoute)
  route?: MedicationRoute | null;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  indication?: string | null;

  @IsOptional()
  @IsDateString()
  startedAt?: string | null;

  @IsOptional()
  @IsDateString()
  endedAt?: string | null;

  @IsOptional()
  @IsEnum(MedicationStatus)
  status?: MedicationStatus;

  @IsOptional()
  @IsString()
  @MaxLength(5000)
  notes?: string | null;
}