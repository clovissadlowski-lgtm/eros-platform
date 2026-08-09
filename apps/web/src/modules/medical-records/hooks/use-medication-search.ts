'use client';

import {
  useQuery,
} from '@tanstack/react-query';

import {
  searchMedications,
} from '../medical-records.service';

export function useMedicationSearch(
  query: string,
) {
  const normalizedQuery =
    query.trim();

  return useQuery({
    queryKey: [
      'medication-catalog',
      'search',
      normalizedQuery,
    ],

    queryFn: () =>
      searchMedications(
        normalizedQuery,
      ),

    enabled:
      normalizedQuery.length >= 2,

    staleTime:
      5 * 60 * 1000,
  });
}