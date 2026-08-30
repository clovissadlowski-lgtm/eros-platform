import {
  AnthropometricInterpretationsService,
} from './anthropometric-interpretations.service';

describe(
  'AnthropometricInterpretationsService',
  () => {
    let service:
      AnthropometricInterpretationsService;

    beforeEach(() => {
      service =
        new AnthropometricInterpretationsService();
    });

    describe(
      'resolvePopulation',
      () => {
        it(
          'classifies a child from birth date and assessment date',
          () => {
            expect(
              service.resolvePopulation({
                birthDate:
                  '2018-05-10',
                assessmentDate:
                  '2026-08-29',
              }),
            ).toBe(
              'CHILD',
            );
          },
        );

        it(
          'classifies an adolescent',
          () => {
            expect(
              service.resolvePopulation({
                birthDate:
                  '2011-01-10',
                assessmentDate:
                  '2026-08-29',
              }),
            ).toBe(
              'ADOLESCENT',
            );
          },
        );

        it(
          'classifies an adult',
          () => {
            expect(
              service.resolvePopulation({
                birthDate:
                  '1990-04-10',
                assessmentDate:
                  '2026-08-29',
              }),
            ).toBe(
              'ADULT',
            );
          },
        );

        it(
          'classifies an older adult',
          () => {
            expect(
              service.resolvePopulation({
                birthDate:
                  '1956-04-10',
                assessmentDate:
                  '2026-08-29',
              }),
            ).toBe(
              'OLDER_ADULT',
            );
          },
        );

        it(
          'uses age at assessment date instead of current age',
          () => {
            expect(
              service.resolvePopulation({
                birthDate:
                  '1967-09-01',
                assessmentDate:
                  '2026-08-29',
              }),
            ).toBe(
              'ADULT',
            );

            expect(
              service.resolvePopulation({
                birthDate:
                  '1967-09-01',
                assessmentDate:
                  '2027-09-01',
              }),
            ).toBe(
              'OLDER_ADULT',
            );
          },
        );
      },
    );
  },
);