import {
  apiRequest,
} from '@/lib/api/api-client';

import {
  authStorage,
} from '@/lib/auth/auth-storage';

import type {
  AllergenCatalogItem,
  CreateMedicalRecordAllergyInput,
  MedicalRecordAllergy,
  UpdateMedicalRecordAllergyInput,
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

export async function searchAllergens(
  query: string,
  limit = 20,
): Promise<AllergenCatalogItem[]> {
  const params =
    new URLSearchParams({
      q: query,
      limit:
        String(limit),
    });

  return apiRequest<
    AllergenCatalogItem[]
  >(
    `/allergen-catalog/search?${params.toString()}`,
    {
      method: 'GET',
      accessToken:
        getAccessToken(),
    },
  );
}

export async function listAllergies(
  patientId: string,
): Promise<MedicalRecordAllergy[]> {
  return apiRequest<
    MedicalRecordAllergy[]
  >(
    `/patients/${patientId}/medical-record/allergies`,
    {
      method: 'GET',
      accessToken:
        getAccessToken(),
    },
  );
}

export async function createAllergy(
  patientId: string,
  input:
    CreateMedicalRecordAllergyInput,
): Promise<MedicalRecordAllergy> {
  return apiRequest<
    MedicalRecordAllergy
  >(
    `/patients/${patientId}/medical-record/allergies`,
    {
      method: 'POST',
      accessToken:
        getAccessToken(),
      body:
        input,
    },
  );
}

export async function updateAllergy(
  patientId: string,
  allergyId: string,
  input:
    UpdateMedicalRecordAllergyInput,
): Promise<MedicalRecordAllergy> {
  return apiRequest<
    MedicalRecordAllergy
  >(
    `/patients/${patientId}/medical-record/allergies/${allergyId}`,
    {
      method: 'PATCH',
      accessToken:
        getAccessToken(),
      body:
        input,
    },
  );
}

export async function deleteAllergy(
  patientId: string,
  allergyId: string,
): Promise<void> {
  return apiRequest(
    `/patients/${patientId}/medical-record/allergies/${allergyId}`,
    {
      method: 'DELETE',
      accessToken:
        getAccessToken(),
    },
  );
}