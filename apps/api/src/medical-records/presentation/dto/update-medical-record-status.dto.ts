import {
  ApiProperty,
} from '@nestjs/swagger';
import {
  IsEnum,
} from 'class-validator';

import {
  MedicalRecordStatus,
} from '../../domain/entities/medical-record.entity';

export class UpdateMedicalRecordStatusDto {
  @ApiProperty({
    description:
      'Novo status do prontuário clínico.',
    enum: MedicalRecordStatus,
    example:
      MedicalRecordStatus.ARCHIVED,
  })
  @IsEnum(MedicalRecordStatus)
  status!: MedicalRecordStatus;
}