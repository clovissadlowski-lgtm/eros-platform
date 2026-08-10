'use client';

import {
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';

import {
  createLaboratoryResult,
} from '../laboratory-exams.service';

export function useCreateLaboratoryResult(
  patientId: string,
  examId: string,
) {
  const queryClient =
    useQueryClient();

  return useMutation({
    mutationFn: (
      input: Parameters<
        typeof createLaboratoryResult
      >[2],
    ) =>
      createLaboratoryResult(
        patientId,
        examId,
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