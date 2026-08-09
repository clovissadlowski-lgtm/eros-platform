'use client';

import {
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';

import {
  deleteHealthCondition,
} from '../medical-records.service';

export function useDeleteHealthCondition(
  patientId: string,
) {
  const queryClient =
    useQueryClient();

  return useMutation({
    mutationFn: (
      healthConditionId: string,
    ) =>
      deleteHealthCondition(
        patientId,
        healthConditionId,
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