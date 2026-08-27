'use client';

import {
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';

import {
  updatePatientStatus,
} from '../patients.service';

import type {
  Patient,
  PatientStatus,
} from '../patient.types';

export function useUpdatePatientStatus(
  patientId: string,
) {
  const queryClient =
    useQueryClient();

  return useMutation({
    mutationFn: (
      status:
        PatientStatus,
    ) =>
      updatePatientStatus(
        patientId,
        status,
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