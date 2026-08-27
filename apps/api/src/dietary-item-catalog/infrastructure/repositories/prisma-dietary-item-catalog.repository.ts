import {
  Injectable,
} from '@nestjs/common';

import {
  PrismaService,
} from '../../../common/database/prisma.service';

import type {
  DietaryItemCatalog,
} from '../../domain/entities/dietary-item-catalog.entity';

import {
  DietaryItemCatalogRepository,
} from '../../domain/repositories/dietary-item-catalog.repository';

import type {
  SearchDietaryItemCatalogInput,
} from '../../domain/repositories/dietary-item-catalog.repository';

@Injectable()
export class PrismaDietaryItemCatalogRepository
  implements DietaryItemCatalogRepository
{
  constructor(
    private readonly prisma:
      PrismaService,
  ) {}

  async search(
    input:
      SearchDietaryItemCatalogInput,
  ): Promise<DietaryItemCatalog[]> {
    const records =
      await this.prisma
        .dietaryItemCatalog
        .findMany({
          where: {
            isActive:
              true,

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
                category: {
                  contains:
                    input.query,

                  mode:
                    'insensitive',
                },
              },
            ],
          },

          include: {
            synonyms:
              true,
          },

          orderBy: {
            name:
              'asc',
          },

          take:
            input.limit,
        });

    return records as DietaryItemCatalog[];
  }

  async findActiveById(
    id: string,
  ): Promise<DietaryItemCatalog | null> {
    const record =
      await this.prisma
        .dietaryItemCatalog
        .findFirst({
          where: {
            id,

            isActive:
              true,
          },

          include: {
            synonyms:
              true,
          },
        });

    return record
      ? record as DietaryItemCatalog
      : null;
  }
}