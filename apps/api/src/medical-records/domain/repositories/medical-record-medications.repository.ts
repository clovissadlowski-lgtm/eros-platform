import {
  MedicalRecordMedication,
} from '../entities/medical-record-medication.entity';

export abstract class MedicalRecordMedicationsRepository {
  abstract create(
    medication:
      MedicalRecordMedication,
  ): Promise<MedicalRecordMedication>;

  abstract findById(
    organizationId: string,
    medicationId: string,
  ): Promise<MedicalRecordMedication | null>;

  abstract listByMedicalRecordId(
    organizationId: string,
    medicalRecordId: string,
  ): Promise<MedicalRecordMedication[]>;

  abstract update(
    medication:
      MedicalRecordMedication,
  ): Promise<MedicalRecordMedication>;

  abstract delete(
    organizationId: string,
    medicationId: string,
  ): Promise<void>;
}