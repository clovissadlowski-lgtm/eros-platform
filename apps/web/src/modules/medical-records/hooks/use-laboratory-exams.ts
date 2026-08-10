'use client';

import {
  useQuery,
} from '@tanstack/react-query';

import {
  listLaboratoryExams,
} from '../laboratory-exams.service';

export function useLaboratoryExams(
  patientId: string,
) {
  return useQuery({
    queryKey: [
      'patients',
      patientId,
      'medical-record',
      'laboratory-exams',
    ],

    queryFn: () =>
      listLaboratoryExams(
        patientId,
      ),

    enabled:
      Boolean(
        patientId,
      ),
  });
}