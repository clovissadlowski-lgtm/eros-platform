'use client';

import {
  useQuery,
} from '@tanstack/react-query';

import {
  listDietaryRestrictions,
} from '../medical-record-dietary-restrictions.service';

export function useDietaryRestrictions(
  patientId: string,
) {
  return useQuery({
    queryKey: [
      'patients',
      patientId,
      'medical-record',
      'dietary-restrictions',
    ],

    queryFn: () =>
      listDietaryRestrictions(
        patientId,
      ),

    enabled:
      Boolean(
        patientId,
      ),
  });
}