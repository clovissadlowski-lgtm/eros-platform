'use client';

import {
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';

import {
  createAnthropometricAssessment,
} from '../anthropometric-assessments.service';

export function useCreateAnthropometricAssessment(
  patientId: string,
) {
  const queryClient =
    useQueryClient();

  return useMutation({
    mutationFn: (
      input: Parameters<
        typeof createAnthropometricAssessment
      >[1],
    ) =>
      createAnthropometricAssessment(
        patientId,
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