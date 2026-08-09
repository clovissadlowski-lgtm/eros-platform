'use client';

import {
  useQuery,
} from '@tanstack/react-query';

import {
  searchClinicalConditions,
} from '../medical-records.service';

export function useClinicalConditionSearch(
  query: string,
) {
  const normalizedQuery =
    query.trim();

  return useQuery({
    queryKey: [
      'clinical-condition-catalog',
      'search',
      normalizedQuery,
    ],

    queryFn: () =>
      searchClinicalConditions(
        normalizedQuery,
      ),

    enabled:
      normalizedQuery.length >= 2,

    staleTime:
      5 * 60 * 1000,
  });
}