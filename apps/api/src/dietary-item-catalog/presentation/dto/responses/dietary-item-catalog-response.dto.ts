import {
  ApiProperty,
  ApiPropertyOptional,
} from '@nestjs/swagger';

import {
  DietaryItemCatalogType,
} from '../../../domain/entities/dietary-item-catalog.entity';

export class DietaryItemSynonymResponseDto {
  @ApiProperty({
    format:
      'uuid',
  })
  id!: string;

  @ApiProperty({
    example:
      'Açúcar do leite',
  })
  term!: string;

  @ApiProperty({
    example:
      'acucar do leite',
  })
  normalizedTerm!: string;
}

export class DietaryItemCatalogResponseDto {
  @ApiProperty({
    format:
      'uuid',
  })
  id!: string;

  @ApiProperty({
    example:
      'Lactose',
  })
  name!: string;

  @ApiProperty({
    example:
      'lactose',
  })
  normalizedName!: string;

  @ApiProperty({
    enum:
      DietaryItemCatalogType,

    example:
      DietaryItemCatalogType.COMPONENT,
  })
  type!:
    DietaryItemCatalogType;

  @ApiPropertyOptional({
    nullable:
      true,

    example:
      'Carboidratos',
  })
  category!:
    string | null;

  @ApiPropertyOptional({
    nullable:
      true,

    example:
      'Dissacarídeo naturalmente presente no leite e derivados.',
  })
  description!:
    string | null;

  @ApiProperty()
  isActive!: boolean;

  @ApiProperty({
    type: [
      DietaryItemSynonymResponseDto,
    ],
  })
  synonyms!:
    DietaryItemSynonymResponseDto[];
}