'use client';

import {
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';

import {
  deleteLaboratoryResult,
} from '../laboratory-exams.service';

export function useDeleteLaboratoryResult(
  patientId: string,
  examId: string,
) {
  const queryClient =
    useQueryClient();

  return useMutation({
    mutationFn: (
      resultId: string,
    ) =>
      deleteLaboratoryResult(
        patientId,
        examId,
        resultId,
      ),

    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: [
            'patients',
            patientId,
            'medical-record',
            'laboratory-exams',
            examId,
            'results',
          ],
        }),

        queryClient.invalidateQueries({
          queryKey: [
            'patients',
            patientId,
            'medical-record',
            'laboratory-exams',
          ],
        }),
      ]);
    },
  });
}