'use client';

import {
  useQuery,
} from '@tanstack/react-query';

import {
  listOrganizations,
} from '../auth.service';

export function useOrganizations() {
  return useQuery({
    queryKey: [
      'auth',
      'organizations',
    ],
    queryFn:
      listOrganizations,
  });
}