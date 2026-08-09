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
  ClinicalConditionCatalogService,
} from './application/services/clinical-condition-catalog.service';
import {
  ClinicalConditionCatalogRepository,
} from './domain/repositories/clinical-condition-catalog.repository';
import {
  PrismaClinicalConditionCatalogRepository,
} from './infrastructure/repositories/prisma-clinical-condition-catalog.repository';
import {
  ClinicalConditionCatalogController,
} from './presentation/controllers/clinical-condition-catalog.controller';

@Module({
  imports: [
    PrismaModule,
    AccessModule,
  ],

  controllers: [
    ClinicalConditionCatalogController,
  ],

  providers: [
    ClinicalConditionCatalogService,
    {
      provide:
        ClinicalConditionCatalogRepository,
      useClass:
        PrismaClinicalConditionCatalogRepository,
    },
  ],

  exports: [
    ClinicalConditionCatalogService,
    ClinicalConditionCatalogRepository,
  ],
})
export class ClinicalCatalogModule {}