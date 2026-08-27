import type {
  DietaryItemCatalog,
} from '../entities/dietary-item-catalog.entity';

export interface SearchDietaryItemCatalogInput {
  query: string;
  limit: number;
}

export abstract class DietaryItemCatalogRepository {
  abstract search(
    input:
      SearchDietaryItemCatalogInput,
  ): Promise<DietaryItemCatalog[]>;

  abstract findActiveById(
    id: string,
  ): Promise<DietaryItemCatalog | null>;
}