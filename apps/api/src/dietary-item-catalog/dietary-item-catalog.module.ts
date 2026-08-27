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
  DietaryItemCatalogService,
} from './application/services/dietary-item-catalog.service';

import {
  DietaryItemCatalogRepository,
} from './domain/repositories/dietary-item-catalog.repository';

import {
  PrismaDietaryItemCatalogRepository,
} from './infrastructure/repositories/prisma-dietary-item-catalog.repository';

import {
  DietaryItemCatalogController,
} from './presentation/controllers/dietary-item-catalog.controller';

@Module({
  imports: [
    PrismaModule,
    AccessModule,
  ],

  controllers: [
    DietaryItemCatalogController,
  ],

  providers: [
    DietaryItemCatalogService,

    {
      provide:
        DietaryItemCatalogRepository,

      useClass:
        PrismaDietaryItemCatalogRepository,
    },
  ],

  exports: [
    DietaryItemCatalogService,
    DietaryItemCatalogRepository,
  ],
})
export class DietaryItemCatalogModule {}