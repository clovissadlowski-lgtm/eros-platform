import {
  ApiPropertyOptional,
} from '@nestjs/swagger';

import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
  Matches,
} from 'class-validator';

import {
  PatientBiologicalSex,
} from '../../domain/entities/patient.entity';

export class UpdatePatientDto {
  @ApiPropertyOptional({
    description:
      'Novo nome completo do paciente.',
    example:
      'Paciente Atualizado Higeia',
    minLength:
      2,
    maxLength:
      120,
  })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @Length(
    2,
    120,
  )
  name?: string;

  @ApiPropertyOptional({
    description:
      'Novo CPF do paciente. Pode ser informado com ou sem formatação. Informe null para remover.',
    nullable:
      true,
    example:
      '123.456.789-09',
  })
  @IsOptional()
  @IsString()
  @Matches(
    /^(?:\d{11}|\d{3}\.\d{3}\.\d{3}-\d{2})$/,
    {
      message:
        'cpf must contain 11 digits and may use the XXX.XXX.XXX-XX format',
    },
  )
  cpf?:
    string | null;

  @ApiPropertyOptional({
    description:
      'Novo e-mail do paciente. Informe null para remover.',
    format:
      'email',
    nullable:
      true,
    example:
      'paciente.atualizado@higeia.test',
  })
  @IsOptional()
  @IsEmail()
  email?:
    string | null;

  @ApiPropertyOptional({
    description:
      'Novo telefone com 8 a 20 dígitos. Pode iniciar com +. Informe null para remover.',
    nullable:
      true,
    example:
      '+5547988888888',
    pattern:
      '^\\+?[0-9]{8,20}$',
  })
  @IsOptional()
  @IsString()
  @Matches(
    /^\+?[0-9]{8,20}$/,
    {
      message:
        'phone must contain between 8 and 20 digits',
    },
  )
  phone?:
    string | null;

  @ApiPropertyOptional({
    description:
      'Nova data de nascimento no formato YYYY-MM-DD. Informe null para remover.',
    nullable:
      true,
    example:
      '1990-01-15',
    pattern:
      '^\\d{4}-\\d{2}-\\d{2}$',
  })
  @IsOptional()
  @IsString()
  @Matches(
    /^\d{4}-\d{2}-\d{2}$/,
    {
      message:
        'birthDate must use the YYYY-MM-DD format',
    },
  )
  birthDate?:
    string | null;

  @ApiPropertyOptional({
    description:
      'Sexo biológico do paciente. Informe null para remover.',
    enum:
      PatientBiologicalSex,
    nullable:
      true,
    example:
      PatientBiologicalSex.MALE,
  })
  @IsOptional()
  @IsEnum(
    PatientBiologicalSex,
  )
  biologicalSex?:
    PatientBiologicalSex | null;
}