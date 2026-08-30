import {
  PatientBiologicalSex,
} from '../../../patients/domain/entities/patient.entity';

import {
  AnthropometricClinicalContextService,
} from './anthropometric-clinical-context.service';

describe(
  'AnthropometricClinicalContextService',
  () => {
    let service:
      AnthropometricClinicalContextService;

    beforeEach(() => {
      service =
        new AnthropometricClinicalContextService();
    });

    it(
      'builds the clinical context from existing patient data',
      () => {
        const result =
          service.build({
            birthDate:
              '1990-04-10',

            biologicalSex:
              PatientBiologicalSex.MALE,

            assessmentDate:
              '2026-08-29',
          });

        expect(result).toEqual({
          assessmentDate:
            '2026-08-29',

          biologicalSex:
            PatientBiologicalSex.MALE,

          age: {
            years: 36,
            months: 4,
            totalMonths: 436,
          },

          population:
            'ADULT',

          hasBirthDate:
            true,

          hasBiologicalSex:
            true,
        });
      },
    );

    it(
      'uses the assessment date to determine the patient population',
      () => {
        const beforeSixty =
          service.build({
            birthDate:
              '1967-09-01',

            biologicalSex:
              PatientBiologicalSex.FEMALE,

            assessmentDate:
              '2026-08-29',
          });

        const afterSixty =
          service.build({
            birthDate:
              '1967-09-01',

            biologicalSex:
              PatientBiologicalSex.FEMALE,

            assessmentDate:
              '2027-09-01',
          });

        expect(
          beforeSixty.population,
        ).toBe(
          'ADULT',
        );

        expect(
          afterSixty.population,
        ).toBe(
          'OLDER_ADULT',
        );
      },
    );

    it(
      'keeps the context usable when birth date is missing',
      () => {
        const result =
          service.build({
            birthDate:
              null,

            biologicalSex:
              PatientBiologicalSex.MALE,

            assessmentDate:
              '2026-08-29',
          });

        expect(result).toEqual({
          assessmentDate:
            '2026-08-29',

          biologicalSex:
            PatientBiologicalSex.MALE,

          age:
            null,

          population:
            'UNKNOWN',

          hasBirthDate:
            false,

          hasBiologicalSex:
            true,
        });
      },
    );

    it(
      'keeps the context usable when biological sex is missing',
      () => {
        const result =
          service.build({
            birthDate:
              '1990-04-10',

            biologicalSex:
              null,

            assessmentDate:
              '2026-08-29',
          });

        expect(
          result.population,
        ).toBe(
          'ADULT',
        );

        expect(
          result.hasBirthDate,
        ).toBe(
          true,
        );

        expect(
          result.hasBiologicalSex,
        ).toBe(
          false,
        );

        expect(
          result.biologicalSex,
        ).toBeNull();
      },
    );

    it(
      'keeps the context usable when both optional patient data are missing',
      () => {
        const result =
          service.build({
            birthDate:
              null,

            biologicalSex:
              null,

            assessmentDate:
              '2026-08-29',
          });

        expect(
          result.age,
        ).toBeNull();

        expect(
          result.population,
        ).toBe(
          'UNKNOWN',
        );

        expect(
          result.hasBirthDate,
        ).toBe(
          false,
        );

        expect(
          result.hasBiologicalSex,
        ).toBe(
          false,
        );
      },
    );
  },
);