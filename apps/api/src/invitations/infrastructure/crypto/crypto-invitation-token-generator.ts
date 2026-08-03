import { Injectable } from '@nestjs/common';
import { randomBytes } from 'node:crypto';

import { InvitationTokenGenerator } from '../../domain/services/invitation-token-generator';

@Injectable()
export class CryptoInvitationTokenGenerator
  implements InvitationTokenGenerator
{
  private static readonly TOKEN_LENGTH = 32;

  generate(): string {
    return randomBytes(
      CryptoInvitationTokenGenerator.TOKEN_LENGTH,
    ).toString('base64url');
  }
}