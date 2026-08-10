'use client';

import {
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';

import {
  createLaboratoryExam,
} from '../laboratory-exams.service';

export function useCreateLaboratoryExam(
  patientId: string,
) {
  const queryClient =
    useQueryClient();

  return useMutation({
    mutationFn: (
      input: Parameters<
        typeof createLaboratoryExam
      >[1],
    ) =>
      createLaboratoryExam(
        patientId,
        input,
      ),

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: [
          'patients',
          patientId,
          'medical-record',
          'laboratory-exams',
        ],
      });
    },
  });
}