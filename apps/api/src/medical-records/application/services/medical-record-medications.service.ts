import {
  BadRequestException,
  Injectable,
} from '@nestjs/common';
import {
  randomUUID,
} from 'node:crypto';

import {
  MedicationCatalogRepository,
} from '../../../medication-catalog/domain/repositories/medication-catalog.repository';

import {
  MedicationRoute,
  MedicationStatus,
  MedicalRecordMedication,
} from '../../domain/entities/medical-record-medication.entity';

import {
  MedicalRecordNotFoundError,
} from '../../domain/errors/medical-record-not-found.error';

import {
  MedicalRecordMedicationsRepository,
} from '../../domain/repositories/medical-record-medications.repository';

import {
  MedicalRecordsRepository,
} from '../../domain/repositories/medical-records.repository';

export interface CreateMedicationInput {
  medicationCatalogId?: string;

  /*
   * Compatibilidade temporária com testes e
   * chamadas internas anteriores ao catálogo.
   *
   * A API pública não aceita mais name.
   */
  name?: string;

  dosage?: string;
  frequency?: string;
  route?: MedicationRoute;
  indication?: string;
  startedAt?: string;
  endedAt?: string;
  status?: MedicationStatus;
  notes?: string;
}

export interface UpdateMedicationInput {
  medicationCatalogId?: string;

  /*
   * Compatibilidade temporária.
   * A API pública não permite edição livre do nome.
   */
  name?: string;

  dosage?: string | null;
  frequency?: string | null;
  route?: MedicationRoute | null;
  indication?: string | null;
  startedAt?: string | null;
  endedAt?: string | null;
  status?: MedicationStatus;
  notes?: string | null;
}

@Injectable()
export class MedicalRecordMedicationsService {
  constructor(
    private readonly medicationsRepository:
      MedicalRecordMedicationsRepository,

    private readonly medicalRecordsRepository:
      MedicalRecordsRepository,

    private readonly medicationCatalogRepository:
      MedicationCatalogRepository,
  ) {}

  async create(
    patientId: string,
    organizationId: string,
    input: CreateMedicationInput,
  ): Promise<MedicalRecordMedication> {
    const medicalRecord =
      await this.getMedicalRecord(
        organizationId,
        patientId,
      );

    const canonicalMedication =
      input.medicationCatalogId
        ? await this.getMedicationCatalogItem(
            input.medicationCatalogId,
          )
        : null;

    const name =
      canonicalMedication?.name ??
      (
        input.name
          ? this.normalizeRequiredText(
              input.name,
            )
          : null
      );

    if (!name) {
      throw new BadRequestException(
        'A medication from the canonical catalog is required.',
      );
    }

    const timestamp =
      new Date().toISOString();

    const medication:
      MedicalRecordMedication = {
        id:
          randomUUID(),

        organizationId,

        medicalRecordId:
          medicalRecord.id,

        patientId,

        medicationCatalogId:
          canonicalMedication?.id ??
          null,

        name,

        dosage:
          this.normalizeOptionalText(
            input.dosage,
          ),

        frequency:
          this.normalizeOptionalText(
            input.frequency,
          ),

        route:
          input.route ??
          null,

        indication:
          this.normalizeOptionalText(
            input.indication,
          ),

        startedAt:
          this.normalizeOptionalDate(
            input.startedAt,
          ),

        endedAt:
          this.normalizeOptionalDate(
            input.endedAt,
          ),

        status:
          input.status ??
          MedicationStatus.ACTIVE,

        notes:
          this.normalizeOptionalText(
            input.notes,
          ),

        createdAt:
          timestamp,

        updatedAt:
          timestamp,
      };

    return this.medicationsRepository.create(
      medication,
    );
  }

  async listByPatient(
    patientId: string,
    organizationId: string,
  ): Promise<MedicalRecordMedication[]> {
    const medicalRecord =
      await this.getMedicalRecord(
        organizationId,
        patientId,
      );

    return this.medicationsRepository
      .listByMedicalRecordId(
        organizationId,
        medicalRecord.id,
      );
  }

  async update(
    patientId: string,
    organizationId: string,
    medicationId: string,
    input: UpdateMedicationInput,
  ): Promise<MedicalRecordMedication> {
    await this.getMedicalRecord(
      organizationId,
      patientId,
    );

    const medication =
      await this.medicationsRepository
        .findById(
          organizationId,
          medicationId,
        );

    if (
      !medication ||
      medication.patientId !==
        patientId
    ) {
      throw new MedicalRecordNotFoundError();
    }

    const canonicalMedication =
      input.medicationCatalogId !== undefined
        ? await this.getMedicationCatalogItem(
            input.medicationCatalogId,
          )
        : null;

    const updated:
      MedicalRecordMedication = {
        ...medication,

        medicationCatalogId:
          canonicalMedication
            ? canonicalMedication.id
            : medication.medicationCatalogId,

        name:
          canonicalMedication
            ? canonicalMedication.name
            : input.name !== undefined
              ? this.normalizeRequiredText(
                  input.name,
                )
              : medication.name,

        dosage:
          input.dosage !== undefined
            ? this.normalizeOptionalText(
                input.dosage,
              )
            : medication.dosage,

        frequency:
          input.frequency !== undefined
            ? this.normalizeOptionalText(
                input.frequency,
              )
            : medication.frequency,

        route:
          input.route !== undefined
            ? input.route
            : medication.route,

        indication:
          input.indication !== undefined
            ? this.normalizeOptionalText(
                input.indication,
              )
            : medication.indication,

        startedAt:
          input.startedAt !== undefined
            ? this.normalizeOptionalDate(
                input.startedAt,
              )
            : medication.startedAt,

        endedAt:
          input.endedAt !== undefined
            ? this.normalizeOptionalDate(
                input.endedAt,
              )
            : medication.endedAt,

        status:
          input.status ??
          medication.status,

        notes:
          input.notes !== undefined
            ? this.normalizeOptionalText(
                input.notes,
              )
            : medication.notes,

        updatedAt:
          new Date().toISOString(),
      };

    return this.medicationsRepository.update(
      updated,
    );
  }

  async remove(
    patientId: string,
    organizationId: string,
    medicationId: string,
  ): Promise<void> {
    await this.getMedicalRecord(
      organizationId,
      patientId,
    );

    const medication =
      await this.medicationsRepository
        .findById(
          organizationId,
          medicationId,
        );

    if (
      !medication ||
      medication.patientId !==
        patientId
    ) {
      throw new MedicalRecordNotFoundError();
    }

    await this.medicationsRepository.delete(
      organizationId,
      medicationId,
    );
  }

  private async getMedicationCatalogItem(
    medicationCatalogId: string,
  ) {
    const medication =
      await this
        .medicationCatalogRepository
        .findActiveById(
          medicationCatalogId,
        );

    if (!medication) {
      throw new BadRequestException(
        'Medication does not exist or is inactive.',
      );
    }

    return medication;
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