import { Module } from '@nestjs/common';

import { AccessModule } from '../access/access.module';
import { PrismaModule } from '../common/database/prisma.module';
import { PatientsModule } from '../patients/patients.module';
import { MedicalRecordsService } from './application/services/medical-records.service';
import { MedicalRecordsRepository } from './domain/repositories/medical-records.repository';
import { PrismaMedicalRecordsRepository } from './infrastructure/repositories/prisma-medical-records.repository';
import { MedicalRecordsController } from './presentation/controllers/medical-records.controller';

@Module({
  imports: [
    PrismaModule,
    PatientsModule,
    AccessModule,
  ],
  controllers: [
    MedicalRecordsController,
  ],
  providers: [
    MedicalRecordsService,
    {
      provide: MedicalRecordsRepository,
      useClass:
        PrismaMedicalRecordsRepository,
    },
  ],
  exports: [
    MedicalRecordsService,
    MedicalRecordsRepository,
  ],
})
export class MedicalRecordsModule {}