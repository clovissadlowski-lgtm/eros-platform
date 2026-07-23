import { Injectable } from '@nestjs/common';
import { Patient } from '../../domain/entities/patient.entity';
import { PatientsRepository } from '../../domain/repositories/patients.repository';

@Injectable()
export class InMemoryPatientsRepository
  implements PatientsRepository
{
  private readonly patients: Patient[] = [];

  async create(patient: Patient): Promise<Patient> {
    this.patients.push(patient);

    return patient;
  }

  async listByOrganization(
    organizationId: string,
  ): Promise<Patient[]> {
    return this.patients.filter(
      (patient) => patient.organizationId === organizationId,
    );
  }

  async findById(
    organizationId: string,
    patientId: string,
  ): Promise<Patient | null> {
    return (
      this.patients.find(
        (patient) =>
          patient.id === patientId &&
          patient.organizationId === organizationId,
      ) ?? null
    );
  }
}
