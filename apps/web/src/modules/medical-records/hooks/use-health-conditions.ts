'use client';

import {
  useQuery,
} from '@tanstack/react-query';

import {
  listHealthConditions,
} from '../medical-records.service';

export function useHealthConditions(
  patientId: string,
) {
  return useQuery({
    queryKey: [
      'patients',
      patientId,
      'medical-record',
      'health-conditions',
    ],
    queryFn: () =>
      listHealthConditions(
        patientId,
      ),
    enabled:
      Boolean(
        patientId,
      ),
  });
}