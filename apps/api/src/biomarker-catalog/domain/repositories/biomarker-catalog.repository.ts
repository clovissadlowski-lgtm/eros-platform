import {
  BiomarkerCatalog,
} from '../entities/biomarker-catalog.entity';

export interface SearchBiomarkerCatalogInput {
  query: string;

  limit: number;
}

export abstract class BiomarkerCatalogRepository {
  abstract search(
    input: SearchBiomarkerCatalogInput,
  ): Promise<BiomarkerCatalog[]>;

  abstract findActiveById(
    id: string,
  ): Promise<BiomarkerCatalog | null>;
}