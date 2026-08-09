import { randomUUID } from 'node:crypto';

import {
  MedicationRoute,
  MedicationStatus,
} from '../../domain/entities/medical-record-medication.entity';
import {
  MedicalRecord,
  MedicalRecordStatus,
} from '../../domain/entities/medical-record.entity';
import { MedicalRecordNotFoundError } from '../../domain/errors/medical-record-not-found.error';
import { InMemoryMedicalRecordMedicationsRepository } from '../../infrastructure/repositories/in-memory-medical-record-medications.repository';
import { InMemoryMedicalRecordsRepository } from '../../infrastructure/repositories/in-memory-medical-records.repository';
import { MedicalRecordMedicationsService } from './medical-record-medications.service';

describe(
  'MedicalRecordMedicationsService',
  () => {
    let medicationsRepository:
      InMemoryMedicalRecordMedicationsRepository;

    let medicalRecordsRepository:
      InMemoryMedicalRecordsRepository;

    let service:
      MedicalRecordMedicationsService;

    beforeEach(() => {
      medicationsRepository =
        new InMemoryMedicalRecordMedicationsRepository();

      medicalRecordsRepository =
        new InMemoryMedicalRecordsRepository();

      service =
        new MedicalRecordMedicationsService(
          medicationsRepository,
          medicalRecordsRepository,
        );
    });

    it(
      'creates a medication for an existing medical record',
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
                '  Losartana  ',
              dosage:
                '  50 mg  ',
              frequency:
                '  1x ao dia  ',
              route:
                MedicationRoute.ORAL,
              indication:
                '  Hipertensão arterial  ',
              startedAt:
                '2025-01-10',
              notes:
                '  Uso contínuo.  ',
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
            'Losartana',
          dosage:
            '50 mg',
          frequency:
            '1x ao dia',
          route:
            MedicationRoute.ORAL,
          indication:
            'Hipertensão arterial',
          startedAt:
            '2025-01-10',
          endedAt:
            null,
          status:
            MedicationStatus.ACTIVE,
          notes:
            'Uso contínuo.',
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
              name:
                'Metformina',
            },
          );

        expect(
          result.status,
        ).toBe(
          MedicationStatus.ACTIVE,
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
              name:
                'Metformina',
              dosage:
                '   ',
              frequency:
                '   ',
              indication:
                '   ',
              notes:
                '   ',
            },
          );

        expect(
          result.dosage,
        ).toBeNull();

        expect(
          result.frequency,
        ).toBeNull();

        expect(
          result.indication,
        ).toBeNull();

        expect(
          result.notes,
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
              name:
                'Losartana',
            },
          ),
        ).rejects.toBeInstanceOf(
          MedicalRecordNotFoundError,
        );
      },
    );

    it(
      'lists medications for a patient',
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
              'Losartana',
          },
        );

        await service.create(
          medicalRecord.patientId,
          medicalRecord.organizationId,
          {
            name:
              'Metformina',
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
            (medication) =>
              medication.name,
          ),
        ).toEqual(
          expect.arrayContaining([
            'Losartana',
            'Metformina',
          ]),
        );
      },
    );

    it(
      'updates only supplied medication fields',
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
                  'Losartana',
                dosage:
                  '50 mg',
                frequency:
                  '1x ao dia',
                route:
                  MedicationRoute.ORAL,
                status:
                  MedicationStatus.ACTIVE,
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
                dosage:
                  '100 mg',
                status:
                  MedicationStatus.SUSPENDED,
                notes:
                  '  Suspenso temporariamente.  ',
              },
            );

          expect(updated).toMatchObject({
            id:
              created.id,
            name:
              'Losartana',
            dosage:
              '100 mg',
            frequency:
              '1x ao dia',
            route:
              MedicationRoute.ORAL,
            status:
              MedicationStatus.SUSPENDED,
            notes:
              'Suspenso temporariamente.',
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
      'does not update medication from another patient',
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
                'Losartana',
            },
          );

        await expect(
          service.update(
            randomUUID(),
            medicalRecord.organizationId,
            created.id,
            {
              status:
                MedicationStatus.DISCONTINUED,
            },
          ),
        ).rejects.toBeInstanceOf(
          MedicalRecordNotFoundError,
        );
      },
    );

    it(
      'does not expose medications from another organization',
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
              'Losartana',
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
      'removes a medication',
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
                'Losartana',
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
      'does not remove medication from another patient',
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
                'Losartana',
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