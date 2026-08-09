import {
  MedicalRecordAllergy,
} from '../../domain/entities/medical-record-allergy.entity';
import {
  MedicalRecordAllergiesRepository,
} from '../../domain/repositories/medical-record-allergies.repository';

export class InMemoryMedicalRecordAllergiesRepository
  implements MedicalRecordAllergiesRepository
{
  private readonly allergies:
    MedicalRecordAllergy[] = [];

  async create(
    allergy:
      MedicalRecordAllergy,
  ): Promise<MedicalRecordAllergy> {
    const stored = {
      ...allergy,
    };

    this.allergies.push(
      stored,
    );

    return {
      ...stored,
    };
  }

  async findById(
    organizationId: string,
    allergyId: string,
  ): Promise<MedicalRecordAllergy | null> {
    const allergy =
      this.allergies.find(
        (stored) =>
          stored.id ===
            allergyId &&
          stored.organizationId ===
            organizationId,
      );

    return allergy
      ? {
          ...allergy,
        }
      : null;
  }

  async listByMedicalRecordId(
    organizationId: string,
    medicalRecordId: string,
  ): Promise<MedicalRecordAllergy[]> {
    return this.allergies
      .filter(
        (stored) =>
          stored.organizationId ===
            organizationId &&
          stored.medicalRecordId ===
            medicalRecordId,
      )
      .map(
        (allergy) => ({
          ...allergy,
        }),
      );
  }

  async update(
    allergy:
      MedicalRecordAllergy,
  ): Promise<MedicalRecordAllergy> {
    const index =
      this.allergies.findIndex(
        (stored) =>
          stored.id ===
            allergy.id &&
          stored.organizationId ===
            allergy.organizationId,
      );

    if (index < 0) {
      throw new Error(
        'Allergy not found in memory repository.',
      );
    }

    const updated = {
      ...allergy,
    };

    this.allergies[
      index
    ] = updated;

    return {
      ...updated,
    };
  }

  async delete(
    organizationId: string,
    allergyId: string,
  ): Promise<void> {
    const index =
      this.allergies.findIndex(
        (stored) =>
          stored.id ===
            allergyId &&
          stored.organizationId ===
            organizationId,
      );

    if (index < 0) {
      return;
    }

    this.allergies.splice(
      index,
      1,
    );
  }
}