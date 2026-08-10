import {
  Injectable,
} from '@nestjs/common';

import {
  PrismaService,
} from '../../../common/database/prisma.service';

import {
  BiomarkerCatalog,
} from '../../domain/entities/biomarker-catalog.entity';

import {
  BiomarkerCatalogRepository,
  SearchBiomarkerCatalogInput,
} from '../../domain/repositories/biomarker-catalog.repository';

interface PrismaBiomarkerCatalogRecord {
  id: string;

  name: string;

  code: string | null;

  defaultUnit: string | null;

  description: string | null;

  active: boolean;

  createdAt: Date;

  updatedAt: Date;
}

@Injectable()
export class PrismaBiomarkerCatalogRepository
  implements BiomarkerCatalogRepository
{
  constructor(
    private readonly prisma:
      PrismaService,
  ) {}

  async search(
    input: SearchBiomarkerCatalogInput,
  ): Promise<BiomarkerCatalog[]> {
    const query =
      input.query.trim();

    if (query.length === 0) {
      return [];
    }

    const biomarkers =
      await this.prisma.biomarkerCatalog.findMany({
        where: {
          active:
            true,

          OR: [
            {
              name: {
                contains:
                  query,

                mode:
                  'insensitive',
              },
            },

            {
              code: {
                contains:
                  query,

                mode:
                  'insensitive',
              },
            },
          ],
        },

        orderBy: {
          name:
            'asc',
        },

        take:
          input.limit,
      });

    return biomarkers.map(
      (
        biomarker,
      ) =>
        this.toDomain(
          biomarker,
        ),
    );
  }

  async findActiveById(
    id: string,
  ): Promise<BiomarkerCatalog | null> {
    const biomarker =
      await this.prisma.biomarkerCatalog.findFirst({
        where: {
          id,

          active:
            true,
        },
      });

    return biomarker
      ? this.toDomain(
          biomarker,
        )
      : null;
  }

  private toDomain(
    biomarker:
      PrismaBiomarkerCatalogRecord,
  ): BiomarkerCatalog {
    return {
      id:
        biomarker.id,

      name:
        biomarker.name,

      code:
        biomarker.code,

      defaultUnit:
        biomarker.defaultUnit,

      description:
        biomarker.description,

      active:
        biomarker.active,

      createdAt:
        biomarker.createdAt
          .toISOString(),

      updatedAt:
        biomarker.updatedAt
          .toISOString(),
    };
  }
}