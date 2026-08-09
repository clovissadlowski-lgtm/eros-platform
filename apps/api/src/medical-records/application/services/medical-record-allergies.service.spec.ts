import { randomUUID } from 'node:crypto';

import {
  AllergySeverity,
  AllergyStatus,
  AllergyType,
} from '../../domain/entities/medical-record-allergy.entity';
import {
  MedicalRecord,
  MedicalRecordStatus,
} from '../../domain/entities/medical-record.entity';
import { MedicalRecordNotFoundError } from '../../domain/errors/medical-record-not-found.error';
import { InMemoryMedicalRecordAllergiesRepository } from '../../infrastructure/repositories/in-memory-medical-record-allergies.repository';
import { InMemoryMedicalRecordsRepository } from '../../infrastructure/repositories/in-memory-medical-records.repository';
import { MedicalRecordAllergiesService } from './medical-record-allergies.service';

describe(
  'MedicalRecordAllergiesService',
  () => {
    let allergiesRepository:
      InMemoryMedicalRecordAllergiesRepository;

    let medicalRecordsRepository:
      InMemoryMedicalRecordsRepository;

    let service:
      MedicalRecordAllergiesService;

    beforeEach(() => {
      allergiesRepository =
        new InMemoryMedicalRecordAllergiesRepository();

      medicalRecordsRepository =
        new InMemoryMedicalRecordsRepository();

      service =
        new MedicalRecordAllergiesService(
          allergiesRepository,
          medicalRecordsRepository,
        );
    });

    it(
      'creates an allergy for an existing medical record',
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
              substance:
                '  Dipirona  ',
              type:
                AllergyType.MEDICATION,
              reaction:
                '  Urticária  ',
              severity:
                AllergySeverity.MODERATE,
              identifiedAt:
                '2024-05-10',
              notes:
                '  Reação após administração.  ',
            },
          );

        expect(result).toMatchObject({
          organizationId:
            medicalRecord.organizationId,
          medicalRecordId:
            medicalRecord.id,
          patientId:
            medicalRecord.patientId,

          substance:
            'Dipirona',

          type:
            AllergyType.MEDICATION,

          reaction:
            'Urticária',

          severity:
            AllergySeverity.MODERATE,

          status:
            AllergyStatus.ACTIVE,

          identifiedAt:
            '2024-05-10',

          notes:
            'Reação após administração.',
        });

        expect(
          typeof result.id,
        ).toBe('string');
      },
    );

    it(
      'uses ACTIVE as default status',
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
              substance:
                'Lactose',
              type:
                AllergyType.FOOD,
            },
          );

        expect(
          result.status,
        ).toBe(
          AllergyStatus.ACTIVE,
        );
      },
    );

    it(
      'normalizes optional empty fields to null',
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
              substance:
                'Lactose',
              type:
                AllergyType.FOOD,
              reaction:
                '   ',
              notes:
                '   ',
              identifiedAt:
                '   ',
            },
          );

        expect(
          result.reaction,
        ).toBeNull();

        expect(
          result.severity,
        ).toBeNull();

        expect(
          result.notes,
        ).toBeNull();

        expect(
          result.identifiedAt,
        ).toBeNull();
      },
    );

    it(
      'rejects creation without an existing medical record',
      async () => {
        await expect(
          service.create(
            randomUUID(),
            randomUUID(),
            {
              substance:
                'Dipirona',
              type:
                AllergyType.MEDICATION,
            },
          ),
        ).rejects.toBeInstanceOf(
          MedicalRecordNotFoundError,
        );
      },
    );

    it(
      'lists allergies for a patient',
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
            substance:
              'Dipirona',
            type:
              AllergyType.MEDICATION,
          },
        );

        await service.create(
          medicalRecord.patientId,
          medicalRecord.organizationId,
          {
            substance:
              'Lactose',
            type:
              AllergyType.FOOD,
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
            (allergy) =>
              allergy.substance,
          ),
        ).toEqual(
          expect.arrayContaining([
            'Dipirona',
            'Lactose',
          ]),
        );
      },
    );

    it(
      'updates only supplied allergy fields',
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
                substance:
                  'Dipirona',
                type:
                  AllergyType.MEDICATION,
                reaction:
                  'Urticária',
                severity:
                  AllergySeverity.MODERATE,
                status:
                  AllergyStatus.ACTIVE,
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
                severity:
                  AllergySeverity.SEVERE,
                status:
                  AllergyStatus.RESOLVED,
                notes:
                  '  Condição reavaliada.  ',
              },
            );

          expect(updated).toMatchObject({
            id:
              created.id,

            substance:
              'Dipirona',

            type:
              AllergyType.MEDICATION,

            reaction:
              'Urticária',

            severity:
              AllergySeverity.SEVERE,

            status:
              AllergyStatus.RESOLVED,

            notes:
              'Condição reavaliada.',
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
      'does not update allergy from another patient',
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
              substance:
                'Dipirona',
              type:
                AllergyType.MEDICATION,
            },
          );

        await expect(
          service.update(
            randomUUID(),
            medicalRecord.organizationId,
            created.id,
            {
              status:
                AllergyStatus.RESOLVED,
            },
          ),
        ).rejects.toBeInstanceOf(
          MedicalRecordNotFoundError,
        );
      },
    );

    it(
      'does not expose allergies from another organization',
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
            substance:
              'Dipirona',
            type:
              AllergyType.MEDICATION,
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
      'removes an allergy',
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
              substance:
                'Dipirona',
              type:
                AllergyType.MEDICATION,
            },
          );

        await service.remove(
          medicalRecord.patientId,
          medicalRecord.organizationId,
          created.id,
        );

        const result =
          await service.listByPatient(
            medicalRecord.patientId,
            medicalRecord.organizationId,
          );

        expect(
          result,
        ).toHaveLength(0);
      },
    );

    it(
      'does not remove allergy from another patient',
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
              substance:
                'Dipirona',
              type:
                AllergyType.MEDICATION,
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
  },
);