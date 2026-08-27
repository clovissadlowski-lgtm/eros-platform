export enum BiomarkerReferenceSex {
  ANY = 'ANY',
  MALE = 'MALE',
  FEMALE = 'FEMALE',
}

export enum BiomarkerReferenceContext {
  GENERAL = 'GENERAL',
  FASTING = 'FASTING',
  NON_FASTING = 'NON_FASTING',
}

export interface BiomarkerReferenceRange {
  id: string;

  biomarkerCatalogId: string;

  unit: string;

  minAgeYears: number | null;

  maxAgeYears: number | null;

  lowerBound: string | null;

  upperBound: string | null;

  sex: BiomarkerReferenceSex;

  context: BiomarkerReferenceContext;

  sourceName: string | null;

  sourceUrl: string | null;

  sourceNote: string | null;

  description: string | null;

  active: boolean;

  createdAt: string;

  updatedAt: string;
}