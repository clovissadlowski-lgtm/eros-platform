import {
  Injectable,
} from '@nestjs/common';

import type {
  ClinicalConditionCatalog,
} from '../../domain/entities/clinical-condition-catalog.entity';
import {
  ClinicalConditionCatalogRepository,
} from '../../domain/repositories/clinical-condition-catalog.repository';

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
export class ClinicalConditionCatalogService {
  constructor(
    private readonly repository:
      ClinicalConditionCatalogRepository,
  ) {}

  async search(
    query: string,
    limit = 20,
  ): Promise<ClinicalConditionCatalog[]> {
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
}