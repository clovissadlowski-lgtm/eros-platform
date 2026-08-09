import {
  ApiProperty,
  ApiPropertyOptional,
} from '@nestjs/swagger';

import {
  AllergenCatalogType,
  AllergenTerminologySystem,
} from '../../../domain/entities/allergen-catalog.entity';

export class AllergenSynonymResponseDto {
  @ApiProperty()
  id!: string;

  @ApiProperty({
    example: 'Poeira doméstica',
  })
  term!: string;

  @ApiProperty({
    example: 'poeira domestica',
  })
  normalizedTerm!: string;
}

export class AllergenExternalCodeResponseDto {
  @ApiProperty()
  id!: string;

  @ApiProperty({
    enum:
      AllergenTerminologySystem,
  })
  system!:
    AllergenTerminologySystem;

  @ApiProperty({
    example: '123456',
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

export class AllergenCatalogResponseDto {
  @ApiProperty({
    format: 'uuid',
  })
  id!: string;

  @ApiProperty({
    example: 'Amoxicilina',
  })
  name!: string;

  @ApiProperty({
    example: 'amoxicilina',
  })
  normalizedName!: string;

  @ApiProperty({
    enum:
      AllergenCatalogType,
  })
  type!:
    AllergenCatalogType;

  @ApiPropertyOptional({
    nullable: true,
  })
  description!: string | null;

  @ApiProperty()
  isActive!: boolean;

  @ApiProperty({
    type: [
      AllergenSynonymResponseDto,
    ],
  })
  synonyms!:
    AllergenSynonymResponseDto[];

  @ApiProperty({
    type: [
      AllergenExternalCodeResponseDto,
    ],
  })
  externalCodes!:
    AllergenExternalCodeResponseDto[];
}