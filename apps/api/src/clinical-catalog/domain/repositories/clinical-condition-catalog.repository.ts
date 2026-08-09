import type {
  ClinicalConditionCatalog,
} from '../entities/clinical-condition-catalog.entity';

export interface SearchClinicalConditionCatalogInput {
  query: string;
  limit: number;
}

export abstract class ClinicalConditionCatalogRepository {
  abstract search(
    input: SearchClinicalConditionCatalogInput,
  ): Promise<ClinicalConditionCatalog[]>;

  abstract findActiveById(
    id: string,
  ): Promise<ClinicalConditionCatalog | null>;
}