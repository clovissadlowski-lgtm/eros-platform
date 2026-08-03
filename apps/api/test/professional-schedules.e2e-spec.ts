import type { INestApplication } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import request from 'supertest';

import { ScryptPasswordHasher } from '../src/auth/infrastructure/crypto/scrypt-password-hasher';
import { PrismaService } from '../src/common/database/prisma.service';
import {
  AppointmentStatus,
  AppointmentType,
  MembershipRole,
  MembershipStatus,
  OrganizationStatus,
  PatientStatus,
  ProfessionalScheduleStatus,
  UserStatus,
} from '../src/generated/prisma/enums';
import { createTestApp } from './helpers/create-test-app';

interface LoginResponse {
  accessToken: string;
  refreshToken: string;
}

interface SelectOrganizationResponse {
  accessToken: string;
  tokenType: 'Bearer';
  expiresIn: number;
  context: {
    organizationId: string;
    membershipId: string;
    role: MembershipRole;
  };
}

interface ProfessionalScheduleResponse {
  id: string;
  organizationId: string;
  professionalMembershipId: string;
  timeZone: string;
  slotIntervalMinutes: number;
  status:
    | 'ACTIVE'
    | 'INACTIVE';
  createdAt: string;
  updatedAt: string;
}

interface AvailabilityWindowResponse {
  id: string;
  organizationId: string;
  professionalScheduleId: string;
  weekday:
    | 'MONDAY'
    | 'TUESDAY'
    | 'WEDNESDAY'
    | 'THURSDAY'
    | 'FRIDAY'
    | 'SATURDAY'
    | 'SUNDAY';
  startMinute: number;
  endMinute: number;
  createdAt: string;
  updatedAt: string;
}

interface ProfessionalScheduleDetailsResponse {
  schedule: ProfessionalScheduleResponse;
  availabilityWindows:
    AvailabilityWindowResponse[];
}

interface AvailableSlotResponse {
  startMinute: number;
  endMinute: number;
  startTime: string;
  endTime: string;
  startsAt: string;
  endsAt: string;
}

interface AvailableSlotsResponse {
  date: string;
  timeZone: string;
  durationMinutes: number;
  slots: AvailableSlotResponse[];
}

