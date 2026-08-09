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
  MedicationCatalogService,
} from '../../application/services/medication-catalog.service';

import type {
  MedicationCatalog,
} from '../../domain/entities/medication-catalog.entity';

import {
  MedicationCatalogResponseDto,
} from '../dto/responses/medication-catalog-response.dto';

@ApiTags(
  'Medication Catalog',
)
@ApiBearerAuth(
  'access-token',
)
@Controller(
  'medication-catalog',
)
@UseGuards(
  JwtAuthGuard,
)
export class MedicationCatalogController {
  constructor(
    private readonly service:
      MedicationCatalogService,
  ) {}

  @Get('search')
  @ApiOperation({
    summary:
      'Pesquisar medicamentos no catálogo canônico',
  })
  @ApiQuery({
    name: 'q',
    required: true,
    example: 'losartana',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    example: 20,
  })
  @ApiOkResponse({
    type:
      MedicationCatalogResponseDto,
    isArray: true,
  })
  search(
    @Query('q')
    query: string,
    @Query('limit')
    limit?: string,
  ): Promise<
    MedicationCatalog[]
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