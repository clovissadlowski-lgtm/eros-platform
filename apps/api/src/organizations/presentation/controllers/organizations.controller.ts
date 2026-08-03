import {
  Body,
  Controller,
  Get,
  Param,
  Post,
} from '@nestjs/common';

import { OrganizationsService } from '../../application/services/organizations.service';
import { CreateOrganizationDto } from '../dto/create-organization.dto';

@Controller('organizations')
export class OrganizationsController {
  constructor(
    private readonly organizationsService: OrganizationsService,
  ) {}

  @Post()
  create(
    @Body() dto: CreateOrganizationDto,
  ) {
    return this.organizationsService.createOrganization(
      dto,
    );
  }

  @Get()
  list() {
    return this.organizationsService.listOrganizations();
  }

  @Get('slug/:slug')
  getBySlug(
    @Param('slug') slug: string,
  ) {
    return this.organizationsService.getOrganizationBySlug(
      slug,
    );
  }

  @Get(':organizationId')
  getById(
    @Param('organizationId')
    organizationId: string,
  ) {
    return this.organizationsService.getOrganizationById(
      organizationId,
    );
  }
}
