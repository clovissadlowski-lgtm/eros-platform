import { IsEnum } from 'class-validator';

import { MedicalRecordStatus } from '../../domain/entities/medical-record.entity';

export class UpdateMedicalRecordStatusDto {
  @IsEnum(MedicalRecordStatus)
  status!: MedicalRecordStatus;
}