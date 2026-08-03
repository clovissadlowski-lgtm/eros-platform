import { Module } from '@nestjs/common';

import { AuthModule } from '../auth/auth.module';
import { PrismaModule } from '../common/database/prisma.module';
import { OrganizationsModule } from '../organizations/organizations.module';
import { UsersModule } from '../users/users.module';
import { AcceptInvitationService } from './application/services/accept-invitation.service';
import { CreateInvitationService } from './application/services/create-invitation.service';
import { InvitationsRepository } from './domain/repositories/invitations.repository';
import { InvitationTokenGenerator } from './domain/services/invitation-token-generator';
import { InvitationTokenHasher } from './domain/services/invitation-token-hasher';
import { InvitationAcceptanceTransaction } from './domain/transactions/invitation-acceptance.transaction';
import { CryptoInvitationTokenGenerator } from './infrastructure/crypto/crypto-invitation-token-generator';
import { Sha256InvitationTokenHasher } from './infrastructure/crypto/sha256-invitation-token-hasher';
import { PrismaInvitationsRepository } from './infrastructure/repositories/prisma-invitations.repository';
import { PrismaInvitationAcceptanceTransaction } from './infrastructure/transactions/prisma-invitation-acceptance.transaction';

@Module({
  imports: [
    PrismaModule,
    AuthModule,
    OrganizationsModule,
    UsersModule,
  ],
  providers: [
    CreateInvitationService,
    AcceptInvitationService,
    {
      provide: InvitationsRepository,
      useClass: PrismaInvitationsRepository,
    },
    {
      provide: InvitationTokenGenerator,
      useClass:
        CryptoInvitationTokenGenerator,
    },
    {
      provide: InvitationTokenHasher,
      useClass:
        Sha256InvitationTokenHasher,
    },
    {
      provide:
        InvitationAcceptanceTransaction,
      useClass:
        PrismaInvitationAcceptanceTransaction,
    },
  ],
  exports: [
    CreateInvitationService,
    AcceptInvitationService,
    InvitationsRepository,
    InvitationTokenGenerator,
    InvitationTokenHasher,
    InvitationAcceptanceTransaction,
  ],
})
export class InvitationsModule {}