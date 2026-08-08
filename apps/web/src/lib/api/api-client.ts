import {
  refreshAccessToken,
} from '@/lib/auth/refresh-session';

import {
  ApiError,
  type ApiErrorResponse,
} from './api-error';
import {
  apiConfig,
} from './api-config';

export interface ApiRequestOptions
  extends Omit<
    RequestInit,
    'body'
  > {
  body?: unknown;
  accessToken?: string | null;
}

function isApiErrorResponse(
  value: unknown,
): value is ApiErrorResponse {
  if (
    typeof value !== 'object' ||
    value === null
  ) {
    return false;
  }

  const candidate =
    value as Partial<ApiErrorResponse>;

  return (
    typeof candidate.statusCode ===
      'number' &&
    typeof candidate.code ===
      'string' &&
    typeof candidate.message ===
      'string' &&
    typeof candidate.timestamp ===
      'string' &&
    typeof candidate.path ===
      'string'
  );
}

async function executeRequest(
  path: string,
  options: ApiRequestOptions,
  accessToken:
    | string
    | null
    | undefined,
): Promise<Response> {
  const {
    body,
    headers,
    accessToken:
      _ignoredAccessToken,
    ...requestOptions
  } = options;

  const requestHeaders =
    new Headers(headers);

  requestHeaders.set(
    'Accept',
    'application/json',
  );

  if (body !== undefined) {
    requestHeaders.set(
      'Content-Type',
      'application/json',
    );
  }

  if (accessToken) {
    requestHeaders.set(
      'Authorization',
      `Bearer ${accessToken}`,
    );
  }

  const normalizedPath =
    path.startsWith('/')
      ? path
      : `/${path}`;

  return fetch(
    `${apiConfig.baseUrl}${normalizedPath}`,
    {
      ...requestOptions,
      headers:
        requestHeaders,
      body:
        body === undefined
          ? undefined
          : JSON.stringify(
              body,
            ),
    },
  );
}

async function parseResponse<T>(
  response: Response,
): Promise<T> {
  if (
    response.status === 204
  ) {
    return undefined as T;
  }

  const contentType =
    response.headers.get(
      'content-type',
    );

  const responseBody =
    contentType?.includes(
      'application/json',
    )
      ? await response.json()
      : await response.text();

  if (!response.ok) {
    if (
      isApiErrorResponse(
        responseBody,
      )
    ) {
      throw new ApiError(
        responseBody,
      );
    }

    throw new Error(
      `API request failed with status ${response.status}.`,
    );
  }

  return responseBody as T;
}

export async function apiRequest<T>(
  path: string,
  options: ApiRequestOptions = {},
): Promise<T> {
  let response =
    await executeRequest(
      path,
      options,
      options.accessToken,
    );

  const canRefresh =
    response.status === 401 &&
    Boolean(
      options.accessToken,
    ) &&
    path !== '/auth/refresh';

  if (canRefresh) {
    try {
      const newAccessToken =
        await refreshAccessToken();

      response =
        await executeRequest(
          path,
          options,
          newAccessToken,
        );
    } catch {
      if (
        typeof window !==
        'undefined'
      ) {
        window.location.replace(
          '/login',
        );
      }

      throw new Error(
        'Authenticated session expired.',
      );
    }
  }

  return parseResponse<T>(
    response,
  );
}