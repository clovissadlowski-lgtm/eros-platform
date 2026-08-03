export abstract class RefreshTokenHasher {
  abstract hash(
    refreshToken: string,
  ): string;

  abstract compare(
    refreshToken: string,
    refreshTokenHash: string,
  ): boolean;
}