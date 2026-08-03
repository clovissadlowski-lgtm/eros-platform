import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

import { MembershipRole } from '../../../users/domain/entities/membership.entity';
import { JwtAccessTokenProvider } from './jwt-access-token.provider';

describe('JwtAccessTokenProvider', () => {
  let provider: JwtAccessTokenProvider;

  beforeEach(() => {
    const jwtService = new JwtService();

    const configService = new ConfigService({
      JWT_ACCESS_SECRET:
        'test-access-secret-with-more-than-thirty-two-characters',
      JWT_ACCESS_TTL_SECONDS: 900,
    });

    provider = new JwtAccessTokenProvider(
      jwtService,
      configService,
    );
  });

  it('generates and verifies an access token', async () => {
    const payload = {
      sub: 'user-id',
      sessionId: 'session-id',
      email: 'admin@higeia.test',
      organizationId: 'organization-id',
      membershipId: 'membership-id',
      role: MembershipRole.OWNER,
    };

    const accessToken =
      await provider.generate(payload);

    expect(accessToken).toBeDefined();

    const verifiedPayload =
      await provider.verify(accessToken);

    expect(verifiedPayload).toEqual(
      expect.objectContaining(payload),
    );
  });

  it('rejects a token signed with another secret', async () => {
    const anotherJwtService =
      new JwtService({
        secret:
          'another-secret-with-more-than-thirty-two-characters',
      });

    const invalidToken =
      await anotherJwtService.signAsync({
        sub: 'user-id',
        sessionId: 'session-id',
        email: 'admin@higeia.test',
      });

    await expect(
      provider.verify(invalidToken),
    ).rejects.toThrow(
      'Invalid or expired access token.',
    );
  });
});