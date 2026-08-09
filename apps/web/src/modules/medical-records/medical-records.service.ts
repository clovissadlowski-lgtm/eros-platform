import {
  apiRequest,
} from '@/lib/api/api-client';
import {
  authStorage,
} from '@/lib/auth/auth-storage';

import type {
  ClinicalConditionCatalogItem,
  CreateHealthConditionInput,
  CreateMedicationInput,
  HealthCondition,
  Medication,
  MedicationCatalogItem,
  UpdateHealthConditionInput,
  UpdateMedicationInput,
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

export async function searchClinicalConditions(
  query: string,
  limit = 20,
): Promise<ClinicalConditionCatalogItem[]> {
  const params =
    new URLSearchParams({
      q: query,
      limit:
        String(limit),
    });

  return apiRequest<
    ClinicalConditionCatalogItem[]
  >(
    `/clinical-condition-catalog/search?${params.toString()}`,
    {
      method: 'GET',
      accessToken:
        getAccessToken(),
    },
  );
}

export async function listHealthConditions(
  patientId: string,
): Promise<HealthCondition[]> {
  return apiRequest<HealthCondition[]>(
    `/patients/${patientId}/medical-record/health-conditions`,
    {
      method: 'GET',
      accessToken:
        getAccessToken(),
    },
  );
}

export async function createHealthCondition(
  patientId: string,
  input: CreateHealthConditionInput,
): Promise<HealthCondition> {
  return apiRequest<HealthCondition>(
    `/patients/${patientId}/medical-record/health-conditions`,
    {
      method: 'POST',
      accessToken:
        getAccessToken(),
      body:
        input,
    },
  );
}

export async function updateHealthCondition(
  patientId: string,
  healthConditionId: string,
  input: UpdateHealthConditionInput,
): Promise<HealthCondition> {
  return apiRequest<HealthCondition>(
    `/patients/${patientId}/medical-record/health-conditions/${healthConditionId}`,
    {
      method: 'PATCH',
      accessToken:
        getAccessToken(),
      body:
        input,
    },
  );
}

export async function deleteHealthCondition(
  patientId: string,
  healthConditionId: string,
): Promise<void> {
  return apiRequest<void>(
    `/patients/${patientId}/medical-record/health-conditions/${healthConditionId}`,
    {
      method: 'DELETE',
      accessToken:
        getAccessToken(),
    },
  );
}

export async function searchMedications(
  query: string,
  limit = 20,
): Promise<MedicationCatalogItem[]> {
  const params =
    new URLSearchParams({
      q: query,
      limit:
        String(limit),
    });

  return apiRequest<
    MedicationCatalogItem[]
  >(
    `/medication-catalog/search?${params.toString()}`,
    {
      method: 'GET',
      accessToken:
        getAccessToken(),
    },
  );
}

export async function listMedications(
  patientId: string,
): Promise<Medication[]> {
  return apiRequest<Medication[]>(
    `/patients/${patientId}/medical-record/medications`,
    {
      method: 'GET',
      accessToken:
        getAccessToken(),
    },
  );
}

export async function createMedication(
  patientId: string,
  input: CreateMedicationInput,
): Promise<Medication> {
  return apiRequest<Medication>(
    `/patients/${patientId}/medical-record/medications`,
    {
      method: 'POST',
      accessToken:
        getAccessToken(),
      body:
        input,
    },
  );
}

export async function updateMedication(
  patientId: string,
  medicationId: string,
  input: UpdateMedicationInput,
): Promise<Medication> {
  return apiRequest<Medication>(
    `/patients/${patientId}/medical-record/medications/${medicationId}`,
    {
      method: 'PATCH',
      accessToken:
        getAccessToken(),
      body:
        input,
    },
  );
}

export async function deleteMedication(
  patientId: string,
  medicationId: string,
): Promise<void> {
  return apiRequest<void>(
    `/patients/${patientId}/medical-record/medications/${medicationId}`,
    {
      method: 'DELETE',
      accessToken:
        getAccessToken(),
    },
  );
}