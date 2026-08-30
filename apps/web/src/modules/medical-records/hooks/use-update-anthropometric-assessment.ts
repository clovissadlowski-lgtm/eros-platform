'use client';

import {
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';

import {
  updateAnthropometricAssessment,
} from '../anthropometric-assessments.service';

export function useUpdateAnthropometricAssessment(
  patientId: string,
) {
  const queryClient =
    useQueryClient();

  return useMutation({
    mutationFn: ({
      assessmentId,
      input,
    }: {
      assessmentId: string;
      input: Parameters<
        typeof updateAnthropometricAssessment
      >[2];
    }) =>
      updateAnthropometricAssessment(
        patientId,
        assessmentId,
        input,
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