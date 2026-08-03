import { randomUUID } from 'node:crypto';

import {
  MedicalRecord,
  MedicalRecordStatus,
} from '../../domain/entities/medical-record.entity';
import { InMemoryMedicalRecordsRepository } from './in-memory-medical-records.repository';

describe(
  'InMemoryMedicalRecordsRepository',
  () => {
    let repository:
      InMemoryMedicalRecordsRepository;

    beforeEach(() => {
      repository =
        new InMemoryMedicalRecordsRepository();
    });

    it('creates and finds a medical record by id', async () => {
      const medicalRecord =
        createMedicalRecord();

      await repository.create(
        medicalRecord,
      );

      const result =
        await repository.findById(
          medicalRecord.organizationId,
          medicalRecord.id,
        );

      expect(result).toEqual(
        medicalRecord,
      );
    });

    it('finds a medical record by patient id', async () => {
      const medicalRecord =
        createMedicalRecord();

      await repository.create(
        medicalRecord,
      );

      const result =
        await repository.findByPatientId(
          medicalRecord.organizationId,
          medicalRecord.patientId,
        );

      expect(result).toEqual(
        medicalRecord,
      );
    });

    it('does not expose a record from another organization', async () => {
      const medicalRecord =
        createMedicalRecord();

      await repository.create(
        medicalRecord,
      );

      const result =
        await repository.findById(
          randomUUID(),
          medicalRecord.id,
        );

      expect(result).toBeNull();
    });

    it('updates a medical record', async () => {
      const medicalRecord =
        createMedicalRecord();

      await repository.create(
        medicalRecord,
      );

      const updatedMedicalRecord = {
        ...medicalRecord,
        clinicalNotes:
          'Updated clinical notes.',
        updatedAt:
          '2026-08-01T18:00:00.000Z',
      };

      const result =
        await repository.update(
          updatedMedicalRecord,
        );

      expect(result).toEqual(
        updatedMedicalRecord,
      );

      const persisted =
        await repository.findById(
          medicalRecord.organizationId,
          medicalRecord.id,
        );

      expect(persisted).toEqual(
        updatedMedicalRecord,
      );
    });

    function createMedicalRecord(
      overrides:
        Partial<MedicalRecord> = {},
    ): MedicalRecord {
      const timestamp =
        '2026-08-01T12:00:00.000Z';

      return {
        id: randomUUID(),
        organizationId: randomUUID(),
        patientId: randomUUID(),
        chiefComplaint:
          'Difficulty losing weight.',
        clinicalHistory: null,
        familyHistory: null,
        allergies: null,
        currentMedications: null,
        healthConditions: null,
        clinicalNotes: null,
        treatmentGoals: null,
        status:
          MedicalRecordStatus.ACTIVE,
        createdAt: timestamp,
        updatedAt: timestamp,
        ...overrides,
      };
    }
  },
);