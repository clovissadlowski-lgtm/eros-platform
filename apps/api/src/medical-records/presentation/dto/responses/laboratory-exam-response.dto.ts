import {
  ApiProperty,
  ApiPropertyOptional,
} from '@nestjs/swagger';

import {
  LaboratoryResultInterpretation,
} from '../../../domain/entities/laboratory-result.entity';

export class LaboratoryResultResponseDto {
  @ApiProperty({
    format: 'uuid',
  })
  id!: string;

  @ApiProperty({
    format: 'uuid',
  })
  laboratoryExamId!: string;

  @ApiPropertyOptional({
    format: 'uuid',
    nullable: true,
  })
  biomarkerCatalogId!: string | null;

  @ApiProperty({
    example: 'Glicose',
  })
  name!: string;

  @ApiPropertyOptional({
    nullable: true,
    example: '92',
  })
  value!: string | null;

  @ApiPropertyOptional({
    nullable: true,
    example: null,
  })
  textValue!: string | null;

  @ApiPropertyOptional({
    nullable: true,
    example: 'mg/dL',
  })
  unit!: string | null;

  @ApiPropertyOptional({
    nullable: true,
    example: '70 - 99 mg/dL',
  })
  referenceRange!: string | null;

  @ApiPropertyOptional({
    enum:
      LaboratoryResultInterpretation,
    nullable: true,
    example:
      LaboratoryResultInterpretation.NORMAL,
  })
  interpretation!:
    LaboratoryResultInterpretation | null;

  @ApiProperty({
    example:
      '2026-08-09T21:00:00.000Z',
  })
  createdAt!: string;

  @ApiProperty({
    example:
      '2026-08-09T21:00:00.000Z',
  })
  updatedAt!: string;
}

export class LaboratoryExamResponseDto {
  @ApiProperty({
    format: 'uuid',
  })
  id!: string;

  @ApiProperty({
    format: 'uuid',
  })
  organizationId!: string;

  @ApiProperty({
    format: 'uuid',
  })
  medicalRecordId!: string;

  @ApiProperty({
    format: 'uuid',
  })
  patientId!: string;

  @ApiProperty({
    example:
      'Painel metabólico',
  })
  name!: string;

  @ApiPropertyOptional({
    nullable: true,
    example:
      'Laboratório Higeia',
  })
  laboratoryName!: string | null;

  @ApiPropertyOptional({
    nullable: true,
    example:
      '2026-08-09',
  })
  collectedAt!: string | null;

  @ApiPropertyOptional({
    nullable: true,
    example:
      '2026-08-10',
  })
  resultedAt!: string | null;

  @ApiPropertyOptional({
    nullable: true,
  })
  notes!: string | null;

  @ApiProperty({
    example:
      '2026-08-09T21:00:00.000Z',
  })
  createdAt!: string;

  @ApiProperty({
    example:
      '2026-08-09T21:00:00.000Z',
  })
  updatedAt!: string;
}

export class LaboratoryExamWithResultsResponseDto {
  @ApiProperty({
    type:
      LaboratoryExamResponseDto,
  })
  exam!: LaboratoryExamResponseDto;

  @ApiProperty({
    type:
      LaboratoryResultResponseDto,
    isArray: true,
  })
  results!: LaboratoryResultResponseDto[];
}