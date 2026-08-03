import { MedicalRecord } from '../entities/medical-record.entity';

export abstract class MedicalRecordsRepository {
  abstract create(
    medicalRecord: MedicalRecord,
  ): Promise<MedicalRecord>;

  abstract findById(
    organizationId: string,
    medicalRecordId: string,
  ): Promise<MedicalRecord | null>;

  abstract findByPatientId(
    organizationId: string,
    patientId: string,
  ): Promise<MedicalRecord | null>;

  abstract update(
    medicalRecord: MedicalRecord,
  ): Promise<MedicalRecord>;
}