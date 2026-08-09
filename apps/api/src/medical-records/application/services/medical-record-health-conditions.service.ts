import {
  BadRequestException,
  Injectable,
} from '@nestjs/common';
import {
  randomUUID,
} from 'node:crypto';

import {
  ClinicalConditionCatalogRepository,
} from '../../../clinical-catalog/domain/repositories/clinical-condition-catalog.repository';

import {
  HealthConditionStatus,
  MedicalRecordHealthCondition,
} from '../../domain/entities/medical-record-health-condition.entity';

import {
  MedicalRecordNotFoundError,
} from '../../domain/errors/medical-record-not-found.error';

import {
  MedicalRecordHealthConditionsRepository,
} from '../../domain/repositories/medical-record-health-conditions.repository';

import {
  MedicalRecordsRepository,
} from '../../domain/repositories/medical-records.repository';

export interface CreateHealthConditionInput {
  clinicalConditionId?: string;

  /**
   * Compatibilidade temporária com testes e chamadas
   * internas anteriores ao catálogo canônico.
   *
   * A API pública não aceita mais este campo.
   */
  name?: string;

  status?: HealthConditionStatus;
  diagnosedAt?: string;
  resolvedAt?: string;
  notes?: string;
}

export interface UpdateHealthConditionInput {
  clinicalConditionId?: string;

  /**
   * Compatibilidade temporária.
   * A API pública não permite alteração livre do nome.
   */
  name?: string;

  status?: HealthConditionStatus;
  diagnosedAt?: string | null;
  resolvedAt?: string | null;
  notes?: string | null;
}

@Injectable()
export class MedicalRecordHealthConditionsService {
  constructor(
    private readonly healthConditionsRepository:
      MedicalRecordHealthConditionsRepository,

    private readonly medicalRecordsRepository:
      MedicalRecordsRepository,

    private readonly clinicalConditionCatalogRepository:
      ClinicalConditionCatalogRepository,
  ) {}

  async create(
    patientId: string,
    organizationId: string,
    input: CreateHealthConditionInput,
  ): Promise<MedicalRecordHealthCondition> {
    const medicalRecord =
      await this.getMedicalRecord(
        organizationId,
        patientId,
      );

    const canonicalCondition =
      input.clinicalConditionId
        ? await this.getClinicalCondition(
            input.clinicalConditionId,
          )
        : null;

    const name =
      canonicalCondition?.name ??
      (
        input.name
          ? this.normalizeRequiredText(
              input.name,
            )
          : null
      );

    if (!name) {
      throw new BadRequestException(
        'A clinical condition from the canonical catalog is required.',
      );
    }

    const timestamp =
      new Date().toISOString();

    const healthCondition:
      MedicalRecordHealthCondition = {
        id:
          randomUUID(),

        organizationId,

        medicalRecordId:
          medicalRecord.id,

        patientId,

        clinicalConditionId:
          canonicalCondition?.id ??
          null,

        name,

        status:
          input.status ??
          HealthConditionStatus.ACTIVE,

        diagnosedAt:
          this.normalizeOptionalDate(
            input.diagnosedAt,
          ),

        resolvedAt:
          this.normalizeOptionalDate(
            input.resolvedAt,
          ),

        notes:
          this.normalizeOptionalText(
            input.notes,
          ),

        createdAt:
          timestamp,

        updatedAt:
          timestamp,
      };

    return this.healthConditionsRepository.create(
      healthCondition,
    );
  }

  async listByPatient(
    patientId: string,
    organizationId: string,
  ): Promise<
    MedicalRecordHealthCondition[]
  > {
    const medicalRecord =
      await this.getMedicalRecord(
        organizationId,
        patientId,
      );

    return this.healthConditionsRepository
      .listByMedicalRecordId(
        organizationId,
        medicalRecord.id,
      );
  }

  async update(
    patientId: string,
    organizationId: string,
    healthConditionId: string,
    input: UpdateHealthConditionInput,
  ): Promise<MedicalRecordHealthCondition> {
    await this.getMedicalRecord(
      organizationId,
      patientId,
    );

    const healthCondition =
      await this.healthConditionsRepository
        .findById(
          organizationId,
          healthConditionId,
        );

    if (
      !healthCondition ||
      healthCondition.patientId !==
        patientId
    ) {
      throw new MedicalRecordNotFoundError();
    }

    const canonicalCondition =
      input.clinicalConditionId !==
      undefined
        ? await this.getClinicalCondition(
            input.clinicalConditionId,
          )
        : null;

    const updated:
      MedicalRecordHealthCondition = {
        ...healthCondition,

        clinicalConditionId:
          canonicalCondition
            ? canonicalCondition.id
            : healthCondition
                .clinicalConditionId,

        name:
          canonicalCondition
            ? canonicalCondition.name
            : input.name !== undefined
              ? this.normalizeRequiredText(
                  input.name,
                )
              : healthCondition.name,

        status:
          input.status ??
          healthCondition.status,

        diagnosedAt:
          input.diagnosedAt !==
          undefined
            ? this.normalizeOptionalDate(
                input.diagnosedAt,
              )
            : healthCondition
                .diagnosedAt,

        resolvedAt:
          input.resolvedAt !==
          undefined
            ? this.normalizeOptionalDate(
                input.resolvedAt,
              )
            : healthCondition
                .resolvedAt,

        notes:
          input.notes !== undefined
            ? this.normalizeOptionalText(
                input.notes,
              )
            : healthCondition.notes,

        updatedAt:
          new Date().toISOString(),
      };

    return this.healthConditionsRepository
      .update(
        updated,
      );
  }

  async remove(
    patientId: string,
    organizationId: string,
    healthConditionId: string,
  ): Promise<void> {
    await this.getMedicalRecord(
      organizationId,
      patientId,
    );

    const healthCondition =
      await this.healthConditionsRepository
        .findById(
          organizationId,
          healthConditionId,
        );

    if (
      !healthCondition ||
      healthCondition.patientId !==
        patientId
    ) {
      throw new MedicalRecordNotFoundError();
    }

    await this.healthConditionsRepository
      .delete(
        organizationId,
        healthConditionId,
      );
  }

  private async getClinicalCondition(
    clinicalConditionId: string,
  ) {
    const clinicalCondition =
      await this
        .clinicalConditionCatalogRepository
        .findActiveById(
          clinicalConditionId,
        );

    if (!clinicalCondition) {
      throw new BadRequestException(
        'Clinical condition does not exist or is inactive.',
      );
    }

    return clinicalCondition;
  }

  private async getMedicalRecord(
    organizationId: string,
    patientId: string,
  ) {
    const medicalRecord =
      await this.medicalRecordsRepository
        .findByPatientId(
          organizationId,
          patientId,
        );

    if (!medicalRecord) {
      throw new MedicalRecordNotFoundError();
    }

    return medicalRecord;
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