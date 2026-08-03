import { Injectable } from '@nestjs/common';
import { randomBytes } from 'node:crypto';

import { RefreshTokenGenerator } from '../../domain/tokens/refresh-token-generator';

@Injectable()
export class CryptoRefreshTokenGenerator
  implements RefreshTokenGenerator
{
  private static readonly TOKEN_SIZE_BYTES = 48;

  generate(): string {
    return randomBytes(
      CryptoRefreshTokenGenerator.TOKEN_SIZE_BYTES,
    ).toString('base64url');
  }
}