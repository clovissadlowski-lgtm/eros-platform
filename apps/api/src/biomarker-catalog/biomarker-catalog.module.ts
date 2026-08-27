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
  BiomarkerReferenceRangeResolverService,
} from './application/services/biomarker-reference-range-resolver.service';

import {
  BiomarkerCatalogRepository,
} from './domain/repositories/biomarker-catalog.repository';

import {
  BiomarkerReferenceRangesRepository,
} from './domain/repositories/biomarker-reference-ranges.repository';

import {
  PrismaBiomarkerCatalogRepository,
} from './infrastructure/repositories/prisma-biomarker-catalog.repository';

import {
  PrismaBiomarkerReferenceRangesRepository,
} from './infrastructure/repositories/prisma-biomarker-reference-ranges.repository';

import {
  BiomarkerCatalogController,
} from './presentation/controllers/biomarker-catalog.controller';

import {
  LaboratoryResultInterpreterService,
} from './application/services/laboratory-result-interpreter.service';

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
  BiomarkerReferenceRangeResolverService,
  LaboratoryResultInterpreterService,

  {
    provide:
      BiomarkerCatalogRepository,

    useClass:
      PrismaBiomarkerCatalogRepository,
  },

  {
    provide:
      BiomarkerReferenceRangesRepository,

    useClass:
      PrismaBiomarkerReferenceRangesRepository,
  },
],

  exports: [
   BiomarkerCatalogService,
   BiomarkerReferenceRangeResolverService,
   LaboratoryResultInterpreterService,
   BiomarkerCatalogRepository,
   BiomarkerReferenceRangesRepository,
  ],
})
export class BiomarkerCatalogModule {}