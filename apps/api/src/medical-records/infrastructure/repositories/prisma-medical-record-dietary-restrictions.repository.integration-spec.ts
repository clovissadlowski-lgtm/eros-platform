import {
  randomUUID,
} from 'node:crypto';

import {
  PrismaService,
} from '../../../common/database/prisma.service';

import {
  DietaryRestrictionAction,
  DietaryRestrictionRisk,
  DietaryRestrictionSource,
  DietaryRestrictionStatus,
  DietaryRestrictionType,
  MedicalRecordDietaryRestriction,
} from '../../domain/entities/medical-record-dietary-restriction.entity';

import {
  PrismaMedicalRecordDietaryRestrictionsRepository,
} from './prisma-medical-record-dietary-restrictions.repository';

describe(
  'PrismaMedicalRecordDietaryRestrictionsRepository integration',
  () => {
    const organizationId =
      '77777777-7777-4777-8777-777777777777';

    const patientId =
      '88888888-8888-4888-8888-888888888888';

    const medicalRecordId =
      '99999999-9999-4999-8999-999999999999';

    let prisma:
      PrismaService;

    let repository:
      PrismaMedicalRecordDietaryRestrictionsRepository;

    beforeAll(
      async () => {
        prisma =
          new PrismaService();

        repository =
          new PrismaMedicalRecordDietaryRestrictionsRepository(
            prisma,
          );

        await prisma.$connect();
      },
    );

    beforeEach(
      async () => {
        await clearTestData();

        await prisma.organization.upsert({
          where: {
            id:
              organizationId,
          },

          update: {
            name:
              'Dietary Integration Organization',

            slug:
              'dietary-integration-organization',

            status:
              'ACTIVE',
          },

          create: {
            id:
              organizationId,

            name:
              'Dietary Integration Organization',

            slug:
              'dietary-integration-organization',

            status:
              'ACTIVE',
          },
        });

        await prisma.patient.upsert({
          where: {
            id:
              patientId,
          },

          update: {
            organizationId,

            name:
              'Dietary Integration Patient',

            status:
              'ACTIVE',
          },

          create: {
            id:
              patientId,

            organizationId,

            name:
              'Dietary Integration Patient',

            status:
              'ACTIVE',
          },
        });

        await prisma.medicalRecord.upsert({
          where: {
            id:
              medicalRecordId,
          },

          update: {
            organizationId,

            patientId,

            status:
              'ACTIVE',
          },

          create: {
            id:
              medicalRecordId,

            organizationId,

            patientId,

            status:
              'ACTIVE',
          },
        });
      },
    );

    afterAll(
      async () => {
        await clearTestData();

        await prisma.$disconnect();
      },
    );

    it(
      'creates and returns a dietary restriction',
      async () => {
        const restriction =
          createRestriction();

        const created =
          await repository.create(
            restriction,
          );

        expect(
          created,
        ).toEqual(
          restriction,
        );

        const stored =
          await prisma
            .medicalRecordDietaryRestriction
            .findUnique({
              where: {
                id:
                  restriction.id,
              },
            });

        expect(
          stored,
        ).not.toBeNull();

        expect(
          stored?.item,
        ).toBe(
          'Lactose',
        );

        expect(
          stored?.dietaryItemCatalogId,
        ).toBeNull();

        expect(
          stored?.organizationId,
        ).toBe(
          organizationId,
        );
      },
    );

    it(
      'finds a dietary restriction by organization and id',
      async () => {
        const restriction =
          createRestriction();

        await repository.create(
          restriction,
        );

        const found =
          await repository.findById(
            organizationId,
            restriction.id,
          );

        expect(
          found,
        ).toEqual(
          restriction,
        );
      },
    );

    it(
      'does not expose a dietary restriction from another organization',
      async () => {
        const restriction =
          createRestriction();

        await repository.create(
          restriction,
        );

        const found =
          await repository.findById(
            randomUUID(),
            restriction.id,
          );

        expect(
          found,
        ).toBeNull();
      },
    );

    it(
      'lists dietary restrictions from the requested medical record',
      async () => {
        const restriction =
          createRestriction();

        await repository.create(
          restriction,
        );

        const restrictions =
          await repository.listByMedicalRecordId(
            organizationId,
            medicalRecordId,
          );

        expect(
          restrictions,
        ).toHaveLength(
          1,
        );

        expect(
          restrictions[0],
        ).toEqual(
          restriction,
        );
      },
    );

    it(
      'updates a dietary restriction',
      async () => {
        const restriction =
          createRestriction();

        await repository.create(
          restriction,
        );

        const updatedRestriction:
          MedicalRecordDietaryRestriction = {
            ...restriction,

            item:
              'Vitamina K',

            type:
              DietaryRestrictionType.MEDICAL_RESTRICTION,

            action:
              DietaryRestrictionAction.KEEP_CONSISTENT,

            risk:
              DietaryRestrictionRisk.HIGH,

            source:
              DietaryRestrictionSource.PROFESSIONAL_REPORTED,

            reason:
              'Uso de anticoagulante oral.',

            notes:
              'Manter ingestão alimentar consistente.',

            updatedAt:
              '2026-08-12T11:00:00.000Z',
          };

        const result =
          await repository.update(
            updatedRestriction,
          );

        expect(
          result,
        ).toEqual(
          updatedRestriction,
        );

        const stored =
          await prisma
            .medicalRecordDietaryRestriction
            .findUnique({
              where: {
                id:
                  restriction.id,
              },
            });

        expect(
          stored?.item,
        ).toBe(
          'Vitamina K',
        );

        expect(
          stored?.action,
        ).toBe(
          'KEEP_CONSISTENT',
        );

        expect(
          stored?.risk,
        ).toBe(
          'HIGH',
        );
      },
    );

    it(
      'deletes a dietary restriction',
      async () => {
        const restriction =
          createRestriction();

        await repository.create(
          restriction,
        );

        await repository.delete(
          organizationId,
          restriction.id,
        );

        const stored =
          await repository.findById(
            organizationId,
            restriction.id,
          );

        expect(
          stored,
        ).toBeNull();
      },
    );

    it(
      'does not delete a dietary restriction from another organization',
      async () => {
        const restriction =
          createRestriction();

        await repository.create(
          restriction,
        );

        await repository.delete(
          randomUUID(),
          restriction.id,
        );

        const stored =
          await repository.findById(
            organizationId,
            restriction.id,
          );

        expect(
          stored,
        ).toEqual(
          restriction,
        );
      },
    );

    function createRestriction():
      MedicalRecordDietaryRestriction {
      return {
        id:
          randomUUID(),

        organizationId,

        medicalRecordId,

        patientId,

        dietaryItemCatalogId:
          null,

        item:
          'Lactose',

        type:
          DietaryRestrictionType.INTOLERANCE,

        action:
          DietaryRestrictionAction.LIMIT,

        risk:
          DietaryRestrictionRisk.MODERATE,

        source:
          DietaryRestrictionSource.PATIENT_REPORTED,

        reason:
          'Desconforto gastrointestinal.',

        identifiedAt:
          '2026-08-12',

        status:
          DietaryRestrictionStatus.ACTIVE,

        notes:
          'Avaliar tolerância individual.',

        createdAt:
          '2026-08-12T10:00:00.000Z',

        updatedAt:
          '2026-08-12T10:00:00.000Z',
      };
    }

    async function clearTestData():
      Promise<void> {
      await prisma
        .medicalRecordDietaryRestriction
        .deleteMany({
          where: {
            organizationId,
          },
        });

      await prisma
        .medicalRecord
        .deleteMany({
          where: {
            id:
              medicalRecordId,
          },
        });

      await prisma
        .patient
        .deleteMany({
          where: {
            id:
              patientId,
          },
        });

      await prisma
        .organization
        .deleteMany({
          where: {
            id:
              organizationId,
          },
        });
    }
  },
);