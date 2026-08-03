import { Injectable } from '@nestjs/common';
import {
  randomBytes,
  scrypt as nodeScrypt,
  timingSafeEqual,
} from 'node:crypto';
import { promisify } from 'node:util';

import { PasswordHasher } from '../../domain/services/password-hasher';

const scrypt = promisify(nodeScrypt);

@Injectable()
export class ScryptPasswordHasher
  implements PasswordHasher
{
  private static readonly ALGORITHM =
    'scrypt';

  private static readonly VERSION = 1;

  private static readonly SALT_LENGTH =
    16;

  private static readonly KEY_LENGTH =
    64;

  async hash(
    plainPassword: string,
  ): Promise<string> {
    const salt = randomBytes(
      ScryptPasswordHasher.SALT_LENGTH,
    );

    const derivedKey = (await scrypt(
      plainPassword,
      salt,
      ScryptPasswordHasher.KEY_LENGTH,
    )) as Buffer;

    return [
      ScryptPasswordHasher.ALGORITHM,
      ScryptPasswordHasher.VERSION,
      salt.toString('base64'),
      derivedKey.toString('base64'),
    ].join('$');
  }

  async compare(
    plainPassword: string,
    passwordHash: string,
  ): Promise<boolean> {
    const parsedHash =
      this.parsePasswordHash(passwordHash);

    if (!parsedHash) {
      return false;
    }

    const derivedKey = (await scrypt(
      plainPassword,
      parsedHash.salt,
      parsedHash.expectedKey.length,
    )) as Buffer;

    if (
      derivedKey.length !==
      parsedHash.expectedKey.length
    ) {
      return false;
    }

    return timingSafeEqual(
      derivedKey,
      parsedHash.expectedKey,
    );
  }

  private parsePasswordHash(
    passwordHash: string,
  ): {
    salt: Buffer;
    expectedKey: Buffer;
  } | null {
    const [
      algorithm,
      version,
      encodedSalt,
      encodedKey,
    ] = passwordHash.split('$');

    if (
      algorithm !==
        ScryptPasswordHasher.ALGORITHM ||
      version !==
        String(
          ScryptPasswordHasher.VERSION,
        ) ||
      !encodedSalt ||
      !encodedKey
    ) {
      return null;
    }

    try {
      const salt = Buffer.from(
        encodedSalt,
        'base64',
      );

      const expectedKey = Buffer.from(
        encodedKey,
        'base64',
      );

      if (
        salt.length !==
          ScryptPasswordHasher.SALT_LENGTH ||
        expectedKey.length !==
          ScryptPasswordHasher.KEY_LENGTH
      ) {
        return null;
      }

      return {
        salt,
        expectedKey,
      };
    } catch {
      return null;
    }
  }
}