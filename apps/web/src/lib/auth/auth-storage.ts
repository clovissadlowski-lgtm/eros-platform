import type {
  AuthUser,
  UserOrganization,
} from '@/modules/auth/auth.types';

const ACCESS_TOKEN_KEY =
  'higeia.accessToken';

const REFRESH_TOKEN_KEY =
  'higeia.refreshToken';

const AUTH_USER_KEY =
  'higeia.authUser';

const ACTIVE_ORGANIZATION_KEY =
  'higeia.activeOrganization';

function parseJson<T>(
  value: string | null,
): T | null {
  if (!value) {
    return null;
  }

  try {
    return JSON.parse(
      value,
    ) as T;
  } catch {
    return null;
  }
}

export const authStorage = {
  getAccessToken():
    | string
    | null {
    if (
      typeof window ===
      'undefined'
    ) {
      return null;
    }

    return sessionStorage.getItem(
      ACCESS_TOKEN_KEY,
    );
  },

  getRefreshToken():
    | string
    | null {
    if (
      typeof window ===
      'undefined'
    ) {
      return null;
    }

    return sessionStorage.getItem(
      REFRESH_TOKEN_KEY,
    );
  },

  getUser():
    | AuthUser
    | null {
    if (
      typeof window ===
      'undefined'
    ) {
      return null;
    }

    return parseJson<AuthUser>(
      sessionStorage.getItem(
        AUTH_USER_KEY,
      ),
    );
  },

  getActiveOrganization():
    | UserOrganization
    | null {
    if (
      typeof window ===
      'undefined'
    ) {
      return null;
    }

    return parseJson<UserOrganization>(
      sessionStorage.getItem(
        ACTIVE_ORGANIZATION_KEY,
      ),
    );
  },

  saveTokens(
    accessToken: string,
    refreshToken: string,
  ): void {
    sessionStorage.setItem(
      ACCESS_TOKEN_KEY,
      accessToken,
    );

    sessionStorage.setItem(
      REFRESH_TOKEN_KEY,
      refreshToken,
    );
  },

  saveUser(
    user: AuthUser,
  ): void {
    sessionStorage.setItem(
      AUTH_USER_KEY,
      JSON.stringify(
        user,
      ),
    );
  },

  saveActiveOrganization(
    organization: UserOrganization,
  ): void {
    sessionStorage.setItem(
      ACTIVE_ORGANIZATION_KEY,
      JSON.stringify(
        organization,
      ),
    );
  },

  clear(): void {
    sessionStorage.removeItem(
      ACCESS_TOKEN_KEY,
    );

    sessionStorage.removeItem(
      REFRESH_TOKEN_KEY,
    );

    sessionStorage.removeItem(
      AUTH_USER_KEY,
    );

    sessionStorage.removeItem(
      ACTIVE_ORGANIZATION_KEY,
    );
  },
};