describe(
  'Professional Schedules (e2e)',
  () => {
    let app: INestApplication;
    let prisma: PrismaService;

    let firstOrganizationId: string;
    let secondOrganizationId: string;

    let ownerUserId: string;
    let nutritionistUserId: string;
    let assistantUserId: string;

    let firstOwnerMembershipId: string;
    let secondOwnerMembershipId: string;
    let nutritionistMembershipId: string;
    let assistantMembershipId: string;

    let patientId: string;

    let ownerAccessToken: string;
    let firstTenantAccessToken: string;
    let secondTenantAccessToken: string;

    let assistantAccessToken: string;
    let assistantTenantAccessToken: string;

    let scheduleId: string;

    const password =
      'StrongPassword#2026';

    const ownerEmail =
      `ps-owner-${randomUUID()}@higeia.test`;

    const assistantEmail =
      `ps-assistant-${randomUUID()}@higeia.test`;

    const availabilityDate =
      getNextWeekdayDate(1, 7);

    beforeAll(async () => {
      app = await createTestApp();

      prisma =
        app.get(PrismaService);

      await prepareTestData();
    });

    afterAll(async () => {
      await clearTestData();

      await app.close();
    });

    it('logs in the owner user', async () => {
      const response = await request(
        app.getHttpServer(),
      )
        .post('/api/auth/login')
        .send({
          email: ownerEmail,
          password,
        })
        .expect(200);

      const body =
        response.body as LoginResponse;

      expect(
        body.accessToken.length,
      ).toBeGreaterThan(20);

      ownerAccessToken =
        body.accessToken;
    });

    it('rejects schedule access without tenant context', async () => {
      const response = await request(
        app.getHttpServer(),
      )
        .get(
          `/api/professional-schedules/${randomUUID()}`,
        )
        .set(
          'Authorization',
          `Bearer ${ownerAccessToken}`,
        )
        .expect(403);

      expect(response.body).toMatchObject({
        statusCode: 403,
        code:
          'TENANT_CONTEXT_REQUIRED',
      });
    });

    it('selects the first organization', async () => {
      const response = await request(
        app.getHttpServer(),
      )
        .post(
          '/api/auth/select-organization',
        )
        .set(
          'Authorization',
          `Bearer ${ownerAccessToken}`,
        )
        .send({
          organizationId:
            firstOrganizationId,
        })
        .expect(200);

      const body =
        response.body as
          SelectOrganizationResponse;

      expect(body.context).toEqual({
        organizationId:
          firstOrganizationId,
        membershipId:
          firstOwnerMembershipId,
        role:
          MembershipRole.OWNER,
      });

      firstTenantAccessToken =
        body.accessToken;
    });

    it('creates a professional schedule', async () => {
      const response = await request(
        app.getHttpServer(),
      )
        .post(
          '/api/professional-schedules',
        )
        .set(
          'Authorization',
          `Bearer ${firstTenantAccessToken}`,
        )
        .send({
          professionalMembershipId:
            nutritionistMembershipId,
          timeZone:
            'America/Sao_Paulo',
          slotIntervalMinutes: 30,
        })
        .expect(201);

      const body =
        response.body as
          ProfessionalScheduleResponse;

      expect(body).toMatchObject({
        organizationId:
          firstOrganizationId,
        professionalMembershipId:
          nutritionistMembershipId,
        timeZone:
          'America/Sao_Paulo',
        slotIntervalMinutes: 30,
        status: 'ACTIVE',
      });

      expect(body.id).toEqual(
        expect.any(String),
      );

      scheduleId = body.id;
    });

    it('rejects a duplicate schedule for the same professional', async () => {
      const response = await request(
        app.getHttpServer(),
      )
        .post(
          '/api/professional-schedules',
        )
        .set(
          'Authorization',
          `Bearer ${firstTenantAccessToken}`,
        )
        .send({
          professionalMembershipId:
            nutritionistMembershipId,
          timeZone:
            'America/Sao_Paulo',
          slotIntervalMinutes: 30,
        })
        .expect(409);

      expect(response.body).toMatchObject({
        statusCode: 409,
        code:
          'PROFESSIONAL_SCHEDULE_ALREADY_EXISTS',
      });
    });

    it('gets a schedule by id', async () => {
      const response = await request(
        app.getHttpServer(),
      )
        .get(
          `/api/professional-schedules/${scheduleId}`,
        )
        .set(
          'Authorization',
          `Bearer ${firstTenantAccessToken}`,
        )
        .expect(200);

      const body =
        response.body as
          ProfessionalScheduleDetailsResponse;

      expect(body.schedule).toMatchObject({
        id: scheduleId,
        organizationId:
          firstOrganizationId,
        professionalMembershipId:
          nutritionistMembershipId,
      });

      expect(
        body.availabilityWindows,
      ).toEqual([]);
    });

    it('gets a schedule by professional membership', async () => {
      const response = await request(
        app.getHttpServer(),
      )
        .get(
          `/api/professional-schedules/professional/${nutritionistMembershipId}`,
        )
        .set(
          'Authorization',
          `Bearer ${firstTenantAccessToken}`,
        )
        .expect(200);

      const body =
        response.body as
          ProfessionalScheduleDetailsResponse;

      expect(body.schedule).toMatchObject({
        id: scheduleId,
        professionalMembershipId:
          nutritionistMembershipId,
      });
    });

    it('updates schedule settings', async () => {
      const response = await request(
        app.getHttpServer(),
      )
        .patch(
          `/api/professional-schedules/${scheduleId}`,
        )
        .set(
          'Authorization',
          `Bearer ${firstTenantAccessToken}`,
        )
        .send({
          timeZone:
            'America/Sao_Paulo',
          slotIntervalMinutes: 30,
          status: 'ACTIVE',
        })
        .expect(200);

      const body =
        response.body as
          ProfessionalScheduleResponse;

      expect(body).toMatchObject({
        id: scheduleId,
        timeZone:
          'America/Sao_Paulo',
        slotIntervalMinutes: 30,
        status: 'ACTIVE',
      });
    });

    it('replaces weekly availability windows', async () => {
      const response = await request(
        app.getHttpServer(),
      )
        .put(
          `/api/professional-schedules/${scheduleId}/windows`,
        )
        .set(
          'Authorization',
          `Bearer ${firstTenantAccessToken}`,
        )
        .send({
          windows: [
            {
              weekday: 'TUESDAY',
              startMinute: 540,
              endMinute: 720,
            },
            {
              weekday: 'MONDAY',
              startMinute: 810,
              endMinute: 1080,
            },
            {
              weekday: 'MONDAY',
              startMinute: 480,
              endMinute: 720,
            },
          ],
        })
        .expect(200);

      const body =
        response.body as
          AvailabilityWindowResponse[];

      expect(
        body.map((window) => ({
          weekday:
            window.weekday,
          startMinute:
            window.startMinute,
          endMinute:
            window.endMinute,
        })),
      ).toEqual([
        {
          weekday: 'MONDAY',
          startMinute: 480,
          endMinute: 720,
        },
        {
          weekday: 'MONDAY',
          startMinute: 810,
          endMinute: 1080,
        },
        {
          weekday: 'TUESDAY',
          startMinute: 540,
          endMinute: 720,
        },
      ]);
    });

    it('lists weekly availability windows in order', async () => {
      const response = await request(
        app.getHttpServer(),
      )
        .get(
          `/api/professional-schedules/${scheduleId}/windows`,
        )
        .set(
          'Authorization',
          `Bearer ${firstTenantAccessToken}`,
        )
        .expect(200);

      const body =
        response.body as
          AvailabilityWindowResponse[];

      expect(body).toHaveLength(3);

      expect(
        body.map((window) => ({
          weekday:
            window.weekday,
          startMinute:
            window.startMinute,
        })),
      ).toEqual([
        {
          weekday: 'MONDAY',
          startMinute: 480,
        },
        {
          weekday: 'MONDAY',
          startMinute: 810,
        },
        {
          weekday: 'TUESDAY',
          startMinute: 540,
        },
      ]);
    });

    it('rejects overlapping weekly availability windows', async () => {
      const response = await request(
        app.getHttpServer(),
      )
        .put(
          `/api/professional-schedules/${scheduleId}/windows`,
        )
        .set(
          'Authorization',
          `Bearer ${firstTenantAccessToken}`,
        )
        .send({
          windows: [
            {
              weekday: 'MONDAY',
              startMinute: 480,
              endMinute: 720,
            },
            {
              weekday: 'MONDAY',
              startMinute: 660,
              endMinute: 840,
            },
          ],
        })
        .expect(422);

      expect(response.body).toMatchObject({
        statusCode: 422,
        code:
          'OVERLAPPING_AVAILABILITY_WINDOW',
      });
    });

    it('calculates available slots', async () => {
      const response = await request(
        app.getHttpServer(),
      )
        .get(
          `/api/professional-schedules/${scheduleId}/available-slots`,
        )
        .query({
          date: availabilityDate,
          durationMinutes: 60,
        })
        .set(
          'Authorization',
          `Bearer ${firstTenantAccessToken}`,
        )
        .expect(200);

      const body =
        response.body as
          AvailableSlotsResponse;

      expect(body).toMatchObject({
        date: availabilityDate,
        timeZone:
          'America/Sao_Paulo',
        durationMinutes: 60,
      });

      expect(
        body.slots.map(
          (slot) =>
            slot.startTime,
        ),
      ).toEqual([
        '08:00',
        '08:30',
        '09:00',
        '09:30',
        '10:00',
        '10:30',
        '11:00',
        '13:30',
        '14:00',
        '14:30',
        '15:00',
        '15:30',
        '16:00',
        '16:30',
        '17:00',
      ]);
    });

    it('removes slots occupied by an appointment', async () => {
      await prisma.appointment.create({
        data: {
          id: randomUUID(),
          organizationId:
            firstOrganizationId,
          patientId,
          professionalMembershipId:
            nutritionistMembershipId,
          type:
            AppointmentType.INITIAL,
          status:
            AppointmentStatus.SCHEDULED,
          scheduledAt:
            new Date(
              `${availabilityDate}T12:00:00.000Z`,
            ),
          durationMinutes: 60,
          reason:
            'Blocking appointment.',
          notes: null,
          completedAt: null,
          cancelledAt: null,
          cancellationReason: null,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      });

      const response = await request(
        app.getHttpServer(),
      )
        .get(
          `/api/professional-schedules/${scheduleId}/available-slots`,
        )
        .query({
          date: availabilityDate,
          durationMinutes: 60,
        })
        .set(
          'Authorization',
          `Bearer ${firstTenantAccessToken}`,
        )
        .expect(200);

      const body =
        response.body as
          AvailableSlotsResponse;

      const morningStartTimes =
        body.slots
          .filter(
            (slot) =>
              slot.startMinute < 720,
          )
          .map(
            (slot) =>
              slot.startTime,
          );

      expect(
        morningStartTimes,
      ).toEqual([
        '08:00',
        '10:00',
        '10:30',
        '11:00',
      ]);

      expect(
        morningStartTimes,
      ).not.toContain('08:30');

      expect(
        morningStartTimes,
      ).not.toContain('09:00');

      expect(
        morningStartTimes,
      ).not.toContain('09:30');
    });

    it('rejects invalid available-slot query parameters', async () => {
      const response = await request(
        app.getHttpServer(),
      )
        .get(
          `/api/professional-schedules/${scheduleId}/available-slots`,
        )
        .query({
          date: 'invalid-date',
          durationMinutes: 0,
        })
        .set(
          'Authorization',
          `Bearer ${firstTenantAccessToken}`,
        )
        .expect(400);

      expect(response.body).toMatchObject({
        statusCode: 400,
        code: 'VALIDATION_ERROR',
      });
    });

    it('logs in and selects the assistant organization', async () => {
      const loginResponse =
        await request(
          app.getHttpServer(),
        )
          .post('/api/auth/login')
          .send({
            email: assistantEmail,
            password,
          })
          .expect(200);

      assistantAccessToken =
        (
          loginResponse.body as
            LoginResponse
        ).accessToken;

      const selectResponse =
        await request(
          app.getHttpServer(),
        )
          .post(
            '/api/auth/select-organization',
          )
          .set(
            'Authorization',
            `Bearer ${assistantAccessToken}`,
          )
          .send({
            organizationId:
              firstOrganizationId,
          })
          .expect(200);

      const body =
        selectResponse.body as
          SelectOrganizationResponse;

      expect(body.context).toEqual({
        organizationId:
          firstOrganizationId,
        membershipId:
          assistantMembershipId,
        role:
          MembershipRole.ASSISTANT,
      });

      assistantTenantAccessToken =
        body.accessToken;
    });

    it('allows an assistant to read the schedule', async () => {
      const response = await request(
        app.getHttpServer(),
      )
        .get(
          `/api/professional-schedules/${scheduleId}`,
        )
        .set(
          'Authorization',
          `Bearer ${assistantTenantAccessToken}`,
        )
        .expect(200);

      expect(
        response.body.schedule,
      ).toMatchObject({
        id: scheduleId,
        organizationId:
          firstOrganizationId,
      });
    });

    it('rejects an assistant updating the schedule', async () => {
      const response = await request(
        app.getHttpServer(),
      )
        .patch(
          `/api/professional-schedules/${scheduleId}`,
        )
        .set(
          'Authorization',
          `Bearer ${assistantTenantAccessToken}`,
        )
        .send({
          slotIntervalMinutes: 15,
        })
        .expect(403);

      expect(response.body).toMatchObject({
        statusCode: 403,
        code:
          'INSUFFICIENT_ROLE',
      });
    });

    it('selects the second organization', async () => {
      const response = await request(
        app.getHttpServer(),
      )
        .post(
          '/api/auth/select-organization',
        )
        .set(
          'Authorization',
          `Bearer ${ownerAccessToken}`,
        )
        .send({
          organizationId:
            secondOrganizationId,
        })
        .expect(200);

      const body =
        response.body as
          SelectOrganizationResponse;

      expect(body.context).toEqual({
        organizationId:
          secondOrganizationId,
        membershipId:
          secondOwnerMembershipId,
        role:
          MembershipRole.OWNER,
      });

      secondTenantAccessToken =
        body.accessToken;
    });

    it('does not expose a schedule to another tenant', async () => {
      const response = await request(
        app.getHttpServer(),
      )
        .get(
          `/api/professional-schedules/${scheduleId}`,
        )
        .set(
          'Authorization',
          `Bearer ${secondTenantAccessToken}`,
        )
        .expect(404);

      expect(response.body).toMatchObject({
        statusCode: 404,
        code:
          'PROFESSIONAL_SCHEDULE_NOT_FOUND',
      });
    });

    async function prepareTestData(): Promise<void> {
      const passwordHasher =
        new ScryptPasswordHasher();

      const passwordHash =
        await passwordHasher.hash(
          password,
        );

      firstOrganizationId =
        randomUUID();

      secondOrganizationId =
        randomUUID();

      ownerUserId =
        randomUUID();

      nutritionistUserId =
        randomUUID();

      assistantUserId =
        randomUUID();

      firstOwnerMembershipId =
        randomUUID();

      secondOwnerMembershipId =
        randomUUID();

      nutritionistMembershipId =
        randomUUID();

      assistantMembershipId =
        randomUUID();

      patientId =
        randomUUID();

      const timestamp =
        new Date();

      await prisma.organization.createMany({
        data: [
          {
            id:
              firstOrganizationId,
            name:
              'Professional Schedules First Organization',
            slug:
              `professional-schedules-first-${randomUUID()}`,
            status:
              OrganizationStatus.ACTIVE,
            createdAt: timestamp,
            updatedAt: timestamp,
          },
          {
            id:
              secondOrganizationId,
            name:
              'Professional Schedules Second Organization',
            slug:
              `professional-schedules-second-${randomUUID()}`,
            status:
              OrganizationStatus.ACTIVE,
            createdAt: timestamp,
            updatedAt: timestamp,
          },
        ],
      });

      await prisma.user.createMany({
        data: [
          {
            id: ownerUserId,
            name:
              'Professional Schedules Owner',
            email: ownerEmail,
            passwordHash,
            status:
              UserStatus.ACTIVE,
            lastLoginAt: null,
            createdAt: timestamp,
            updatedAt: timestamp,
          },
          {
            id:
              nutritionistUserId,
            name:
              'Professional Schedules Nutritionist',
            email:
              `ps-nutritionist-${randomUUID()}@higeia.test`,
            passwordHash: null,
            status:
              UserStatus.ACTIVE,
            lastLoginAt: null,
            createdAt: timestamp,
            updatedAt: timestamp,
          },
          {
            id:
              assistantUserId,
            name:
              'Professional Schedules Assistant',
            email:
              assistantEmail,
            passwordHash,
            status:
              UserStatus.ACTIVE,
            lastLoginAt: null,
            createdAt: timestamp,
            updatedAt: timestamp,
          },
        ],
      });

      await prisma.membership.createMany({
        data: [
          {
            id:
              firstOwnerMembershipId,
            userId:
              ownerUserId,
            organizationId:
              firstOrganizationId,
            role:
              MembershipRole.OWNER,
            status:
              MembershipStatus.ACTIVE,
            createdAt: timestamp,
            updatedAt: timestamp,
          },
          {
            id:
              secondOwnerMembershipId,
            userId:
              ownerUserId,
            organizationId:
              secondOrganizationId,
            role:
              MembershipRole.OWNER,
            status:
              MembershipStatus.ACTIVE,
            createdAt: timestamp,
            updatedAt: timestamp,
          },
          {
            id:
              nutritionistMembershipId,
            userId:
              nutritionistUserId,
            organizationId:
              firstOrganizationId,
            role:
              MembershipRole.NUTRITIONIST,
            status:
              MembershipStatus.ACTIVE,
            createdAt: timestamp,
            updatedAt: timestamp,
          },
          {
            id:
              assistantMembershipId,
            userId:
              assistantUserId,
            organizationId:
              firstOrganizationId,
            role:
              MembershipRole.ASSISTANT,
            status:
              MembershipStatus.ACTIVE,
            createdAt: timestamp,
            updatedAt: timestamp,
          },
        ],
      });

      await prisma.patient.create({
        data: {
          id: patientId,
          organizationId:
            firstOrganizationId,
          name:
            'Professional Schedules Patient',
          email:
            `ps-patient-${randomUUID()}@higeia.test`,
          status:
            PatientStatus.ACTIVE,
          createdAt: timestamp,
          updatedAt: timestamp,
        },
      });
    }

    async function clearTestData(): Promise<void> {
      const organizationIds = [
        firstOrganizationId,
        secondOrganizationId,
      ].filter(Boolean);

      const userIds = [
        ownerUserId,
        nutritionistUserId,
        assistantUserId,
      ].filter(Boolean);

      if (userIds.length > 0) {
        await prisma.session.deleteMany({
          where: {
            userId: {
              in: userIds,
            },
          },
        });
      }

      if (
        organizationIds.length > 0
      ) {
        await prisma.appointment.deleteMany({
          where: {
            organizationId: {
              in: organizationIds,
            },
          },
        });

        await prisma.professionalAvailabilityWindow.deleteMany({
          where: {
            organizationId: {
              in: organizationIds,
            },
          },
        });

        await prisma.professionalSchedule.deleteMany({
          where: {
            organizationId: {
              in: organizationIds,
            },
          },
        });

        await prisma.patient.deleteMany({
          where: {
            organizationId: {
              in: organizationIds,
            },
          },
        });

        await prisma.membership.deleteMany({
          where: {
            organizationId: {
              in: organizationIds,
            },
          },
        });
      }

      if (userIds.length > 0) {
        await prisma.user.deleteMany({
          where: {
            id: {
              in: userIds,
            },
          },
        });
      }

      if (
        organizationIds.length > 0
      ) {
        await prisma.organization.deleteMany({
          where: {
            id: {
              in: organizationIds,
            },
          },
        });
      }
    }

    function getNextWeekdayDate(
      targetWeekday: number,
      minimumDaysAhead: number,
    ): string {
      const date =
        new Date();

      date.setUTCHours(
        12,
        0,
        0,
        0,
      );

      date.setUTCDate(
        date.getUTCDate() +
          minimumDaysAhead,
      );

      while (
        date.getUTCDay() !==
        targetWeekday
      ) {
        date.setUTCDate(
          date.getUTCDate() + 1,
        );
      }

      return [
        date
          .getUTCFullYear()
          .toString()
          .padStart(4, '0'),
        (
          date.getUTCMonth() + 1
        )
          .toString()
          .padStart(2, '0'),
        date
          .getUTCDate()
          .toString()
          .padStart(2, '0'),
      ].join('-');
    }
  },
);