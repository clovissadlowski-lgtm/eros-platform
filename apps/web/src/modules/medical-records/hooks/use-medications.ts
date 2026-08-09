'use client';

import {
  useQuery,
} from '@tanstack/react-query';

import {
  listMedications,
} from '../medical-records.service';

export function useMedications(
  patientId: string,
) {
  return useQuery({
    queryKey: [
      'patients',
      patientId,
      'medical-record',
      'medications',
    ],

    queryFn: () =>
      listMedications(
        patientId,
      ),

    enabled:
      Boolean(
        patientId,
      ),
  });
}