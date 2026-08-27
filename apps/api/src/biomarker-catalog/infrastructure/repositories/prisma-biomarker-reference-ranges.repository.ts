import {
  Injectable,
} from '@nestjs/common';

import {
  PrismaService,
} from '../../../common/database/prisma.service';

import {
  BiomarkerReferenceContext,
  BiomarkerReferenceRange,
  BiomarkerReferenceSex,
} from '../../domain/entities/biomarker-reference-range.entity';

import {
  BiomarkerReferenceRangesRepository,
  FindReferenceRangesInput,
} from '../../domain/repositories/biomarker-reference-ranges.repository';

interface PrismaBiomarkerReferenceRangeRecord {
  id: string;

  biomarkerCatalogId: string;

  unit: string;

  minAgeYears: number | null;

  maxAgeYears: number | null;

  lowerBound: {
    toString(): string;
  } | null;

  upperBound: {
    toString(): string;
  } | null;

  sex:
    | 'ANY'
    | 'MALE'
    | 'FEMALE';

  context:
    | 'GENERAL'
    | 'FASTING'
    | 'NON_FASTING';

  sourceName: string | null;

  sourceUrl: string | null;

  sourceNote: string | null;

  description: string | null;

  active: boolean;

  createdAt: Date;

  updatedAt: Date;
}

@Injectable()
export class PrismaBiomarkerReferenceRangesRepository
  implements BiomarkerReferenceRangesRepository
{
  constructor(
    private readonly prisma:
      PrismaService,
  ) {}

  async findActiveByBiomarker(
    input:
      FindReferenceRangesInput,
  ): Promise<BiomarkerReferenceRange[]> {
    const ranges =
      await this.prisma.biomarkerReferenceRange.findMany({
        where: {
          biomarkerCatalogId:
            input.biomarkerCatalogId,

          active:
            true,

          ...(input.unit
            ? {
                unit: {
                  equals:
                    input.unit,

                  mode:
                    'insensitive',
                },
              }
            : {}),

          ...(input.ageYears !== undefined
            ? {
                AND: [
                  {
                    OR: [
                      {
                        minAgeYears:
                          null,
                      },

                      {
                        minAgeYears: {
                          lte:
                            input.ageYears,
                        },
                      },
                    ],
                  },

                  {
                    OR: [
                      {
                        maxAgeYears:
                          null,
                      },

                      {
                        maxAgeYears: {
                          gte:
                            input.ageYears,
                        },
                      },
                    ],
                  },
                ],
              }
            : {}),

          ...(input.sex
            ? {
                sex: {
                  in: [
                    'ANY',
                    input.sex,
                  ],
                },
              }
            : {
                sex:
                  'ANY',
              }),

          context:
            input.context ??
            'GENERAL',
        },

        orderBy: [
          {
            minAgeYears:
              'desc',
          },

          {
            maxAgeYears:
              'asc',
          },

          {
            createdAt:
              'asc',
          },
        ],
      });

    return ranges.map(
      (
        range,
      ) =>
        this.toDomain(
          range,
        ),
    );
  }

  async findActiveById(
    id: string,
  ): Promise<BiomarkerReferenceRange | null> {
    const range =
      await this.prisma.biomarkerReferenceRange.findFirst({
        where: {
          id,

          active:
            true,
        },
      });

    return range
      ? this.toDomain(
          range,
        )
      : null;
  }

  private toDomain(
    range:
      PrismaBiomarkerReferenceRangeRecord,
  ): BiomarkerReferenceRange {
    return {
      id:
        range.id,

      biomarkerCatalogId:
        range.biomarkerCatalogId,

      unit:
        range.unit,

      minAgeYears:
        range.minAgeYears,

      maxAgeYears:
        range.maxAgeYears,

      lowerBound:
        range.lowerBound
          ? range.lowerBound.toString()
          : null,

      upperBound:
        range.upperBound
          ? range.upperBound.toString()
          : null,

      sex:
        range.sex as
          BiomarkerReferenceSex,

      context:
        range.context as
          BiomarkerReferenceContext,

      sourceName:
        range.sourceName,

      sourceUrl:
        range.sourceUrl,

      sourceNote:
        range.sourceNote,

      description:
        range.description,

      active:
        range.active,

      createdAt:
        range.createdAt.toISOString(),

      updatedAt:
        range.updatedAt.toISOString(),
    };
  }
}