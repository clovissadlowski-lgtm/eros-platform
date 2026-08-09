import {
  ApiProperty,
  ApiPropertyOptional,
} from '@nestjs/swagger';

import {
  MedicationSynonymType,
  MedicationTerminologySystem,
} from '../../../domain/entities/medication-catalog.entity';

export class MedicationSynonymResponseDto {
  @ApiProperty()
  id!: string;

  @ApiProperty({
    example: 'Cozaar',
  })
  term!: string;

  @ApiProperty({
    example: 'cozaar',
  })
  normalizedTerm!: string;

  @ApiProperty({
    enum:
      MedicationSynonymType,
  })
  type!: MedicationSynonymType;
}

export class MedicationExternalCodeResponseDto {
  @ApiProperty()
  id!: string;

  @ApiProperty({
    enum:
      MedicationTerminologySystem,
  })
  system!:
    MedicationTerminologySystem;

  @ApiProperty({
    example: 'C09CA01',
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

export class MedicationCatalogResponseDto {
  @ApiProperty({
    format: 'uuid',
  })
  id!: string;

  @ApiProperty({
    example: 'Losartana',
  })
  name!: string;

  @ApiProperty({
    example: 'losartana',
  })
  normalizedName!: string;

  @ApiProperty({
    example:
      'Losartana potássica',
  })
  activeIngredient!: string;

  @ApiProperty({
    example:
      'losartana potassica',
  })
  normalizedActiveIngredient!: string;

  @ApiPropertyOptional({
    nullable: true,
  })
  description!: string | null;

  @ApiProperty()
  isActive!: boolean;

  @ApiProperty({
    type: [
      MedicationSynonymResponseDto,
    ],
  })
  synonyms!:
    MedicationSynonymResponseDto[];

  @ApiProperty({
    type: [
      MedicationExternalCodeResponseDto,
    ],
  })
  externalCodes!:
    MedicationExternalCodeResponseDto[];
}