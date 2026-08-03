import { Patient } from '../../domain/entities/patient.entity';
import { PatientsRepository } from '../../domain/repositories/patients.repository';

export class InMemoryPatientsRepository
  implements PatientsRepository
{
  private readonly patients: Patient[] = [];

  async create(
    patient: Patient,
  ): Promise<Patient> {
    const storedPatient = {
      ...patient,
    };

    this.patients.push(storedPatient);

    return {
      ...storedPatient,
    };
  }

  async listByOrganization(
    organizationId: string,
  ): Promise<Patient[]> {
    return this.patients
      .filter(
        (patient) =>
          patient.organizationId ===
          organizationId,
      )
      .map((patient) => ({
        ...patient,
      }));
  }

  async findById(
    organizationId: string,
    patientId: string,
  ): Promise<Patient | null> {
    const patient =
      this.patients.find(
        (storedPatient) =>
          storedPatient.id === patientId &&
          storedPatient.organizationId ===
            organizationId,
      );

    return patient
      ? {
          ...patient,
        }
      : null;
  }

  async findByEmail(
    organizationId: string,
    email: string,
  ): Promise<Patient | null> {
    const normalizedEmail =
      email.trim().toLowerCase();

    const patient =
      this.patients.find(
        (storedPatient) =>
          storedPatient.organizationId ===
            organizationId &&
          storedPatient.email
            ?.trim()
            .toLowerCase() ===
            normalizedEmail,
      );

    return patient
      ? {
          ...patient,
        }
      : null;
  }

  async update(
    patient: Patient,
  ): Promise<Patient> {
    const patientIndex =
      this.patients.findIndex(
        (storedPatient) =>
          storedPatient.id === patient.id &&
          storedPatient.organizationId ===
            patient.organizationId,
      );

    if (patientIndex < 0) {
      throw new Error(
        'Patient not found in memory repository.',
      );
    }

    const updatedPatient = {
      ...patient,
    };

    this.patients[patientIndex] =
      updatedPatient;

    return {
      ...updatedPatient,
    };
  }
}