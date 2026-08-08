import {
  apiRequest,
} from '@/lib/api/api-client';
import {
  authStorage,
} from '@/lib/auth/auth-storage';

import type {
  LoginInput,
  LoginResponse,
  SelectOrganizationResponse,
  UserOrganization,
} from './auth.types';

export async function login(
  input: LoginInput,
): Promise<LoginResponse> {
  return apiRequest<LoginResponse>(
    '/auth/login',
    {
      method: 'POST',
      body: input,
    },
  );
}

export async function listOrganizations(): Promise<
  UserOrganization[]
> {
  const accessToken =
    authStorage.getAccessToken();

  return apiRequest<
    UserOrganization[]
  >(
    '/auth/organizations',
    {
      method: 'GET',
      accessToken,
    },
  );
}

export async function selectOrganization(
  organizationId: string,
): Promise<SelectOrganizationResponse> {
  const accessToken =
    authStorage.getAccessToken();

  return apiRequest<SelectOrganizationResponse>(
    '/auth/select-organization',
    {
      method: 'POST',
      accessToken,
      body: {
        organizationId,
      },
    },
  );
}