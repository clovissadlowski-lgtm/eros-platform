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
  AllergenCatalogService,
} from './application/services/allergen-catalog.service';

import {
  AllergenCatalogRepository,
} from './domain/repositories/allergen-catalog.repository';

import {
  PrismaAllergenCatalogRepository,
} from './infrastructure/repositories/prisma-allergen-catalog.repository';

import {
  AllergenCatalogController,
} from './presentation/controllers/allergen-catalog.controller';

@Module({
  imports: [
    PrismaModule,
    AccessModule,
  ],

  controllers: [
    AllergenCatalogController,
  ],

  providers: [
    AllergenCatalogService,

    {
      provide:
        AllergenCatalogRepository,

      useClass:
        PrismaAllergenCatalogRepository,
    },
  ],

  exports: [
    AllergenCatalogService,
    AllergenCatalogRepository,
  ],
})
export class AllergenCatalogModule {}