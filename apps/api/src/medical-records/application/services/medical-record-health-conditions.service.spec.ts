import { randomUUID } from 'node:crypto';

import {
  HealthConditionStatus,
  MedicalRecordHealthCondition,
} from '../../domain/entities/medical-record-health-condition.entity';
import {
  MedicalRecord,
  MedicalRecordStatus,
} from '../../domain/entities/medical-record.entity';
import { MedicalRecordNotFoundError } from '../../domain/errors/medical-record-not-found.error';
import { InMemoryMedicalRecordHealthConditionsRepository } from '../../infrastructure/repositories/in-memory-medical-record-health-conditions.repository';
import { InMemoryMedicalRecordsRepository } from '../../infrastructure/repositories/in-memory-medical-records.repository';
import { MedicalRecordHealthConditionsService } from './medical-record-health-conditions.service';

describe(
  'MedicalRecordHealthConditionsService',
  () => {
    let healthConditionsRepository:
      InMemoryMedicalRecordHealthConditionsRepository;

    let medicalRecordsRepository:
      InMemoryMedicalRecordsRepository;

    let service:
      MedicalRecordHealthConditionsService;

    beforeEach(() => {
      healthConditionsRepository =
        new InMemoryMedicalRecordHealthConditionsRepository();

      medicalRecordsRepository =
        new InMemoryMedicalRecordsRepository();

      service =
        new MedicalRecordHealthConditionsService(
          healthConditionsRepository,
          medicalRecordsRepository,
        );
    });

    it(
      'creates a health condition for an existing medical record',
      async () => {
        const medicalRecord =
          createMedicalRecord();

        await medicalRecordsRepository.create(
          medicalRecord,
        );

        const result =
          await service.create(
            medicalRecord.patientId,
            medicalRecord.organizationId,
            {
              name:
                '  Hypertension  ',
              status:
                HealthConditionStatus.ACTIVE,
              diagnosedAt:
                '2025-01-10',
              notes:
                '  Controlled with medication.  ',
            },
          );

        expect(result).toMatchObject({
          organizationId:
            medicalRecord.organizationId,
          medicalRecordId:
            medicalRecord.id,
          patientId:
            medicalRecord.patientId,
          name:
            'Hypertension',
          status:
            HealthConditionStatus.ACTIVE,
          diagnosedAt:
            '2025-01-10',
          resolvedAt:
            null,
          notes:
            'Controlled with medication.',
        });

        expect(
          typeof result.id,
        ).toBe('string');
      },
    );

    it(
      'uses ACTIVE as the default status',
      async () => {
        const medicalRecord =
          createMedicalRecord();

        await medicalRecordsRepository.create(
          medicalRecord,
        );

        const result =
          await service.create(
            medicalRecord.patientId,
            medicalRecord.organizationId,
            {
              name:
                'Diabetes mellitus type 2',
            },
          );

        expect(
          result.status,
        ).toBe(
          HealthConditionStatus.ACTIVE,
        );
      },
    );

    it(
      'normalizes optional notes to null',
      async () => {
        const medicalRecord =
          createMedicalRecord();

        await medicalRecordsRepository.create(
          medicalRecord,
        );

        const result =
          await service.create(
            medicalRecord.patientId,
            medicalRecord.organizationId,
            {
              name:
                'Hypothyroidism',
              notes:
                '   ',
            },
          );

        expect(
          result.notes,
        ).toBeNull();
      },
    );

    it(
      'rejects creation when the medical record does not exist',
      async () => {
        await expect(
          service.create(
            randomUUID(),
            randomUUID(),
            {
              name:
                'Hypertension',
            },
          ),
        ).rejects.toBeInstanceOf(
          MedicalRecordNotFoundError,
        );
      },
    );

    it(
      'lists health conditions for a patient',
      async () => {
        const medicalRecord =
          createMedicalRecord();

        await medicalRecordsRepository.create(
          medicalRecord,
        );

        await service.create(
          medicalRecord.patientId,
          medicalRecord.organizationId,
          {
            name:
              'Hypertension',
          },
        );

        await service.create(
          medicalRecord.patientId,
          medicalRecord.organizationId,
          {
            name:
              'Hypercholesterolemia',
          },
        );

        const result =
          await service.listByPatient(
            medicalRecord.patientId,
            medicalRecord.organizationId,
          );

        expect(
          result,
        ).toHaveLength(2);

        expect(
          result.map(
            (condition) =>
              condition.name,
          ),
        ).toEqual(
          expect.arrayContaining([
            'Hypertension',
            'Hypercholesterolemia',
          ]),
        );
      },
    );

    it(
      'updates only supplied fields',
      async () => {
        jest.useFakeTimers();

        try {
          jest.setSystemTime(
            new Date(
              '2026-08-08T12:00:00.000Z',
            ),
          );

          const medicalRecord =
            createMedicalRecord();

          await medicalRecordsRepository.create(
            medicalRecord,
          );

          const created =
            await service.create(
              medicalRecord.patientId,
              medicalRecord.organizationId,
              {
                name:
                  'Hypertension',
                status:
                  HealthConditionStatus.ACTIVE,
                diagnosedAt:
                  '2024-05-01',
                notes:
                  'Initial notes.',
              },
            );

          jest.setSystemTime(
            new Date(
              '2026-08-08T12:05:00.000Z',
            ),
          );

          const updated =
            await service.update(
              medicalRecord.patientId,
              medicalRecord.organizationId,
              created.id,
              {
                status:
                  HealthConditionStatus.CONTROLLED,
                notes:
                  '  Condition controlled.  ',
              },
            );

          expect(updated).toMatchObject({
            id:
              created.id,
            name:
              'Hypertension',
            diagnosedAt:
              '2024-05-01',
            status:
              HealthConditionStatus.CONTROLLED,
            notes:
              'Condition controlled.',
          });

          expect(
            updated.updatedAt,
          ).toBe(
            '2026-08-08T12:05:00.000Z',
          );
        } finally {
          jest.useRealTimers();
        }
      },
    );

    it(
      'does not update a condition from another patient',
      async () => {
        const medicalRecord =
          createMedicalRecord();

        await medicalRecordsRepository.create(
          medicalRecord,
        );

        const created =
          await service.create(
            medicalRecord.patientId,
            medicalRecord.organizationId,
            {
              name:
                'Hypertension',
            },
          );

        await expect(
          service.update(
            randomUUID(),
            medicalRecord.organizationId,
            created.id,
            {
              status:
                HealthConditionStatus.RESOLVED,
            },
          ),
        ).rejects.toBeInstanceOf(
          MedicalRecordNotFoundError,
        );
      },
    );

    it(
      'does not expose a condition from another organization',
      async () => {
        const medicalRecord =
          createMedicalRecord();

        await medicalRecordsRepository.create(
          medicalRecord,
        );

        await service.create(
          medicalRecord.patientId,
          medicalRecord.organizationId,
          {
            name:
              'Hypertension',
          },
        );

        await expect(
          service.listByPatient(
            medicalRecord.patientId,
            randomUUID(),
          ),
        ).rejects.toBeInstanceOf(
          MedicalRecordNotFoundError,
        );
      },
    );

    it(
      'removes a health condition',
      async () => {
        const medicalRecord =
          createMedicalRecord();

        await medicalRecordsRepository.create(
          medicalRecord,
        );

        const created =
          await service.create(
            medicalRecord.patientId,
            medicalRecord.organizationId,
            {
              name:
                'Hypertension',
            },
          );

        await service.remove(
          medicalRecord.patientId,
          medicalRecord.organizationId,
          created.id,
        );

        const conditions =
          await service.listByPatient(
            medicalRecord.patientId,
            medicalRecord.organizationId,
          );

        expect(
          conditions,
        ).toHaveLength(0);
      },
    );

    it(
      'does not remove a condition from another patient',
      async () => {
        const medicalRecord =
          createMedicalRecord();

        await medicalRecordsRepository.create(
          medicalRecord,
        );

        const created =
          await service.create(
            medicalRecord.patientId,
            medicalRecord.organizationId,
            {
              name:
                'Hypertension',
            },
          );

        await expect(
          service.remove(
            randomUUID(),
            medicalRecord.organizationId,
            created.id,
          ),
        ).rejects.toBeInstanceOf(
          MedicalRecordNotFoundError,
        );
      },
    );

    function createMedicalRecord(
      overrides:
        Partial<MedicalRecord> = {},
    ): MedicalRecord {
      const timestamp =
        '2026-08-08T12:00:00.000Z';

      return {
        id:
          randomUUID(),
        organizationId:
          randomUUID(),
        patientId:
          randomUUID(),
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
          MedicalRecordStatus.ACTIVE,
        createdAt:
          timestamp,
        updatedAt:
          timestamp,
        ...overrides,
      };
    }

    function createHealthCondition(
      overrides:
        Partial<MedicalRecordHealthCondition> = {},
    ): MedicalRecordHealthCondition {
      const timestamp =
        '2026-08-08T12:00:00.000Z';

      return {
        id:
          randomUUID(),
        organizationId:
          randomUUID(),
        medicalRecordId:
          randomUUID(),
        patientId:
          randomUUID(),
        name:
          'Hypertension',
        status:
          HealthConditionStatus.ACTIVE,
        diagnosedAt:
          null,
        resolvedAt:
          null,
        notes:
          null,
        createdAt:
          timestamp,
        updatedAt:
          timestamp,
        ...overrides,
      };
    }
  },
);