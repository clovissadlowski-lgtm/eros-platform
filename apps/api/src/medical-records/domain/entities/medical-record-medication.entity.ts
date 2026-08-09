export enum MedicationStatus {
  ACTIVE = 'ACTIVE',
  SUSPENDED = 'SUSPENDED',
  COMPLETED = 'COMPLETED',
  DISCONTINUED = 'DISCONTINUED',
}

export enum MedicationRoute {
  ORAL = 'ORAL',
  SUBCUTANEOUS = 'SUBCUTANEOUS',
  INTRAMUSCULAR = 'INTRAMUSCULAR',
  INTRAVENOUS = 'INTRAVENOUS',
  TOPICAL = 'TOPICAL',
  INHALATION = 'INHALATION',
  SUBLINGUAL = 'SUBLINGUAL',
  RECTAL = 'RECTAL',
  VAGINAL = 'VAGINAL',
  OPHTHALMIC = 'OPHTHALMIC',
  OTIC = 'OTIC',
  NASAL = 'NASAL',
  OTHER = 'OTHER',
}

export class MedicalRecordMedication {
  id!: string;
  organizationId!: string;
  medicalRecordId!: string;
  patientId!: string;

  medicationCatalogId!: string | null;

  name!: string;
  dosage!: string | null;
  frequency!: string | null;
  route!: MedicationRoute | null;
  indication!: string | null;

  startedAt!: string | null;
  endedAt!: string | null;

  status!: MedicationStatus;

  notes!: string | null;

  createdAt!: string;
  updatedAt!: string;
}