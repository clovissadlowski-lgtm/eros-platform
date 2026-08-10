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
  BiomarkerCatalogService,
} from '../../application/services/biomarker-catalog.service';

import type {
  BiomarkerCatalog,
} from '../../domain/entities/biomarker-catalog.entity';

import {
  BiomarkerCatalogResponseDto,
} from '../dto/responses/biomarker-catalog-response.dto';

@ApiTags(
  'Biomarker Catalog',
)
@ApiBearerAuth(
  'access-token',
)
@Controller(
  'biomarker-catalog',
)
@UseGuards(
  JwtAuthGuard,
)
export class BiomarkerCatalogController {
  constructor(
    private readonly service:
      BiomarkerCatalogService,
  ) {}

  @Get('search')
  @ApiOperation({
    summary:
      'Pesquisar biomarcadores no catálogo canônico',
  })
  @ApiQuery({
    name:
      'q',

    required:
      true,

    example:
      'hemoglobina',
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
      BiomarkerCatalogResponseDto,

    isArray:
      true,
  })
  search(
    @Query('q')
    query: string,

    @Query('limit')
    limit?: string,
  ): Promise<BiomarkerCatalog[]> {
    const parsedLimit =
      limit
        ? Number(
            limit,
          )
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