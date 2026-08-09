export enum MedicationSynonymType {
  BRAND_NAME = 'BRAND_NAME',
  ABBREVIATION = 'ABBREVIATION',
  ALTERNATIVE_NAME = 'ALTERNATIVE_NAME',
  OTHER = 'OTHER',
}

export enum MedicationTerminologySystem {
  ATC = 'ATC',
  RXNORM = 'RXNORM',
  SNOMED_CT = 'SNOMED_CT',
  ANVISA = 'ANVISA',
  OTHER = 'OTHER',
}

export interface MedicationSynonym {
  id: string;
  term: string;
  normalizedTerm: string;
  type: MedicationSynonymType;
}

export interface MedicationExternalCode {
  id: string;
  system: MedicationTerminologySystem;
  code: string;
  display: string | null;
  version: string | null;
  isPrimary: boolean;
}

export interface MedicationCatalog {
  id: string;
  name: string;
  normalizedName: string;
  activeIngredient: string;
  normalizedActiveIngredient: string;
  description: string | null;
  isActive: boolean;
  synonyms: MedicationSynonym[];
  externalCodes: MedicationExternalCode[];
}