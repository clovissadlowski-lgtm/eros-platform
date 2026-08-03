import { IsEnum } from 'class-validator';

import { PatientStatus } from '../../domain/entities/patient.entity';

export class UpdatePatientStatusDto {
  @IsEnum(PatientStatus)
  status!: PatientStatus;
}