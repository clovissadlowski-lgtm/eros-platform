import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

import { AuthModule } from '../auth/auth.module';
import { PrismaModule } from '../common/database/prisma.module';
import { UsersModule } from '../users/users.module';

import { LoginService } from './application/services/login.service';
import { LogoutAllSessionsService } from './application/services/logout-all-sessions.service';
import { LogoutSessionService } from './application/services/logout-session.service';
import { RefreshSessionService } from './application/services/refresh-session.service';
import { SelectOrganizationService } from './application/services/select-organization.service';

import { SessionsRepository } from './domain/repositories/sessions.repository';
import { AccessTokenProvider } from './domain/tokens/access-token-provider';
import { RefreshTokenGenerator } from './domain/tokens/refresh-token-generator';
import { RefreshTokenHasher } from './domain/tokens/refresh-token-hasher';
import { LoginPersistenceTransaction } from './domain/transactions/login-persistence.transaction';
import { RefreshSessionTransaction } from './domain/transactions/refresh-session.transaction';

import { PrismaSessionsRepository } from './infrastructure/repositories/prisma-sessions.repository';
import { CryptoRefreshTokenGenerator } from './infrastructure/tokens/crypto-refresh-token-generator';
import { JwtAccessTokenProvider } from './infrastructure/tokens/jwt-access-token.provider';
import { Sha256RefreshTokenHasher } from './infrastructure/tokens/sha256-refresh-token-hasher';
import { PrismaLoginPersistenceTransaction } from './infrastructure/transactions/prisma-login-persistence.transaction';
import { PrismaRefreshSessionTransaction } from './infrastructure/transactions/prisma-refresh-session.transaction';

import { AccessController } from './presentation/controllers/access.controller';
import { JwtAuthGuard } from './presentation/guards/jwt-auth.guard';
import { RolesGuard } from './presentation/guards/roles.guard';

@Module({
  imports: [
    PrismaModule,
    AuthModule,
    UsersModule,
    JwtModule.register({}),
  ],
  controllers: [
    AccessController,
  ],
  providers: [
    LoginService,
    RefreshSessionService,
    LogoutSessionService,
    LogoutAllSessionsService,
    SelectOrganizationService,

    JwtAuthGuard,
    RolesGuard,

    {
      provide: SessionsRepository,
      useClass: PrismaSessionsRepository,
    },
    {
      provide: AccessTokenProvider,
      useClass: JwtAccessTokenProvider,
    },
    {
      provide: RefreshTokenGenerator,
      useClass: CryptoRefreshTokenGenerator,
    },
    {
      provide: RefreshTokenHasher,
      useClass: Sha256RefreshTokenHasher,
    },
    {
      provide: LoginPersistenceTransaction,
      useClass: PrismaLoginPersistenceTransaction,
    },
    {
      provide: RefreshSessionTransaction,
      useClass: PrismaRefreshSessionTransaction,
    },
  ],
  exports: [
    UsersModule,

    LoginService,
    RefreshSessionService,
    LogoutSessionService,
    LogoutAllSessionsService,
    SelectOrganizationService,

    JwtAuthGuard,
    RolesGuard,

    SessionsRepository,
    AccessTokenProvider,
    RefreshTokenGenerator,
    RefreshTokenHasher,
    LoginPersistenceTransaction,
    RefreshSessionTransaction,
  ],
})
export class AccessModule {}