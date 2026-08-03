import { Module } from '@nestjs/common';

import { AccessModule } from '../access/access.module';
import { PrismaModule } from '../common/database/prisma.module';
import { PatientsModule } from '../patients/patients.module';
import { UsersModule } from '../users/users.module';
import { AppointmentsService } from './application/services/appointments.service';
import { AppointmentsRepository } from './domain/repositories/appointments.repository';
import { PrismaAppointmentsRepository } from './infrastructure/repositories/prisma-appointments.repository';
import { AppointmentsController } from './presentation/controllers/appointments.controller';

@Module({
  imports: [
    PrismaModule,
    PatientsModule,
    UsersModule,
    AccessModule,
  ],
  controllers: [
    AppointmentsController,
  ],
  providers: [
    AppointmentsService,
    {
      provide: AppointmentsRepository,
      useClass:
        PrismaAppointmentsRepository,
    },
  ],
  exports: [
    AppointmentsService,
    AppointmentsRepository,
  ],
})
export class AppointmentsModule {}