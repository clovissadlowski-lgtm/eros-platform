'use client';

import {
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';

import {
  updateLaboratoryExam,
} from '../laboratory-exams.service';

export function useUpdateLaboratoryExam(
  patientId: string,
) {
  const queryClient =
    useQueryClient();

  return useMutation({
    mutationFn: ({
      examId,
      input,
    }: {
      examId: string;

      input: Parameters<
        typeof updateLaboratoryExam
      >[2];
    }) =>
      updateLaboratoryExam(
        patientId,
        examId,
        input,
      ),

    onSuccess: async (
      _data,
      variables,
    ) => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: [
            'patients',
            patientId,
            'medical-record',
            'laboratory-exams',
          ],
        }),

        queryClient.invalidateQueries({
          queryKey: [
            'patients',
            patientId,
            'medical-record',
            'laboratory-exams',
            variables.examId,
          ],
        }),
      ]);
    },
  });
}