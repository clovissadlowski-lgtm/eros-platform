'use client';

import {
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';

import {
  createHealthCondition,
} from '../medical-records.service';

export function useCreateHealthCondition(
  patientId: string,
) {
  const queryClient =
    useQueryClient();

  return useMutation({
    mutationFn: (
      input: Parameters<
        typeof createHealthCondition
      >[1],
    ) =>
      createHealthCondition(
        patientId,
        input,
      ),

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: [
          'patients',
          patientId,
          'medical-record',
          'health-conditions',
        ],
      });
    },
  });
}