'use client';

import {
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';

import {
  deleteAllergy,
} from '../medical-record-allergies.service';

export function useDeleteAllergy(
  patientId: string,
) {
  const queryClient =
    useQueryClient();

  return useMutation({
    mutationFn: (
      allergyId: string,
    ) =>
      deleteAllergy(
        patientId,
        allergyId,
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