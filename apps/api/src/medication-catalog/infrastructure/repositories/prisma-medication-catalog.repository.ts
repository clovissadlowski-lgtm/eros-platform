import {
  Injectable,
} from '@nestjs/common';

import {
  PrismaService,
} from '../../../common/database/prisma.service';

import type {
  MedicationCatalog,
} from '../../domain/entities/medication-catalog.entity';

import {
  MedicationCatalogRepository,
} from '../../domain/repositories/medication-catalog.repository';

import type {
  SearchMedicationCatalogInput,
} from '../../domain/repositories/medication-catalog.repository';

@Injectable()
export class PrismaMedicationCatalogRepository
  implements MedicationCatalogRepository
{
  constructor(
    private readonly prisma:
      PrismaService,
  ) {}

  async search(
    input:
      SearchMedicationCatalogInput,
  ): Promise<MedicationCatalog[]> {
    const records =
      await this.prisma
        .medicationCatalog
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
                normalizedActiveIngredient: {
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
            name:
              'asc',
          },

          take:
            input.limit,
        });

    return records as MedicationCatalog[];
  }

  async findActiveById(
    id: string,
  ): Promise<MedicationCatalog | null> {
    const record =
      await this.prisma
        .medicationCatalog
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
      ? record as MedicationCatalog
      : null;
  }
}