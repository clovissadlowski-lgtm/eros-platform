import { Sha256RefreshTokenHasher } from './sha256-refresh-token-hasher';

describe(
  'Sha256RefreshTokenHasher',
  () => {
    let hasher: Sha256RefreshTokenHasher;

    beforeEach(() => {
      hasher =
        new Sha256RefreshTokenHasher();
    });

    it('hashes a refresh token', () => {
      const refreshToken =
        'secure-refresh-token';

      const hash =
        hasher.hash(refreshToken);

      expect(hash).not.toBe(refreshToken);
      expect(hash).toMatch(
        /^[a-f0-9]{64}$/,
      );
    });

    it('generates the same hash for the same token', () => {
      const token =
        'secure-refresh-token';

      expect(hasher.hash(token)).toBe(
        hasher.hash(token),
      );
    });

    it('accepts the correct refresh token', () => {
      const token =
        'secure-refresh-token';

      const hash = hasher.hash(token);

      expect(
        hasher.compare(token, hash),
      ).toBe(true);
    });

    it('rejects an incorrect refresh token', () => {
      const hash = hasher.hash(
        'correct-refresh-token',
      );

      expect(
        hasher.compare(
          'wrong-refresh-token',
          hash,
        ),
      ).toBe(false);
    });

    it('rejects an invalid hash', () => {
      expect(
        hasher.compare(
          'refresh-token',
          'invalid-hash',
        ),
      ).toBe(false);
    });
  },
);