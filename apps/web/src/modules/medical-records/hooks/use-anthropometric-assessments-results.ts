'use client';

import {
  useQueries,
} from '@tanstack/react-query';

import {
  getAnthropometricAssessmentResults,
} from '../anthropometric-assessments.service';

import type {
  AnthropometricAssessmentResults,
} from '../medical-record.types';

interface AnthropometricAssessmentResultEntry {
  assessmentId: string;
  data:
    | AnthropometricAssessmentResults
    | undefined;
  isLoading: boolean;
  isError: boolean;
}

export function useAnthropometricAssessmentsResults(
  patientId: string,
  assessmentIds: string[],
): AnthropometricAssessmentResultEntry[] {
  const queries =
    useQueries({
      queries:
        assessmentIds.map(
          (
            assessmentId,
          ) => ({
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
          }),
        ),
    });

  return queries.map(
    (
      query,
      index,
    ) => ({
      assessmentId:
        assessmentIds[
          index
        ],

      data:
        query.data,

      isLoading:
        query.isLoading,

      isError:
        query.isError,
    }),
  );
}