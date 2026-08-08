import {
  apiConfig,
} from '@/lib/api/api-config';

import {
  authStorage,
} from './auth-storage';

interface RefreshSessionResponse {
  accessToken: string;
  refreshToken: string;
  tokenType: 'Bearer';
  expiresIn: number;
  session: {
    id: string;
    expiresAt: string;
  };
}

let refreshPromise:
  | Promise<string>
  | null = null;

async function executeRefresh(): Promise<string> {
  const refreshToken =
    authStorage.getRefreshToken();

  if (!refreshToken) {
    throw new Error(
      'Refresh token is not available.',
    );
  }

  const response = await fetch(
    `${apiConfig.baseUrl}/auth/refresh`,
    {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type':
          'application/json',
      },
      body: JSON.stringify({
        refreshToken,
      }),
    },
  );

  if (!response.ok) {
    authStorage.clear();

    throw new Error(
      'Session refresh failed.',
    );
  }

  const result =
    (await response.json()) as RefreshSessionResponse;

  authStorage.saveTokens(
    result.accessToken,
    result.refreshToken,
  );

  return result.accessToken;
}

export async function refreshAccessToken(): Promise<string> {
  if (!refreshPromise) {
    refreshPromise =
      executeRefresh().finally(
        () => {
          refreshPromise = null;
        },
      );
  }

  return refreshPromise;
}