import {
  Injectable,
} from '@nestjs/common';

import {
  PrismaService,
} from '../../../common/database/prisma.service';

import type {
  ClinicalConditionCatalog,
} from '../../domain/entities/clinical-condition-catalog.entity';

import {
  ClinicalConditionCatalogRepository,
} from '../../domain/repositories/clinical-condition-catalog.repository';

import type {
  SearchClinicalConditionCatalogInput,
} from '../../domain/repositories/clinical-condition-catalog.repository';

@Injectable()
export class PrismaClinicalConditionCatalogRepository
  implements ClinicalConditionCatalogRepository
{
  constructor(
    private readonly prisma:
      PrismaService,
  ) {}

  async search(
    input:
      SearchClinicalConditionCatalogInput,
  ): Promise<ClinicalConditionCatalog[]> {
    const records =
      await this.prisma
        .clinicalConditionCatalog
        .findMany({
          where: {
            isActive: true,

            OR: [
              {
                normalizedName: {
                  contains:
                    input.query,
                  mode:
                    'insensitive',
                },
              },

              {
                synonyms: {
                  some: {
                    normalizedTerm: {
                      contains:
                        input.query,
                      mode:
                        'insensitive',
                    },
                  },
                },
              },

              {
                externalCodes: {
                  some: {
                    code: {
                      contains:
                        input.query,
                      mode:
                        'insensitive',
                    },
                  },
                },
              },
            ],
          },

          include: {
            synonyms: true,
            externalCodes: true,
          },

          orderBy: {
            name: 'asc',
          },

          take:
            input.limit,
        });

    return records as ClinicalConditionCatalog[];
  }

  async findActiveById(
    id: string,
  ): Promise<ClinicalConditionCatalog | null> {
    const record =
      await this.prisma
        .clinicalConditionCatalog
        .findFirst({
          where: {
            id,
            isActive: true,
          },

          include: {
            synonyms: true,
            externalCodes: true,
          },
        });

    return record
      ? record as ClinicalConditionCatalog
      : null;
  }
}