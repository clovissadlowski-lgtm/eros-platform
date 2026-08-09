import {
  Injectable,
} from '@nestjs/common';

import {
  PrismaService,
} from '../../../common/database/prisma.service';

import type {
  AllergenCatalog,
} from '../../domain/entities/allergen-catalog.entity';

import {
  AllergenCatalogRepository,
} from '../../domain/repositories/allergen-catalog.repository';

import type {
  SearchAllergenCatalogInput,
} from '../../domain/repositories/allergen-catalog.repository';

@Injectable()
export class PrismaAllergenCatalogRepository
  implements AllergenCatalogRepository
{
  constructor(
    private readonly prisma:
      PrismaService,
  ) {}

  async search(
    input:
      SearchAllergenCatalogInput,
  ): Promise<AllergenCatalog[]> {
    const records =
      await this.prisma
        .allergenCatalog
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

    return records as AllergenCatalog[];
  }

  async findActiveById(
    id: string,
  ): Promise<AllergenCatalog | null> {
    const record =
      await this.prisma
        .allergenCatalog
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
      ? record as AllergenCatalog
      : null;
  }
}