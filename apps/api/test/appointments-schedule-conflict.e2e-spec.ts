import type { INestApplication } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import request from 'supertest';

import { ScryptPasswordHasher } from '../src/auth/infrastructure/crypto/scrypt-password-hasher';
import { PrismaService } from '../src/common/database/prisma.service';
import {
  MembershipRole,
  MembershipStatus,
  OrganizationStatus,
  PatientStatus,
  UserStatus,
} from '../src/generated/prisma/enums';
import { createTestApp } from './helpers/create-test-app';

interface LoginResponse {
  accessToken: string;
  refreshToken: string;
}

interface SelectOrganizationResponse {
  accessToken: string;
}

interface AppointmentResponse {
  id: string;
  organizationId: string;
  patientId: string;
  professionalMembershipId: string;
  scheduledAt: string;
  durationMinutes: number;
  status: string;
}

describe(
  'Appointment schedule conflicts (e2e)',
  () => {
    let app: INestApplication;
    let prisma: PrismaService;

    let organizationId: string;
    let userId: string;
    let membershipId: string;
    let patientId: string;

    let accessToken: string;
    let tenantAccessToken: string;

    const password =
      'StrongPassword#2026';

    const email =
      `schedule-conflict-${randomUUID()}@higeia.test`;

    const firstScheduledAt =
      new Date(
        Date.now() +
          7 * 24 * 60 * 60 * 1000,
      );

    beforeAll(async () => {
      app = await createTestApp();
      prisma = app.get(PrismaService);

      await prepareTestData();
      await authenticate();
    });

    afterAll(async () => {
      await clearTestData();
      await app.close();
    });

    it('creates the first appointment', async () => {
      const response = await request(
        app.getHttpServer(),
      )
        .post('/api/appointments')
        .set(
          'Authorization',
          `Bearer ${tenantAccessToken}`,
        )
        .send({
          patientId,
          professionalMembershipId:
            membershipId,
          type: 'INITIAL',
          scheduledAt:
            firstScheduledAt.toISOString(),
          durationMinutes: 60,
          reason:
            'First appointment.',
        })
        .expect(201);

      const body =
        response.body as AppointmentResponse;

      expect(body).toMatchObject({
        organizationId,
        patientId,
        professionalMembershipId:
          membershipId,
        status: 'SCHEDULED',
        durationMinutes: 60,
      });
    });

    it('rejects an overlapping appointment', async () => {
      const overlappingStart =
        new Date(
          firstScheduledAt.getTime() +
            30 * 60_000,
        );

      const response = await request(
        app.getHttpServer(),
      )
        .post('/api/appointments')
        .set(
          'Authorization',
          `Bearer ${tenantAccessToken}`,
        )
        .send({
          patientId,
          professionalMembershipId:
            membershipId,
          type: 'FOLLOW_UP',
          scheduledAt:
            overlappingStart.toISOString(),
          durationMinutes: 60,
          reason:
            'Conflicting appointment.',
        })
        .expect(409);

      expect(response.body).toMatchObject({
        statusCode: 409,
        code:
          'APPOINTMENT_SCHEDULE_CONFLICT',
      });
    });

    it('allows an appointment immediately after the previous one', async () => {
      const adjacentStart =
        new Date(
          firstScheduledAt.getTime() +
            60 * 60_000,
        );

      const response = await request(
        app.getHttpServer(),
      )
        .post('/api/appointments')
        .set(
          'Authorization',
          `Bearer ${tenantAccessToken}`,
        )
        .send({
          patientId,
          professionalMembershipId:
            membershipId,
          type: 'FOLLOW_UP',
          scheduledAt:
            adjacentStart.toISOString(),
          durationMinutes: 60,
          reason:
            'Adjacent appointment.',
        })
        .expect(201);

      expect(response.body).toMatchObject({
        status: 'SCHEDULED',
        scheduledAt:
          adjacentStart.toISOString(),
      });
    });

    async function authenticate(): Promise<void> {
      const loginResponse = await request(
        app.getHttpServer(),
      )
        .post('/api/auth/login')
        .send({
          email,
          password,
        })
        .expect(200);

      accessToken =
        (
          loginResponse.body as LoginResponse
        ).accessToken;

      const selectResponse = await request(
        app.getHttpServer(),
      )
        .post(
          '/api/auth/select-organization',
        )
        .set(
          'Authorization',
          `Bearer ${accessToken}`,
        )
        .send({
          organizationId,
        })
        .expect(200);

      tenantAccessToken =
        (
          selectResponse.body as
            SelectOrganizationResponse
        ).accessToken;
    }

    async function prepareTestData(): Promise<void> {
      organizationId =
        randomUUID();

      userId =
        randomUUID();

      membershipId =
        randomUUID();

      patientId =
        randomUUID();

      const passwordHasher =
        new ScryptPasswordHasher();

      const passwordHash =
        await passwordHasher.hash(
          password,
        );

      const timestamp =
        new Date();

      await prisma.organization.create({
        data: {
          id: organizationId,
          name:
            'Schedule Conflict Organization',
          slug:
            `schedule-conflict-${randomUUID()}`,
          status:
            OrganizationStatus.ACTIVE,
          createdAt: timestamp,
          updatedAt: timestamp,
        },
      });

      await prisma.user.create({
        data: {
          id: userId,
          name:
            'Schedule Conflict Professional',
          email,
          passwordHash,
          status:
            UserStatus.ACTIVE,
          lastLoginAt: null,
          createdAt: timestamp,
          updatedAt: timestamp,
        },
      });

      await prisma.membership.create({
        data: {
          id: membershipId,
          userId,
          organizationId,
          role:
            MembershipRole.NUTRITIONIST,
          status:
            MembershipStatus.ACTIVE,
          createdAt: timestamp,
          updatedAt: timestamp,
        },
      });

      await prisma.patient.create({
        data: {
          id: patientId,
          organizationId,
          name:
            'Schedule Conflict Patient',
          email:
            `schedule-conflict-patient-${randomUUID()}@higeia.test`,
          status:
            PatientStatus.ACTIVE,
          createdAt: timestamp,
          updatedAt: timestamp,
        },
      });
    }

    async function clearTestData(): Promise<void> {
      await prisma.session.deleteMany({
        where: {
          userId,
        },
      });

      await prisma.appointment.deleteMany({
        where: {
          organizationId,
        },
      });

      await prisma.patient.deleteMany({
        where: {
          organizationId,
        },
      });

      await prisma.membership.deleteMany({
        where: {
          organizationId,
        },
      });

      await prisma.user.deleteMany({
        where: {
          id: userId,
        },
      });

      await prisma.organization.deleteMany({
        where: {
          id: organizationId,
        },
      });
    }
  },
);