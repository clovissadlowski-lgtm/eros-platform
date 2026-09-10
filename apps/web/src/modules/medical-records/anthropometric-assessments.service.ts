import {
  apiRequest,
} from '@/lib/api/api-client';

import {
  authStorage,
} from '@/lib/auth/auth-storage';

import type {
  AnthropometricAssessment,
  AnthropometricAssessmentResults,
  CreateAnthropometricAssessmentInput,
  UpdateAnthropometricAssessmentInput,
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

export async function listAnthropometricAssessments(
  patientId: string,
): Promise<AnthropometricAssessment[]> {
  return apiRequest<
    AnthropometricAssessment[]
  >(
    `/patients/${patientId}/medical-record/anthropometric-assessments`,
    {
      method:
        'GET',

      accessToken:
        getAccessToken(),
    },
  );
}

export async function createAnthropometricAssessment(
  patientId: string,
  input: CreateAnthropometricAssessmentInput,
): Promise<AnthropometricAssessment> {
  return apiRequest<
    AnthropometricAssessment
  >(
    `/patients/${patientId}/medical-record/anthropometric-assessments`,
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

export async function updateAnthropometricAssessment(
  patientId: string,
  assessmentId: string,
  input: UpdateAnthropometricAssessmentInput,
): Promise<AnthropometricAssessment> {
  return apiRequest<
    AnthropometricAssessment
  >(
    `/patients/${patientId}/medical-record/anthropometric-assessments/${assessmentId}`,
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

export async function getAnthropometricAssessmentResults(
  patientId: string,
  assessmentId: string,
): Promise<AnthropometricAssessmentResults> {
  return apiRequest<
    AnthropometricAssessmentResults
  >(
    `/patients/${patientId}/medical-record/anthropometric-assessments/${assessmentId}/results`,
    {
      method:
        'GET',

      accessToken:
        getAccessToken(),
    },
  );
}

export async function deleteAnthropometricAssessment(
  patientId: string,
  assessmentId: string,
): Promise<void> {
  return apiRequest(
    `/patients/${patientId}/medical-record/anthropometric-assessments/${assessmentId}`,
    {
      method:
        'DELETE',

      accessToken:
        getAccessToken(),
    },
  );
}