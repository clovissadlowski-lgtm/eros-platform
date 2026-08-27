'use client';

import {
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';

import {
  deleteDietaryRestriction,
} from '../medical-record-dietary-restrictions.service';

export function useDeleteDietaryRestriction(
  patientId: string,
) {
  const queryClient =
    useQueryClient();

  return useMutation({
    mutationFn: (
      restrictionId: string,
    ) =>
      deleteDietaryRestriction(
        patientId,
        restrictionId,
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