import { Injectable } from '@nestjs/common';
import { randomUUID } from 'node:crypto';

import {
  Patient,
  PatientStatus,
} from '../../domain/entities/patient.entity';
import { PatientEmailAlreadyExistsError } from '../../domain/errors/patient-email-already-exists.error';
import { PatientNotFoundError } from '../../domain/errors/patient-not-found.error';
import { PatientsRepository } from '../../domain/repositories/patients.repository';
import { CreatePatientDto } from '../../presentation/dto/create-patient.dto';
import { UpdatePatientDto } from '../../presentation/dto/update-patient.dto';

@Injectable()
export class PatientsService {
  constructor(
    private readonly patientsRepository: PatientsRepository,
  ) {}

  async createPatient(
    dto: CreatePatientDto,
    organizationId: string,
  ): Promise<Patient> {
    const normalizedEmail =
      this.normalizeEmail(dto.email);

    await this.ensureEmailIsAvailable(
      organizationId,
      normalizedEmail,
    );

    const timestamp =
      new Date().toISOString();

    const patient: Patient = {
      id: randomUUID(),
      organizationId,
      name: dto.name.trim(),
      email: normalizedEmail,
      phone:
        dto.phone?.trim() ??
        null,
      birthDate:
        dto.birthDate ?? null,
      status: PatientStatus.ACTIVE,
      createdAt: timestamp,
      updatedAt: timestamp,
    };

    return this.patientsRepository.create(
      patient,
    );
  }

  async listPatients(
    organizationId: string,
  ): Promise<Patient[]> {
    return this.patientsRepository.listByOrganization(
      organizationId,
    );
  }

  async getPatientById(
    patientId: string,
    organizationId: string,
  ): Promise<Patient> {
    const patient =
      await this.patientsRepository.findById(
        organizationId,
        patientId,
      );

    if (!patient) {
      throw new PatientNotFoundError();
    }

    return patient;
  }

  async updatePatient(
    patientId: string,
    organizationId: string,
    dto: UpdatePatientDto,
  ): Promise<Patient> {
    const patient =
      await this.getPatientById(
        patientId,
        organizationId,
      );

    const normalizedEmail =
      dto.email !== undefined
        ? this.normalizeEmail(dto.email)
        : patient.email;

    await this.ensureEmailIsAvailable(
      organizationId,
      normalizedEmail,
      patient.id,
    );

    const updatedPatient: Patient = {
      ...patient,
      name:
        dto.name !== undefined
          ? dto.name.trim()
          : patient.name,
      email: normalizedEmail,
      phone:
        dto.phone !== undefined
          ? dto.phone.trim()
          : patient.phone,
      birthDate:
        dto.birthDate !== undefined
          ? dto.birthDate
          : patient.birthDate,
      updatedAt:
        new Date().toISOString(),
    };

    return this.patientsRepository.update(
      updatedPatient,
    );
  }

  async updatePatientStatus(
    patientId: string,
    organizationId: string,
    status: PatientStatus,
  ): Promise<Patient> {
    const patient =
      await this.getPatientById(
        patientId,
        organizationId,
      );

    const updatedPatient: Patient = {
      ...patient,
      status,
      updatedAt:
        new Date().toISOString(),
    };

    return this.patientsRepository.update(
      updatedPatient,
    );
  }

  private normalizeEmail(
    email: string | undefined,
  ): string | null {
    if (email === undefined) {
      return null;
    }

    return email
      .trim()
      .toLowerCase();
  }

  private async ensureEmailIsAvailable(
    organizationId: string,
    email: string | null,
    currentPatientId?: string,
  ): Promise<void> {
    if (!email) {
      return;
    }

    const existingPatient =
      await this.patientsRepository.findByEmail(
        organizationId,
        email,
      );

    if (
      existingPatient &&
      existingPatient.id !==
        currentPatientId
    ) {
      throw new PatientEmailAlreadyExistsError();
    }
  }
}