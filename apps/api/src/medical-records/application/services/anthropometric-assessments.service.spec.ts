import {
  BadRequestException,
} from '@nestjs/common';

import {
  AnthropometricAssessment,
  BodyCompositionMethod,
  SkinfoldMeasurementSide,
  SkinfoldProtocol,
  SkinfoldSite,
} from '../../domain/entities/anthropometric-assessment.entity';

import {
  MedicalRecordNotFoundError,
} from '../../domain/errors/medical-record-not-found.error';

import {
  Patient,
  PatientBiologicalSex,
  PatientStatus,
} from '../../../patients/domain/entities/patient.entity';

import {
  PatientNotFoundError,
} from '../../../patients/domain/errors/patient-not-found.error';

import {
  PatientsRepository,
} from '../../../patients/domain/repositories/patients.repository';

import {
  AnthropometricAssessmentsRepository,
} from '../../domain/repositories/anthropometric-assessments.repository';

import {
  MedicalRecordsRepository,
} from '../../domain/repositories/medical-records.repository';

import {
  AnthropometricAssessmentsService,
} from './anthropometric-assessments.service';

describe(
  'AnthropometricAssessmentsService',
  () => {
    let service:
      AnthropometricAssessmentsService;

    let anthropometricAssessmentsRepository:
      jest.Mocked<AnthropometricAssessmentsRepository>;

    let medicalRecordsRepository:
      jest.Mocked<MedicalRecordsRepository>;

    let patientsRepository:
      jest.Mocked<PatientsRepository>;

    const organizationId =
      '11111111-1111-4111-8111-111111111111';

    const patientId =
      '22222222-2222-4222-8222-222222222222';

    const medicalRecordId =
      '33333333-3333-4333-8333-333333333333';

    const assessmentId =
      '44444444-4444-4444-8444-444444444444';

    const createPatient =
      (
        overrides:
          Partial<Patient> = {},
      ): Patient => ({
        id:
          patientId,

        organizationId,

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

    beforeEach(() => {
      anthropometricAssessmentsRepository = {
        create:
          jest.fn(),

        findById:
          jest.fn(),

        listByMedicalRecordId:
          jest.fn(),

        update:
          jest.fn(),

        delete:
          jest.fn(),
      };

      medicalRecordsRepository = {
        create:
          jest.fn(),

        findById:
          jest.fn(),

        findByPatientId:
          jest.fn(),

        update:
          jest.fn(),

        updateStatus:
          jest.fn(),
      } as unknown as jest.Mocked<
        MedicalRecordsRepository
      >;

      medicalRecordsRepository
        .findByPatientId
        .mockResolvedValue(
          createMedicalRecord(),
        );

      patientsRepository = {
        create:
          jest.fn(),

        listByOrganization:
          jest.fn(),

        findById:
          jest.fn(),

        findByEmail:
          jest.fn(),

        findByCpf:
          jest.fn(),

        update:
          jest.fn(),
      } as unknown as jest.Mocked<
        PatientsRepository
      >;


      patientsRepository
        .findById
        .mockResolvedValue(
          createPatient(),
        );

      service =
        new AnthropometricAssessmentsService(
          anthropometricAssessmentsRepository,
          medicalRecordsRepository,
          patientsRepository,
        );
    });

    it(
      'builds clinical context from patient data',
      async () => {
        const result =
          await service.getClinicalContext(
            patientId,
            organizationId,
            '2026-08-29',
          );

        expect(
          patientsRepository.findById,
        ).toHaveBeenCalledWith(
          organizationId,
          patientId,
        );

        expect(result).toEqual({
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
      },
    );

    it(
      'builds unknown population when birth date is missing',
      async () => {
        patientsRepository
          .findById
          .mockResolvedValue(
            createPatient({
              birthDate:
                null,
            }),
          );

        const result =
          await service.getClinicalContext(
            patientId,
            organizationId,
            '2026-08-29',
          );

        expect(result.age).toBeNull();

        expect(
          result.population,
        ).toBe(
          'UNKNOWN',
        );

        expect(
          result.biologicalSex,
        ).toBe(
          PatientBiologicalSex.MALE,
        );

        expect(
          result.hasBirthDate,
        ).toBe(
          false,
        );

        expect(
          result.hasBiologicalSex,
        ).toBe(
          true,
        );
      },
    );

    it(
      'keeps age and population when biological sex is missing',
      async () => {
        patientsRepository
          .findById
          .mockResolvedValue(
            createPatient({
              biologicalSex:
                null,
            }),
          );

        const result =
          await service.getClinicalContext(
            patientId,
            organizationId,
            '2026-08-29',
          );

        expect(result.age).toEqual({
          years:
            36,

          months:
            4,

          totalMonths:
            436,
        });

        expect(
          result.population,
        ).toBe(
          'ADULT',
        );

        expect(
          result.biologicalSex,
        ).toBeNull();

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
      },
    );

    it(
      'throws when patient does not exist while building clinical context',
      async () => {
        patientsRepository
          .findById
          .mockResolvedValue(
            null,
          );

        await expect(
          service.getClinicalContext(
            patientId,
            organizationId,
            '2026-08-29',
          ),
        ).rejects.toBeInstanceOf(
          PatientNotFoundError,
        );
      },
    );

    it(
      'creates an anthropometric assessment',
      async () => {
        anthropometricAssessmentsRepository
          .create
          .mockImplementation(
            async (
              assessment,
            ) =>
              assessment,
          );

        const result =
          await service.create(
            patientId,
            organizationId,
            {
              measuredAt:
                '2026-08-29',

              weightKg:
                76.5,

              heightCm:
                170,

              waistCircumferenceCm:
                83,

              hipCircumferenceCm:
                88.5,

              notes:
                ' Avaliação inicial ',
            },
          );

        expect(
          result.organizationId,
        ).toBe(
          organizationId,
        );

        expect(
          result.medicalRecordId,
        ).toBe(
          medicalRecordId,
        );

        expect(
          result.patientId,
        ).toBe(
          patientId,
        );

        expect(
          result.measuredAt,
        ).toBe(
          '2026-08-29',
        );

        expect(
          result.weightKg,
        ).toBe(
          76.5,
        );

        expect(
          result.heightCm,
        ).toBe(
          170,
        );

        expect(
          result.notes,
        ).toBe(
          'Avaliação inicial',
        );

        expect(
          result.skinfoldMeasurements,
        ).toEqual(
          [],
        );

        expect(
          anthropometricAssessmentsRepository.create,
        ).toHaveBeenCalledTimes(
          1,
        );
      },
    );

    it(
      'creates an assessment with skinfold measurements',
      async () => {
        anthropometricAssessmentsRepository
          .create
          .mockImplementation(
            async (
              assessment,
            ) =>
              assessment,
          );

        const result =
          await service.create(
            patientId,
            organizationId,
            {
              measuredAt:
                '2026-08-29',

              weightKg:
                76.5,

              bodyCompositionMethod:
                BodyCompositionMethod.SKINFOLD,

              skinfoldProtocol:
                SkinfoldProtocol.JACKSON_POLLOCK_7,

              skinfoldMeasurements: [
                {
                  site:
                    SkinfoldSite.CHEST,

                  readingNumber:
                    1,

                  valueMm:
                    10.2,
                },
                {
                  site:
                    SkinfoldSite.MIDAXILLARY,

                  readingNumber:
                    1,

                  valueMm:
                    11.5,
                },
                {
                  site:
                    SkinfoldSite.TRICEPS,

                  readingNumber:
                    1,

                  valueMm:
                    12.3,
                },
                {
                  site:
                    SkinfoldSite.SUBSCAPULAR,

                  readingNumber:
                    1,

                  valueMm:
                    14.1,
                },
                {
                  site:
                    SkinfoldSite.ABDOMEN,

                  readingNumber:
                    1,

                  valueMm:
                    18.4,
                },
                {
                  site:
                    SkinfoldSite.SUPRAILIAC,

                  readingNumber:
                    1,

                  valueMm:
                    13.2,
                },
                {
                  site:
                    SkinfoldSite.THIGH,

                  readingNumber:
                    1,

                  valueMm:
                    16.7,
                },
              ],
            },
          );

        expect(
          result.skinfoldProtocol,
        ).toBe(
          SkinfoldProtocol.JACKSON_POLLOCK_7,
        );

        expect(
          result.bodyCompositionMethod,
        ).toBe(
          BodyCompositionMethod.SKINFOLD,
        );

        expect(
          result.skinfoldMeasurements,
        ).toHaveLength(
          7,
        );

        expect(
          result.skinfoldMeasurements[0]
            .side,
        ).toBe(
          SkinfoldMeasurementSide.RIGHT,
        );

        expect(
          result.skinfoldMeasurements[0]
            .anthropometricAssessmentId,
        ).toBe(
          result.id,
        );

        expect(
          result.skinfoldMeasurements[0]
            .valueMm,
        ).toBe(
          10.2,
        );
      },
    );

    it(
      'allows multiple readings for the same skinfold site',
      async () => {
        anthropometricAssessmentsRepository
          .create
          .mockImplementation(
            async (
              assessment,
            ) =>
              assessment,
          );

        const result =
          await service.create(
            patientId,
            organizationId,
            {
              measuredAt:
                '2026-08-29',

              skinfoldProtocol:
                SkinfoldProtocol.OTHER,

              skinfoldMeasurements: [
                {
                  site:
                    SkinfoldSite.TRICEPS,

                  readingNumber:
                    1,

                  valueMm:
                    12,
                },
                {
                  site:
                    SkinfoldSite.TRICEPS,

                  readingNumber:
                    2,

                  valueMm:
                    12.4,
                },
                {
                  site:
                    SkinfoldSite.TRICEPS,

                  readingNumber:
                    3,

                  valueMm:
                    12.2,
                },
              ],
            },
          );

        expect(
          result.skinfoldMeasurements,
        ).toHaveLength(
          3,
        );

        expect(
          result.skinfoldMeasurements.map(
            (
              measurement,
            ) =>
              measurement.readingNumber,
          ),
        ).toEqual([
          1,
          2,
          3,
        ]);
      },
    );

    it(
      'rejects an assessment without measurements',
      async () => {
        await expect(
          service.create(
            patientId,
            organizationId,
            {
              measuredAt:
                '2026-08-29',
            },
          ),
        ).rejects.toBeInstanceOf(
          BadRequestException,
        );

        expect(
          anthropometricAssessmentsRepository.create,
        ).not.toHaveBeenCalled();
      },
    );

    it(
      'rejects invalid positive measurements',
      async () => {
        await expect(
          service.create(
            patientId,
            organizationId,
            {
              measuredAt:
                '2026-08-29',

              weightKg:
                0,
            },
          ),
        ).rejects.toBeInstanceOf(
          BadRequestException,
        );

        await expect(
          service.create(
            patientId,
            organizationId,
            {
              measuredAt:
                '2026-08-29',

              heightCm:
                -170,
            },
          ),
        ).rejects.toBeInstanceOf(
          BadRequestException,
        );

        await expect(
          service.create(
            patientId,
            organizationId,
            {
              measuredAt:
                '2026-08-29',

              waistCircumferenceCm:
                0,
            },
          ),
        ).rejects.toBeInstanceOf(
          BadRequestException,
        );
      },
    );

    it(
      'rejects invalid body fat percentages',
      async () => {
        await expect(
          service.create(
            patientId,
            organizationId,
            {
              measuredAt:
                '2026-08-29',

              bodyFatPercentage:
                -1,
            },
          ),
        ).rejects.toBeInstanceOf(
          BadRequestException,
        );

        await expect(
          service.create(
            patientId,
            organizationId,
            {
              measuredAt:
                '2026-08-29',

              bodyFatPercentage:
                101,
            },
          ),
        ).rejects.toBeInstanceOf(
          BadRequestException,
        );
      },
    );

    it(
      'rejects body composition masses greater than body weight',
      async () => {
        await expect(
          service.create(
            patientId,
            organizationId,
            {
              measuredAt:
                '2026-08-29',

              weightKg:
                70,

              fatMassKg:
                71,
            },
          ),
        ).rejects.toBeInstanceOf(
          BadRequestException,
        );

        await expect(
          service.create(
            patientId,
            organizationId,
            {
              measuredAt:
                '2026-08-29',

              weightKg:
                70,

              leanMassKg:
                71,
            },
          ),
        ).rejects.toBeInstanceOf(
          BadRequestException,
        );

        await expect(
          service.create(
            patientId,
            organizationId,
            {
              measuredAt:
                '2026-08-29',

              weightKg:
                70,

              muscleMassKg:
                71,
            },
          ),
        ).rejects.toBeInstanceOf(
          BadRequestException,
        );
      },
    );

    it(
      'rejects a non-positive skinfold measurement',
      async () => {
        await expect(
          service.create(
            patientId,
            organizationId,
            {
              measuredAt:
                '2026-08-29',

              skinfoldProtocol:
                SkinfoldProtocol.OTHER,

              skinfoldMeasurements: [
                {
                  site:
                    SkinfoldSite.TRICEPS,

                  readingNumber:
                    1,

                  valueMm:
                    0,
                },
              ],
            },
          ),
        ).rejects.toBeInstanceOf(
          BadRequestException,
        );
      },
    );

    it(
      'rejects an invalid skinfold reading number',
      async () => {
        await expect(
          service.create(
            patientId,
            organizationId,
            {
              measuredAt:
                '2026-08-29',

              skinfoldProtocol:
                SkinfoldProtocol.OTHER,

              skinfoldMeasurements: [
                {
                  site:
                    SkinfoldSite.TRICEPS,

                  readingNumber:
                    0,

                  valueMm:
                    12,
                },
              ],
            },
          ),
        ).rejects.toBeInstanceOf(
          BadRequestException,
        );

        await expect(
          service.create(
            patientId,
            organizationId,
            {
              measuredAt:
                '2026-08-29',

              skinfoldProtocol:
                SkinfoldProtocol.OTHER,

              skinfoldMeasurements: [
                {
                  site:
                    SkinfoldSite.TRICEPS,

                  readingNumber:
                    1.5,

                  valueMm:
                    12,
                },
              ],
            },
          ),
        ).rejects.toBeInstanceOf(
          BadRequestException,
        );
      },
    );

    it(
      'rejects duplicate skinfold measurements',
      async () => {
        await expect(
          service.create(
            patientId,
            organizationId,
            {
              measuredAt:
                '2026-08-29',

              skinfoldProtocol:
                SkinfoldProtocol.OTHER,

              skinfoldMeasurements: [
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
                    SkinfoldSite.TRICEPS,

                  side:
                    SkinfoldMeasurementSide.RIGHT,

                  readingNumber:
                    1,

                  valueMm:
                    12.2,
                },
              ],
            },
          ),
        ).rejects.toBeInstanceOf(
          BadRequestException,
        );
      },
    );

    it(
      'allows the same site and reading number on different sides',
      async () => {
        anthropometricAssessmentsRepository
          .create
          .mockImplementation(
            async (
              assessment,
            ) =>
              assessment,
          );

        const result =
          await service.create(
            patientId,
            organizationId,
            {
              measuredAt:
                '2026-08-29',

              skinfoldProtocol:
                SkinfoldProtocol.OTHER,

              skinfoldMeasurements: [
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
                    SkinfoldSite.TRICEPS,

                  side:
                    SkinfoldMeasurementSide.LEFT,

                  readingNumber:
                    1,

                  valueMm:
                    12.4,
                },
              ],
            },
          );

        expect(
          result.skinfoldMeasurements,
        ).toHaveLength(
          2,
        );
      },
    );

    it(
      'requires a protocol when skinfold measurements are provided',
      async () => {
        await expect(
          service.create(
            patientId,
            organizationId,
            {
              measuredAt:
                '2026-08-29',

              skinfoldMeasurements: [
                {
                  site:
                    SkinfoldSite.TRICEPS,

                  readingNumber:
                    1,

                  valueMm:
                    12,
                },
              ],
            },
          ),
        ).rejects.toBeInstanceOf(
          BadRequestException,
        );
      },
    );

    it(
      'requires a skinfold measurement when a protocol is provided',
      async () => {
        await expect(
          service.create(
            patientId,
            organizationId,
            {
              measuredAt:
                '2026-08-29',

              weightKg:
                76,

              skinfoldProtocol:
                SkinfoldProtocol.JACKSON_POLLOCK_7,
            },
          ),
        ).rejects.toBeInstanceOf(
          BadRequestException,
        );
      },
    );

    it(
      'lists assessments from the patient medical record',
      async () => {
        const assessment =
          createAssessment();

        anthropometricAssessmentsRepository
          .listByMedicalRecordId
          .mockResolvedValue([
            assessment,
          ]);

        const result =
          await service.listByPatient(
            patientId,
            organizationId,
          );

        expect(
          result,
        ).toEqual([
          assessment,
        ]);

        expect(
          anthropometricAssessmentsRepository.listByMedicalRecordId,
        ).toHaveBeenCalledWith(
          organizationId,
          medicalRecordId,
        );
      },
    );

    it(
      'finds an assessment by id',
      async () => {
        const assessment =
          createAssessment();

        anthropometricAssessmentsRepository
          .findById
          .mockResolvedValue(
            assessment,
          );

        const result =
          await service.findById(
            patientId,
            organizationId,
            assessment.id,
          );

        expect(
          result,
        ).toEqual(
          assessment,
        );

        expect(
          anthropometricAssessmentsRepository.findById,
        ).toHaveBeenCalledWith(
          organizationId,
          assessment.id,
        );
      },
    );

    it(
      'does not return an assessment from another patient',
      async () => {
        anthropometricAssessmentsRepository
          .findById
          .mockResolvedValue({
            ...createAssessment(),

            patientId:
              '55555555-5555-4555-8555-555555555555',
          });

        await expect(
          service.findById(
            patientId,
            organizationId,
            assessmentId,
          ),
        ).rejects.toBeInstanceOf(
          MedicalRecordNotFoundError,
        );
      },
    );

    it(
      'returns calculated anthropometric results',
      async () => {
        const assessment = {
          ...createAssessment(),

          weightKg:
            77,

          heightCm:
            170,

          measuredAt:
            '2026-08-29',
        };

        anthropometricAssessmentsRepository
          .findById
          .mockResolvedValue(
            assessment,
          );

        const result =
          await service.getResults(
            patientId,
            organizationId,
            assessment.id,
          );

        expect(
          patientsRepository.findById,
        ).toHaveBeenCalledWith(
          organizationId,
          patientId,
        );

        expect(
          result.assessment,
        ).toEqual(
          assessment,
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
      'returns anthropometric results without BMI when required measurements are missing',
      async () => {
        const assessment = {
          ...createAssessment(),

          weightKg:
            77,

          heightCm:
            null,
        };

        anthropometricAssessmentsRepository
          .findById
          .mockResolvedValue(
            assessment,
          );

        const result =
          await service.getResults(
            patientId,
            organizationId,
            assessment.id,
          );

        expect(
          result.assessment,
        ).toEqual(
          assessment,
        );

        expect(
          result.calculations,
        ).toEqual([]);
      },
    );

    it(
      'throws when patient does not exist while getting anthropometric results',
      async () => {
        const assessment =
          createAssessment();

        anthropometricAssessmentsRepository
          .findById
          .mockResolvedValue(
            assessment,
          );

        patientsRepository
          .findById
          .mockResolvedValue(
            null,
          );

        await expect(
          service.getResults(
            patientId,
            organizationId,
            assessment.id,
          ),
        ).rejects.toBeInstanceOf(
          PatientNotFoundError,
        );
      },
    );

    it(
      'updates an anthropometric assessment',
      async () => {
        const assessment =
          createAssessment();

        anthropometricAssessmentsRepository
          .findById
          .mockResolvedValue(
            assessment,
          );

        anthropometricAssessmentsRepository
          .update
          .mockImplementation(
            async (
              updated,
            ) =>
              updated,
          );

        const result =
          await service.update(
            patientId,
            organizationId,
            assessment.id,
            {
              weightKg:
                75.8,

              waistCircumferenceCm:
                81.5,

              notes:
                ' Evolução positiva ',
            },
          );

        expect(
          result.weightKg,
        ).toBe(
          75.8,
        );

        expect(
          result.waistCircumferenceCm,
        ).toBe(
          81.5,
        );

        expect(
          result.heightCm,
        ).toBe(
          assessment.heightCm,
        );

        expect(
          result.notes,
        ).toBe(
          'Evolução positiva',
        );

        expect(
          anthropometricAssessmentsRepository.update,
        ).toHaveBeenCalledTimes(
          1,
        );
      },
    );

    it(
      'replaces skinfold measurements during update',
      async () => {
        const assessment =
          createAssessment();

        anthropometricAssessmentsRepository
          .findById
          .mockResolvedValue(
            assessment,
          );

        anthropometricAssessmentsRepository
          .update
          .mockImplementation(
            async (
              updated,
            ) =>
              updated,
          );

        const result =
          await service.update(
            patientId,
            organizationId,
            assessment.id,
            {
              skinfoldProtocol:
                SkinfoldProtocol.OTHER,

              skinfoldMeasurements: [
                {
                  site:
                    SkinfoldSite.TRICEPS,

                  readingNumber:
                    1,

                  valueMm:
                    11.8,
                },
                {
                  site:
                    SkinfoldSite.TRICEPS,

                  readingNumber:
                    2,

                  valueMm:
                    12,
                },
              ],
            },
          );

        expect(
          result.skinfoldMeasurements,
        ).toHaveLength(
          2,
        );

        expect(
          result.skinfoldMeasurements[0]
            .anthropometricAssessmentId,
        ).toBe(
          assessment.id,
        );

        expect(
          result.skinfoldMeasurements[0]
            .valueMm,
        ).toBe(
          11.8,
        );
      },
    );

    it(
      'does not update an assessment from another patient',
      async () => {
        anthropometricAssessmentsRepository
          .findById
          .mockResolvedValue({
            ...createAssessment(),

            patientId:
              '55555555-5555-4555-8555-555555555555',
          });

        await expect(
          service.update(
            patientId,
            organizationId,
            assessmentId,
            {
              weightKg:
                75,
            },
          ),
        ).rejects.toBeInstanceOf(
          MedicalRecordNotFoundError,
        );

        expect(
          anthropometricAssessmentsRepository.update,
        ).not.toHaveBeenCalled();
      },
    );

    it(
      'removes an anthropometric assessment',
      async () => {
        const assessment =
          createAssessment();

        anthropometricAssessmentsRepository
          .findById
          .mockResolvedValue(
            assessment,
          );

        await service.remove(
          patientId,
          organizationId,
          assessment.id,
        );

        expect(
          anthropometricAssessmentsRepository.delete,
        ).toHaveBeenCalledWith(
          organizationId,
          assessment.id,
        );
      },
    );

    it(
      'does not remove an assessment from another patient',
      async () => {
        anthropometricAssessmentsRepository
          .findById
          .mockResolvedValue({
            ...createAssessment(),

            patientId:
              '55555555-5555-4555-8555-555555555555',
          });

        await expect(
          service.remove(
            patientId,
            organizationId,
            assessmentId,
          ),
        ).rejects.toBeInstanceOf(
          MedicalRecordNotFoundError,
        );

        expect(
          anthropometricAssessmentsRepository.delete,
        ).not.toHaveBeenCalled();
      },
    );

    it(
      'throws when the patient medical record does not exist',
      async () => {
        medicalRecordsRepository
          .findByPatientId
          .mockResolvedValue(
            null,
          );

        await expect(
          service.listByPatient(
            patientId,
            organizationId,
          ),
        ).rejects.toBeInstanceOf(
          MedicalRecordNotFoundError,
        );
      },
    );

    function createMedicalRecord() {
      return {
        id:
          medicalRecordId,

        organizationId,

        patientId,

        chiefComplaint:
          null,

        clinicalHistory:
          null,

        familyHistory:
          null,

        allergies:
          null,

        currentMedications:
          null,

        healthConditions:
          null,

        clinicalNotes:
          null,

        treatmentGoals:
          null,

        status:
          'ACTIVE',

        createdAt:
          '2026-08-29T00:00:00.000Z',

        updatedAt:
          '2026-08-29T00:00:00.000Z',
      } as any;
    }

    function createAssessment():
      AnthropometricAssessment {
      return {
        id:
          assessmentId,

        organizationId,

        medicalRecordId,

        patientId,

        measuredAt:
          '2026-08-29',

        weightKg:
          76.5,

        heightCm:
          170,

        bodyFatPercentage:
          19.1,

        fatMassKg:
          14.61,

        leanMassKg:
          61.89,

        muscleMassKg:
          null,

        waistCircumferenceCm:
          83,

        hipCircumferenceCm:
          88.5,

        abdomenCircumferenceCm:
          null,

        chestCircumferenceCm:
          101,

        armCircumferenceCm:
          null,

        thighCircumferenceCm:
          null,

        calfCircumferenceCm:
          null,

        bodyCompositionMethod:
          BodyCompositionMethod.BIOIMPEDANCE,

        skinfoldProtocol:
          null,

        skinfoldMeasurements:
          [],

        notes:
          null,

        createdAt:
          '2026-08-29T00:00:00.000Z',

        updatedAt:
          '2026-08-29T00:00:00.000Z',
      };
    }
  },
);