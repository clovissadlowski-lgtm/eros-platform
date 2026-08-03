import { Module } from '@nestjs/common';

import { PrismaModule } from '../common/database/prisma.module';
import { MembershipsService } from './application/services/memberships.service';
import { UsersService } from './application/services/users.service';
import { MembershipsRepository } from './domain/repositories/memberships.repository';
import { UsersRepository } from './domain/repositories/users.repository';
import { PrismaMembershipsRepository } from './infrastructure/repositories/prisma-memberships.repository';
import { PrismaUsersRepository } from './infrastructure/repositories/prisma-users.repository';
import { OrganizationsModule } from '../organizations/organizations.module';

@Module({
  imports: [
    PrismaModule,
    OrganizationsModule,
  ],
  providers: [
    UsersService,
    MembershipsService,
    {
      provide: UsersRepository,
      useClass: PrismaUsersRepository,
    },
    {
      provide: MembershipsRepository,
      useClass: PrismaMembershipsRepository,
    },
  ],
  exports: [
    UsersService,
    MembershipsService,
    UsersRepository,
    MembershipsRepository,
  ],
})
export class UsersModule {}