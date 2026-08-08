const ACCESS_TOKEN_KEY =
  'higeia.accessToken';

const REFRESH_TOKEN_KEY =
  'higeia.refreshToken';

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

  clear(): void {
    sessionStorage.removeItem(
      ACCESS_TOKEN_KEY,
    );

    sessionStorage.removeItem(
      REFRESH_TOKEN_KEY,
    );
  },
};