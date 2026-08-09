'use client';

import {
  useQuery,
} from '@tanstack/react-query';

import {
  listAllergies,
} from '../medical-record-allergies.service';

export function useAllergies(
  patientId: string,
) {
  return useQuery({
    queryKey: [
      'patients',
      patientId,
      'medical-record',
      'allergies',
    ],

    queryFn: () =>
      listAllergies(
        patientId,
      ),

    enabled:
      Boolean(
        patientId,
      ),
  });
}