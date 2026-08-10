'use client';

import {
  useQuery,
} from '@tanstack/react-query';

import {
  listLaboratoryResults,
} from '../laboratory-exams.service';

export function useLaboratoryResults(
  patientId: string,
  examId: string,
) {
  return useQuery({
    queryKey: [
      'patients',
      patientId,
      'medical-record',
      'laboratory-exams',
      examId,
      'results',
    ],

    queryFn: () =>
      listLaboratoryResults(
        patientId,
        examId,
      ),

    enabled:
      Boolean(patientId) &&
      Boolean(examId),
  });
}