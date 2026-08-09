import {
  MedicalRecordHealthCondition,
} from '../../domain/entities/medical-record-health-condition.entity';
import {
  MedicalRecordHealthConditionsRepository,
} from '../../domain/repositories/medical-record-health-conditions.repository';

export class InMemoryMedicalRecordHealthConditionsRepository
  implements MedicalRecordHealthConditionsRepository
{
  private readonly healthConditions:
    MedicalRecordHealthCondition[] = [];

  async create(
    healthCondition:
      MedicalRecordHealthCondition,
  ): Promise<MedicalRecordHealthCondition> {
    const storedHealthCondition = {
      ...healthCondition,
    };

    this.healthConditions.push(
      storedHealthCondition,
    );

    return {
      ...storedHealthCondition,
    };
  }

  async findById(
    organizationId: string,
    healthConditionId: string,
  ): Promise<MedicalRecordHealthCondition | null> {
    const healthCondition =
      this.healthConditions.find(
        (storedHealthCondition) =>
          storedHealthCondition.id ===
            healthConditionId &&
          storedHealthCondition.organizationId ===
            organizationId,
      );

    return healthCondition
      ? {
          ...healthCondition,
        }
      : null;
  }

  async listByMedicalRecordId(
    organizationId: string,
    medicalRecordId: string,
  ): Promise<MedicalRecordHealthCondition[]> {
    return this.healthConditions
      .filter(
        (storedHealthCondition) =>
          storedHealthCondition.organizationId ===
            organizationId &&
          storedHealthCondition.medicalRecordId ===
            medicalRecordId,
      )
      .map(
        (healthCondition) => ({
          ...healthCondition,
        }),
      );
  }

  async update(
    healthCondition:
      MedicalRecordHealthCondition,
  ): Promise<MedicalRecordHealthCondition> {
    const healthConditionIndex =
      this.healthConditions.findIndex(
        (storedHealthCondition) =>
          storedHealthCondition.id ===
            healthCondition.id &&
          storedHealthCondition.organizationId ===
            healthCondition.organizationId,
      );

    if (healthConditionIndex < 0) {
      throw new Error(
        'Health condition not found in memory repository.',
      );
    }

    const updatedHealthCondition = {
      ...healthCondition,
    };

    this.healthConditions[
      healthConditionIndex
    ] = updatedHealthCondition;

    return {
      ...updatedHealthCondition,
    };
  }

  async delete(
    organizationId: string,
    healthConditionId: string,
  ): Promise<void> {
    const healthConditionIndex =
      this.healthConditions.findIndex(
        (storedHealthCondition) =>
          storedHealthCondition.id ===
            healthConditionId &&
          storedHealthCondition.organizationId ===
            organizationId,
      );

    if (healthConditionIndex < 0) {
      return;
    }

    this.healthConditions.splice(
      healthConditionIndex,
      1,
    );
  }
}