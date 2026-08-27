import {
  useQuery,
} from '@tanstack/react-query';

import {
  searchDietaryItems,
} from '../dietary-item-catalog.service';

export function useDietaryItemSearch(
  query: string,
) {
  const normalizedQuery =
    query.trim();

  return useQuery({
    queryKey: [
      'dietary-item-catalog',
      'search',
      normalizedQuery,
    ],

    queryFn: () =>
      searchDietaryItems(
        normalizedQuery,
      ),

    enabled:
      normalizedQuery.length >= 2,

    staleTime:
      5 * 60 * 1000,
  });
}