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
  MedicationCatalogService,
} from './application/services/medication-catalog.service';

import {
  MedicationCatalogRepository,
} from './domain/repositories/medication-catalog.repository';

import {
  PrismaMedicationCatalogRepository,
} from './infrastructure/repositories/prisma-medication-catalog.repository';

import {
  MedicationCatalogController,
} from './presentation/controllers/medication-catalog.controller';

@Module({
  imports: [
    PrismaModule,
    AccessModule,
  ],

  controllers: [
    MedicationCatalogController,
  ],

  providers: [
    MedicationCatalogService,

    {
      provide:
        MedicationCatalogRepository,

      useClass:
        PrismaMedicationCatalogRepository,
    },
  ],

  exports: [
    MedicationCatalogService,
    MedicationCatalogRepository,
  ],
})
export class MedicationCatalogModule {}