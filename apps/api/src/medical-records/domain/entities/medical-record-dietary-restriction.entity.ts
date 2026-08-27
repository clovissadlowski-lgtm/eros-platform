export enum DietaryRestrictionType {
  PREFERENCE = 'PREFERENCE',
  INTOLERANCE = 'INTOLERANCE',
  MEDICAL_RESTRICTION = 'MEDICAL_RESTRICTION',
  CULTURAL_RELIGIOUS = 'CULTURAL_RELIGIOUS',
  ETHICAL_LIFESTYLE = 'ETHICAL_LIFESTYLE',
  OTHER = 'OTHER',
}

export enum DietaryRestrictionAction {
  AVOID = 'AVOID',
  LIMIT = 'LIMIT',
  MONITOR = 'MONITOR',
  KEEP_CONSISTENT = 'KEEP_CONSISTENT',
  BLOCK = 'BLOCK',
}

export enum DietaryRestrictionRisk {
  NONE = 'NONE',
  LOW = 'LOW',
  MODERATE = 'MODERATE',
  HIGH = 'HIGH',
  CRITICAL = 'CRITICAL',
}

export enum DietaryRestrictionSource {
  PATIENT_REPORTED = 'PATIENT_REPORTED',
  PROFESSIONAL_REPORTED = 'PROFESSIONAL_REPORTED',
  SYSTEM_DERIVED = 'SYSTEM_DERIVED',
}

export enum DietaryRestrictionStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  RESOLVED = 'RESOLVED',
}

export class MedicalRecordDietaryRestriction {
  id!: string;
  organizationId!: string;
  medicalRecordId!: string;
  patientId!: string;

  dietaryItemCatalogId!: string | null;

  item!: string;
  type!: DietaryRestrictionType;
  action!: DietaryRestrictionAction;
  risk!: DietaryRestrictionRisk;
  source!: DietaryRestrictionSource;

  reason!: string | null;
  identifiedAt!: string | null;
  status!: DietaryRestrictionStatus;
  notes!: string | null;

  createdAt!: string;
  updatedAt!: string;
}