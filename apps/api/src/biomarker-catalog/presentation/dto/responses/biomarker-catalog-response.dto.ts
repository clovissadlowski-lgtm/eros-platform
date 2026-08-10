import {
  ApiProperty,
  ApiPropertyOptional,
} from '@nestjs/swagger';

export class BiomarkerCatalogResponseDto {
  @ApiProperty({
    format:
      'uuid',
    example:
      '3fa85f64-5717-4562-b3fc-2c963f66afa6',
  })
  id!: string;

  @ApiProperty({
    example:
      'Hemoglobina',
  })
  name!: string;

  @ApiPropertyOptional({
    nullable:
      true,
    example:
      'HB',
  })
  code!: string | null;

  @ApiPropertyOptional({
    nullable:
      true,
    example:
      'g/dL',
  })
  defaultUnit!: string | null;

  @ApiPropertyOptional({
    nullable:
      true,
    example:
      'Concentração de hemoglobina no sangue.',
  })
  description!: string | null;

  @ApiProperty({
    example:
      true,
  })
  active!: boolean;

  @ApiProperty({
    example:
      '2026-08-10T18:00:00.000Z',
  })
  createdAt!: string;

  @ApiProperty({
    example:
      '2026-08-10T18:00:00.000Z',
  })
  updatedAt!: string;
}