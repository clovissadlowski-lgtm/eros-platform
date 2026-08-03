import { Injectable } from '@nestjs/common';
import {
  createHash,
  timingSafeEqual,
} from 'node:crypto';

import { InvitationTokenHasher } from '../../domain/services/invitation-token-hasher';

@Injectable()
export class Sha256InvitationTokenHasher
  implements InvitationTokenHasher
{
  hash(token: string): string {
    return createHash('sha256')
      .update(token, 'utf8')
      .digest('hex');
  }

  compare(
    token: string,
    tokenHash: string,
  ): boolean {
    const calculatedHash = this.hash(token);

    const calculatedBuffer = Buffer.from(
      calculatedHash,
      'hex',
    );

    let expectedBuffer: Buffer;

    try {
      expectedBuffer = Buffer.from(
        tokenHash,
        'hex',
      );
    } catch {
      return false;
    }

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