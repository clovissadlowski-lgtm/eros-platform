export type HealthConditionStatus =
  | 'ACTIVE'
  | 'CONTROLLED'
  | 'RESOLVED'
  | 'INACTIVE';

export interface HealthCondition {
  id: string;
  organizationId: string;
  medicalRecordId: string;
  patientId: string;

  clinicalConditionId: string | null;

  name: string;
  status: HealthConditionStatus;

  diagnosedAt: string | null;
  resolvedAt: string | null;

  notes: string | null;

  createdAt: string;
  updatedAt: string;
}

export interface CreateHealthConditionInput {
  clinicalConditionId: string;
  status?: HealthConditionStatus;
  diagnosedAt?: string;
  resolvedAt?: string;
  notes?: string;
}

export interface UpdateHealthConditionInput {
  clinicalConditionId?: string;
  status?: HealthConditionStatus;
  diagnosedAt?: string | null;
  resolvedAt?: string | null;
  notes?: string | null;
}

export type ClinicalConceptType =
  | 'CONDITION'
  | 'DISEASE'
  | 'DISORDER'
  | 'SYNDROME'
  | 'CLINICAL_FINDING'
  | 'OTHER';

export type TerminologySystem =
  | 'SNOMED_CT'
  | 'ICD_10'
  | 'ICD_11'
  | 'OTHER';

export interface ClinicalConditionSynonym {
  id: string;
  term: string;
  normalizedTerm: string;
}

export interface ClinicalConditionExternalCode {
  id: string;
  system: TerminologySystem;
  code: string;
  display: string | null;
  version: string | null;
  isPrimary: boolean;
}

export interface ClinicalConditionCatalogItem {
  id: string;
  name: string;
  normalizedName: string;
  conceptType: ClinicalConceptType;
  category: string | null;
  description: string | null;
  isActive: boolean;
  synonyms: ClinicalConditionSynonym[];
  externalCodes: ClinicalConditionExternalCode[];
}

export type MedicationStatus =
  | 'ACTIVE'
  | 'SUSPENDED'
  | 'COMPLETED'
  | 'DISCONTINUED';

export type MedicationRoute =
  | 'ORAL'
  | 'SUBCUTANEOUS'
  | 'INTRAMUSCULAR'
  | 'INTRAVENOUS'
  | 'TOPICAL'
  | 'INHALATION'
  | 'SUBLINGUAL'
  | 'RECTAL'
  | 'VAGINAL'
  | 'OPHTHALMIC'
  | 'OTIC'
  | 'NASAL'
  | 'OTHER';

export interface Medication {
  id: string;
  organizationId: string;
  medicalRecordId: string;
  patientId: string;

  medicationCatalogId: string | null;

  name: string;
  dosage: string | null;
  frequency: string | null;
  route: MedicationRoute | null;
  indication: string | null;

  startedAt: string | null;
  endedAt: string | null;

  status: MedicationStatus;

  notes: string | null;

  createdAt: string;
  updatedAt: string;
}

export interface CreateMedicationInput {
  medicationCatalogId: string;
  dosage?: string;
  frequency?: string;
  route?: MedicationRoute;
  indication?: string;
  startedAt?: string;
  endedAt?: string;
  status?: MedicationStatus;
  notes?: string;
}

export interface UpdateMedicationInput {
  medicationCatalogId?: string;
  dosage?: string | null;
  frequency?: string | null;
  route?: MedicationRoute | null;
  indication?: string | null;
  startedAt?: string | null;
  endedAt?: string | null;
  status?: MedicationStatus;
  notes?: string | null;
}

export type MedicationSynonymType =
  | 'BRAND_NAME'
  | 'ABBREVIATION'
  | 'ALTERNATIVE_NAME'
  | 'OTHER';

export type MedicationTerminologySystem =
  | 'ATC'
  | 'RXNORM'
  | 'SNOMED_CT'
  | 'ANVISA'
  | 'OTHER';

export interface MedicationCatalogSynonym {
  id: string;
  term: string;
  normalizedTerm: string;
  type: MedicationSynonymType;
}

export interface MedicationCatalogExternalCode {
  id: string;
  system: MedicationTerminologySystem;
  code: string;
  display: string | null;
  version: string | null;
  isPrimary: boolean;
}

export interface MedicationCatalogItem {
  id: string;
  name: string;
  normalizedName: string;

  activeIngredient: string;
  normalizedActiveIngredient: string;

  description: string | null;
  isActive: boolean;

  synonyms: MedicationCatalogSynonym[];
  externalCodes: MedicationCatalogExternalCode[];
}

export type AllergyType =
  | 'MEDICATION'
  | 'FOOD'
  | 'ENVIRONMENTAL'
  | 'CONTACT'
  | 'OTHER';

export type AllergySeverity =
  | 'MILD'
  | 'MODERATE'
  | 'SEVERE'
  | 'LIFE_THREATENING';

export type AllergyStatus =
  | 'ACTIVE'
  | 'INACTIVE'
  | 'RESOLVED';

export interface MedicalRecordAllergy {
  id: string;
  organizationId: string;
  medicalRecordId: string;
  patientId: string;

  substance: string;
  type: AllergyType;

  reaction: string | null;
  severity: AllergySeverity | null;
  status: AllergyStatus;

  identifiedAt: string | null;
  notes: string | null;

  createdAt: string;
  updatedAt: string;
}

export interface CreateMedicalRecordAllergyInput {
  substance: string;
  type: AllergyType;

  reaction?: string;
  severity?: AllergySeverity;
  status?: AllergyStatus;

  identifiedAt?: string;
  notes?: string;
}

export interface UpdateMedicalRecordAllergyInput {
  substance?: string;
  type?: AllergyType;

  reaction?: string | null;
  severity?: AllergySeverity | null;
  status?: AllergyStatus;

  identifiedAt?: string | null;
  notes?: string | null;
}