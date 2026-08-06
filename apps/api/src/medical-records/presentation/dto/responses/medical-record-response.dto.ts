import {
  ApiProperty,
} from '@nestjs/swagger';

import {
  MedicalRecordStatus,
} from '../../../domain/entities/medical-record.entity';

export class MedicalRecordResponseDto {
  @ApiProperty({
    description:
      'Identificador único do prontuário.',
    format: 'uuid',
    example:
      '3e9e1884-b00a-48a9-a5cc-fb37c29bcc27',
  })
  id!: string;

  @ApiProperty({
    description:
      'Identificador da organização proprietária do prontuário.',
    format: 'uuid',
    example:
      '7181fc2f-7a27-462e-aa75-16565a036509',
  })
  organizationId!: string;

  @ApiProperty({
    description:
      'Identificador do paciente ao qual o prontuário pertence.',
    format: 'uuid',
    example:
      '507ff5bd-f2f2-451d-9e2d-5e2d1d3303ab',
  })
  patientId!: string;

  @ApiProperty({
    nullable: true,
    example:
      'Dificuldade para perder peso.',
  })
  chiefComplaint!: string | null;

  @ApiProperty({
    nullable: true,
    example:
      'Histórico de resistência à insulina.',
  })
  clinicalHistory!: string | null;

  @ApiProperty({
    nullable: true,
    example:
      'Pais com histórico de diabetes e hipertensão.',
  })
  familyHistory!: string | null;

  @ApiProperty({
    nullable: true,
    example:
      'Alergia a amendoim.',
  })
  allergies!: string | null;

  @ApiProperty({
    nullable: true,
    example:
      'Metformina 850 mg.',
  })
  currentMedications!: string | null;

  @ApiProperty({
    nullable: true,
    example:
      'Resistência à insulina.',
  })
  healthConditions!: string | null;

  @ApiProperty({
    nullable: true,
    example:
      'Paciente motivado e aderente às orientações.',
  })
  clinicalNotes!: string | null;

  @ApiProperty({
    nullable: true,
    example:
      'Reduzir gordura corporal e melhorar controle glicêmico.',
  })
  treatmentGoals!: string | null;

  @ApiProperty({
    description:
      'Status atual do prontuário.',
    enum: MedicalRecordStatus,
    example:
      MedicalRecordStatus.ACTIVE,
  })
  status!: MedicalRecordStatus;

  @ApiProperty({
    description:
      'Data e horário de criação.',
    format: 'date-time',
    example:
      '2026-08-04T18:00:00.000Z',
  })
  createdAt!: string;

  @ApiProperty({
    description:
      'Data e horário da última atualização.',
    format: 'date-time',
    example:
      '2026-08-04T18:30:00.000Z',
  })
  updatedAt!: string;
}