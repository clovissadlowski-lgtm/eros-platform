'use client';

import {
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';

import {
  updateDietaryRestriction,
} from '../medical-record-dietary-restrictions.service';

export function useUpdateDietaryRestriction(
  patientId: string,
) {
  const queryClient =
    useQueryClient();

  return useMutation({
    mutationFn: ({
      restrictionId,
      input,
    }: {
      restrictionId: string;
      input: Parameters<
        typeof updateDietaryRestriction
      >[2];
    }) =>
      updateDietaryRestriction(
        patientId,
        restrictionId,
        input,
      ),

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: [
          'patients',
          patientId,
          'medical-record',
          'dietary-restrictions',
        ],
      });
    },
  });
}