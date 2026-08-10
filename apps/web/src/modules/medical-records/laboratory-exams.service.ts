import {
  apiRequest,
} from '@/lib/api/api-client';

import {
  authStorage,
} from '@/lib/auth/auth-storage';

import type {
  BiomarkerCatalogItem,
  CreateLaboratoryExamInput,
  CreateLaboratoryResultInput,
  LaboratoryExam,
  LaboratoryExamWithResults,
  LaboratoryResult,
  UpdateLaboratoryExamInput,
  UpdateLaboratoryResultInput,
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

export async function searchBiomarkers(
  query: string,
  limit = 20,
): Promise<BiomarkerCatalogItem[]> {
  const params =
    new URLSearchParams({
      q:
        query,

      limit:
        String(
          limit,
        ),
    });

  return apiRequest<
    BiomarkerCatalogItem[]
  >(
    `/biomarker-catalog/search?${params.toString()}`,
    {
      method:
        'GET',

      accessToken:
        getAccessToken(),
    },
  );
}

export async function listLaboratoryExams(
  patientId: string,
): Promise<LaboratoryExam[]> {
  return apiRequest<
    LaboratoryExam[]
  >(
    `/patients/${patientId}/medical-record/laboratory-exams`,
    {
      method:
        'GET',

      accessToken:
        getAccessToken(),
    },
  );
}

export async function getLaboratoryExam(
  patientId: string,
  examId: string,
): Promise<LaboratoryExamWithResults> {
  return apiRequest<
    LaboratoryExamWithResults
  >(
    `/patients/${patientId}/medical-record/laboratory-exams/${examId}`,
    {
      method:
        'GET',

      accessToken:
        getAccessToken(),
    },
  );
}

export async function createLaboratoryExam(
  patientId: string,
  input:
    CreateLaboratoryExamInput,
): Promise<LaboratoryExam> {
  return apiRequest<
    LaboratoryExam
  >(
    `/patients/${patientId}/medical-record/laboratory-exams`,
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

export async function updateLaboratoryExam(
  patientId: string,
  examId: string,
  input:
    UpdateLaboratoryExamInput,
): Promise<LaboratoryExam> {
  return apiRequest<
    LaboratoryExam
  >(
    `/patients/${patientId}/medical-record/laboratory-exams/${examId}`,
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

export async function deleteLaboratoryExam(
  patientId: string,
  examId: string,
): Promise<void> {
  return apiRequest(
    `/patients/${patientId}/medical-record/laboratory-exams/${examId}`,
    {
      method:
        'DELETE',

      accessToken:
        getAccessToken(),
    },
  );
}

export async function listLaboratoryResults(
  patientId: string,
  examId: string,
): Promise<LaboratoryResult[]> {
  return apiRequest<
    LaboratoryResult[]
  >(
    `/patients/${patientId}/medical-record/laboratory-exams/${examId}/results`,
    {
      method:
        'GET',

      accessToken:
        getAccessToken(),
    },
  );
}

export async function createLaboratoryResult(
  patientId: string,
  examId: string,
  input:
    CreateLaboratoryResultInput,
): Promise<LaboratoryResult> {
  return apiRequest<
    LaboratoryResult
  >(
    `/patients/${patientId}/medical-record/laboratory-exams/${examId}/results`,
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

export async function updateLaboratoryResult(
  patientId: string,
  examId: string,
  resultId: string,
  input:
    UpdateLaboratoryResultInput,
): Promise<LaboratoryResult> {
  return apiRequest<
    LaboratoryResult
  >(
    `/patients/${patientId}/medical-record/laboratory-exams/${examId}/results/${resultId}`,
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

export async function deleteLaboratoryResult(
  patientId: string,
  examId: string,
  resultId: string,
): Promise<void> {
  return apiRequest(
    `/patients/${patientId}/medical-record/laboratory-exams/${examId}/results/${resultId}`,
    {
      method:
        'DELETE',

      accessToken:
        getAccessToken(),
    },
  );
}