'use client';

import {
  useQuery,
} from '@tanstack/react-query';

import {
  getAnthropometricAssessmentResults,
} from '../anthropometric-assessments.service';

export function useAnthropometricAssessmentResults(
  patientId: string,
  assessmentId: string,
) {
  return useQuery({
    queryKey: [
      'patients',
      patientId,
      'medical-record',
      'anthropometric-assessments',
      assessmentId,
      'results',
    ],
    queryFn: () =>
      getAnthropometricAssessmentResults(
        patientId,
        assessmentId,
      ),
    enabled:
      Boolean(patientId) &&
      Boolean(assessmentId),
  });
}