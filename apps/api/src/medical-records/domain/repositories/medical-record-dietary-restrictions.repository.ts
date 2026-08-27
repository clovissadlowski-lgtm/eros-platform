import {
  MedicalRecordDietaryRestriction,
} from '../entities/medical-record-dietary-restriction.entity';

export abstract class MedicalRecordDietaryRestrictionsRepository {
  abstract create(
    restriction:
      MedicalRecordDietaryRestriction,
  ): Promise<MedicalRecordDietaryRestriction>;

  abstract findById(
    organizationId: string,
    restrictionId: string,
  ): Promise<MedicalRecordDietaryRestriction | null>;

  abstract listByMedicalRecordId(
    organizationId: string,
    medicalRecordId: string,
  ): Promise<MedicalRecordDietaryRestriction[]>;

  abstract update(
    restriction:
      MedicalRecordDietaryRestriction,
  ): Promise<MedicalRecordDietaryRestriction>;

  abstract delete(
    organizationId: string,
    restrictionId: string,
  ): Promise<void>;
}