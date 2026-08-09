import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import {
  ConfigModule,
} from '@nestjs/config';
import * as Joi from 'joi';

import {
  AccessModule,
} from './access/access.module';
import {
  AppointmentsModule,
} from './appointments/appointments.module';
import {
  ClinicalCatalogModule,
} from './clinical-catalog/clinical-catalog.module';
import {
  PrismaModule,
} from './common/database/prisma.module';
import {
  LoggerModule,
} from './common/logger/logger.module';
import {
  HttpLoggingMiddleware,
} from './common/middleware/http-logging.middleware';
import {
  RequestIdMiddleware,
} from './common/middleware/request-id.middleware';
import {
  appConfig,
} from './config/app.config';
import {
  HealthModule,
} from './health/health.module';
import {
  InvitationsModule,
} from './invitations/invitations.module';
import {
  MedicalRecordsModule,
} from './medical-records/medical-records.module';
import {
  OrganizationsModule,
} from './organizations/organizations.module';
import {
  PatientsModule,
} from './patients/patients.module';
import {
  ProfessionalSchedulesModule,
} from './professional-schedules/professional-schedules.module';
import {
  UsersModule,
} from './users/users.module';
import {
  MedicationCatalogModule,
} from './medication-catalog/medication-catalog.module';
import {
  AllergenCatalogModule,
} from './allergen-catalog/allergen-catalog.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,

      load: [
        appConfig,
      ],

      validationSchema:
        Joi.object({
          NODE_ENV:
            Joi.string()
              .valid(
                'development',
                'test',
                'production',
              )
              .default(
                'development',
              ),

          PORT:
            Joi.number()
              .port()
              .default(
                3001,
              ),

          WEB_ORIGIN:
            Joi.string()
              .uri()
              .required(),

          DATABASE_URL:
            Joi.string()
              .required(),

          JWT_ACCESS_SECRET:
            Joi.string()
              .min(32)
              .required(),

          JWT_ACCESS_TTL_SECONDS:
            Joi.number()
              .integer()
              .positive()
              .default(
                900,
              ),

          REFRESH_TOKEN_TTL_DAYS:
            Joi.number()
              .integer()
              .positive()
              .default(
                30,
              ),
        }),
    }),

    LoggerModule,
    PrismaModule,
    HealthModule,
    OrganizationsModule,
    PatientsModule,
    MedicalRecordsModule,
    AppointmentsModule,
    UsersModule,
    InvitationsModule,
    AccessModule,
    ProfessionalSchedulesModule,
    ClinicalCatalogModule,
    MedicationCatalogModule,
    AllergenCatalogModule,
  ],
})
export class AppModule
  implements NestModule
{
  configure(
    consumer:
      MiddlewareConsumer,
  ): void {
    consumer
      .apply(
        RequestIdMiddleware,
        HttpLoggingMiddleware,
      )
      .forRoutes({
        path:
          '{*path}',
        method:
          RequestMethod.ALL,
      });
  }
}