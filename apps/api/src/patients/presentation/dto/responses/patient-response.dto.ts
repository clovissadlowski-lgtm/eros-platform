import {
  ApiProperty,
} from '@nestjs/swagger';

import {
  PatientBiologicalSex,
  PatientStatus,
} from '../../../domain/entities/patient.entity';

export class PatientResponseDto {
  @ApiProperty({
    description:
      'Identificador único do paciente.',
    format:
      'uuid',
    example:
      '507ff5bd-f2f2-451d-9e2d-5e2d1d3303ab',
  })
  id!: string;

  @ApiProperty({
    description:
      'Organização à qual o paciente pertence.',
    format:
      'uuid',
    example:
      '7181fc2f-7a27-462e-aa75-16565a036509',
  })
  organizationId!: string;

  @ApiProperty({
    description:
      'Nome completo do paciente.',
    example:
      'Paciente Demonstração Higeia',
  })
  name!: string;

  @ApiProperty({
    description:
      'E-mail do paciente, quando informado.',
    format:
      'email',
    nullable:
      true,
    example:
      'paciente.demo@higeia.test',
  })
  email!: string | null;

  @ApiProperty({
    description:
      'Telefone do paciente, quando informado.',
    nullable:
      true,
    example:
      '+5547999999999',
  })
  phone!: string | null;

  @ApiProperty({
    description:
      'Data de nascimento no formato YYYY-MM-DD, quando informada.',
    nullable:
      true,
    example:
      '1990-01-15',
  })
  birthDate!: string | null;

  @ApiProperty({
    description:
      'Sexo biológico do paciente para uso em parâmetros clínicos e laboratoriais.',
    enum:
      PatientBiologicalSex,
    nullable:
      true,
    example:
      PatientBiologicalSex.MALE,
  })
  biologicalSex!:
    PatientBiologicalSex | null;

  @ApiProperty({
    description:
      'Situação atual do paciente.',
    enum:
      PatientStatus,
    example:
      PatientStatus.ACTIVE,
  })
  status!: PatientStatus;

  @ApiProperty({
    description:
      'Data e horário de criação do registro.',
    format:
      'date-time',
    example:
      '2026-08-04T13:44:08.849Z',
  })
  createdAt!: string;

  @ApiProperty({
    description:
      'Data e horário da última atualização.',
    format:
      'date-time',
    example:
      '2026-08-04T13:44:08.849Z',
  })
  updatedAt!: string;
}