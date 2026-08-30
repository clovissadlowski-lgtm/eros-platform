'use client';

import {
  useQuery,
} from '@tanstack/react-query';

import {
  listAnthropometricAssessments,
} from '../anthropometric-assessments.service';

export function useAnthropometricAssessments(
  patientId: string,
) {
  return useQuery({
    queryKey: [
      'patients',
      patientId,
      'medical-record',
      'anthropometric-assessments',
    ],

    queryFn: () =>
      listAnthropometricAssessments(
        patientId,
      ),

    enabled:
      Boolean(
        patientId,
      ),
  });
}