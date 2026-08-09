'use client';

import {
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';

import {
  createMedication,
} from '../medical-records.service';

export function useCreateMedication(
  patientId: string,
) {
  const queryClient =
    useQueryClient();

  return useMutation({
    mutationFn: (
      input: Parameters<
        typeof createMedication
      >[1],
    ) =>
      createMedication(
        patientId,
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