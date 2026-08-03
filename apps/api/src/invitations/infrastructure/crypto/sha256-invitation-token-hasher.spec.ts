import { Sha256InvitationTokenHasher } from './sha256-invitation-token-hasher';

describe(
  'Sha256InvitationTokenHasher',
  () => {
    let tokenHasher: Sha256InvitationTokenHasher;

    beforeEach(() => {
      tokenHasher =
        new Sha256InvitationTokenHasher();
    });

    it('hashes a token', () => {
      const token =
        'secure-invitation-token';

      const tokenHash =
        tokenHasher.hash(token);

      expect(tokenHash).toBeDefined();
      expect(tokenHash).not.toBe(token);
      expect(tokenHash).toMatch(
        /^[a-f0-9]{64}$/,
      );
    });

    it('produces the same hash for the same token', () => {
      const token =
        'secure-invitation-token';

      expect(
        tokenHasher.hash(token),
      ).toBe(tokenHasher.hash(token));
    });

    it('accepts the correct token', () => {
      const token =
        'secure-invitation-token';

      const tokenHash =
        tokenHasher.hash(token);

      expect(
        tokenHasher.compare(
          token,
          tokenHash,
        ),
      ).toBe(true);
    });

    it('rejects an incorrect token', () => {
      const tokenHash =
        tokenHasher.hash(
          'correct-token',
        );

      expect(
        tokenHasher.compare(
          'wrong-token',
          tokenHash,
        ),
      ).toBe(false);
    });

    it('rejects an invalid hash', () => {
      expect(
        tokenHasher.compare(
          'token',
          'invalid-hash',
        ),
      ).toBe(false);
    });
  },
);