import {
  Injectable,
} from '@nestjs/common';

import type {
  DietaryItemCatalog,
} from '../../domain/entities/dietary-item-catalog.entity';

import {
  DietaryItemCatalogRepository,
} from '../../domain/repositories/dietary-item-catalog.repository';

function normalizeSearchTerm(
  value: string,
): string {
  return value
    .normalize(
      'NFD',
    )
    .replace(
      /[\u0300-\u036f]/g,
      '',
    )
    .trim()
    .toLowerCase();
}

@Injectable()
export class DietaryItemCatalogService {
  constructor(
    private readonly repository:
      DietaryItemCatalogRepository,
  ) {}

  async search(
    query: string,
    limit = 20,
  ): Promise<DietaryItemCatalog[]> {
    const normalizedQuery =
      normalizeSearchTerm(
        query,
      );

    if (
      normalizedQuery.length <
      2
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
  ): Promise<DietaryItemCatalog | null> {
    return this.repository.findActiveById(
      id,
    );
  }
}