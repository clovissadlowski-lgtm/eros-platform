import {
  MedicalRecordAllergy,
} from '../entities/medical-record-allergy.entity';

export abstract class MedicalRecordAllergiesRepository {
  abstract create(
    allergy:
      MedicalRecordAllergy,
  ): Promise<MedicalRecordAllergy>;

  abstract findById(
    organizationId: string,
    allergyId: string,
  ): Promise<MedicalRecordAllergy | null>;

  abstract listByMedicalRecordId(
    organizationId: string,
    medicalRecordId: string,
  ): Promise<MedicalRecordAllergy[]>;

  abstract update(
    allergy:
      MedicalRecordAllergy,
  ): Promise<MedicalRecordAllergy>;

  abstract delete(
    organizationId: string,
    allergyId: string,
  ): Promise<void>;
}