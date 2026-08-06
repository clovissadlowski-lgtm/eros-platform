import { ApiProperty } from '@nestjs/swagger';

export class SessionResponseDto {
  @ApiProperty({
    format: 'uuid',
    example:
      'c30170b5-c367-4f4d-891d-205cbfe2fc83',
  })
  id!: string;

  @ApiProperty({
    format: 'date-time',
    example:
      '2026-09-01T20:40:55.653Z',
  })
  expiresAt!: string;
}