'use client';

import {
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';

import {
  deleteAnthropometricAssessment,
} from '../anthropometric-assessments.service';

export function useDeleteAnthropometricAssessment(
  patientId: string,
) {
  const queryClient =
    useQueryClient();

  return useMutation({
    mutationFn: (
      assessmentId: string,
    ) =>
      deleteAnthropometricAssessment(
        patientId,
        assessmentId,
      ),

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: [
          'patients',
          patientId,
          'medical-record',
          'anthropometric-assessments',
        ],
      });
    },
  });
}