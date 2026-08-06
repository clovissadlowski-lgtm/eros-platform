import {
  ApiPropertyOptional,
} from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
  Matches,
} from 'class-validator';

export class UpdatePatientDto {
  @ApiPropertyOptional({
    description:
      'Novo nome completo do paciente.',
    example:
      'Paciente Atualizado Higeia',
    minLength: 2,
    maxLength: 120,
  })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @Length(2, 120)
  name?: string;

  @ApiPropertyOptional({
    description:
      'Novo e-mail do paciente.',
    format: 'email',
    example:
      'paciente.atualizado@higeia.test',
  })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiPropertyOptional({
    description:
      'Novo telefone com 8 a 20 dígitos. Pode iniciar com o símbolo +.',
    example:
      '+5547988888888',
    pattern:
      '^\\+?[0-9]{8,20}$',
  })
  @IsOptional()
  @IsString()
  @Matches(/^\+?[0-9]{8,20}$/, {
    message:
      'phone must contain between 8 and 20 digits',
  })
  phone?: string;

  @ApiPropertyOptional({
    description:
      'Nova data de nascimento no formato YYYY-MM-DD.',
    example:
      '1990-01-15',
    pattern:
      '^\\d{4}-\\d{2}-\\d{2}$',
  })
  @IsOptional()
  @IsString()
  @Matches(/^\d{4}-\d{2}-\d{2}$/, {
    message:
      'birthDate must use the YYYY-MM-DD format',
  })
  birthDate?: string;
}