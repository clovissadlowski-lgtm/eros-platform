import {
  apiRequest,
} from '@/lib/api/api-client';

import {
  authStorage,
} from '@/lib/auth/auth-storage';

import type {
  DietaryItemCatalogItem,
} from './medical-record.types';

function getAccessToken(): string {
  const accessToken =
    authStorage.getAccessToken();

  if (!accessToken) {
    throw new Error(
      'Authenticated session is required.',
    );
  }

  return accessToken;
}

export async function searchDietaryItems(
  query: string,
  limit = 20,
): Promise<DietaryItemCatalogItem[]> {
  const normalizedQuery =
    query.trim();

  if (
    normalizedQuery.length <
    2
  ) {
    return [];
  }

  const searchParams =
    new URLSearchParams({
      q:
        normalizedQuery,

      limit:
        String(
          limit,
        ),
    });

  return apiRequest<
    DietaryItemCatalogItem[]
  >(
    `/dietary-item-catalog/search?${searchParams.toString()}`,
    {
      method:
        'GET',

      accessToken:
        getAccessToken(),
    },
  );
}