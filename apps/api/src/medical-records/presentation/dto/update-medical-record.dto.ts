import {
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

export class UpdateMedicalRecordDto {
  @IsOptional()
  @IsString()
  @MaxLength(5000)
  chiefComplaint?: string;

  @IsOptional()
  @IsString()
  @MaxLength(10000)
  clinicalHistory?: string;

  @IsOptional()
  @IsString()
  @MaxLength(10000)
  familyHistory?: string;

  @IsOptional()
  @IsString()
  @MaxLength(5000)
  allergies?: string;

  @IsOptional()
  @IsString()
  @MaxLength(5000)
  currentMedications?: string;

  @IsOptional()
  @IsString()
  @MaxLength(5000)
  healthConditions?: string;

  @IsOptional()
  @IsString()
  @MaxLength(10000)
  clinicalNotes?: string;

  @IsOptional()
  @IsString()
  @MaxLength(5000)
  treatmentGoals?: string;
}
