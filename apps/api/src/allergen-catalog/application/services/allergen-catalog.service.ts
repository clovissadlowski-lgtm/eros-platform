import {
  Injectable,
} from '@nestjs/common';

import type {
  AllergenCatalog,
} from '../../domain/entities/allergen-catalog.entity';

import {
  AllergenCatalogRepository,
} from '../../domain/repositories/allergen-catalog.repository';

function normalizeSearchTerm(
  value: string,
): string {
  return value
    .normalize('NFD')
    .replace(
      /[\u0300-\u036f]/g,
      '',
    )
    .trim()
    .toLowerCase();
}

@Injectable()
export class AllergenCatalogService {
  constructor(
    private readonly repository:
      AllergenCatalogRepository,
  ) {}

  async search(
    query: string,
    limit = 20,
  ): Promise<AllergenCatalog[]> {
    const normalizedQuery =
      normalizeSearchTerm(
        query,
      );

    if (
      normalizedQuery.length < 2
    ) {
      return [];
    }

    const safeLimit =
      Math.min(
        Math.max(
          limit,
          1,
        ),
        50,
      );

    return this.repository.search({
      query:
        normalizedQuery,
      limit:
        safeLimit,
    });
  }

  findActiveById(
    id: string,
  ): Promise<AllergenCatalog | null> {
    return this.repository.findActiveById(
      id,
    );
  }
}