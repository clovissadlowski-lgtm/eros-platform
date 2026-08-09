import {
  Injectable,
} from '@nestjs/common';

import type {
  MedicationCatalog,
} from '../../domain/entities/medication-catalog.entity';

import {
  MedicationCatalogRepository,
} from '../../domain/repositories/medication-catalog.repository';

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
export class MedicationCatalogService {
  constructor(
    private readonly repository:
      MedicationCatalogRepository,
  ) {}

  async search(
    query: string,
    limit = 20,
  ): Promise<MedicationCatalog[]> {
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
  ): Promise<MedicationCatalog | null> {
    return this.repository.findActiveById(
      id,
    );
  }
}