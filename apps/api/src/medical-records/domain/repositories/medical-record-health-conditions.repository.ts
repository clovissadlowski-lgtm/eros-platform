import {
  MedicalRecordHealthCondition,
} from '../entities/medical-record-health-condition.entity';

export abstract class MedicalRecordHealthConditionsRepository {
  abstract create(
    healthCondition:
      MedicalRecordHealthCondition,
  ): Promise<MedicalRecordHealthCondition>;

  abstract findById(
    organizationId: string,
    healthConditionId: string,
  ): Promise<MedicalRecordHealthCondition | null>;

  abstract listByMedicalRecordId(
    organizationId: string,
    medicalRecordId: string,
  ): Promise<MedicalRecordHealthCondition[]>;

  abstract update(
    healthCondition:
      MedicalRecordHealthCondition,
  ): Promise<MedicalRecordHealthCondition>;

  abstract delete(
    organizationId: string,
    healthConditionId: string,
  ): Promise<void>;
}