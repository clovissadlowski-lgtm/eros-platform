import {
  SkinfoldMeasurementSide,
  SkinfoldProtocol,
  SkinfoldSite,
} from '../entities/anthropometric-assessment.entity';

import {
  AnthropometricSkinfoldProtocolService,
} from './anthropometric-skinfold-protocol.service';

describe(
  'AnthropometricSkinfoldProtocolService',
  () => {
    let service:
      AnthropometricSkinfoldProtocolService;

    beforeEach(() => {
      service =
        new AnthropometricSkinfoldProtocolService();
    });

    it(
      'prepares male Jackson-Pollock 3 using the average of repeated readings',
      () => {
        const result =
          service.prepare({
            biologicalSex:
              'MALE',

            protocol:
              SkinfoldProtocol.JACKSON_POLLOCK_3,

            measurements: [
              {
                site:
                  SkinfoldSite.CHEST,

                side:
                  SkinfoldMeasurementSide.RIGHT,

                readingNumber:
                  1,

                valueMm:
                  10,
              },
              {
                site:
                  SkinfoldSite.CHEST,

                side:
                  SkinfoldMeasurementSide.RIGHT,

                readingNumber:
                  2,

                valueMm:
                  12,
              },
              {
                site:
                  SkinfoldSite.ABDOMEN,

                side:
                  SkinfoldMeasurementSide.RIGHT,

                readingNumber:
                  1,

                valueMm:
                  20,
              },
              {
                site:
                  SkinfoldSite.ABDOMEN,

                side:
                  SkinfoldMeasurementSide.RIGHT,

                readingNumber:
                  2,

                valueMm:
                  22,
              },
              {
                site:
                  SkinfoldSite.THIGH,

                side:
                  SkinfoldMeasurementSide.RIGHT,

                readingNumber:
                  1,

                valueMm:
                  30,
              },
              {
                site:
                  SkinfoldSite.THIGH,

                side:
                  SkinfoldMeasurementSide.RIGHT,

                readingNumber:
                  2,

                valueMm:
                  32,
              },
            ],
          });

        expect(
          result.eligible,
        ).toBe(
          true,
        );

        expect(
          result.sumSkinfoldsMm,
        ).toBe(
          63,
        );

        expect(
          result.siteAverages,
        ).toEqual([
          {
            site:
              SkinfoldSite.CHEST,

            readingsCount:
              2,

            averageMm:
              11,
          },
          {
            site:
              SkinfoldSite.ABDOMEN,

            readingsCount:
              2,

            averageMm:
              21,
          },
          {
            site:
              SkinfoldSite.THIGH,

            readingsCount:
              2,

            averageMm:
              31,
          },
        ]);

        expect(
          result.missingSites,
        ).toEqual(
          [],
        );

        expect(
          result.reason,
        ).toBeNull();
      },
    );

    it(
      'uses female Jackson-Pollock 3 sites',
      () => {
        const result =
          service.prepare({
            biologicalSex:
              'FEMALE',

            protocol:
              SkinfoldProtocol.JACKSON_POLLOCK_3,

            measurements: [
              {
                site:
                  SkinfoldSite.TRICEPS,

                side:
                  SkinfoldMeasurementSide.RIGHT,

                readingNumber:
                  1,

                valueMm:
                  15,
              },
              {
                site:
                  SkinfoldSite.SUPRAILIAC,

                side:
                  SkinfoldMeasurementSide.RIGHT,

                readingNumber:
                  1,

                valueMm:
                  18,
              },
              {
                site:
                  SkinfoldSite.THIGH,

                side:
                  SkinfoldMeasurementSide.RIGHT,

                readingNumber:
                  1,

                valueMm:
                  25,
              },

              {
                site:
                  SkinfoldSite.CHEST,

                side:
                  SkinfoldMeasurementSide.RIGHT,

                readingNumber:
                  1,

                valueMm:
                  99,
              },
            ],
          });

        expect(
          result.eligible,
        ).toBe(
          true,
        );

        expect(
          result.requiredSites,
        ).toEqual([
          SkinfoldSite.TRICEPS,
          SkinfoldSite.SUPRAILIAC,
          SkinfoldSite.THIGH,
        ]);

        expect(
          result.sumSkinfoldsMm,
        ).toBe(
          58,
        );
      },
    );

    it(
      'prepares Jackson-Pollock 7 with all required sites',
      () => {
        const result =
          service.prepare({
            biologicalSex:
              'MALE',

            protocol:
              SkinfoldProtocol.JACKSON_POLLOCK_7,

            measurements: [
              {
                site:
                  SkinfoldSite.CHEST,

                side:
                  SkinfoldMeasurementSide.RIGHT,

                readingNumber:
                  1,

                valueMm:
                  10,
              },
              {
                site:
                  SkinfoldSite.MIDAXILLARY,

                side:
                  SkinfoldMeasurementSide.RIGHT,

                readingNumber:
                  1,

                valueMm:
                  11,
              },
              {
                site:
                  SkinfoldSite.TRICEPS,

                side:
                  SkinfoldMeasurementSide.RIGHT,

                readingNumber:
                  1,

                valueMm:
                  12,
              },
              {
                site:
                  SkinfoldSite.SUBSCAPULAR,

                side:
                  SkinfoldMeasurementSide.RIGHT,

                readingNumber:
                  1,

                valueMm:
                  13,
              },
              {
                site:
                  SkinfoldSite.ABDOMEN,

                side:
                  SkinfoldMeasurementSide.RIGHT,

                readingNumber:
                  1,

                valueMm:
                  14,
              },
              {
                site:
                  SkinfoldSite.SUPRAILIAC,

                side:
                  SkinfoldMeasurementSide.RIGHT,

                readingNumber:
                  1,

                valueMm:
                  15,
              },
              {
                site:
                  SkinfoldSite.THIGH,

                side:
                  SkinfoldMeasurementSide.RIGHT,

                readingNumber:
                  1,

                valueMm:
                  16,
              },
            ],
          });

        expect(
          result.eligible,
        ).toBe(
          true,
        );

        expect(
          result.sumSkinfoldsMm,
        ).toBe(
          91,
        );

        expect(
          result.siteAverages,
        ).toHaveLength(
          7,
        );
      },
    );

    it(
      'does not use left-side readings to complete the protocol',
      () => {
        const result =
          service.prepare({
            biologicalSex:
              'MALE',

            protocol:
              SkinfoldProtocol.JACKSON_POLLOCK_3,

            measurements: [
              {
                site:
                  SkinfoldSite.CHEST,

                side:
                  SkinfoldMeasurementSide.RIGHT,

                readingNumber:
                  1,

                valueMm:
                  10,
              },
              {
                site:
                  SkinfoldSite.ABDOMEN,

                side:
                  SkinfoldMeasurementSide.RIGHT,

                readingNumber:
                  1,

                valueMm:
                  20,
              },
              {
                site:
                  SkinfoldSite.THIGH,

                side:
                  SkinfoldMeasurementSide.LEFT,

                readingNumber:
                  1,

                valueMm:
                  30,
              },
            ],
          });

        expect(
          result.eligible,
        ).toBe(
          false,
        );

        expect(
          result.missingSites,
        ).toEqual([
          SkinfoldSite.THIGH,
        ]);

        expect(
          result.reason,
        ).toBe(
          'MISSING_REQUIRED_SITES',
        );

        expect(
          result.sumSkinfoldsMm,
        ).toBeNull();
      },
    );

    it(
      'reports every required site that is missing',
      () => {
        const result =
          service.prepare({
            biologicalSex:
              'MALE',

            protocol:
              SkinfoldProtocol.JACKSON_POLLOCK_3,

            measurements: [
              {
                site:
                  SkinfoldSite.CHEST,

                side:
                  SkinfoldMeasurementSide.RIGHT,

                readingNumber:
                  1,

                valueMm:
                  10,
              },
            ],
          });

        expect(
          result.eligible,
        ).toBe(
          false,
        );

        expect(
          result.missingSites,
        ).toEqual([
          SkinfoldSite.ABDOMEN,
          SkinfoldSite.THIGH,
        ]);

        expect(
          result.reason,
        ).toBe(
          'MISSING_REQUIRED_SITES',
        );
      },
    );

    it(
      'is not eligible without biological sex',
      () => {
        const result =
          service.prepare({
            biologicalSex:
              null,

            protocol:
              SkinfoldProtocol.JACKSON_POLLOCK_3,

            measurements:
              [],
          });

        expect(
          result.eligible,
        ).toBe(
          false,
        );

        expect(
          result.reason,
        ).toBe(
          'MISSING_BIOLOGICAL_SEX',
        );
      },
    );

    it(
      'is not eligible for an unsupported protocol',
      () => {
        const result =
          service.prepare({
            biologicalSex:
              'MALE',

            protocol:
              SkinfoldProtocol.OTHER,

            measurements:
              [],
          });

        expect(
          result.eligible,
        ).toBe(
          false,
        );

        expect(
          result.reason,
        ).toBe(
          'UNSUPPORTED_PROTOCOL',
        );
      },
    );
  },
);