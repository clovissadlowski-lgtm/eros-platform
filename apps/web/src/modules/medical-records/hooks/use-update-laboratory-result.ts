'use client';

import {
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';

import {
  updateLaboratoryResult,
} from '../laboratory-exams.service';

export function useUpdateLaboratoryResult(
  patientId: string,
  examId: string,
) {
  const queryClient =
    useQueryClient();

  return useMutation({
    mutationFn: ({
      resultId,
      input,
    }: {
      resultId: string;
      input: Parameters<
        typeof updateLaboratoryResult
      >[3];
    }) =>
      updateLaboratoryResult(
        patientId,
        examId,
        resultId,
        input,
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