import { Patient } from '../entities/patient.entity';

export abstract class PatientsRepository {
  abstract create(
    patient: Patient,
  ): Promise<Patient>;

  abstract listByOrganization(
    organizationId: string,
  ): Promise<Patient[]>;

  abstract findById(
    organizationId: string,
    patientId: string,
  ): Promise<Patient | null>;

  abstract findByEmail(
    organizationId: string,
    email: string,
  ): Promise<Patient | null>;

  abstract findByCpf(
    organizationId: string,
    cpf: string,
  ): Promise<Patient | null>;

  abstract update(
    patient: Patient,
  ): Promise<Patient>;
}