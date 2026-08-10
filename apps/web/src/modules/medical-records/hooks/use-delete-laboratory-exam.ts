'use client';

import {
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';

import {
  deleteLaboratoryExam,
} from '../laboratory-exams.service';

export function useDeleteLaboratoryExam(
  patientId: string,
) {
  const queryClient =
    useQueryClient();

  return useMutation({
    mutationFn: (
      examId: string,
    ) =>
      deleteLaboratoryExam(
        patientId,
        examId,
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