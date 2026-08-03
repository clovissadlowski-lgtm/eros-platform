import {
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RefreshTokenDto {
  @ApiProperty({
    description:
      'Refresh token emitido durante o login ou renovação de sessão.',
    example:
      'CtVSet2u7Qtz1W8QPhwEAshRHmNoYw-8DhPC8eTBT-3bQFsqPpGahUGn7NZAk7f1',
    minLength: 20,
    maxLength: 500,
    writeOnly: true,
  })
  @IsString()
  @MinLength(20)
  @MaxLength(500)
  refreshToken!: string;
}