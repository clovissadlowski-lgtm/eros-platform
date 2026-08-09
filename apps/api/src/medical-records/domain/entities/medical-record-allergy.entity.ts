export enum AllergyType {
  MEDICATION = 'MEDICATION',
  FOOD = 'FOOD',
  ENVIRONMENTAL = 'ENVIRONMENTAL',
  CONTACT = 'CONTACT',
  OTHER = 'OTHER',
}

export enum AllergySeverity {
  MILD = 'MILD',
  MODERATE = 'MODERATE',
  SEVERE = 'SEVERE',
  LIFE_THREATENING = 'LIFE_THREATENING',
}

export enum AllergyStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  RESOLVED = 'RESOLVED',
}

export class MedicalRecordAllergy {
  id!: string;
  organizationId!: string;
  medicalRecordId!: string;
  patientId!: string;

  substance!: string;
  type!: AllergyType;
  reaction!: string | null;
  severity!: AllergySeverity | null;
  status!: AllergyStatus;

  identifiedAt!: string | null;

  notes!: string | null;

  createdAt!: string;
  updatedAt!: string;
}