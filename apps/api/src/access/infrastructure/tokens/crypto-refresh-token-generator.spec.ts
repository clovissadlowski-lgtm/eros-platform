import { CryptoRefreshTokenGenerator } from './crypto-refresh-token-generator';

describe(
  'CryptoRefreshTokenGenerator',
  () => {
    let generator: CryptoRefreshTokenGenerator;

    beforeEach(() => {
      generator =
        new CryptoRefreshTokenGenerator();
    });

    it('generates a refresh token', () => {
      const token = generator.generate();

      expect(token).toBeDefined();
      expect(token.length).toBeGreaterThan(
        50,
      );
    });

    it('generates URL-safe tokens', () => {
      const token = generator.generate();

      expect(token).toMatch(
        /^[A-Za-z0-9_-]+$/,
      );
    });

    it('generates different tokens', () => {
      const firstToken =
        generator.generate();

      const secondToken =
        generator.generate();

      expect(firstToken).not.toBe(
        secondToken,
      );
    });
  },
);