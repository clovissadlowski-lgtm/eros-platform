export enum ClinicalConceptType {
  CONDITION = 'CONDITION',
  DISEASE = 'DISEASE',
  DISORDER = 'DISORDER',
  SYNDROME = 'SYNDROME',
  CLINICAL_FINDING = 'CLINICAL_FINDING',
  OTHER = 'OTHER',
}

export enum TerminologySystem {
  SNOMED_CT = 'SNOMED_CT',
  ICD_10 = 'ICD_10',
  ICD_11 = 'ICD_11',
  OTHER = 'OTHER',
}

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

export interface ClinicalConditionCatalog {
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