import { Injectable } from '@nestjs/common';
import { randomUUID } from 'node:crypto';

import {
  AllergySeverity,
  AllergyStatus,
  AllergyType,
  MedicalRecordAllergy,
} from '../../domain/entities/medical-record-allergy.entity';

import { MedicalRecordNotFoundError } from '../../domain/errors/medical-record-not-found.error';

import { MedicalRecordAllergiesRepository } from '../../domain/repositories/medical-record-allergies.repository';
import { MedicalRecordsRepository } from '../../domain/repositories/medical-records.repository';

export interface CreateAllergyInput {
  substance: string;
  type: AllergyType;
  reaction?: string;
  severity?: AllergySeverity;
  status?: AllergyStatus;
  identifiedAt?: string;
  notes?: string;
}

export interface UpdateAllergyInput {
  substance?: string;
  type?: AllergyType;
  reaction?: string | null;
  severity?: AllergySeverity | null;
  status?: AllergyStatus;
  identifiedAt?: string | null;
  notes?: string | null;
}

@Injectable()
export class MedicalRecordAllergiesService {
  constructor(
    private readonly allergiesRepository:
      MedicalRecordAllergiesRepository,

    private readonly medicalRecordsRepository:
      MedicalRecordsRepository,
  ) {}

  async create(
    patientId: string,
    organizationId: string,
    input: CreateAllergyInput,
  ): Promise<MedicalRecordAllergy> {
    const medicalRecord =
      await this.getMedicalRecord(
        organizationId,
        patientId,
      );

    const timestamp =
      new Date().toISOString();

    const allergy:
      MedicalRecordAllergy = {
        id:
          randomUUID(),

        organizationId,

        medicalRecordId:
          medicalRecord.id,

        patientId,

        substance:
          this.normalizeRequiredText(
            input.substance,
          ),

        type:
          input.type,

        reaction:
          this.normalizeOptionalText(
            input.reaction,
          ),

        severity:
          input.severity ??
          null,

        status:
          input.status ??
          AllergyStatus.ACTIVE,

        identifiedAt:
          this.normalizeOptionalDate(
            input.identifiedAt,
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

    return this.allergiesRepository.create(
      allergy,
    );
  }

  async listByPatient(
    patientId: string,
    organizationId: string,
  ): Promise<MedicalRecordAllergy[]> {
    const medicalRecord =
      await this.getMedicalRecord(
        organizationId,
        patientId,
      );

    return this.allergiesRepository.listByMedicalRecordId(
      organizationId,
      medicalRecord.id,
    );
  }

  async update(
    patientId: string,
    organizationId: string,
    allergyId: string,
    input: UpdateAllergyInput,
  ): Promise<MedicalRecordAllergy> {
    await this.getMedicalRecord(
      organizationId,
      patientId,
    );

    const allergy =
      await this.allergiesRepository.findById(
        organizationId,
        allergyId,
      );

    if (
      !allergy ||
      allergy.patientId !==
        patientId
    ) {
      throw new MedicalRecordNotFoundError();
    }

    const updated:
      MedicalRecordAllergy = {
        ...allergy,

        substance:
          input.substance !==
          undefined
            ? this.normalizeRequiredText(
                input.substance,
              )
            : allergy.substance,

        type:
          input.type ??
          allergy.type,

        reaction:
          input.reaction !==
          undefined
            ? this.normalizeOptionalText(
                input.reaction,
              )
            : allergy.reaction,

        severity:
          input.severity !==
          undefined
            ? input.severity
            : allergy.severity,

        status:
          input.status ??
          allergy.status,

        identifiedAt:
          input.identifiedAt !==
          undefined
            ? this.normalizeOptionalDate(
                input.identifiedAt,
              )
            : allergy.identifiedAt,

        notes:
          input.notes !==
          undefined
            ? this.normalizeOptionalText(
                input.notes,
              )
            : allergy.notes,

        updatedAt:
          new Date().toISOString(),
      };

    return this.allergiesRepository.update(
      updated,
    );
  }

  async remove(
    patientId: string,
    organizationId: string,
    allergyId: string,
  ): Promise<void> {
    await this.getMedicalRecord(
      organizationId,
      patientId,
    );

    const allergy =
      await this.allergiesRepository.findById(
        organizationId,
        allergyId,
      );

    if (
      !allergy ||
      allergy.patientId !==
        patientId
    ) {
      throw new MedicalRecordNotFoundError();
    }

    await this.allergiesRepository.delete(
      organizationId,
      allergyId,
    );
  }

  private async getMedicalRecord(
    organizationId: string,
    patientId: string,
  ) {
    const medicalRecord =
      await this.medicalRecordsRepository.findByPatientId(
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
      value.trim().length ===
        0
    ) {
      return null;
    }

    return value;
  }
}