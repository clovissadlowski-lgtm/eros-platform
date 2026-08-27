import {
  ApiProperty,
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

export class CreatePatientDto {
  @ApiProperty({
    description:
      'Nome completo do paciente.',
    example:
      'Paciente Demonstração Higeia',
    minLength:
      2,
    maxLength:
      120,
  })
  @IsString()
  @IsNotEmpty()
  @Length(
    2,
    120,
  )
  name!: string;

  @ApiPropertyOptional({
    description:
      'CPF do paciente. Pode ser informado com ou sem formatação. Quando informado, deve ser válido e único dentro da organização.',
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
  cpf?: string;

  @ApiPropertyOptional({
    description:
      'E-mail do paciente. Quando informado, deve ser válido e único dentro da organização.',
    format:
      'email',
    example:
      'paciente.demo@higeia.test',
  })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiPropertyOptional({
    description:
      'Telefone com 8 a 20 dígitos. Pode iniciar com o símbolo +.',
    example:
      '+5547999999999',
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
  phone?: string;

  @ApiPropertyOptional({
    description:
      'Data de nascimento no formato YYYY-MM-DD.',
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
  birthDate?: string;

  @ApiPropertyOptional({
    description:
      'Sexo biológico do paciente para uso em parâmetros clínicos e laboratoriais.',
    enum:
      PatientBiologicalSex,
    example:
      PatientBiologicalSex.MALE,
  })
  @IsOptional()
  @IsEnum(
    PatientBiologicalSex,
  )
  biologicalSex?:
    PatientBiologicalSex;
}