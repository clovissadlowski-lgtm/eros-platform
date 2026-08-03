import { MedicalRecord } from '../../domain/entities/medical-record.entity';
import { MedicalRecordsRepository } from '../../domain/repositories/medical-records.repository';

export class InMemoryMedicalRecordsRepository
  implements MedicalRecordsRepository
{
  private readonly medicalRecords:
    MedicalRecord[] = [];

  async create(
    medicalRecord: MedicalRecord,
  ): Promise<MedicalRecord> {
    const storedMedicalRecord = {
      ...medicalRecord,
    };

    this.medicalRecords.push(
      storedMedicalRecord,
    );

    return {
      ...storedMedicalRecord,
    };
  }

  async findById(
    organizationId: string,
    medicalRecordId: string,
  ): Promise<MedicalRecord | null> {
    const medicalRecord =
      this.medicalRecords.find(
        (storedMedicalRecord) =>
          storedMedicalRecord.id ===
            medicalRecordId &&
          storedMedicalRecord.organizationId ===
            organizationId,
      );

    return medicalRecord
      ? {
          ...medicalRecord,
        }
      : null;
  }

  async findByPatientId(
    organizationId: string,
    patientId: string,
  ): Promise<MedicalRecord | null> {
    const medicalRecord =
      this.medicalRecords.find(
        (storedMedicalRecord) =>
          storedMedicalRecord.patientId ===
            patientId &&
          storedMedicalRecord.organizationId ===
            organizationId,
      );

    return medicalRecord
      ? {
          ...medicalRecord,
        }
      : null;
  }

  async update(
    medicalRecord: MedicalRecord,
  ): Promise<MedicalRecord> {
    const medicalRecordIndex =
      this.medicalRecords.findIndex(
        (storedMedicalRecord) =>
          storedMedicalRecord.id ===
            medicalRecord.id &&
          storedMedicalRecord.organizationId ===
            medicalRecord.organizationId,
      );

    if (medicalRecordIndex < 0) {
      throw new Error(
        'Medical record not found in memory repository.',
      );
    }

    const updatedMedicalRecord = {
      ...medicalRecord,
    };

    this.medicalRecords[
      medicalRecordIndex
    ] = updatedMedicalRecord;

    return {
      ...updatedMedicalRecord,
    };
  }
}