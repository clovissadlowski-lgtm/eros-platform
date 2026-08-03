import { Module } from '@nestjs/common';

import { PasswordHasher } from './domain/services/password-hasher';
import { PasswordPolicy } from './domain/services/password-policy';
import { ScryptPasswordHasher } from './infrastructure/crypto/scrypt-password-hasher';
import { DefaultPasswordPolicy } from './infrastructure/security/default-password-policy';

@Module({
  providers: [
    {
      provide: PasswordHasher,
      useClass: ScryptPasswordHasher,
    },
    {
      provide: PasswordPolicy,
      useClass: DefaultPasswordPolicy,
    },
  ],
  exports: [
    PasswordHasher,
    PasswordPolicy,
  ],
})
export class AuthModule {}