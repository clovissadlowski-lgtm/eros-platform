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

// -----------------------------------------------------------------------------
// ALLERGEN CATALOG
// -----------------------------------------------------------------------------

export type AllergenCatalogType =
  | 'MEDICATION'
  | 'ACTIVE_INGREDIENT'
  | 'FOOD'
  | 'ENVIRONMENTAL'
  | 'CONTACT'
  | 'BIOLOGICAL'
  | 'CHEMICAL'
  | 'OTHER';

export type AllergenTerminologySystem =
  | 'SNOMED_CT'
  | 'RXNORM'
  | 'UNII'
  | 'OTHER';

export interface AllergenCatalogSynonym {
  id: string;
  term: string;
  normalizedTerm: string;
}

export interface AllergenCatalogExternalCode {
  id: string;
  system: AllergenTerminologySystem;
  code: string;
  display: string | null;
  version: string | null;
  isPrimary: boolean;
}

export interface AllergenCatalogItem {
  id: string;
  name: string;
  normalizedName: string;

  type: AllergenCatalogType;

  description: string | null;
  isActive: boolean;

  synonyms: AllergenCatalogSynonym[];
  externalCodes: AllergenCatalogExternalCode[];
}

// -----------------------------------------------------------------------------
// MEDICAL RECORD ALLERGIES
// -----------------------------------------------------------------------------

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

  allergenCatalogId: string | null;

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
  allergenCatalogId: string;

  reaction?: string;
  severity?: AllergySeverity;
  status?: AllergyStatus;

  identifiedAt?: string;
  notes?: string;
}

export interface UpdateMedicalRecordAllergyInput {
  allergenCatalogId?: string;

  reaction?: string | null;
  severity?: AllergySeverity | null;
  status?: AllergyStatus;

  identifiedAt?: string | null;
  notes?: string | null;
}

// -----------------------------------------------------------------------------
// DIETARY ITEM CATALOG
// -----------------------------------------------------------------------------

export type DietaryItemCatalogType =
  | 'FOOD'
  | 'NUTRIENT'
  | 'COMPONENT'
  | 'INGREDIENT'
  | 'OTHER';

export interface DietaryItemCatalogSynonym {
  id: string;
  term: string;
  normalizedTerm: string;
}

export interface DietaryItemCatalogItem {
  id: string;

  name: string;
  normalizedName: string;

  type: DietaryItemCatalogType;

  category: string | null;
  description: string | null;

  isActive: boolean;

  synonyms: DietaryItemCatalogSynonym[];
}

// -----------------------------------------------------------------------------
// DIETARY PREFERENCES AND RESTRICTIONS
// -----------------------------------------------------------------------------

export type DietaryRestrictionType =
  | 'PREFERENCE'
  | 'INTOLERANCE'
  | 'MEDICAL_RESTRICTION'
  | 'CULTURAL_RELIGIOUS'
  | 'ETHICAL_LIFESTYLE'
  | 'OTHER';

export type DietaryRestrictionAction =
  | 'AVOID'
  | 'LIMIT'
  | 'MONITOR'
  | 'KEEP_CONSISTENT'
  | 'BLOCK';

export type DietaryRestrictionRisk =
  | 'NONE'
  | 'LOW'
  | 'MODERATE'
  | 'HIGH'
  | 'CRITICAL';

export type DietaryRestrictionSource =
  | 'PATIENT_REPORTED'
  | 'PROFESSIONAL_REPORTED'
  | 'SYSTEM_DERIVED';

export type DietaryRestrictionStatus =
  | 'ACTIVE'
  | 'INACTIVE'
  | 'RESOLVED';

export interface MedicalRecordDietaryRestriction {
  id: string;
  organizationId: string;
  medicalRecordId: string;
  patientId: string;

  dietaryItemCatalogId: string | null;

  item: string;

  type: DietaryRestrictionType;
  action: DietaryRestrictionAction;
  risk: DietaryRestrictionRisk;
  source: DietaryRestrictionSource;

