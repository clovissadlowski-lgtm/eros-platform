import {
  MedicalRecordMedication,
} from '../../domain/entities/medical-record-medication.entity';
import {
  MedicalRecordMedicationsRepository,
} from '../../domain/repositories/medical-record-medications.repository';

export class InMemoryMedicalRecordMedicationsRepository
  implements MedicalRecordMedicationsRepository
{
  private readonly medications:
    MedicalRecordMedication[] = [];

  async create(
    medication:
      MedicalRecordMedication,
  ): Promise<MedicalRecordMedication> {
    const stored = {
      ...medication,
    };

    this.medications.push(
      stored,
    );

    return {
      ...stored,
    };
  }

  async findById(
    organizationId: string,
    medicationId: string,
  ): Promise<MedicalRecordMedication | null> {
    const medication =
      this.medications.find(
        (stored) =>
          stored.id ===
            medicationId &&
          stored.organizationId ===
            organizationId,
      );

    return medication
      ? {
          ...medication,
        }
      : null;
  }

  async listByMedicalRecordId(
    organizationId: string,
    medicalRecordId: string,
  ): Promise<MedicalRecordMedication[]> {
    return this.medications
      .filter(
        (stored) =>
          stored.organizationId ===
            organizationId &&
          stored.medicalRecordId ===
            medicalRecordId,
      )
      .map(
        (medication) => ({
          ...medication,
        }),
      );
  }

  async update(
    medication:
      MedicalRecordMedication,
  ): Promise<MedicalRecordMedication> {
    const index =
      this.medications.findIndex(
        (stored) =>
          stored.id ===
            medication.id &&
          stored.organizationId ===
            medication.organizationId,
      );

    if (index < 0) {
      throw new Error(
        'Medication not found in memory repository.',
      );
    }

    const updated = {
      ...medication,
    };

    this.medications[
      index
    ] = updated;

    return {
      ...updated,
    };
  }

  async delete(
    organizationId: string,
    medicationId: string,
  ): Promise<void> {
    const index =
      this.medications.findIndex(
        (stored) =>
          stored.id ===
            medicationId &&
          stored.organizationId ===
            organizationId,
      );

    if (index < 0) {
      return;
    }

    this.medications.splice(
      index,
      1,
    );
  }
}