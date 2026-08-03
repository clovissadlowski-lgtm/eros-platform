import {
  IsEmail,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({
    description:
      'Endereço de e-mail utilizado para autenticação na Higeia.',
    example: 'usuario@higeia.test',
    format: 'email',
    maxLength: 255,
  })
  @IsEmail()
  @MaxLength(255)
  email!: string;

  @ApiProperty({
    description:
      'Senha da conta do usuário.',
    example: 'StrongPassword#2026',
    minLength: 1,
    maxLength: 200,
    writeOnly: true,
  })
  @IsString()
  @MinLength(1)
  @MaxLength(200)
  password!: string;
}