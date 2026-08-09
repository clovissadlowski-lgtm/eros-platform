'use client';

import {
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';

import {
  deleteMedication,
} from '../medical-records.service';

export function useDeleteMedication(
  patientId: string,
) {
  const queryClient =
    useQueryClient();

  return useMutation({
    mutationFn: (
      medicationId: string,
    ) =>
      deleteMedication(
        patientId,
        medicationId,
      ),

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: [
          'patients',
          patientId,
          'medical-record',
          'medications',
        ],
      });
    },
  });
}