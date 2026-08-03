import {
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

import {
  AccessTokenPayload,
  AccessTokenProvider,
} from '../../domain/tokens/access-token-provider';

@Injectable()
export class JwtAccessTokenProvider
  implements AccessTokenProvider
{
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async generate(
    payload: AccessTokenPayload,
  ): Promise<string> {
    const secret = this.getSecret();
    const expiresIn =
      this.getExpirationSeconds();

    return this.jwtService.signAsync(
      payload,
      {
        secret,
        expiresIn,
        algorithm: 'HS256',
      },
    );
  }

  async verify(
    accessToken: string,
  ): Promise<AccessTokenPayload> {
    try {
      return await this.jwtService.verifyAsync<AccessTokenPayload>(
        accessToken,
        {
          secret: this.getSecret(),
          algorithms: ['HS256'],
        },
      );
    } catch {
      throw new UnauthorizedException(
        'Invalid or expired access token.',
      );
    }
  }

  private getSecret(): string {
    return this.configService.getOrThrow<string>(
      'JWT_ACCESS_SECRET',
    );
  }

  private getExpirationSeconds(): number {
    return this.configService.getOrThrow<number>(
      'JWT_ACCESS_TTL_SECONDS',
    );
  }
}