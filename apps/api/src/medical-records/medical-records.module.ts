import { Module } from '@nestjs/common';

import { AccessModule } from '../access/access.module';
import { PrismaModule } from '../common/database/prisma.module';
import { PatientsModule } from '../patients/patients.module';

import { MedicalRecordHealthConditionsService } from './application/services/medical-record-health-conditions.service';
import { MedicalRecordMedicationsService } from './application/services/medical-record-medications.service';
import { MedicalRecordsService } from './application/services/medical-records.service';

import { MedicalRecordHealthConditionsRepository } from './domain/repositories/medical-record-health-conditions.repository';
import { MedicalRecordMedicationsRepository } from './domain/repositories/medical-record-medications.repository';
import { MedicalRecordsRepository } from './domain/repositories/medical-records.repository';

import { PrismaMedicalRecordHealthConditionsRepository } from './infrastructure/repositories/prisma-medical-record-health-conditions.repository';
import { PrismaMedicalRecordMedicationsRepository } from './infrastructure/repositories/prisma-medical-record-medications.repository';
import { PrismaMedicalRecordsRepository } from './infrastructure/repositories/prisma-medical-records.repository';

import { MedicalRecordHealthConditionsController } from './presentation/controllers/medical-record-health-conditions.controller';
import { MedicalRecordsController } from './presentation/controllers/medical-records.controller';

import { MedicalRecordMedicationsController } from './presentation/controllers/medical-record-medications.controller';

import {
  MedicalRecordAllergiesService,
} from './application/services/medical-record-allergies.service';

import {
  MedicalRecordAllergiesRepository,
} from './domain/repositories/medical-record-allergies.repository';

import {
  PrismaMedicalRecordAllergiesRepository,
} from './infrastructure/repositories/prisma-medical-record-allergies.repository';

import {
  MedicalRecordAllergiesController,
} from './presentation/controllers/medical-record-allergies.controller';

import {
  ClinicalCatalogModule,
} from '../clinical-catalog/clinical-catalog.module';

import {
  MedicationCatalogModule,
} from '../medication-catalog/medication-catalog.module';

@Module({
  imports: [
    PrismaModule,
    PatientsModule,
    AccessModule,
    ClinicalCatalogModule,
    MedicationCatalogModule,
  ],

  controllers: [
    MedicalRecordsController,
    MedicalRecordHealthConditionsController,
    MedicalRecordMedicationsController,
    MedicalRecordAllergiesController,
  ],

  providers: [
    MedicalRecordsService,
    MedicalRecordHealthConditionsService,
    MedicalRecordMedicationsService,
    MedicalRecordAllergiesService,

    {
      provide:
        MedicalRecordsRepository,
      useClass:
        PrismaMedicalRecordsRepository,
    },

    {
      provide:
        MedicalRecordHealthConditionsRepository,
      useClass:
        PrismaMedicalRecordHealthConditionsRepository,
    },

    {
      provide:
        MedicalRecordMedicationsRepository,
      useClass:
        PrismaMedicalRecordMedicationsRepository,
    },

    {
      provide:
        MedicalRecordAllergiesRepository,
      useClass:
        PrismaMedicalRecordAllergiesRepository,
    },
  ],

  exports: [
    MedicalRecordsService,
    MedicalRecordHealthConditionsService,
    MedicalRecordMedicationsService,
    MedicalRecordsRepository,
    MedicalRecordHealthConditionsRepository,
    MedicalRecordMedicationsRepository,
    MedicalRecordAllergiesService,
    MedicalRecordAllergiesRepository,
  ],
})
export class MedicalRecordsModule {}