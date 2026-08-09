export enum AllergenCatalogType {
  MEDICATION = 'MEDICATION',
  ACTIVE_INGREDIENT = 'ACTIVE_INGREDIENT',
  FOOD = 'FOOD',
  ENVIRONMENTAL = 'ENVIRONMENTAL',
  CONTACT = 'CONTACT',
  BIOLOGICAL = 'BIOLOGICAL',
  CHEMICAL = 'CHEMICAL',
  OTHER = 'OTHER',
}

export enum AllergenTerminologySystem {
  SNOMED_CT = 'SNOMED_CT',
  RXNORM = 'RXNORM',
  UNII = 'UNII',
  OTHER = 'OTHER',
}

export interface AllergenSynonym {
  id: string;
  term: string;
  normalizedTerm: string;
}

export interface AllergenExternalCode {
  id: string;
  system: AllergenTerminologySystem;
  code: string;
  display: string | null;
  version: string | null;
  isPrimary: boolean;
}

export interface AllergenCatalog {
  id: string;
  name: string;
  normalizedName: string;
  type: AllergenCatalogType;
  description: string | null;
  isActive: boolean;
  synonyms: AllergenSynonym[];
  externalCodes: AllergenExternalCode[];
}