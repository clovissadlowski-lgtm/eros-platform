import {
  Injectable,
} from '@nestjs/common';

import {
  BiomarkerReferenceContext,
  BiomarkerReferenceRange,
  BiomarkerReferenceSex,
} from '../../domain/entities/biomarker-reference-range.entity';

import {
  BiomarkerReferenceRangesRepository,
} from '../../domain/repositories/biomarker-reference-ranges.repository';

export interface ResolveBiomarkerReferenceRangeInput {
  biomarkerCatalogId: string;

  unit?: string;

  ageYears?: number;

  sex?: BiomarkerReferenceSex;

  context?: BiomarkerReferenceContext;
}

@Injectable()
export class BiomarkerReferenceRangeResolverService {
  constructor(
    private readonly repository:
      BiomarkerReferenceRangesRepository,
  ) {}

  async resolve(
    input:
      ResolveBiomarkerReferenceRangeInput,
  ): Promise<BiomarkerReferenceRange | null> {
    const ranges =
      await this.repository.findActiveByBiomarker({
        biomarkerCatalogId:
          input.biomarkerCatalogId,

        unit:
          input.unit,

        ageYears:
          input.ageYears,

        sex:
          input.sex,

        context:
          input.context,
      });

    if (
      ranges.length === 0
    ) {
      return null;
    }

    const ranked =
      [...ranges].sort(
        (
          a,
          b,
        ) =>
          this.score(
            b,
            input,
          ) -
          this.score(
            a,
            input,
          ),
      );

    return ranked[0] ??
      null;
  }

  private score(
    range:
      BiomarkerReferenceRange,

    input:
      ResolveBiomarkerReferenceRangeInput,
  ): number {
    let score = 0;

    if (
      input.unit &&
      range.unit.toLowerCase() ===
        input.unit.toLowerCase()
    ) {
      score += 100;
    }

    if (
      input.context &&
      range.context ===
        input.context
    ) {
      score += 80;
    } else if (
      !input.context &&
      range.context ===
        BiomarkerReferenceContext.GENERAL
    ) {
      score += 20;
    }

    if (
      input.sex &&
      range.sex ===
        input.sex
    ) {
      score += 50;
    } else if (
      range.sex ===
      BiomarkerReferenceSex.ANY
    ) {
      score += 10;
    }

    if (
      input.ageYears !== undefined
    ) {
      const hasMinAge =
        range.minAgeYears !==
        null;

      const hasMaxAge =
        range.maxAgeYears !==
        null;

      if (
        hasMinAge ||
        hasMaxAge
      ) {
        score += 20;
      }

      if (
        hasMinAge &&
        range.minAgeYears !==
          null &&
        input.ageYears >=
          range.minAgeYears
      ) {
        score += 5;
      }

      if (
        hasMaxAge &&
        range.maxAgeYears !==
          null &&
        input.ageYears <=
          range.maxAgeYears
      ) {
        score += 5;
      }
    }

    if (
      range.lowerBound !==
      null
    ) {
      score += 1;
    }

    if (
      range.upperBound !==
      null
    ) {
      score += 1;
    }

    return score;
  }
}