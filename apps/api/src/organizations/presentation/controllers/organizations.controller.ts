import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Post,
} from '@nestjs/common';
import {
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';

import { ApiErrorResponse } from '../../../common/presentation/swagger/api-error-response.decorator';
import { OrganizationsService } from '../../application/services/organizations.service';
import type { Organization } from '../../domain/entities/organization.entity';
import { CreateOrganizationDto } from '../dto/create-organization.dto';
import { OrganizationResponseDto } from '../dto/responses/organization-response.dto';

@ApiTags('Organizations')
@Controller('organizations')
export class OrganizationsController {
  constructor(
    private readonly organizationsService:
      OrganizationsService,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Criar organização',
    description:
      'Cria uma nova organização ativa. O nome é normalizado e o slug deve ser exclusivo.',
  })
  @ApiCreatedResponse({
    description:
      'Organização criada com sucesso.',
    type: OrganizationResponseDto,
  })
  @ApiErrorResponse({
    status: HttpStatus.BAD_REQUEST,
    description:
      'Nome ou slug inválidos.',
    code: 'VALIDATION_ERROR',
    message:
      'Request validation failed.',
    details: [
      'name must be longer than or equal to 2 characters',
      'slug must be longer than or equal to 2 characters',
    ],
    path:
      '/api/organizations',
  })
  @ApiErrorResponse({
    status: HttpStatus.CONFLICT,
    description:
      'Já existe uma organização com o slug informado.',
    code:
      'ORGANIZATION_SLUG_ALREADY_EXISTS',
    message:
      'An organization with this slug already exists.',
    path:
      '/api/organizations',
  })
  create(
    @Body()
    dto: CreateOrganizationDto,
  ): Promise<Organization> {
    return this.organizationsService.createOrganization(
      dto,
    );
  }

  @Get()
  @ApiOperation({
    summary: 'Listar organizações',
    description:
      'Retorna todas as organizações cadastradas.',
  })
  @ApiOkResponse({
    description:
      'Lista de organizações retornada com sucesso.',
    type: OrganizationResponseDto,
    isArray: true,
  })
  list(): Promise<Organization[]> {
    return this.organizationsService.listOrganizations();
  }

  @Get('slug/:slug')
  @ApiOperation({
    summary:
      'Consultar organização pelo slug',
    description:
      'Normaliza o slug informado e retorna a organização correspondente.',
  })
  @ApiParam({
    name: 'slug',
    description:
      'Slug público da organização.',
    example:
      'clinica-higeia-teste',
  })
  @ApiOkResponse({
    description:
      'Organização encontrada.',
    type: OrganizationResponseDto,
  })
  @ApiErrorResponse({
    status: HttpStatus.NOT_FOUND,
    description:
      'Organização não encontrada.',
    code:
      'ORGANIZATION_NOT_FOUND',
    message:
      'Organization not found.',
    path:
      '/api/organizations/slug/clinica-inexistente',
  })
  getBySlug(
    @Param('slug')
    slug: string,
  ): Promise<Organization> {
    return this.organizationsService.getOrganizationBySlug(
      slug,
    );
  }

  @Get(':organizationId')
  @ApiOperation({
    summary:
      'Consultar organização pelo ID',
    description:
      'Retorna uma organização a partir de seu identificador UUID.',
  })
  @ApiParam({
    name: 'organizationId',
    description:
      'Identificador UUID da organização.',
    format: 'uuid',
    example:
      '7181fc2f-7a27-462e-aa75-16565a036509',
  })
  @ApiOkResponse({
    description:
      'Organização encontrada.',
    type: OrganizationResponseDto,
  })
  @ApiErrorResponse({
    status: HttpStatus.BAD_REQUEST,
    description:
      'O identificador informado não é um UUID válido.',
    code:
      'VALIDATION_ERROR',
    message:
      'Validation failed (uuid is expected).',
    path:
      '/api/organizations/invalid-id',
  })
  @ApiErrorResponse({
    status: HttpStatus.NOT_FOUND,
    description:
      'Organização não encontrada.',
    code:
      'ORGANIZATION_NOT_FOUND',
    message:
      'Organization not found.',
    path:
      '/api/organizations/11111111-1111-4111-8111-111111111111',
  })
  getById(
    @Param(
      'organizationId',
      new ParseUUIDPipe(),
    )
    organizationId: string,
  ): Promise<Organization> {
    return this.organizationsService.getOrganizationById(
      organizationId,
    );
  }
}