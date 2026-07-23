import { Injectable } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { Patient, PatientStatus } from '../../domain/entities/patient.entity';
import { PatientNotFoundError } from '../../domain/errors/patient-not-found.error';
import { PatientsRepository } from '../../domain/repositories/patients.repository';
import { CreatePatientDto } from '../../presentation/dto/create-patient.dto';

export const DEVELOPMENT_ORGANIZATION_ID =
  'development-organization';

@Injectable()
export class PatientsService {
  constructor(
    private readonly patientsRepository: PatientsRepository,
  ) {}

  async createPatient(
    dto: CreatePatientDto,
    organizationId = DEVELOPMENT_ORGANIZATION_ID,
  ): Promise<Patient> {
    const timestamp = new Date().toISOString();

    const patient: Patient = {
      id: randomUUID(),
      organizationId,
      name: dto.name.trim(),
      email: dto.email ?? null,
      phone: dto.phone ?? null,
      birthDate: dto.birthDate ?? null,
      status: PatientStatus.ACTIVE,
      createdAt: timestamp,
      updatedAt: timestamp,
    };

    return this.patientsRepository.create(patient);
  }

  async listPatients(
    organizationId = DEVELOPMENT_ORGANIZATION_ID,
  ): Promise<Patient[]> {
    return this.patientsRepository.listByOrganization(
      organizationId,
    );
  }

  async getPatientById(
    patientId: string,
    organizationId = DEVELOPMENT_ORGANIZATION_ID,
  ): Promise<Patient> {
    const patient = await this.patientsRepository.findById(
      organizationId,
      patientId,
    );

    if (!patient) {
      throw new PatientNotFoundError();
    }

    return patient;
  }
}
