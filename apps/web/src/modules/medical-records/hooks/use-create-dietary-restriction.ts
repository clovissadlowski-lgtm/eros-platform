'use client';

import {
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';

import {
  createDietaryRestriction,
} from '../medical-record-dietary-restrictions.service';

export function useCreateDietaryRestriction(
  patientId: string,
) {
  const queryClient =
    useQueryClient();

  return useMutation({
    mutationFn: (
      input: Parameters<
        typeof createDietaryRestriction
      >[1],
    ) =>
      createDietaryRestriction(
        patientId,
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