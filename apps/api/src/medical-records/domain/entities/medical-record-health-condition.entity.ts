export enum HealthConditionStatus {
  ACTIVE = 'ACTIVE',
  CONTROLLED = 'CONTROLLED',
  RESOLVED = 'RESOLVED',
  INACTIVE = 'INACTIVE',
}

export class MedicalRecordHealthCondition {
  id!: string;
  organizationId!: string;
  medicalRecordId!: string;
  patientId!: string;

  clinicalConditionId!: string | null;

  name!: string;
  status!: HealthConditionStatus;

  diagnosedAt!: string | null;
  resolvedAt!: string | null;

  notes!: string | null;

  createdAt!: string;
  updatedAt!: string;
}