  reason: string | null;
  identifiedAt: string | null;

  status: DietaryRestrictionStatus;

  notes: string | null;

  createdAt: string;
  updatedAt: string;
}

export interface CreateMedicalRecordDietaryRestrictionInput {
  dietaryItemCatalogId?: string;

  item: string;

  type: DietaryRestrictionType;
  action: DietaryRestrictionAction;

  risk?: DietaryRestrictionRisk;

  source?:
    | 'PATIENT_REPORTED'
    | 'PROFESSIONAL_REPORTED';

  reason?: string;

  identifiedAt?: string;

  status?: DietaryRestrictionStatus;

  notes?: string;
}

export interface UpdateMedicalRecordDietaryRestrictionInput {
  dietaryItemCatalogId?: string | null;

  item?: string;

  type?: DietaryRestrictionType;
  action?: DietaryRestrictionAction;

  risk?: DietaryRestrictionRisk;

  source?:
    | 'PATIENT_REPORTED'
    | 'PROFESSIONAL_REPORTED';

  reason?: string | null;

  identifiedAt?: string | null;

  status?: DietaryRestrictionStatus;

  notes?: string | null;
}

// -----------------------------------------------------------------------------
// BIOMARKER CATALOG
// -----------------------------------------------------------------------------

export interface BiomarkerCatalogItem {
  id: string;
  name: string;
  code: string | null;
  defaultUnit: string | null;
  description: string | null;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

// -----------------------------------------------------------------------------
// LABORATORY EXAMS
// -----------------------------------------------------------------------------

export type BiomarkerReferenceContext =
  | 'GENERAL'
  | 'FASTING'
  | 'NON_FASTING';

export type LaboratoryResultInterpretation =
  | 'LOW'
  | 'NORMAL'
  | 'HIGH'
  | 'CRITICAL_LOW'
  | 'CRITICAL_HIGH'
  | 'ABNORMAL'
  | 'INCONCLUSIVE';

export interface LaboratoryExam {
  id: string;

  organizationId: string;

  medicalRecordId: string;

  patientId: string;

  name: string;

  laboratoryName: string | null;

  collectedAt: string | null;

  resultedAt: string | null;

  collectionContext:
    BiomarkerReferenceContext | null;

  notes: string | null;

  createdAt: string;

  updatedAt: string;
}

export interface LaboratoryResult {
  id: string;

  laboratoryExamId: string;

  biomarkerCatalogId: string | null;

  name: string;

  value: string | null;

  textValue: string | null;

  unit: string | null;

  referenceRange: string | null;

  interpretation:
    LaboratoryResultInterpretation | null;

  createdAt: string;

  updatedAt: string;
}

export interface LaboratoryExamWithResults {
  exam: LaboratoryExam;

  results: LaboratoryResult[];
}

export interface CreateLaboratoryExamInput {
  name: string;

  laboratoryName?: string;

  collectedAt?: string;

  resultedAt?: string;

  collectionContext?:
    BiomarkerReferenceContext;

  notes?: string;
}

export interface UpdateLaboratoryExamInput {
  name?: string;

  laboratoryName?: string | null;

  collectedAt?: string | null;

  resultedAt?: string | null;

  collectionContext?:
    BiomarkerReferenceContext | null;

  notes?: string | null;
}

export interface CreateLaboratoryResultInput {
  biomarkerCatalogId?: string;

  name?: string;

  value?: string;

  textValue?: string;

  unit?: string;

  referenceRange?: string;

  interpretation?:
    LaboratoryResultInterpretation;
}

export interface UpdateLaboratoryResultInput {
  biomarkerCatalogId?: string;

  name?: string;

  value?: string | null;

  textValue?: string | null;

  unit?: string | null;

  referenceRange?: string | null;

