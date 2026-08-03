import { Module } from '@nestjs/common';

import { PrismaModule } from '../common/database/prisma.module';
import { OrganizationsService } from './application/services/organizations.service';
import { OrganizationsRepository } from './domain/repositories/organizations.repository';
import { PrismaOrganizationsRepository } from './infrastructure/repositories/prisma-organizations.repository';
import { OrganizationsController } from './presentation/controllers/organizations.controller';

@Module({
  imports: [
    PrismaModule,
  ],
  controllers: [
    OrganizationsController,
  ],
  providers: [
    OrganizationsService,
    {
      provide: OrganizationsRepository,
      useClass: PrismaOrganizationsRepository,
    },
  ],
  exports: [
    OrganizationsService,
    OrganizationsRepository,
  ],
})
export class OrganizationsModule {}