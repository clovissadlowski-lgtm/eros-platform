import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';

import { PatientStatus } from '../../domain/entities/patient.entity';

export class UpdatePatientStatusDto {
  @ApiProperty({
    description:
      'Novo status do paciente.',
    enum: PatientStatus,
    example:
      PatientStatus.ACTIVE,
  })
  @IsEnum(PatientStatus)
  status!: PatientStatus;
}