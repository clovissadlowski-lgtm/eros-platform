'use client';

import {
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';

import {
  createAllergy,
} from '../medical-record-allergies.service';

export function useCreateAllergy(
  patientId: string,
) {
  const queryClient =
    useQueryClient();

  return useMutation({
    mutationFn: (
      input: Parameters<
        typeof createAllergy
      >[1],
    ) =>
      createAllergy(
        patientId,
        input,
      ),

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: [
          'patients',
          patientId,
          'medical-record',
          'allergies',
        ],
      });
    },
  });
}