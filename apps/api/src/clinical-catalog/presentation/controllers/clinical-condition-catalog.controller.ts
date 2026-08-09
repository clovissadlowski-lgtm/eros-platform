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
  ClinicalConditionCatalogService,
} from '../../application/services/clinical-condition-catalog.service';
import type {
  ClinicalConditionCatalog,
} from '../../domain/entities/clinical-condition-catalog.entity';
import {
  ClinicalConditionCatalogResponseDto,
} from '../dto/responses/clinical-condition-catalog-response.dto';

@ApiTags(
  'Clinical Catalog',
)
@ApiBearerAuth(
  'access-token',
)
@Controller(
  'clinical-condition-catalog',
)
@UseGuards(
  JwtAuthGuard,
)
export class ClinicalConditionCatalogController {
  constructor(
    private readonly service:
      ClinicalConditionCatalogService,
  ) {}

  @Get('search')
  @ApiOperation({
    summary:
      'Pesquisar condições no catálogo clínico canônico',
  })
  @ApiQuery({
    name: 'q',
    required: true,
    example: 'hipertensao',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    example: 20,
  })
  @ApiOkResponse({
    type:
      ClinicalConditionCatalogResponseDto,
    isArray: true,
  })
  search(
    @Query('q')
    query: string,
    @Query('limit')
    limit?: string,
  ): Promise<
    ClinicalConditionCatalog[]
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