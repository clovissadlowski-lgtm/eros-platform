import { ApiProperty } from '@nestjs/swagger';

import { SessionResponseDto } from './session-response.dto';

export class RefreshSessionResponseDto {
  @ApiProperty({
    description:
      'Novo JWT usado para autenticar requisições protegidas.',
  })
  accessToken!: string;

  @ApiProperty({
    description:
      'Novo refresh token emitido após a rotação da sessão.',
    writeOnly: true,
  })
  refreshToken!: string;

  @ApiProperty({
    example: 'Bearer',
  })
  tokenType!: 'Bearer';

  @ApiProperty({
    description:
      'Tempo de validade do novo access token em segundos.',
    example: 900,
  })
  expiresIn!: number;

  @ApiProperty({
    type: SessionResponseDto,
  })
  session!: SessionResponseDto;
}