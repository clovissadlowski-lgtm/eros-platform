export enum DietaryItemCatalogType {
  FOOD = 'FOOD',
  NUTRIENT = 'NUTRIENT',
  COMPONENT = 'COMPONENT',
  INGREDIENT = 'INGREDIENT',
  OTHER = 'OTHER',
}

export interface DietaryItemSynonym {
  id: string;
  term: string;
  normalizedTerm: string;
}

export interface DietaryItemCatalog {
  id: string;

  name: string;
  normalizedName: string;

  type: DietaryItemCatalogType;

  category: string | null;

  description: string | null;

  isActive: boolean;

  synonyms: DietaryItemSynonym[];
}