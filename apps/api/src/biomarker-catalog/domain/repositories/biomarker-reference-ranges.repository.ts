import type {
  BiomarkerReferenceContext,
  BiomarkerReferenceRange,
  BiomarkerReferenceSex,
} from '../entities/biomarker-reference-range.entity';

export interface FindReferenceRangesInput {
  biomarkerCatalogId: string;

  unit?: string;

  ageYears?: number;

  sex?: BiomarkerReferenceSex;

  context?: BiomarkerReferenceContext;
}

export abstract class BiomarkerReferenceRangesRepository {
  abstract findActiveByBiomarker(
    input: FindReferenceRangesInput,
  ): Promise<BiomarkerReferenceRange[]>;

  abstract findActiveById(
    id: string,
  ): Promise<BiomarkerReferenceRange | null>;
}