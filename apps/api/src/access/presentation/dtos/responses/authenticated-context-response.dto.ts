import {
  ApiProperty,
  ApiPropertyOptional,
} from '@nestjs/swagger';

export class AuthenticatedContextResponseDto {
  @ApiProperty({
    format: 'uuid',
  })
  userId!: string;

  @ApiProperty({
    format: 'uuid',
  })
  sessionId!: string;

  @ApiProperty({
    format: 'email',
    example:
      'usuario@higeia.test',
  })
  email!: string;

  @ApiPropertyOptional({
    format: 'uuid',
  })
  organizationId?: string;

  @ApiPropertyOptional({
    format: 'uuid',
  })
  membershipId?: string;

  @ApiPropertyOptional({
    example: 'OWNER',
  })
  role?: string;
}