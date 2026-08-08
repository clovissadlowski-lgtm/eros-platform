'use client';

import {
  useQuery,
} from '@tanstack/react-query';

import {
  getPatient,
} from '../patients.service';

export function usePatient(
  patientId: string,
) {
  return useQuery({
    queryKey: [
      'patients',
      patientId,
    ],
    queryFn: () =>
      getPatient(
        patientId,
      ),
    enabled: Boolean(
      patientId,
    ),
  });
}