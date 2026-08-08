'use client';

import {
  useQuery,
} from '@tanstack/react-query';

import {
  listPatients,
} from '../patients.service';

export function usePatients() {
  return useQuery({
    queryKey: [
      'patients',
    ],
    queryFn:
      listPatients,
  });
}