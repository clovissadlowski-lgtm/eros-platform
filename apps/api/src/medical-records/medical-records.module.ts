import {
  Module,
} from '@nestjs/common';

import {
  AccessModule,
} from '../access/access.module';

import {
  AllergenCatalogModule,
} from '../allergen-catalog/allergen-catalog.module';

import {
  BiomarkerCatalogModule,
} from '../biomarker-catalog/biomarker-catalog.module';

import {
  ClinicalCatalogModule,
} from '../clinical-catalog/clinical-catalog.module';

import {
  PrismaModule,
} from '../common/database/prisma.module';

import {
  DietaryItemCatalogModule,
} from '../dietary-item-catalog/dietary-item-catalog.module';

import {
  MedicationCatalogModule,
} from '../medication-catalog/medication-catalog.module';

import {
  PatientsModule,
} from '../patients/patients.module';

import {
  AnthropometricAssessmentResultsService,
} from './application/services/anthropometric-assessment-results.service';

import {
  AnthropometricAssessmentsService,
} from './application/services/anthropometric-assessments.service';

import {
  LaboratoryExamsService,
} from './application/services/laboratory-exams.service';

import {
  MedicalRecordAllergiesService,
} from './application/services/medical-record-allergies.service';

import {
  MedicalRecordDietaryRestrictionsService,
} from './application/services/medical-record-dietary-restrictions.service';

import {
  MedicalRecordHealthConditionsService,
} from './application/services/medical-record-health-conditions.service';

import {
  MedicalRecordMedicationsService,
} from './application/services/medical-record-medications.service';

import {
  MedicalRecordsService,
} from './application/services/medical-records.service';

import {
  AnthropometricAssessmentsRepository,
} from './domain/repositories/anthropometric-assessments.repository';

import {
  LaboratoryExamsRepository,
} from './domain/repositories/laboratory-exams.repository';

import {
  MedicalRecordAllergiesRepository,
} from './domain/repositories/medical-record-allergies.repository';

import {
  MedicalRecordDietaryRestrictionsRepository,
} from './domain/repositories/medical-record-dietary-restrictions.repository';

import {
  MedicalRecordHealthConditionsRepository,
} from './domain/repositories/medical-record-health-conditions.repository';

import {
  MedicalRecordMedicationsRepository,
} from './domain/repositories/medical-record-medications.repository';

import {
  MedicalRecordsRepository,
} from './domain/repositories/medical-records.repository';

import {
  PrismaAnthropometricAssessmentsRepository,
} from './infrastructure/repositories/prisma-anthropometric-assessments.repository';

import {
  PrismaLaboratoryExamsRepository,
} from './infrastructure/repositories/prisma-laboratory-exams.repository';

import {
  PrismaMedicalRecordAllergiesRepository,
} from './infrastructure/repositories/prisma-medical-record-allergies.repository';

import {
  PrismaMedicalRecordDietaryRestrictionsRepository,
} from './infrastructure/repositories/prisma-medical-record-dietary-restrictions.repository';

import {
  PrismaMedicalRecordHealthConditionsRepository,
} from './infrastructure/repositories/prisma-medical-record-health-conditions.repository';

import {
  PrismaMedicalRecordMedicationsRepository,
} from './infrastructure/repositories/prisma-medical-record-medications.repository';

import {
  PrismaMedicalRecordsRepository,
} from './infrastructure/repositories/prisma-medical-records.repository';

import {
  AnthropometricAssessmentsController,
} from './presentation/controllers/anthropometric-assessments.controller';

import {
  LaboratoryExamsController,
} from './presentation/controllers/laboratory-exams.controller';

import {
  MedicalRecordAllergiesController,
} from './presentation/controllers/medical-record-allergies.controller';

import {
  MedicalRecordDietaryRestrictionsController,
} from './presentation/controllers/medical-record-dietary-restrictions.controller';

import {
  MedicalRecordHealthConditionsController,
} from './presentation/controllers/medical-record-health-conditions.controller';

import {
  MedicalRecordMedicationsController,
} from './presentation/controllers/medical-record-medications.controller';

import {
  MedicalRecordsController,
} from './presentation/controllers/medical-records.controller';

@Module({
  imports: [
    PrismaModule,
    PatientsModule,
    AccessModule,
    ClinicalCatalogModule,
    MedicationCatalogModule,
    AllergenCatalogModule,
    DietaryItemCatalogModule,
    BiomarkerCatalogModule,
  ],

  controllers: [
    MedicalRecordsController,
    MedicalRecordHealthConditionsController,
    MedicalRecordMedicationsController,
    MedicalRecordAllergiesController,
    MedicalRecordDietaryRestrictionsController,
    LaboratoryExamsController,
    AnthropometricAssessmentsController,
  ],

  providers: [
    MedicalRecordsService,
    MedicalRecordHealthConditionsService,
    MedicalRecordMedicationsService,
    MedicalRecordAllergiesService,
    MedicalRecordDietaryRestrictionsService,
    LaboratoryExamsService,
    AnthropometricAssessmentResultsService,
    AnthropometricAssessmentsService,

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

    {
      provide:
        MedicalRecordDietaryRestrictionsRepository,

      useClass:
        PrismaMedicalRecordDietaryRestrictionsRepository,
    },

    {
      provide:
        LaboratoryExamsRepository,

      useClass:
        PrismaLaboratoryExamsRepository,
    },

    {
      provide:
        AnthropometricAssessmentsRepository,

      useClass:
        PrismaAnthropometricAssessmentsRepository,
    },
  ],

  exports: [
    MedicalRecordsService,
    MedicalRecordHealthConditionsService,
    MedicalRecordMedicationsService,
    MedicalRecordAllergiesService,
    MedicalRecordDietaryRestrictionsService,
    LaboratoryExamsService,
    AnthropometricAssessmentsService,

    MedicalRecordsRepository,
    MedicalRecordHealthConditionsRepository,
    MedicalRecordMedicationsRepository,
    MedicalRecordAllergiesRepository,
    MedicalRecordDietaryRestrictionsRepository,
    LaboratoryExamsRepository,
    AnthropometricAssessmentsRepository,
  ],
})
export class MedicalRecordsModule {}