import type {
  AllergenCatalog,
} from '../entities/allergen-catalog.entity';

export interface SearchAllergenCatalogInput {
  query: string;
  limit: number;
}

export abstract class AllergenCatalogRepository {
  abstract search(
    input: SearchAllergenCatalogInput,
  ): Promise<AllergenCatalog[]>;

  abstract findActiveById(
    id: string,
  ): Promise<AllergenCatalog | null>;
}