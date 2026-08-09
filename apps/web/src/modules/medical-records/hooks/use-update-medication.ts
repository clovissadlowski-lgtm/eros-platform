'use client';

import {
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';

import {
  updateMedication,
} from '../medical-records.service';

export function useUpdateMedication(
  patientId: string,
) {
  const queryClient =
    useQueryClient();

  return useMutation({
    mutationFn: ({
      medicationId,
      input,
    }: {
      medicationId: string;
      input: Parameters<
        typeof updateMedication
      >[2];
    }) =>
      updateMedication(
        patientId,
        medicationId,
        input,
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