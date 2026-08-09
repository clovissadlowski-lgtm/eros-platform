import {
  ApiProperty,
  ApiPropertyOptional,
} from '@nestjs/swagger';

import {
  ClinicalConceptType,
  TerminologySystem,
} from '../../../domain/entities/clinical-condition-catalog.entity';

export class ClinicalConditionSynonymResponseDto {
  @ApiProperty()
  id!: string;

  @ApiProperty({
    example: 'HAS',
  })
  term!: string;

  @ApiProperty({
    example: 'has',
  })
  normalizedTerm!: string;
}

export class ClinicalConditionExternalCodeResponseDto {
  @ApiProperty()
  id!: string;

  @ApiProperty({
    enum:
      TerminologySystem,
  })
  system!: TerminologySystem;

  @ApiProperty({
    example: 'I10',
  })
  code!: string;

  @ApiPropertyOptional({
    nullable: true,
  })
  display!: string | null;

  @ApiPropertyOptional({
    nullable: true,
  })
  version!: string | null;

  @ApiProperty()
  isPrimary!: boolean;
}

export class ClinicalConditionCatalogResponseDto {
  @ApiProperty({
    format: 'uuid',
  })
  id!: string;

  @ApiProperty({
    example:
      'Hipertensão arterial',
  })
  name!: string;

  @ApiProperty({
    example:
      'hipertensao arterial',
  })
  normalizedName!: string;

  @ApiProperty({
    enum:
      ClinicalConceptType,
  })
  conceptType!:
    ClinicalConceptType;

  @ApiPropertyOptional({
    nullable: true,
  })
  category!: string | null;

  @ApiPropertyOptional({
    nullable: true,
  })
  description!: string | null;

  @ApiProperty()
  isActive!: boolean;

  @ApiProperty({
    type: [
      ClinicalConditionSynonymResponseDto,
    ],
  })
  synonyms!:
    ClinicalConditionSynonymResponseDto[];

  @ApiProperty({
    type: [
      ClinicalConditionExternalCodeResponseDto,
    ],
  })
  externalCodes!:
    ClinicalConditionExternalCodeResponseDto[];
}