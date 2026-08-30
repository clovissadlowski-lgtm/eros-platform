import {
  SkinfoldMeasurementSide,
  SkinfoldProtocol,
  SkinfoldSite,
} from '../entities/anthropometric-assessment.entity';

export type SkinfoldProtocolBiologicalSex =
  | 'MALE'
  | 'FEMALE';

export type SkinfoldProtocolEligibilityReason =
  | 'MISSING_BIOLOGICAL_SEX'
  | 'MISSING_PROTOCOL'
  | 'UNSUPPORTED_PROTOCOL'
  | 'MISSING_REQUIRED_SITES';

export interface SkinfoldProtocolMeasurementInput {
  site:
    SkinfoldSite;

  side:
    SkinfoldMeasurementSide;

  readingNumber:
    number;

  valueMm:
    number;
}

export interface SkinfoldSiteAverage {
  site:
    SkinfoldSite;

  readingsCount:
    number;

  averageMm:
    number;
}

export interface SkinfoldProtocolPreparationResult {
  eligible:
    boolean;

  protocol:
    SkinfoldProtocol | null;

  requiredSites:
    SkinfoldSite[];

  missingSites:
    SkinfoldSite[];

  siteAverages:
    SkinfoldSiteAverage[];

  sumSkinfoldsMm:
    number | null;

  reason:
    SkinfoldProtocolEligibilityReason | null;
}

export interface SkinfoldProtocolPreparationInput {
  biologicalSex:
    SkinfoldProtocolBiologicalSex | null;

  protocol:
    SkinfoldProtocol | null;

  measurements:
    SkinfoldProtocolMeasurementInput[];
}

export class AnthropometricSkinfoldProtocolService {
  prepare(
    input:
      SkinfoldProtocolPreparationInput,
  ): SkinfoldProtocolPreparationResult {
    const {
      biologicalSex,
      protocol,
      measurements,
    } = input;

    if (!biologicalSex) {
      return {
        eligible:
          false,

        protocol,

        requiredSites:
          [],

        missingSites:
          [],

        siteAverages:
          [],

        sumSkinfoldsMm:
          null,

        reason:
          'MISSING_BIOLOGICAL_SEX',
      };
    }

    if (!protocol) {
      return {
        eligible:
          false,

        protocol:
          null,

        requiredSites:
          [],

        missingSites:
          [],

        siteAverages:
          [],

        sumSkinfoldsMm:
          null,

        reason:
          'MISSING_PROTOCOL',
      };
    }

    const requiredSites =
      this.resolveRequiredSites(
        biologicalSex,
        protocol,
      );

    if (!requiredSites) {
      return {
        eligible:
          false,

        protocol,

        requiredSites:
          [],

        missingSites:
          [],

        siteAverages:
          [],

        sumSkinfoldsMm:
          null,

        reason:
          'UNSUPPORTED_PROTOCOL',
      };
    }

    const rightSideMeasurements =
      measurements.filter(
        (measurement) =>
          measurement.side ===
            SkinfoldMeasurementSide.RIGHT &&
          Number.isFinite(
            measurement.valueMm,
          ) &&
          measurement.valueMm > 0,
      );

    const siteAverages:
      SkinfoldSiteAverage[] =
        [];

    const missingSites:
      SkinfoldSite[] =
        [];

    for (
      const site of requiredSites
    ) {
      const siteMeasurements =
        rightSideMeasurements.filter(
          (measurement) =>
            measurement.site ===
            site,
        );

      if (
        siteMeasurements.length === 0
      ) {
        missingSites.push(
          site,
        );

        continue;
      }

      const sum =
        siteMeasurements.reduce(
          (
            total,
            measurement,
          ) =>
            total +
            measurement.valueMm,
          0,
        );

      const averageMm =
        sum /
        siteMeasurements.length;

      siteAverages.push({
        site,

        readingsCount:
          siteMeasurements.length,

        averageMm:
          this.round(
            averageMm,
            2,
          ),
      });
    }

    if (
      missingSites.length > 0
    ) {
      return {
        eligible:
          false,

        protocol,

        requiredSites,

        missingSites,

        siteAverages,

        sumSkinfoldsMm:
          null,

        reason:
          'MISSING_REQUIRED_SITES',
      };
    }

    const sumSkinfoldsMm =
      siteAverages.reduce(
        (
          total,
          siteAverage,
        ) =>
          total +
          siteAverage.averageMm,
        0,
      );

    return {
      eligible:
        true,

      protocol,

      requiredSites,

      missingSites:
        [],

      siteAverages,

      sumSkinfoldsMm:
        this.round(
          sumSkinfoldsMm,
          2,
        ),

      reason:
        null,
    };
  }

  private resolveRequiredSites(
    biologicalSex:
      SkinfoldProtocolBiologicalSex,

    protocol:
      SkinfoldProtocol,
  ): SkinfoldSite[] | null {
    if (
      protocol ===
      SkinfoldProtocol.JACKSON_POLLOCK_3
    ) {
      if (
        biologicalSex ===
        'MALE'
      ) {
        return [
          SkinfoldSite.CHEST,
          SkinfoldSite.ABDOMEN,
          SkinfoldSite.THIGH,
        ];
      }

      return [
        SkinfoldSite.TRICEPS,
        SkinfoldSite.SUPRAILIAC,
        SkinfoldSite.THIGH,
      ];
    }

    if (
      protocol ===
      SkinfoldProtocol.JACKSON_POLLOCK_7
    ) {
      return [
        SkinfoldSite.CHEST,
        SkinfoldSite.MIDAXILLARY,
        SkinfoldSite.TRICEPS,
        SkinfoldSite.SUBSCAPULAR,
        SkinfoldSite.ABDOMEN,
        SkinfoldSite.SUPRAILIAC,
        SkinfoldSite.THIGH,
      ];
    }

    return null;
  }

  private round(
    value:
      number,

    decimalPlaces:
      number,
  ): number {
    const factor =
      10 ** decimalPlaces;

    return (
      Math.round(
        (
          value +
          Number.EPSILON
        ) *
          factor,
      ) /
      factor
    );
  }
}