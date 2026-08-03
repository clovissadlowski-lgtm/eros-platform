import { Module } from '@nestjs/common';

import { AccessModule } from '../access/access.module';
import { PrismaModule } from '../common/database/prisma.module';
import { PatientsService } from './application/services/patients.service';
import { PatientsRepository } from './domain/repositories/patients.repository';
import { PrismaPatientsRepository } from './infrastructure/repositories/prisma-patients.repository';
import { PatientsController } from './presentation/controllers/patients.controller';

@Module({
  imports: [
    PrismaModule,
    AccessModule,
  ],
  controllers: [
    PatientsController,
  ],
  providers: [
    PatientsService,
    {
      provide: PatientsRepository,
      useClass: PrismaPatientsRepository,
    },
  ],
  exports: [
    PatientsService,
    PatientsRepository,
  ],
})
export class PatientsModule {}