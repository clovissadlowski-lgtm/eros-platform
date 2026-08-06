import {
  ApiProperty,
  ApiPropertyOptional,
} from '@nestjs/swagger';

export class ErrorResponseDto {
  @ApiProperty({
    description:
      'Código HTTP retornado pela API.',
    example: 401,
  })
  statusCode!: number;

  @ApiProperty({
    description:
      'Código interno estável que identifica o tipo do erro.',
    example:
      'INVALID_ACCESS_TOKEN',
  })
  code!: string;

  @ApiProperty({
    description:
      'Mensagem legível descrevendo o erro.',
    example:
      'Invalid or expired access token.',
  })
  message!: string;

  @ApiPropertyOptional({
    description:
      'Detalhes adicionais do erro. Em falhas de validação, pode conter uma lista de mensagens.',
    nullable: true,
    oneOf: [
      {
        type: 'array',
        items: {
          type: 'string',
        },
      },
      {
        type: 'object',
      },
      {
        type: 'null',
      },
    ],
    example: null,
  })
  details!: unknown | null;

  @ApiPropertyOptional({
    description:
      'Identificador da requisição usado para rastreamento nos logs.',
    format: 'uuid',
    nullable: true,
    example:
      'b56a021d-a8aa-4e37-8cba-cc8c9ff91d63',
  })
  requestId!: string | null;

  @ApiProperty({
    description:
      'Data e horário em que a resposta de erro foi produzida.',
    format: 'date-time',
    example:
      '2026-08-04T12:40:00.000Z',
  })
  timestamp!: string;

  @ApiProperty({
    description:
      'Caminho HTTP em que o erro ocorreu.',
    example:
      '/api/auth/me',
  })
  path!: string;
}