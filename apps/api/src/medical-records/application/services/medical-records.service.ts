import { Injectable } from '@nestjs/common';
import { randomUUID } from 'node:crypto';

import { PatientNotFoundError } from '../../../patients/domain/errors/patient-not-found.error';
import { PatientsRepository } from '../../../patients/domain/repositories/patients.repository';
import {
  MedicalRecord,
  MedicalRecordStatus,
} from '../../domain/entities/medical-record.entity';
import { MedicalRecordAlreadyExistsError } from '../../domain/errors/medical-record-already-exists.error';
import { MedicalRecordNotFoundError } from '../../domain/errors/medical-record-not-found.error';
import { MedicalRecordsRepository } from '../../domain/repositories/medical-records.repository';

export interface CreateMedicalRecordInput {
  chiefComplaint?: string;
  clinicalHistory?: string;
  familyHistory?: string;
  allergies?: string;
  currentMedications?: string;
  healthConditions?: string;
  clinicalNotes?: string;
  treatmentGoals?: string;
}

export interface UpdateMedicalRecordInput {
  chiefComplaint?: string;
  clinicalHistory?: string;
  familyHistory?: string;
  allergies?: string;
  currentMedications?: string;
  healthConditions?: string;
  clinicalNotes?: string;
  treatmentGoals?: string;
}

@Injectable()
export class MedicalRecordsService {
  constructor(
    private readonly medicalRecordsRepository:
      MedicalRecordsRepository,
    private readonly patientsRepository:
      PatientsRepository,
  ) {}

  async createMedicalRecord(
    patientId: string,
    organizationId: string,
    input: CreateMedicalRecordInput,
  ): Promise<MedicalRecord> {
    await this.ensurePatientExists(
      organizationId,
      patientId,
    );

    const existingMedicalRecord =
      await this.medicalRecordsRepository.findByPatientId(
        organizationId,
        patientId,
      );

    if (existingMedicalRecord) {
      throw new MedicalRecordAlreadyExistsError();
    }

    const timestamp =
      new Date().toISOString();

    const medicalRecord: MedicalRecord = {
      id: randomUUID(),
      organizationId,
      patientId,
      chiefComplaint:
        this.normalizeOptionalText(
          input.chiefComplaint,
        ),
      clinicalHistory:
        this.normalizeOptionalText(
          input.clinicalHistory,
        ),
      familyHistory:
        this.normalizeOptionalText(
          input.familyHistory,
        ),
      allergies:
        this.normalizeOptionalText(
          input.allergies,
        ),
      currentMedications:
        this.normalizeOptionalText(
          input.currentMedications,
        ),
      healthConditions:
        this.normalizeOptionalText(
          input.healthConditions,
        ),
      clinicalNotes:
        this.normalizeOptionalText(
          input.clinicalNotes,
        ),
      treatmentGoals:
        this.normalizeOptionalText(
          input.treatmentGoals,
        ),
      status: MedicalRecordStatus.ACTIVE,
      createdAt: timestamp,
      updatedAt: timestamp,
    };

    return this.medicalRecordsRepository.create(
      medicalRecord,
    );
  }

  async getMedicalRecordByPatientId(
    patientId: string,
    organizationId: string,
  ): Promise<MedicalRecord> {
    await this.ensurePatientExists(
      organizationId,
      patientId,
    );

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

  async updateMedicalRecord(
    patientId: string,
    organizationId: string,
    input: UpdateMedicalRecordInput,
  ): Promise<MedicalRecord> {
    const medicalRecord =
      await this.getMedicalRecordByPatientId(
        patientId,
        organizationId,
      );

    const updatedMedicalRecord: MedicalRecord = {
      ...medicalRecord,
      chiefComplaint:
        input.chiefComplaint !== undefined
          ? this.normalizeOptionalText(
              input.chiefComplaint,
            )
          : medicalRecord.chiefComplaint,
      clinicalHistory:
        input.clinicalHistory !== undefined
          ? this.normalizeOptionalText(
              input.clinicalHistory,
            )
          : medicalRecord.clinicalHistory,
      familyHistory:
        input.familyHistory !== undefined
          ? this.normalizeOptionalText(
              input.familyHistory,
            )
          : medicalRecord.familyHistory,
      allergies:
        input.allergies !== undefined
          ? this.normalizeOptionalText(
              input.allergies,
            )
          : medicalRecord.allergies,
      currentMedications:
        input.currentMedications !== undefined
          ? this.normalizeOptionalText(
              input.currentMedications,
            )
          : medicalRecord.currentMedications,
      healthConditions:
        input.healthConditions !== undefined
          ? this.normalizeOptionalText(
              input.healthConditions,
            )
          : medicalRecord.healthConditions,
      clinicalNotes:
        input.clinicalNotes !== undefined
          ? this.normalizeOptionalText(
              input.clinicalNotes,
            )
          : medicalRecord.clinicalNotes,
      treatmentGoals:
        input.treatmentGoals !== undefined
          ? this.normalizeOptionalText(
              input.treatmentGoals,
            )
          : medicalRecord.treatmentGoals,
      updatedAt: new Date().toISOString(),
    };

    return this.medicalRecordsRepository.update(
      updatedMedicalRecord,
    );
  }

  async updateMedicalRecordStatus(
    patientId: string,
    organizationId: string,
    status: MedicalRecordStatus,
  ): Promise<MedicalRecord> {
    const medicalRecord =
      await this.getMedicalRecordByPatientId(
        patientId,
        organizationId,
      );

    const updatedMedicalRecord: MedicalRecord = {
      ...medicalRecord,
      status,
      updatedAt: new Date().toISOString(),
    };

    return this.medicalRecordsRepository.update(
      updatedMedicalRecord,
    );
  }

  private async ensurePatientExists(
    organizationId: string,
    patientId: string,
  ): Promise<void> {
    const patient =
      await this.patientsRepository.findById(
        organizationId,
        patientId,
      );

    if (!patient) {
      throw new PatientNotFoundError();
    }
  }

  private normalizeOptionalText(
    value: string | undefined,
  ): string | null {
    if (value === undefined) {
      return null;
    }

    const normalizedValue =
      value.trim();

    return normalizedValue.length > 0
      ? normalizedValue
      : null;
  }
}