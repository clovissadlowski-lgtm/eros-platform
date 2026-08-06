import { ApiProperty } from '@nestjs/swagger';

import { SessionResponseDto } from './session-response.dto';
import { UserResponseDto } from './user-response.dto';

export class LoginResponseDto {
  @ApiProperty({
    description:
      'JWT usado para autenticar requisições protegidas.',
  })
  accessToken!: string;

  @ApiProperty({
    description:
      'Token usado para renovar a sessão.',
    writeOnly: true,
  })
  refreshToken!: string;

  @ApiProperty({
    example: 'Bearer',
  })
  tokenType!: string;

  @ApiProperty({
    example: 900,
    description:
      'Validade do access token em segundos.',
  })
  expiresIn!: number;

  @ApiProperty({
    type: UserResponseDto,
  })
  user!: UserResponseDto;

  @ApiProperty({
    type: SessionResponseDto,
  })
  session!: SessionResponseDto;
}
