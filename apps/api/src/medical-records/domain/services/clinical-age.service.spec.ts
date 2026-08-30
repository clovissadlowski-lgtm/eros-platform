import {
  ClinicalAgeService,
} from './clinical-age.service';

describe(
  'ClinicalAgeService',
  () => {
    let service:
      ClinicalAgeService;

    beforeEach(() => {
      service =
        new ClinicalAgeService();
    });

    describe(
      'calculate',
      () => {
        it(
          'calculates age on the reference date',
          () => {
            const result =
              service.calculate({
                birthDate:
                  '1990-04-10',
                referenceDate:
                  '2026-08-29',
              });

            expect(result).toEqual({
              years: 36,
              months: 4,
              totalMonths: 436,
            });
          },
        );

        it(
          'does not increment the month before the birth day',
          () => {
            const result =
              service.calculate({
                birthDate:
                  '1990-04-30',
                referenceDate:
                  '2026-08-29',
              });

            expect(result).toEqual({
              years: 36,
              months: 3,
              totalMonths: 435,
            });
          },
        );

        it(
          'calculates age correctly on the birthday',
          () => {
            const result =
              service.calculate({
                birthDate:
                  '1990-08-29',
                referenceDate:
                  '2026-08-29',
              });

            expect(result).toEqual({
              years: 36,
              months: 0,
              totalMonths: 432,
            });
          },
        );

        it(
          'supports children younger than one year',
          () => {
            const result =
              service.calculate({
                birthDate:
                  '2026-01-15',
                referenceDate:
                  '2026-08-29',
              });

            expect(result).toEqual({
              years: 0,
              months: 7,
              totalMonths: 7,
            });
          },
        );

        it(
          'rejects a reference date before birth date',
          () => {
            expect(() =>
              service.calculate({
                birthDate:
                  '2026-08-29',
                referenceDate:
                  '2026-08-28',
              }),
            ).toThrow(
              'referenceDate must be on or after birthDate.',
            );
          },
        );

        it(
          'rejects invalid date format',
          () => {
            expect(() =>
              service.calculate({
                birthDate:
                  '29/08/1990',
                referenceDate:
                  '2026-08-29',
              }),
            ).toThrow(
              'birthDate must use YYYY-MM-DD format.',
            );
          },
        );

        it(
          'rejects invalid calendar dates',
          () => {
            expect(() =>
              service.calculate({
                birthDate:
                  '1990-02-31',
                referenceDate:
                  '2026-08-29',
              }),
            ).toThrow(
              'birthDate must be a valid calendar date.',
            );
          },
        );
      },
    );
  },
);