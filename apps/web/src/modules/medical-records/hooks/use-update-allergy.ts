'use client';

import {
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';

import {
  updateAllergy,
} from '../medical-record-allergies.service';

export function useUpdateAllergy(
  patientId: string,
) {
  const queryClient =
    useQueryClient();

  return useMutation({
    mutationFn: ({
      allergyId,
      input,
    }: {
      allergyId: string;
      input: Parameters<
        typeof updateAllergy
      >[2];
    }) =>
      updateAllergy(
        patientId,
        allergyId,
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