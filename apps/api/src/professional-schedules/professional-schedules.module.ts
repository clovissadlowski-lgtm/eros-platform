import { Module } from '@nestjs/common';

import { AccessModule } from '../access/access.module';
import { AppointmentsModule } from '../appointments/appointments.module';
import { PrismaModule } from '../common/database/prisma.module';
import { UsersModule } from '../users/users.module';
import { AvailableSlotsService } from './application/services/available-slots.service';
import { ProfessionalScheduleBlocksService } from './application/services/professional-schedule-blocks.service';
import { ProfessionalSchedulesService } from './application/services/professional-schedules.service';
import { ProfessionalAvailabilityWindowsRepository } from './domain/repositories/professional-availability-windows.repository';
import { ProfessionalScheduleBlocksRepository } from './domain/repositories/professional-schedule-blocks.repository';
import { ProfessionalSchedulesRepository } from './domain/repositories/professional-schedules.repository';
import { PrismaProfessionalAvailabilityWindowsRepository } from './infrastructure/repositories/prisma-professional-availability-windows.repository';
import { PrismaProfessionalScheduleBlocksRepository } from './infrastructure/repositories/prisma-professional-schedule-blocks.repository';
import { PrismaProfessionalSchedulesRepository } from './infrastructure/repositories/prisma-professional-schedules.repository';
import { ProfessionalSchedulesController } from './presentation/controllers/professional-schedules.controller';

@Module({
  imports: [
    PrismaModule,
    UsersModule,
    AppointmentsModule,
    AccessModule,
  ],
  controllers: [
    ProfessionalSchedulesController,
  ],
  providers: [
    ProfessionalSchedulesService,
    AvailableSlotsService,
    ProfessionalScheduleBlocksService,

    {
      provide:
        ProfessionalSchedulesRepository,
      useClass:
        PrismaProfessionalSchedulesRepository,
    },
    {
      provide:
        ProfessionalAvailabilityWindowsRepository,
      useClass:
        PrismaProfessionalAvailabilityWindowsRepository,
    },
    {
      provide:
        ProfessionalScheduleBlocksRepository,
      useClass:
        PrismaProfessionalScheduleBlocksRepository,
    },
  ],
  exports: [
    ProfessionalSchedulesService,
    AvailableSlotsService,
    ProfessionalScheduleBlocksService,
    ProfessionalSchedulesRepository,
    ProfessionalAvailabilityWindowsRepository,
    ProfessionalScheduleBlocksRepository,
  ],
})
export class ProfessionalSchedulesModule {}