import {
  ApiProperty,
  ApiPropertyOptional,
} from '@nestjs/swagger';

export class UserResponseDto {
  @ApiProperty({
    format: 'uuid',
    example:
      '79676415-8049-4a54-bf6c-7652c4d7d7b2',
  })
  id!: string;

  @ApiProperty({
    example:
      'Usuário de Teste Higeia',
  })
  name!: string;

  @ApiProperty({
    format: 'email',
    example:
      'usuario@higeia.test',
  })
  email!: string;

  @ApiProperty({
    example: 'ACTIVE',
  })
  status!: string;

  @ApiPropertyOptional({
    format: 'date-time',
    nullable: true,
    example:
      '2026-08-02T20:40:55.653Z',
  })
  lastLoginAt!: string | null;

  @ApiProperty({
    format: 'date-time',
  })
  createdAt!: string;

  @ApiProperty({
    format: 'date-time',
  })
  updatedAt!: string;
}