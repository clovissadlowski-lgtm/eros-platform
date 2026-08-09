'use client';

import {
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';

import {
  updateHealthCondition,
} from '../medical-records.service';

export function useUpdateHealthCondition(
  patientId: string,
) {
  const queryClient =
    useQueryClient();

  return useMutation({
    mutationFn: ({
      healthConditionId,
      input,
    }: {
      healthConditionId: string;
      input: Parameters<
        typeof updateHealthCondition
      >[2];
    }) =>
      updateHealthCondition(
        patientId,
        healthConditionId,
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