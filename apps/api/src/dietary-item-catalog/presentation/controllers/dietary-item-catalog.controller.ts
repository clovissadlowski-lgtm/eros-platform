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
  DietaryItemCatalogService,
} from '../../application/services/dietary-item-catalog.service';

import type {
  DietaryItemCatalog,
} from '../../domain/entities/dietary-item-catalog.entity';

import {
  DietaryItemCatalogResponseDto,
} from '../dto/responses/dietary-item-catalog-response.dto';

@ApiTags(
  'Dietary Item Catalog',
)
@ApiBearerAuth(
  'access-token',
)
@Controller(
  'dietary-item-catalog',
)
@UseGuards(
  JwtAuthGuard,
)
export class DietaryItemCatalogController {
  constructor(
    private readonly service:
      DietaryItemCatalogService,
  ) {}

  @Get(
    'search',
  )
  @ApiOperation({
    summary:
      'Pesquisar alimentos, nutrientes, componentes e ingredientes no catálogo canônico',
  })
  @ApiQuery({
    name:
      'q',

    required:
      true,

    example:
      'lactose',
  })
  @ApiQuery({
    name:
      'limit',

    required:
      false,

    example:
      20,
  })
  @ApiOkResponse({
    type:
      DietaryItemCatalogResponseDto,

    isArray:
      true,
  })
  search(
    @Query(
      'q',
    )
    query: string,

    @Query(
      'limit',
    )
    limit?: string,
  ): Promise<DietaryItemCatalog[]> {
    const parsedLimit =
      limit
        ? Number(
            limit,
          )
        : 20;

    return this.service.search(
      query ??
        '',

      Number.isFinite(
        parsedLimit,
      )
        ? parsedLimit
        : 20,
    );
  }
}
