import {
  apiRequest,
} from '@/lib/api/api-client';

import {
  authStorage,
} from '@/lib/auth/auth-storage';

import type {
  CreateMedicalRecordDietaryRestrictionInput,
  MedicalRecordDietaryRestriction,
  UpdateMedicalRecordDietaryRestrictionInput,
} from './medical-record.types';

function getAccessToken(): string {
  const accessToken =
    authStorage.getAccessToken();

  if (!accessToken) {
    throw new Error(
      'Authenticated session is required.',
    );
  }

  return accessToken;
}

export async function listDietaryRestrictions(
  patientId: string,
): Promise<MedicalRecordDietaryRestriction[]> {
  return apiRequest<
    MedicalRecordDietaryRestriction[]
  >(
    `/patients/${patientId}/medical-record/dietary-restrictions`,
    {
      method:
        'GET',

      accessToken:
        getAccessToken(),
    },
  );
}

export async function createDietaryRestriction(
  patientId: string,
  input:
    CreateMedicalRecordDietaryRestrictionInput,
): Promise<MedicalRecordDietaryRestriction> {
  return apiRequest<
    MedicalRecordDietaryRestriction
  >(
    `/patients/${patientId}/medical-record/dietary-restrictions`,
    {
      method:
        'POST',

      accessToken:
        getAccessToken(),

      body:
        input,
    },
  );
}

export async function updateDietaryRestriction(
  patientId: string,
  restrictionId: string,
  input:
    UpdateMedicalRecordDietaryRestrictionInput,
): Promise<MedicalRecordDietaryRestriction> {
  return apiRequest<
    MedicalRecordDietaryRestriction
  >(
    `/patients/${patientId}/medical-record/dietary-restrictions/${restrictionId}`,
    {
      method:
        'PATCH',

      accessToken:
        getAccessToken(),

      body:
        input,
    },
  );
}

export async function deleteDietaryRestriction(
  patientId: string,
  restrictionId: string,
): Promise<void> {
  return apiRequest(
    `/patients/${patientId}/medical-record/dietary-restrictions/${restrictionId}`,
    {
      method:
        'DELETE',

      accessToken:
        getAccessToken(),
    },
  );
}