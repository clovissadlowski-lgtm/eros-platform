import {
  BadRequestException,
  Injectable,
} from '@nestjs/common';

import {
  randomUUID,
} from 'node:crypto';

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

export interface CreateDietaryRestrictionInput {
  dietaryItemCatalogId?: string;

  item: string;

  type:
    DietaryRestrictionType;

  action:
    DietaryRestrictionAction;

  risk?:
    DietaryRestrictionRisk;

  source?:
    DietaryRestrictionSource;

  reason?: string;

  identifiedAt?: string;

  status?:
    DietaryRestrictionStatus;

  notes?: string;
}

export interface UpdateDietaryRestrictionInput {
  dietaryItemCatalogId?:
    string | null;

  item?: string;

  type?:
    DietaryRestrictionType;

  action?:
    DietaryRestrictionAction;

  risk?:
    DietaryRestrictionRisk;

  source?:
    DietaryRestrictionSource;

  reason?:
    string | null;

  identifiedAt?:
    string | null;

  status?:
    DietaryRestrictionStatus;

  notes?:
    string | null;
}

@Injectable()
export class MedicalRecordDietaryRestrictionsService {
  constructor(
    private readonly dietaryRestrictionsRepository:
      MedicalRecordDietaryRestrictionsRepository,

    private readonly medicalRecordsRepository:
      MedicalRecordsRepository,

    private readonly dietaryItemCatalogService:
      DietaryItemCatalogService,
  ) {}

  async create(
    patientId: string,
    organizationId: string,
    input:
      CreateDietaryRestrictionInput,
  ): Promise<MedicalRecordDietaryRestriction> {
    const medicalRecord =
      await this.getMedicalRecord(
        organizationId,
        patientId,
      );

    const catalogItem =
      input.dietaryItemCatalogId
        ? await this.getCatalogItem(
            input.dietaryItemCatalogId,
          )
        : null;

    const item =
      catalogItem
        ? catalogItem.name
        : this.normalizeRequiredText(
            input.item,
          );

    if (!item) {
      throw new BadRequestException(
        'Dietary restriction item is required.',
      );
    }

    const timestamp =
      new Date().toISOString();

    const restriction:
      MedicalRecordDietaryRestriction = {
        id:
          randomUUID(),

        organizationId,

        medicalRecordId:
          medicalRecord.id,

        patientId,

        dietaryItemCatalogId:
          catalogItem?.id ??
          null,

        item,

        type:
          input.type,

        action:
          input.action,

        risk:
          input.risk ??
          DietaryRestrictionRisk.NONE,

        source:
          input.source ??
          DietaryRestrictionSource.PATIENT_REPORTED,

        reason:
          this.normalizeOptionalText(
            input.reason,
          ),

        identifiedAt:
          this.normalizeOptionalDate(
            input.identifiedAt,
          ),

        status:
          input.status ??
          DietaryRestrictionStatus.ACTIVE,

        notes:
          this.normalizeOptionalText(
            input.notes,
          ),

        createdAt:
          timestamp,

        updatedAt:
          timestamp,
      };

    return this
      .dietaryRestrictionsRepository
      .create(
        restriction,
      );
  }

  async listByPatient(
    patientId: string,
    organizationId: string,
  ): Promise<MedicalRecordDietaryRestriction[]> {
    const medicalRecord =
      await this.getMedicalRecord(
        organizationId,
        patientId,
      );

    return this
      .dietaryRestrictionsRepository
      .listByMedicalRecordId(
        organizationId,
        medicalRecord.id,
      );
  }

