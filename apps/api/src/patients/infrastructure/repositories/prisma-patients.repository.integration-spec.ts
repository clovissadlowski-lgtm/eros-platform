import { randomUUID } from 'node:crypto';

import { PrismaService } from '../../../common/database/prisma.service';
import {
  Patient,
  PatientStatus,
} from '../../domain/entities/patient.entity';
import { PrismaPatientsRepository } from './prisma-patients.repository';

describe(
  'PrismaPatientsRepository integration',
  () => {
    const organizationId =
      '22222222-2222-4222-8222-222222222222';

    let prisma: PrismaService;
    let repository: PrismaPatientsRepository;

    beforeAll(async () => {
      prisma = new PrismaService();

      repository =
        new PrismaPatientsRepository(prisma);

      await prisma.$connect();
    });

    beforeEach(async () => {
      await clearTestData();

      await prisma.organization.upsert({
        where: {
          id: organizationId,
        },
        update: {
          name: 'Integration Test Organization',
          slug: 'integration-test-organization',
          status: 'ACTIVE',
        },
        create: {
          id: organizationId,
          name: 'Integration Test Organization',
          slug: 'integration-test-organization',
          status: 'ACTIVE',
        },
      });
    });

    afterAll(async () => {
      await clearTestData();

      await prisma.organization.deleteMany({
        where: {
          id: organizationId,
        },
      });

      await prisma.$disconnect();
    });

    it('creates and returns a patient', async () => {
      const patient = createPatient();

      const createdPatient =
        await repository.create(patient);

      expect(createdPatient).toEqual(patient);

      const storedPatient =
        await prisma.patient.findUnique({
          where: {
            id: patient.id,
          },
        });

      expect(storedPatient).not.toBeNull();

      expect(storedPatient?.name).toBe(
        'Integration Patient',
      );

      expect(storedPatient?.organizationId).toBe(
        organizationId,
      );

      expect(storedPatient?.status).toBe(
        'ACTIVE',
      );

      expect(storedPatient?.cpf).toBeNull();

      expect(
        storedPatient?.biologicalSex,
      ).toBeNull();
    });

    it(
      'finds a patient by organization and id',
      async () => {
        const patient = createPatient();

        await repository.create(patient);

        const foundPatient =
          await repository.findById(
            organizationId,
            patient.id,
          );

        expect(foundPatient).toEqual(patient);
      },
    );

    it(
      'returns null when the patient belongs to another organization',
      async () => {
        const patient = createPatient();

        await repository.create(patient);

        const foundPatient =
          await repository.findById(
            randomUUID(),
            patient.id,
          );

        expect(foundPatient).toBeNull();
      },
    );

    it(
      'lists only patients from the requested organization',
      async () => {
        const patient = createPatient();

        await repository.create(patient);

        const patients =
          await repository.listByOrganization(
            organizationId,
          );

        expect(patients).toHaveLength(1);
        expect(patients[0]).toEqual(patient);
      },
    );

    function createPatient(): Patient {
      const timestamp =
        new Date().toISOString();

      return {
        id: randomUUID(),
        organizationId,
        name: 'Integration Patient',
        cpf: null,
        email:
          'integration.patient@higeia.com',
        phone: '47999999999',
        birthDate: '1990-01-01',
        biologicalSex: null,
        status: PatientStatus.ACTIVE,
        createdAt: timestamp,
        updatedAt: timestamp,
      };
    }

    async function clearTestData(): Promise<void> {
      await prisma.appointment.deleteMany({
        where: {
          organizationId,
        },
      });

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
    }
  },
);
