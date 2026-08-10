import {
  Injectable,
} from '@nestjs/common';

import type {
  BiomarkerCatalog,
} from '../../domain/entities/biomarker-catalog.entity';

import {
  BiomarkerCatalogRepository,
} from '../../domain/repositories/biomarker-catalog.repository';

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
export class BiomarkerCatalogService {
  constructor(
    private readonly repository:
      BiomarkerCatalogRepository,
  ) {}

  async search(
    query: string,
    limit = 20,
  ): Promise<BiomarkerCatalog[]> {
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
  ): Promise<BiomarkerCatalog | null> {
    return this.repository.findActiveById(
      id,
    );
  }
}