  async update(
    patientId: string,
    organizationId: string,
    restrictionId: string,
    input:
      UpdateDietaryRestrictionInput,
  ): Promise<MedicalRecordDietaryRestriction> {
    await this.getMedicalRecord(
      organizationId,
      patientId,
    );

    const restriction =
      await this
        .dietaryRestrictionsRepository
        .findById(
          organizationId,
          restrictionId,
        );

    if (
      !restriction ||
      restriction.patientId !==
        patientId
    ) {
      throw new MedicalRecordNotFoundError();
    }

    let dietaryItemCatalogId =
      restriction.dietaryItemCatalogId;

    let item =
      restriction.item;

    if (
      input.dietaryItemCatalogId !==
      undefined
    ) {
      if (
        input.dietaryItemCatalogId ===
        null
      ) {
        dietaryItemCatalogId =
          null;

        if (
          input.item !==
          undefined
        ) {
          item =
            this.normalizeRequiredText(
              input.item,
            );
        }
      } else {
        const catalogItem =
          await this.getCatalogItem(
            input.dietaryItemCatalogId,
          );

        dietaryItemCatalogId =
          catalogItem.id;

        item =
          catalogItem.name;
      }
    } else if (
      input.item !==
      undefined
    ) {
      item =
        this.normalizeRequiredText(
          input.item,
        );

      dietaryItemCatalogId =
        null;
    }

    const updated:
      MedicalRecordDietaryRestriction = {
        ...restriction,

        dietaryItemCatalogId,

        item,

        type:
          input.type ??
          restriction.type,

        action:
          input.action ??
          restriction.action,

        risk:
          input.risk ??
          restriction.risk,

        source:
          input.source ??
          restriction.source,

        reason:
          input.reason !==
          undefined
            ? this.normalizeOptionalText(
                input.reason,
              )
            : restriction.reason,

        identifiedAt:
          input.identifiedAt !==
          undefined
            ? this.normalizeOptionalDate(
                input.identifiedAt,
              )
            : restriction.identifiedAt,

        status:
          input.status ??
          restriction.status,

        notes:
          input.notes !==
          undefined
            ? this.normalizeOptionalText(
                input.notes,
              )
            : restriction.notes,

        updatedAt:
          new Date().toISOString(),
      };

    if (!updated.item) {
      throw new BadRequestException(
        'Dietary restriction item is required.',
      );
    }

    return this
      .dietaryRestrictionsRepository
      .update(
        updated,
      );
  }

  async remove(
    patientId: string,
    organizationId: string,
    restrictionId: string,
  ): Promise<void> {
    await this.getMedicalRecord(
      organizationId,
      patientId,
    );

    const restriction =
      await this
        .dietaryRestrictionsRepository
        .findById(
          organizationId,
          restrictionId,
        );

    if (
      !restriction ||
      restriction.patientId !==
        patientId
    ) {
      throw new MedicalRecordNotFoundError();
    }

    await this
      .dietaryRestrictionsRepository
      .delete(
        organizationId,
        restrictionId,
      );
  }

  private async getMedicalRecord(
    organizationId: string,
    patientId: string,
  ) {
    const medicalRecord =
      await this
        .medicalRecordsRepository
        .findByPatientId(
          organizationId,
          patientId,
        );

    if (!medicalRecord) {
      throw new MedicalRecordNotFoundError();
    }

    return medicalRecord;
  }

  private async getCatalogItem(
    dietaryItemCatalogId: string,
  ) {
    const catalogItem =
      await this
        .dietaryItemCatalogService
        .findActiveById(
          dietaryItemCatalogId,
        );

    if (!catalogItem) {
      throw new BadRequestException(
        'Dietary item catalog entry is invalid or inactive.',
      );
    }

    return catalogItem;
  }

  private normalizeRequiredText(
    value: string,
  ): string {
    return value.trim();
  }

  private normalizeOptionalText(
    value:
      | string
      | null
      | undefined,
  ): string | null {
    if (
      value === undefined ||
      value === null
    ) {
      return null;
    }

    const normalized =
      value.trim();

    return normalized.length > 0
      ? normalized
      : null;
  }

  private normalizeOptionalDate(
    value:
      | string
      | null
      | undefined,
  ): string | null {
    if (
      value === undefined ||
      value === null ||
      value.trim().length === 0
    ) {
      return null;
    }

    return value;
  }
}