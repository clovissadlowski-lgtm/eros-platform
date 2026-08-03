export enum MedicalRecordStatus {
  ACTIVE = 'ACTIVE',
  ARCHIVED = 'ARCHIVED',
}

export class MedicalRecord {
  id!: string;
  organizationId!: string;
  patientId!: string;

  chiefComplaint!: string | null;
  clinicalHistory!: string | null;
  familyHistory!: string | null;
  allergies!: string | null;
  currentMedications!: string | null;
  healthConditions!: string | null;
  clinicalNotes!: string | null;
  treatmentGoals!: string | null;

  status!: MedicalRecordStatus;

  createdAt!: string;
  updatedAt!: string;
}