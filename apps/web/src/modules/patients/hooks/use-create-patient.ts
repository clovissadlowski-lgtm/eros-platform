'use client';

import {
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';

import {
  createPatient,
} from '../patients.service';

export function useCreatePatient() {
  const queryClient =
    useQueryClient();

  return useMutation({
    mutationFn:
      createPatient,

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: [
          'patients',
        ],
      });
    },
  });
}