  interpretation?:
    LaboratoryResultInterpretation | null;
}

// -----------------------------------------------------------------------------
// ANTHROPOMETRIC ASSESSMENTS
// -----------------------------------------------------------------------------

export type BodyCompositionMethod =
  | 'BIOIMPEDANCE'
  | 'SKINFOLD'
  | 'DEXA'
  | 'OTHER';

export type SkinfoldMeasurementSide =
  | 'RIGHT'
  | 'LEFT';

export type SkinfoldSite =
  | 'CHEST'
  | 'MIDAXILLARY'
  | 'TRICEPS'
  | 'SUBSCAPULAR'
  | 'ABDOMEN'
  | 'SUPRAILIAC'
  | 'THIGH'
  | 'BICEPS'
  | 'SUPRASPINALE'
  | 'CALF'
  | 'OTHER';

export type SkinfoldProtocol =
  | 'JACKSON_POLLOCK_3'
  | 'JACKSON_POLLOCK_7'
  | 'OTHER';

export interface AnthropometricSkinfoldMeasurement {
  id: string;
  anthropometricAssessmentId: string;

  site: SkinfoldSite;
  side: SkinfoldMeasurementSide;

  readingNumber: number;
  valueMm: number;

  createdAt: string;
  updatedAt: string;
}

export interface AnthropometricAssessment {
  id: string;

  organizationId: string;
  medicalRecordId: string;
  patientId: string;

  measuredAt: string;

  weightKg: number | null;
  heightCm: number | null;

  bodyFatPercentage: number | null;
  fatMassKg: number | null;
  leanMassKg: number | null;
  muscleMassKg: number | null;

  waistCircumferenceCm: number | null;
  hipCircumferenceCm: number | null;
  abdomenCircumferenceCm: number | null;
  chestCircumferenceCm: number | null;
  armCircumferenceCm: number | null;
  thighCircumferenceCm: number | null;
  calfCircumferenceCm: number | null;

  bodyCompositionMethod: BodyCompositionMethod | null;
  skinfoldProtocol: SkinfoldProtocol | null;

  skinfoldMeasurements: AnthropometricSkinfoldMeasurement[];

  notes: string | null;

  createdAt: string;
  updatedAt: string;
}

export interface AnthropometricSkinfoldMeasurementInput {
  site: SkinfoldSite;
  side?: SkinfoldMeasurementSide;
  readingNumber: number;
  valueMm: number;
}

export interface CreateAnthropometricAssessmentInput {
  measuredAt: string;

  weightKg?: number;
  heightCm?: number;

  bodyFatPercentage?: number;
  fatMassKg?: number;
  leanMassKg?: number;
  muscleMassKg?: number;

  waistCircumferenceCm?: number;
  hipCircumferenceCm?: number;
  abdomenCircumferenceCm?: number;
  chestCircumferenceCm?: number;
  armCircumferenceCm?: number;
  thighCircumferenceCm?: number;
  calfCircumferenceCm?: number;

  bodyCompositionMethod?: BodyCompositionMethod;
  skinfoldProtocol?: SkinfoldProtocol;

  skinfoldMeasurements?: AnthropometricSkinfoldMeasurementInput[];

  notes?: string;
}

export interface UpdateAnthropometricAssessmentInput {
  measuredAt?: string;

  weightKg?: number | null;
  heightCm?: number | null;

  bodyFatPercentage?: number | null;
  fatMassKg?: number | null;
  leanMassKg?: number | null;
  muscleMassKg?: number | null;

  waistCircumferenceCm?: number | null;
  hipCircumferenceCm?: number | null;
  abdomenCircumferenceCm?: number | null;
  chestCircumferenceCm?: number | null;
  armCircumferenceCm?: number | null;
  thighCircumferenceCm?: number | null;
  calfCircumferenceCm?: number | null;

  bodyCompositionMethod?: BodyCompositionMethod | null;
  skinfoldProtocol?: SkinfoldProtocol | null;

  skinfoldMeasurements?: AnthropometricSkinfoldMeasurementInput[];

  notes?: string | null;
}
