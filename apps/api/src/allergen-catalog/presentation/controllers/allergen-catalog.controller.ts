import {
  Controller,
  Get,
  Query,
  UseGuards,
} from '@nestjs/common';

import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';

import {
  JwtAuthGuard,
} from '../../../access/presentation/guards/jwt-auth.guard';

import {
  AllergenCatalogService,
} from '../../application/services/allergen-catalog.service';

import type {
  AllergenCatalog,
} from '../../domain/entities/allergen-catalog.entity';

import {
  AllergenCatalogResponseDto,
} from '../dto/responses/allergen-catalog-response.dto';

@ApiTags(
  'Allergen Catalog',
)
@ApiBearerAuth(
  'access-token',
)
@Controller(
  'allergen-catalog',
)
@UseGuards(
  JwtAuthGuard,
)
export class AllergenCatalogController {
  constructor(
    private readonly service:
      AllergenCatalogService,
  ) {}

  @Get('search')
  @ApiOperation({
    summary:
      'Pesquisar substâncias e alérgenos no catálogo canônico',
  })
  @ApiQuery({
    name: 'q',
    required: true,
    example: 'amoxicilina',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    example: 20,
  })
  @ApiOkResponse({
    type:
      AllergenCatalogResponseDto,
    isArray: true,
  })
  search(
    @Query('q')
    query: string,
    @Query('limit')
    limit?: string,
  ): Promise<
    AllergenCatalog[]
  > {
    const parsedLimit =
      limit
        ? Number(limit)
        : 20;

    return this.service.search(
      query ?? '',
      Number.isFinite(
        parsedLimit,
      )
        ? parsedLimit
        : 20,
    );
  }
}