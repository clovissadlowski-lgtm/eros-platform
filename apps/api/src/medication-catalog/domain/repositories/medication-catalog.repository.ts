import type {
  MedicationCatalog,
} from '../entities/medication-catalog.entity';

export interface SearchMedicationCatalogInput {
  query: string;
  limit: number;
}

export abstract class MedicationCatalogRepository {
  abstract search(
    input: SearchMedicationCatalogInput,
  ): Promise<MedicationCatalog[]>;

  abstract findActiveById(
    id: string,
  ): Promise<MedicationCatalog | null>;
}