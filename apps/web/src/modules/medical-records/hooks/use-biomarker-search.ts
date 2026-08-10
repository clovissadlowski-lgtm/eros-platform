'use client';

import {
  useQuery,
} from '@tanstack/react-query';

import {
  searchBiomarkers,
} from '../laboratory-exams.service';

export function useBiomarkerSearch(
  query: string,
) {
  const normalizedQuery =
    query.trim();

  return useQuery({
    queryKey: [
      'biomarker-catalog',
      'search',
      normalizedQuery,
    ],

    queryFn: () =>
      searchBiomarkers(
        normalizedQuery,
      ),

    enabled:
      normalizedQuery.length >= 2,

    staleTime:
      5 * 60 * 1000,
  });
}