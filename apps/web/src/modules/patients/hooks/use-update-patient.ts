'use client';

import {
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';

import {
  updatePatient,
} from '../patients.service';

import type {
  Patient,
  UpdatePatientInput,
} from '../patient.types';

export function useUpdatePatient(
  patientId: string,
) {
  const queryClient =
    useQueryClient();

  return useMutation({
    mutationFn: (
      input:
        UpdatePatientInput,
    ) =>
      updatePatient(
        patientId,
        input,
      ),

    onSuccess: async (
      updatedPatient:
        Patient,
    ) => {
      queryClient.setQueryData(
        [
          'patients',
          patientId,
        ],
        updatedPatient,
      );

      await queryClient.invalidateQueries({
        queryKey: [
          'patients',
        ],
      });
    },
  });
}