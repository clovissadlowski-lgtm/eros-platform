import {
  Patient,
  PatientBiologicalSex,
  PatientStatus,
} from '../../../patients/domain/entities/patient.entity';

import {
  AnthropometricAssessment,
  SkinfoldMeasurementSide,
  SkinfoldProtocol,
  SkinfoldSite,
} from '../../domain/entities/anthropometric-assessment.entity';

import {
  AnthropometricAssessmentResultsService,
} from './anthropometric-assessment-results.service';

describe(
  'AnthropometricAssessmentResultsService',
  () => {
    let service:
      AnthropometricAssessmentResultsService;

    beforeEach(() => {
      service =
        new AnthropometricAssessmentResultsService();
    });

    const createPatient =
      (
        overrides:
          Partial<Patient> = {},
      ): Patient => ({
        id:
          '22222222-2222-4222-8222-222222222222',

        organizationId:
          '11111111-1111-4111-8111-111111111111',

        name:
          'Paciente Teste',

        cpf:
          null,

        email:
          null,

        phone:
          null,

        birthDate:
          '1990-04-10',

        biologicalSex:
          PatientBiologicalSex.MALE,

        status:
          PatientStatus.ACTIVE,

        createdAt:
          '2026-01-01T00:00:00.000Z',

        updatedAt:
          '2026-01-01T00:00:00.000Z',

        ...overrides,
      });

    const createAssessment =
      (
        overrides:
          Partial<AnthropometricAssessment> = {},
      ): AnthropometricAssessment => ({
        id:
          '44444444-4444-4444-8444-444444444444',

        organizationId:
          '11111111-1111-4111-8111-111111111111',

        medicalRecordId:
          '33333333-3333-4333-8333-333333333333',

        patientId:
          '22222222-2222-4222-8222-222222222222',

        measuredAt:
          '2026-08-29',

        weightKg:
          77,

        heightCm:
          170,

        bodyFatPercentage:
          null,

        fatMassKg:
          null,

        leanMassKg:
          null,

        muscleMassKg:
          null,

        waistCircumferenceCm:
          null,

        hipCircumferenceCm:
          null,

        abdomenCircumferenceCm:
          null,

        chestCircumferenceCm:
          null,

        armCircumferenceCm:
          null,

        thighCircumferenceCm:
          null,

        calfCircumferenceCm:
          null,

        bodyCompositionMethod:
          null,

        skinfoldProtocol:
          null,

        skinfoldMeasurements:
          [],

        notes:
          null,

        createdAt:
          '2026-08-29T12:00:00.000Z',

        updatedAt:
          '2026-08-29T12:00:00.000Z',

        ...overrides,
      });

    it(
      'builds clinical context and BMI from an assessment',
      () => {
        const result =
          service.build(
            createAssessment(),
            createPatient(),
          );

        expect(
          result.clinicalContext,
        ).toEqual({
          assessmentDate:
            '2026-08-29',

          biologicalSex:
            PatientBiologicalSex.MALE,

          age: {
            years:
              36,

            months:
              4,

            totalMonths:
              436,
          },

          population:
            'ADULT',

          hasBirthDate:
            true,

          hasBiologicalSex:
            true,
        });

        expect(
          result.calculations,
        ).toEqual([
          {
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
          },
        ]);
      },
    );

    it(
      'calculates Jackson-Pollock 3 body composition from repeated skinfold readings',
      () => {
        const result =
          service.build(
            createAssessment({
              skinfoldProtocol:
                SkinfoldProtocol.JACKSON_POLLOCK_3,

              skinfoldMeasurements: [
                {
                  id:
                    '1',

                  anthropometricAssessmentId:
                    '44444444-4444-4444-8444-444444444444',

                  site:
                    SkinfoldSite.CHEST,

                  side:
                    SkinfoldMeasurementSide.RIGHT,

                  readingNumber:
                    1,

                  valueMm:
                    10,

                  createdAt:
                    '2026-08-29T12:00:00.000Z',

                  updatedAt:
                    '2026-08-29T12:00:00.000Z',
                },
                {
                  id:
                    '2',

                  anthropometricAssessmentId:
                    '44444444-4444-4444-8444-444444444444',

                  site:
                    SkinfoldSite.CHEST,

                  side:
                    SkinfoldMeasurementSide.RIGHT,

                  readingNumber:
                    2,

                  valueMm:
                    12,

                  createdAt:
                    '2026-08-29T12:00:00.000Z',

                  updatedAt:
                    '2026-08-29T12:00:00.000Z',
                },
                {
                  id:
                    '3',

                  anthropometricAssessmentId:
                    '44444444-4444-4444-8444-444444444444',

                  site:
                    SkinfoldSite.ABDOMEN,

                  side:
                    SkinfoldMeasurementSide.RIGHT,

                  readingNumber:
                    1,

                  valueMm:
                    20,

                  createdAt:
                    '2026-08-29T12:00:00.000Z',

                  updatedAt:
                    '2026-08-29T12:00:00.000Z',
                },
                {
                  id:
                    '4',

                  anthropometricAssessmentId:
                    '44444444-4444-4444-8444-444444444444',

                  site:
                    SkinfoldSite.ABDOMEN,

                  side:
                    SkinfoldMeasurementSide.RIGHT,

                  readingNumber:
                    2,

                  valueMm:
                    22,

                  createdAt:
                    '2026-08-29T12:00:00.000Z',

                  updatedAt:
                    '2026-08-29T12:00:00.000Z',
                },
                {
                  id:
                    '5',

                  anthropometricAssessmentId:
                    '44444444-4444-4444-8444-444444444444',

                  site:
                    SkinfoldSite.THIGH,

                  side:
                    SkinfoldMeasurementSide.RIGHT,

                  readingNumber:
                    1,

                  valueMm:
                    30,

                  createdAt:
                    '2026-08-29T12:00:00.000Z',

                  updatedAt:
                    '2026-08-29T12:00:00.000Z',
                },
                {
                  id:
                    '6',

                  anthropometricAssessmentId:
                    '44444444-4444-4444-8444-444444444444',

                  site:
                    SkinfoldSite.THIGH,

                  side:
                    SkinfoldMeasurementSide.RIGHT,

                  readingNumber:
                    2,

                  valueMm:
                    32,

                  createdAt:
                    '2026-08-29T12:00:00.000Z',

                  updatedAt:
                    '2026-08-29T12:00:00.000Z',
                },
              ],
            }),

            createPatient(),
          );

        expect(
          result.calculations,
        ).toEqual([
          {
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
          },
          {
            code:
              'BODY_DENSITY',

            value:
              1.054382,

            unit:
              'g/mL',

            source:
              'HIGEIA_CALCULATION',

            method:
              'JACKSON_POLLOCK_3',
          },
          {
            code:
              'BODY_FAT_PERCENTAGE',

            value:
              19.47,

            unit:
              '%',

            source:
              'HIGEIA_CALCULATION',

            method:
              'SIRI',
          },
          {
            code:
              'FAT_MASS_KG',

            value:
              14.99,

            unit:
              'kg',

            source:
              'HIGEIA_CALCULATION',

            method:
              'WEIGHT_BODY_FAT_PERCENTAGE',
          },
          {
            code:
              'LEAN_MASS_KG',

            value:
              62.01,

            unit:
              'kg',

            source:
              'HIGEIA_CALCULATION',

            method:
              'WEIGHT_BODY_FAT_PERCENTAGE',
          },
        ]);
      },
    );

    it(
      'does not calculate Jackson-Pollock when required sites are missing',
      () => {
        const result =
          service.build(
            createAssessment({
              skinfoldProtocol:
                SkinfoldProtocol.JACKSON_POLLOCK_3,

              skinfoldMeasurements: [
                {
                  id:
                    '1',

                  anthropometricAssessmentId:
                    '44444444-4444-4444-8444-444444444444',

                  site:
                    SkinfoldSite.CHEST,

                  side:
                    SkinfoldMeasurementSide.RIGHT,

                  readingNumber:
                    1,

                  valueMm:
                    10,

                  createdAt:
                    '2026-08-29T12:00:00.000Z',

                  updatedAt:
                    '2026-08-29T12:00:00.000Z',
                },
              ],
            }),

            createPatient(),
          );

        expect(
          result.calculations,
        ).toHaveLength(
          1,
        );

        expect(
          result.calculations[0].code,
        ).toBe(
          'BMI',
        );
      },
    );

    it(
      'does not calculate Jackson-Pollock without birth date',
      () => {
        const result =
          service.build(
            createAssessment({
              skinfoldProtocol:
                SkinfoldProtocol.JACKSON_POLLOCK_3,
            }),

            createPatient({
              birthDate:
                null,
            }),
          );

        expect(
          result.clinicalContext.age,
        ).toBeNull();

        expect(
          result.calculations,
        ).toHaveLength(
          1,
        );
      },
    );

    it(
      'does not calculate BMI when weight is missing',
      () => {
        const result =
          service.build(
            createAssessment({
              weightKg:
                null,
            }),
            createPatient(),
          );

        expect(
          result.calculations,
        ).toEqual([]);
      },
    );

    it(
      'does not calculate BMI when height is missing',
      () => {
        const result =
          service.build(
            createAssessment({
              heightCm:
                null,
            }),
            createPatient(),
          );

        expect(
          result.calculations,
        ).toEqual([]);
      },
    );

    it(
      'builds clinical context without birth date',
      () => {
        const result =
          service.build(
            createAssessment(),
            createPatient({
              birthDate:
                null,
            }),
          );

        expect(
          result.clinicalContext.age,
        ).toBeNull();

        expect(
          result.clinicalContext.population,
        ).toBe(
          'UNKNOWN',
        );

        expect(
          result.calculations,
        ).toHaveLength(
          1,
        );

        expect(
          result.calculations[0].code,
        ).toBe(
          'BMI',
        );
      },
    );

    it(
      'uses the assessment date for historical clinical context',
      () => {
        const result =
          service.build(
            createAssessment({
              measuredAt:
                '2050-04-10',
            }),
            createPatient(),
          );

        expect(
          result.clinicalContext.age,
        ).toEqual({
          years:
            60,

          months:
            0,

          totalMonths:
            720,
        });

        expect(
          result.clinicalContext.population,
        ).toBe(
          'OLDER_ADULT',
        );
      },
    );
  },
);