import {
  BadRequestException,
} from '@nestjs/common';

import {
  DietaryItemCatalogService,
} from '../../../dietary-item-catalog/application/services/dietary-item-catalog.service';

import {
  DietaryRestrictionAction,
  DietaryRestrictionRisk,
  DietaryRestrictionSource,
  DietaryRestrictionStatus,
  DietaryRestrictionType,
  MedicalRecordDietaryRestriction,
} from '../../domain/entities/medical-record-dietary-restriction.entity';

import {
  MedicalRecordNotFoundError,
} from '../../domain/errors/medical-record-not-found.error';

import {
  MedicalRecordDietaryRestrictionsRepository,
} from '../../domain/repositories/medical-record-dietary-restrictions.repository';

import {
  MedicalRecordsRepository,
} from '../../domain/repositories/medical-records.repository';

import {
  MedicalRecordDietaryRestrictionsService,
} from './medical-record-dietary-restrictions.service';

describe(
  'MedicalRecordDietaryRestrictionsService',
  () => {
    let service:
      MedicalRecordDietaryRestrictionsService;

    let dietaryRestrictionsRepository:
      jest.Mocked<MedicalRecordDietaryRestrictionsRepository>;

    let medicalRecordsRepository:
      jest.Mocked<MedicalRecordsRepository>;

    let dietaryItemCatalogService: {
      findActiveById:
        jest.Mock;
    };

    const organizationId =
      '11111111-1111-4111-8111-111111111111';

    const patientId =
      '22222222-2222-4222-8222-222222222222';

    const medicalRecordId =
      '33333333-3333-4333-8333-333333333333';

    const dietaryItemCatalogId =
      '77777777-7777-4777-8777-777777777777';

    beforeEach(() => {
      dietaryRestrictionsRepository = {
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

      dietaryItemCatalogService = {
        findActiveById:
          jest.fn(),
      };

      medicalRecordsRepository
        .findByPatientId
        .mockResolvedValue(
          createMedicalRecord(),
        );

      service =
        new MedicalRecordDietaryRestrictionsService(
          dietaryRestrictionsRepository,
          medicalRecordsRepository,
          dietaryItemCatalogService as unknown as DietaryItemCatalogService,
        );
    });

    it(
      'creates a dietary restriction with a free-text item',
      async () => {
        dietaryRestrictionsRepository
          .create
          .mockImplementation(
            async (
              restriction,
            ) =>
              restriction,
          );

        const result =
          await service.create(
            patientId,
            organizationId,
            {
              item:
                ' Lactose ',

              type:
                DietaryRestrictionType.INTOLERANCE,

              action:
                DietaryRestrictionAction.LIMIT,

              risk:
                DietaryRestrictionRisk.MODERATE,

              source:
                DietaryRestrictionSource.PATIENT_REPORTED,

              reason:
                ' Desconforto gastrointestinal ',

              identifiedAt:
                '2026-08-12',

              notes:
                ' Avaliar tolerância ',
            },
          );

        expect(
          result.item,
        ).toBe(
          'Lactose',
        );

        expect(
          result.dietaryItemCatalogId,
        ).toBeNull();

        expect(
          result.reason,
        ).toBe(
          'Desconforto gastrointestinal',
        );

        expect(
          result.notes,
        ).toBe(
          'Avaliar tolerância',
        );

        expect(
          result.status,
        ).toBe(
          DietaryRestrictionStatus.ACTIVE,
        );

        expect(
          dietaryItemCatalogService.findActiveById,
        ).not.toHaveBeenCalled();

        expect(
          dietaryRestrictionsRepository.create,
        ).toHaveBeenCalledTimes(
          1,
        );
      },
    );

    it(
      'creates a dietary restriction using the dietary item catalog',
      async () => {
        dietaryItemCatalogService
          .findActiveById
          .mockResolvedValue(
            createCatalogItem(
              'Lactose',
            ),
          );

        dietaryRestrictionsRepository
          .create
          .mockImplementation(
            async (
              restriction,
            ) =>
              restriction,
          );

        const result =
          await service.create(
            patientId,
            organizationId,
            {
              dietaryItemCatalogId,

              item:
                'Texto enviado pelo cliente',

              type:
                DietaryRestrictionType.INTOLERANCE,

              action:
                DietaryRestrictionAction.LIMIT,
            },
          );

        expect(
          dietaryItemCatalogService.findActiveById,
        ).toHaveBeenCalledWith(
          dietaryItemCatalogId,
        );

        expect(
          result.dietaryItemCatalogId,
        ).toBe(
          dietaryItemCatalogId,
        );

        expect(
          result.item,
        ).toBe(
          'Lactose',
        );

        expect(
          dietaryRestrictionsRepository.create,
        ).toHaveBeenCalledTimes(
          1,
        );
      },
    );

    it(
      'uses the canonical catalog name instead of the client item',
      async () => {
        dietaryItemCatalogService
          .findActiveById
          .mockResolvedValue(
            createCatalogItem(
              'Glúten',
            ),
          );

        dietaryRestrictionsRepository
          .create
          .mockImplementation(
            async (
              restriction,
            ) =>
              restriction,
          );

        const result =
          await service.create(
            patientId,
            organizationId,
            {
              dietaryItemCatalogId,

              item:
                'Tomate',

              type:
                DietaryRestrictionType.MEDICAL_RESTRICTION,

              action:
                DietaryRestrictionAction.BLOCK,
            },
          );

        expect(
          result.item,
        ).toBe(
          'Glúten',
        );

        expect(
          result.item,
        ).not.toBe(
          'Tomate',
        );
      },
    );

    it(
      'rejects an invalid dietary item catalog id',
      async () => {
        dietaryItemCatalogService
          .findActiveById
          .mockResolvedValue(
            null,
          );

        await expect(
          service.create(
            patientId,
            organizationId,
            {
              dietaryItemCatalogId,

              item:
                'Lactose',

              type:
                DietaryRestrictionType.INTOLERANCE,

              action:
                DietaryRestrictionAction.LIMIT,
            },
          ),
        ).rejects.toBeInstanceOf(
          BadRequestException,
        );

        expect(
          dietaryRestrictionsRepository.create,
        ).not.toHaveBeenCalled();
      },
    );

    it(
      'uses default risk, source and status',
      async () => {
        dietaryRestrictionsRepository
          .create
          .mockImplementation(
            async (
              restriction,
            ) =>
              restriction,
          );

        const result =
          await service.create(
            patientId,
            organizationId,
            {
              item:
                'Tomate',

              type:
                DietaryRestrictionType.PREFERENCE,

              action:
                DietaryRestrictionAction.AVOID,
            },
          );

        expect(
          result.risk,
        ).toBe(
          DietaryRestrictionRisk.NONE,
        );

        expect(
          result.source,
        ).toBe(
          DietaryRestrictionSource.PATIENT_REPORTED,
        );

        expect(
          result.status,
        ).toBe(
          DietaryRestrictionStatus.ACTIVE,
        );
      },
    );

    it(
      'rejects an empty free-text item',
      async () => {
        await expect(
          service.create(
            patientId,
            organizationId,
            {
              item:
                '   ',

              type:
                DietaryRestrictionType.PREFERENCE,

              action:
                DietaryRestrictionAction.AVOID,
            },
          ),
        ).rejects.toBeInstanceOf(
          BadRequestException,
        );
      },
    );

    it(
      'lists dietary restrictions from the patient medical record',
      async () => {
        const restriction =
          createRestriction();

        dietaryRestrictionsRepository
          .listByMedicalRecordId
          .mockResolvedValue([
            restriction,
          ]);

        const result =
          await service.listByPatient(
            patientId,
            organizationId,
          );

        expect(
          result,
        ).toEqual([
          restriction,
        ]);

        expect(
          dietaryRestrictionsRepository.listByMedicalRecordId,
        ).toHaveBeenCalledWith(
          organizationId,
          medicalRecordId,
        );
      },
    );

    it(
      'updates a free-text dietary restriction',
      async () => {
        const restriction =
          createRestriction();

        dietaryRestrictionsRepository
          .findById
          .mockResolvedValue(
            restriction,
          );

        dietaryRestrictionsRepository
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
            restriction.id,
            {
              item:
                ' Glúten ',

              type:
                DietaryRestrictionType.MEDICAL_RESTRICTION,

              action:
                DietaryRestrictionAction.BLOCK,

              risk:
                DietaryRestrictionRisk.HIGH,

              source:
                DietaryRestrictionSource.PROFESSIONAL_REPORTED,

              reason:
                ' Restrição clínica ',
            },
          );

        expect(
          result.item,
        ).toBe(
          'Glúten',
        );

        expect(
          result.dietaryItemCatalogId,
        ).toBeNull();

        expect(
          result.type,
        ).toBe(
          DietaryRestrictionType.MEDICAL_RESTRICTION,
        );

        expect(
          result.action,
        ).toBe(
          DietaryRestrictionAction.BLOCK,
        );

        expect(
          result.risk,
        ).toBe(
          DietaryRestrictionRisk.HIGH,
        );

        expect(
          result.reason,
        ).toBe(
          'Restrição clínica',
        );
      },
    );

    it(
      'updates a dietary restriction using a catalog item',
      async () => {
        const restriction =
          createRestriction();

        dietaryRestrictionsRepository
          .findById
          .mockResolvedValue(
            restriction,
          );

        dietaryItemCatalogService
          .findActiveById
          .mockResolvedValue(
            createCatalogItem(
              'Glúten',
            ),
          );

        dietaryRestrictionsRepository
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
            restriction.id,
            {
              dietaryItemCatalogId,

              item:
                'Texto incorreto',
            },
          );

        expect(
          dietaryItemCatalogService.findActiveById,
        ).toHaveBeenCalledWith(
          dietaryItemCatalogId,
        );

        expect(
          result.dietaryItemCatalogId,
        ).toBe(
          dietaryItemCatalogId,
        );

        expect(
          result.item,
        ).toBe(
          'Glúten',
        );
      },
    );

    it(
      'removes the catalog link when a free-text item replaces it',
      async () => {
        const restriction = {
          ...createRestriction(),

          dietaryItemCatalogId,
        };

        dietaryRestrictionsRepository
          .findById
          .mockResolvedValue(
            restriction,
          );

        dietaryRestrictionsRepository
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
            restriction.id,
            {
              item:
                'Outro alimento',
            },
          );

        expect(
          result.dietaryItemCatalogId,
        ).toBeNull();

        expect(
          result.item,
        ).toBe(
          'Outro alimento',
        );
      },
    );

    it(
      'explicitly removes the catalog link',
      async () => {
        const restriction = {
          ...createRestriction(),

          dietaryItemCatalogId,

          item:
            'Lactose',
        };

        dietaryRestrictionsRepository
          .findById
          .mockResolvedValue(
            restriction,
          );

        dietaryRestrictionsRepository
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
            restriction.id,
            {
              dietaryItemCatalogId:
                null,

              item:
                'Leite',
            },
          );

        expect(
          result.dietaryItemCatalogId,
        ).toBeNull();

        expect(
          result.item,
        ).toBe(
          'Leite',
        );
      },
    );

    it(
      'rejects update with an empty free-text item',
      async () => {
        const restriction =
          createRestriction();

        dietaryRestrictionsRepository
          .findById
          .mockResolvedValue(
            restriction,
          );

        await expect(
          service.update(
            patientId,
            organizationId,
            restriction.id,
            {
              item:
                '   ',
            },
          ),
        ).rejects.toBeInstanceOf(
          BadRequestException,
        );
      },
    );

    it(
      'does not update a restriction from another patient',
      async () => {
        dietaryRestrictionsRepository
          .findById
          .mockResolvedValue({
            ...createRestriction(),

            patientId:
              '44444444-4444-4444-8444-444444444444',
          });

        await expect(
          service.update(
            patientId,
            organizationId,
            '55555555-5555-4555-8555-555555555555',
            {
              item:
                'Tomate',
            },
          ),
        ).rejects.toBeInstanceOf(
          MedicalRecordNotFoundError,
        );
      },
    );

    it(
      'removes a dietary restriction',
      async () => {
        const restriction =
          createRestriction();

        dietaryRestrictionsRepository
          .findById
          .mockResolvedValue(
            restriction,
          );

        await service.remove(
          patientId,
          organizationId,
          restriction.id,
        );

        expect(
          dietaryRestrictionsRepository.delete,
        ).toHaveBeenCalledWith(
          organizationId,
          restriction.id,
        );
      },
    );

    it(
      'does not remove a restriction from another patient',
      async () => {
        dietaryRestrictionsRepository
          .findById
          .mockResolvedValue({
            ...createRestriction(),

            patientId:
              '44444444-4444-4444-8444-444444444444',
          });

        await expect(
          service.remove(
            patientId,
            organizationId,
            '55555555-5555-4555-8555-555555555555',
          ),
        ).rejects.toBeInstanceOf(
          MedicalRecordNotFoundError,
        );
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
          '2026-08-12T00:00:00.000Z',

        updatedAt:
          '2026-08-12T00:00:00.000Z',
      } as any;
    }

    function createRestriction():
      MedicalRecordDietaryRestriction {
      return {
        id:
          '66666666-6666-4666-8666-666666666666',

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
          'Desconforto gastrointestinal',

        identifiedAt:
          '2026-08-12',

        status:
          DietaryRestrictionStatus.ACTIVE,

        notes:
          null,

        createdAt:
          '2026-08-12T00:00:00.000Z',

        updatedAt:
          '2026-08-12T00:00:00.000Z',
      };
    }

    function createCatalogItem(
      name: string,
    ) {
      return {
        id:
          dietaryItemCatalogId,

        name,

        normalizedName:
          name
            .normalize(
              'NFD',
            )
            .replace(
              /[\u0300-\u036f]/g,
              '',
            )
            .toLowerCase(),

        type:
          'COMPONENT',

        category:
          null,

        description:
          null,

        isActive:
          true,

        synonyms:
          [],

        createdAt:
          '2026-08-12T00:00:00.000Z',

        updatedAt:
          '2026-08-12T00:00:00.000Z',
      };
    }
  },
);