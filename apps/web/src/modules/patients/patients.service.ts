import {
  apiRequest,
} from '@/lib/api/api-client';
import {
  authStorage,
} from '@/lib/auth/auth-storage';

import type {
  CreatePatientInput,
  Patient,
  PatientStatus,
  UpdatePatientInput,
} from './patient.types';

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

export async function listPatients(): Promise<
  Patient[]
> {
  return apiRequest<Patient[]>(
    '/patients',
    {
      method: 'GET',
      accessToken:
        getAccessToken(),
    },
  );
}

export async function getPatient(
  patientId: string,
): Promise<Patient> {
  return apiRequest<Patient>(
    `/patients/${patientId}`,
    {
      method: 'GET',
      accessToken:
        getAccessToken(),
    },
  );
}

export async function createPatient(
  input: CreatePatientInput,
): Promise<Patient> {
  return apiRequest<Patient>(
    '/patients',
    {
      method: 'POST',
      accessToken:
        getAccessToken(),
      body: input,
    },
  );
}

export async function updatePatient(
  patientId: string,
  input: UpdatePatientInput,
): Promise<Patient> {
  return apiRequest<Patient>(
    `/patients/${patientId}`,
    {
      method: 'PATCH',
      accessToken:
        getAccessToken(),
      body: input,
    },
  );
}

export async function updatePatientStatus(
  patientId: string,
  status: PatientStatus,
): Promise<Patient> {
  return apiRequest<Patient>(
    `/patients/${patientId}/status`,
    {
      method: 'PATCH',
      accessToken:
        getAccessToken(),
      body: {
        status,
      },
    },
  );
}