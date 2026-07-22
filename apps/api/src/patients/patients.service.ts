import { Injectable } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { CreatePatientDto } from './dto/create-patient.dto';
import { Patient, PatientStatus } from './entities/patient.entity';
import { PatientNotFoundError } from './errors/patient-not-found.error';

export const DEVELOPMENT_ORGANIZATION_ID = 'development-organization';

@Injectable()
export class PatientsService {
  private readonly patients: Patient[] = [];

  createPatient(
    dto: CreatePatientDto,
    organizationId = DEVELOPMENT_ORGANIZATION_ID,
  ): Patient {
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

    this.patients.push(patient);

    return patient;
  }

  listPatients(
    organizationId = DEVELOPMENT_ORGANIZATION_ID,
  ): Patient[] {
    return this.patients.filter(
      (patient) => patient.organizationId === organizationId,
    );
  }

  getPatientById(
    patientId: string,
    organizationId = DEVELOPMENT_ORGANIZATION_ID,
  ): Patient {
    const patient = this.patients.find(
      (item) =>
        item.id === patientId &&
        item.organizationId === organizationId,
    );

    if (!patient) {
      throw new PatientNotFoundError();
    }

    return patient;
  }
}
