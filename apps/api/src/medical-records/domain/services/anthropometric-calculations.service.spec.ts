import {
  AnthropometricCalculationsService,
} from './anthropometric-calculations.service';

describe(
  'AnthropometricCalculationsService',
  () => {
    let service:
      AnthropometricCalculationsService;

    beforeEach(() => {
      service =
        new AnthropometricCalculationsService();
    });

    describe(
      'calculateBmi',
      () => {
        it(
          'calculates BMI from weight and height',
          () => {
            const result =
              service.calculateBmi({
                weightKg: 77,
                heightCm: 170,
              });

            expect(result).toEqual({
              code:
                'BMI',

              value:
                26.64,

              unit:
                'kg/m²',

              source:
                'HIGEIA_CALCULATION',

              method:
                'WEIGHT_HEIGHT_BMI',
            });
          },
        );

        it(
          'supports decimal weight and height',
          () => {
            const result =
              service.calculateBmi({
                weightKg: 76.5,
                heightCm: 170.5,
              });

            expect(
              result.value,
            ).toBe(
              26.32,
            );
          },
        );

        it(
          'rejects zero weight',
          () => {
            expect(() =>
              service.calculateBmi({
                weightKg: 0,
                heightCm: 170,
              }),
            ).toThrow(
              'weightKg must be a positive finite number.',
            );
          },
        );

        it(
          'rejects negative weight',
          () => {
            expect(() =>
              service.calculateBmi({
                weightKg: -70,
                heightCm: 170,
              }),
            ).toThrow(
              'weightKg must be a positive finite number.',
            );
          },
        );

        it(
          'rejects zero height',
          () => {
            expect(() =>
              service.calculateBmi({
                weightKg: 70,
                heightCm: 0,
              }),
            ).toThrow(
              'heightCm must be a positive finite number.',
            );
          },
        );

        it(
          'rejects non-finite values',
          () => {
            expect(() =>
              service.calculateBmi({
                weightKg:
                  Number.NaN,

                heightCm:
                  170,
              }),
            ).toThrow(
              'weightKg must be a positive finite number.',
            );

            expect(() =>
              service.calculateBmi({
                weightKg:
                  70,

                heightCm:
                  Number.POSITIVE_INFINITY,
              }),
            ).toThrow(
              'heightCm must be a positive finite number.',
            );
          },
        );
      },
    );

    describe(
      'calculateJacksonPollockBodyDensity',
      () => {
        it(
          'calculates male Jackson-Pollock 3-site body density',
          () => {
            const result =
              service
                .calculateJacksonPollockBodyDensity({
                  biologicalSex:
                    'MALE',

                  protocol:
                    'JACKSON_POLLOCK_3',

                  ageYears:
                    36,

                  sumSkinfoldsMm:
                    80,
                });

            expect(result).toEqual({
              code:
                'BODY_DENSITY',

              value:
                1.044218,

              unit:
                'g/mL',

              source:
                'HIGEIA_CALCULATION',

              method:
                'JACKSON_POLLOCK_3',
            });
          },
        );

        it(
          'calculates male Jackson-Pollock 7-site body density',
          () => {
            const result =
              service
                .calculateJacksonPollockBodyDensity({
                  biologicalSex:
                    'MALE',

                  protocol:
                    'JACKSON_POLLOCK_7',

                  ageYears:
                    36,

                  sumSkinfoldsMm:
                    120,
                });

            expect(
              result.value,
            ).toBe(
              1.057344,
            );
          },
        );

        it(
          'calculates female Jackson-Pollock 3-site body density',
          () => {
            const result =
              service
                .calculateJacksonPollockBodyDensity({
                  biologicalSex:
                    'FEMALE',

                  protocol:
                    'JACKSON_POLLOCK_3',

                  ageYears:
                    36,

                  sumSkinfoldsMm:
                    80,
                });

            expect(
              result.value,
            ).toBe(
              1.029769,
            );
          },
        );

        it(
          'calculates female Jackson-Pollock 7-site body density',
          () => {
            const result =
              service
                .calculateJacksonPollockBodyDensity({
                  biologicalSex:
                    'FEMALE',

                  protocol:
                    'JACKSON_POLLOCK_7',

                  ageYears:
                    36,

                  sumSkinfoldsMm:
                    120,
                });

            expect(
              result.value,
            ).toBe(
              1.044081,
            );
          },
        );

        it(
          'rejects invalid skinfold sum',
          () => {
            expect(() =>
              service
                .calculateJacksonPollockBodyDensity({
                  biologicalSex:
                    'MALE',

                  protocol:
                    'JACKSON_POLLOCK_3',

                  ageYears:
                    36,

                  sumSkinfoldsMm:
                    0,
                }),
            ).toThrow(
              'sumSkinfoldsMm must be a positive finite number.',
            );
          },
        );

        it(
          'rejects negative age',
          () => {
            expect(() =>
              service
                .calculateJacksonPollockBodyDensity({
                  biologicalSex:
                    'MALE',

                  protocol:
                    'JACKSON_POLLOCK_3',

                  ageYears:
                    -1,

                  sumSkinfoldsMm:
                    80,
                }),
            ).toThrow(
              'ageYears must be a non-negative finite number.',
            );
          },
        );
      },
    );

    describe(
      'calculateBodyFatFromDensity',
      () => {
        it(
          'calculates body fat percentage using Siri equation',
          () => {
            const result =
              service
                .calculateBodyFatFromDensity({
                  bodyDensity:
                    1.044218,
                });

            expect(result).toEqual({
              code:
                'BODY_FAT_PERCENTAGE',

              value:
                24.04,

              unit:
                '%',

              source:
                'HIGEIA_CALCULATION',

              method:
                'SIRI',
            });
          },
        );

        it(
          'rejects invalid body density',
          () => {
            expect(() =>
              service
                .calculateBodyFatFromDensity({
                  bodyDensity:
                    0,
                }),
            ).toThrow(
              'bodyDensity must be a positive finite number.',
            );
          },
        );
      },
    );

    describe(
      'body composition masses',
      () => {
        it(
          'calculates fat mass',
          () => {
            const result =
              service.calculateFatMass({
                weightKg:
                  77,

                bodyFatPercentage:
                  20,
              });

            expect(result).toEqual({
              code:
                'FAT_MASS_KG',

              value:
                15.4,

              unit:
                'kg',

              source:
                'HIGEIA_CALCULATION',

              method:
                'WEIGHT_BODY_FAT_PERCENTAGE',
            });
          },
        );

        it(
          'calculates lean mass',
          () => {
            const result =
              service.calculateLeanMass({
                weightKg:
                  77,

                bodyFatPercentage:
                  20,
              });

            expect(result).toEqual({
              code:
                'LEAN_MASS_KG',

              value:
                61.6,

              unit:
                'kg',

              source:
                'HIGEIA_CALCULATION',

              method:
                'WEIGHT_BODY_FAT_PERCENTAGE',
            });
          },
        );

        it(
          'rejects body fat percentage above 100',
          () => {
            expect(() =>
              service.calculateFatMass({
                weightKg:
                  77,

                bodyFatPercentage:
                  101,
              }),
            ).toThrow(
              'bodyFatPercentage must be between 0 and 100.',
            );
          },
        );
      },
    );
  },
);