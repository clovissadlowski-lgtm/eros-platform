'use client';

import {
  useQuery,
} from '@tanstack/react-query';

import {
  searchAllergens,
} from '../medical-record-allergies.service';

export function useAllergenSearch(
  query: string,
) {
  const normalizedQuery =
    query.trim();

  return useQuery({
    queryKey: [
      'allergen-catalog',
      'search',
      normalizedQuery,
    ],

    queryFn: () =>
      searchAllergens(
        normalizedQuery,
      ),

    enabled:
      normalizedQuery.length >= 2,

    staleTime:
      5 * 60 * 1000,
  });
}