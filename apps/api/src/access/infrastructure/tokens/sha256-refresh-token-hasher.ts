import { Injectable } from '@nestjs/common';
import {
  createHash,
  timingSafeEqual,
} from 'node:crypto';

import { RefreshTokenHasher } from '../../domain/tokens/refresh-token-hasher';

@Injectable()
export class Sha256RefreshTokenHasher
  implements RefreshTokenHasher
{
  hash(refreshToken: string): string {
    return createHash('sha256')
      .update(refreshToken, 'utf8')
      .digest('hex');
  }

  compare(
    refreshToken: string,
    refreshTokenHash: string,
  ): boolean {
    const calculatedHash =
      this.hash(refreshToken);

    if (
      !/^[a-f0-9]{64}$/i.test(
        refreshTokenHash,
      )
    ) {
      return false;
    }

    const calculatedBuffer = Buffer.from(
      calculatedHash,
      'hex',
    );

    const expectedBuffer = Buffer.from(
      refreshTokenHash,
      'hex',
    );

    if (
      calculatedBuffer.length !==
      expectedBuffer.length
    ) {
      return false;
    }

    return timingSafeEqual(
      calculatedBuffer,
      expectedBuffer,
    );
  }
}