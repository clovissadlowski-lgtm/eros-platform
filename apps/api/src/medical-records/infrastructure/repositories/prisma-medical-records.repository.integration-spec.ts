import { randomUUID } from 'node:crypto';

import {
  MedicalRecord,
  MedicalRecordStatus,
} from '../../domain/entities/medical-record.entity';
import { PrismaMedicalRecordsRepository } from './prisma-medical-records.repository';
import { PrismaService } from '../../../common/database/prisma.service';
import {
  OrganizationStatus,
  PatientStatus,
} from '../../../generated/prisma/enums';

describe(
  'PrismaMedicalRecordsRepository',
  () => {
    const prisma =
      new PrismaService();

    const repository =
      new PrismaMedicalRecordsRepository(
        prisma,
      );

    let organizationId: string;
    let patientId: string;

    beforeAll(async () => {
      await prisma.$connect();
    });

    beforeEach(async () => {
      organizationId =
        randomUUID();

      patientId =
        randomUUID();

      const timestamp =
        new Date();

      await prisma.organization.create({
        data: {
          id: organizationId,
          name:
            'Medical Record Test Organization',
          slug:
            `medical-record-${randomUUID()}`,
          status:
            OrganizationStatus.ACTIVE,
          createdAt: timestamp,
          updatedAt: timestamp,
        },
      });

      await prisma.patient.create({
        data: {
          id: patientId,
          organizationId,
          name:
            'Medical Record Test Patient',
          email:
            `medical-record-${randomUUID()}@higeia.test`,
          status:
            PatientStatus.ACTIVE,
          createdAt: timestamp,
          updatedAt: timestamp,
        },
      });
    });

    afterEach(async () => {
      await prisma.medicalRecord.deleteMany({
        where: {
          organizationId,
        },
      });

      await prisma.patient.deleteMany({
        where: {
          organizationId,
        },
      });

      await prisma.organization.deleteMany({
        where: {
          id: organizationId,
        },
      });
    });

    afterAll(async () => {
      await prisma.$disconnect();
    });

    it('creates and finds a medical record', async () => {
      const medicalRecord =
        createMedicalRecord();

      const created =
        await repository.create(
          medicalRecord,
        );

      expect(created).toEqual(
        medicalRecord,
      );

      const found =
        await repository.findByPatientId(
          organizationId,
          patientId,
        );

      expect(found).toEqual(
        medicalRecord,
      );
    });

    it('does not expose a medical record from another organization', async () => {
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
          'Updated Prisma clinical notes.',
        status:
          MedicalRecordStatus.ARCHIVED,
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
    });

    function createMedicalRecord(): MedicalRecord {
      const timestamp =
        '2026-08-01T12:00:00.000Z';

      return {
        id: randomUUID(),
        organizationId,
        patientId,
        chiefComplaint:
          'Difficulty losing weight.',
        clinicalHistory:
          'Weight gain over two years.',
        familyHistory:
          'Family history of hypertension.',
        allergies: null,
        currentMedications: null,
        healthConditions: null,
        clinicalNotes:
          'Patient motivated.',
        treatmentGoals:
          'Reduce body fat.',
        status:
          MedicalRecordStatus.ACTIVE,
        createdAt: timestamp,
        updatedAt: timestamp,
      };
    }
  },
);