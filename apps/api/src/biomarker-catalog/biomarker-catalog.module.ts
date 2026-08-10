import {
  Module,
} from '@nestjs/common';

import {
  AccessModule,
} from '../access/access.module';

import {
  PrismaModule,
} from '../common/database/prisma.module';

import {
  BiomarkerCatalogService,
} from './application/services/biomarker-catalog.service';

import {
  BiomarkerCatalogRepository,
} from './domain/repositories/biomarker-catalog.repository';

import {
  PrismaBiomarkerCatalogRepository,
} from './infrastructure/repositories/prisma-biomarker-catalog.repository';

import {
  BiomarkerCatalogController,
} from './presentation/controllers/biomarker-catalog.controller';

@Module({
  imports: [
    PrismaModule,
    AccessModule,
  ],

  controllers: [
    BiomarkerCatalogController,
  ],

  providers: [
    BiomarkerCatalogService,

    {
      provide:
        BiomarkerCatalogRepository,

      useClass:
        PrismaBiomarkerCatalogRepository,
    },
  ],

  exports: [
    BiomarkerCatalogService,
    BiomarkerCatalogRepository,
  ],
})
export class BiomarkerCatalogModule {}