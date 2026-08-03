import { CryptoInvitationTokenGenerator } from './crypto-invitation-token-generator';

describe(
  'CryptoInvitationTokenGenerator',
  () => {
    let tokenGenerator: CryptoInvitationTokenGenerator;

    beforeEach(() => {
      tokenGenerator =
        new CryptoInvitationTokenGenerator();
    });

    it('generates a token', () => {
      const token =
        tokenGenerator.generate();

      expect(token).toBeDefined();
      expect(token.length).toBeGreaterThan(30);
    });

    it('generates URL-safe tokens', () => {
      const token =
        tokenGenerator.generate();

      expect(token).toMatch(
        /^[A-Za-z0-9_-]+$/,
      );
    });

    it('generates different tokens', () => {
      const firstToken =
        tokenGenerator.generate();

      const secondToken =
        tokenGenerator.generate();

      expect(firstToken).not.toBe(
        secondToken,
      );
    });
  },
);