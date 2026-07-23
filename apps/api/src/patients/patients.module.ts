import { Module } from '@nestjs/common';
import { PatientsService } from './application/services/patients.service';
import { PatientsRepository } from './domain/repositories/patients.repository';
import { InMemoryPatientsRepository } from './infrastructure/repositories/in-memory-patients.repository';
import { PatientsController } from './presentation/controllers/patients.controller';

@Module({
  controllers: [PatientsController],
  providers: [
    PatientsService,
    {
      provide: PatientsRepository,
      useClass: InMemoryPatientsRepository,
    },
  ],
  exports: [PatientsService],
})
export class PatientsModule {}
