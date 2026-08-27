import {
  Patient,
} from '../../domain/entities/patient.entity';

import {
  PatientsRepository,
} from '../../domain/repositories/patients.repository';

export class InMemoryPatientsRepository
  implements PatientsRepository
{
  public readonly items:
    Patient[] = [];

  async create(
    patient: Patient,
  ): Promise<Patient> {
    this.items.push(
      patient,
    );

    return patient;
  }

  async listByOrganization(
    organizationId: string,
  ): Promise<Patient[]> {
    return this.items.filter(
      (
        patient,
      ) =>
        patient.organizationId ===
        organizationId,
    );
  }

  async findById(
    organizationId: string,
    patientId: string,
  ): Promise<Patient | null> {
    return (
      this.items.find(
        (
          patient,
        ) =>
          patient.organizationId ===
            organizationId &&
          patient.id ===
            patientId,
      ) ??
      null
    );
  }

  async findByEmail(
    organizationId: string,
    email: string,
  ): Promise<Patient | null> {
    const normalizedEmail =
      email
        .trim()
        .toLowerCase();

    return (
      this.items.find(
        (
          patient,
        ) =>
          patient.organizationId ===
            organizationId &&
          patient.email?.toLowerCase() ===
            normalizedEmail,
      ) ??
      null
    );
  }

  async findByCpf(
    organizationId: string,
    cpf: string,
  ): Promise<Patient | null> {
    const normalizedCpf =
      cpf.trim();

    return (
      this.items.find(
        (
          patient,
        ) =>
          patient.organizationId ===
            organizationId &&
          patient.cpf ===
            normalizedCpf,
      ) ??
      null
    );
  }

  async update(
    patient: Patient,
  ): Promise<Patient> {
    const index =
      this.items.findIndex(
        (
          item,
        ) =>
          item.id ===
            patient.id,
      );

    if (
      index >= 0
    ) {
      this.items[index] =
        patient;
    }

    return patient;
  }
}