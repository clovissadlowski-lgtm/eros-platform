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
  tokenType: 'Bearer';
  expiresIn: number;
  context: {
    organizationId: string;
    membershipId: string;
    role: MembershipRole;
  };
}

interface AppointmentResponse {
  id: string;
  organizationId: string;
  patientId: string;
  professionalMembershipId: string;
  type:
    | 'INITIAL'
    | 'FOLLOW_UP'
    | 'REVIEW'
    | 'OTHER';
  status:
    | 'SCHEDULED'
    | 'CONFIRMED'
    | 'IN_PROGRESS'
    | 'COMPLETED'
    | 'CANCELLED'
    | 'NO_SHOW';
  scheduledAt: string;
  durationMinutes: number;
  reason: string | null;
  notes: string | null;
  completedAt: string | null;
  cancelledAt: string | null;
  cancellationReason: string | null;
  createdAt: string;
  updatedAt: string;
}

describe('Appointments (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;

  let firstOrganizationId: string;
  let secondOrganizationId: string;

  let ownerUserId: string;
  let assistantUserId: string;

  let ownerMembershipId: string;
  let nutritionistMembershipId: string;
  let assistantMembershipId: string;

  let ownerAccessToken: string;
  let ownerTenantAccessToken: string;

  let assistantAccessToken: string;
  let assistantTenantAccessToken: string;

  let firstPatientId: string;
  let secondPatientId: string;

  let appointmentId: string;

  const password =
    'StrongPassword#2026';

  const ownerEmail =
    `appointments-owner-${randomUUID()}@higeia.test`;

  const assistantEmail =
    `appointments-assistant-${randomUUID()}@higeia.test`;

  const firstScheduledAt =
    new Date(
      Date.now() +
        7 * 24 * 60 * 60 * 1000,
    ).toISOString();

  const updatedScheduledAt =
    new Date(
      Date.now() +
        10 * 24 * 60 * 60 * 1000,
    ).toISOString();

  beforeAll(async () => {
    app = await createTestApp();
    prisma = app.get(PrismaService);

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

  it('rejects appointment access without tenant context', async () => {
    const response = await request(
      app.getHttpServer(),
    )
      .get('/api/appointments')
      .set(
        'Authorization',
        `Bearer ${ownerAccessToken}`,
      )
      .expect(403);

    expect(response.body).toMatchObject({
      statusCode: 403,
      code: 'TENANT_CONTEXT_REQUIRED',
    });
  });

  it('selects the owner organization', async () => {
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
      response.body as SelectOrganizationResponse;

    expect(body.context).toEqual({
      organizationId:
        firstOrganizationId,
      membershipId:
        ownerMembershipId,
      role: MembershipRole.OWNER,
    });

    ownerTenantAccessToken =
      body.accessToken;
  });

  it('creates an appointment', async () => {
    const response = await request(
      app.getHttpServer(),
    )
      .post('/api/appointments')
      .set(
        'Authorization',
        `Bearer ${ownerTenantAccessToken}`,
      )
      .send({
        patientId:
          firstPatientId,
        professionalMembershipId:
          nutritionistMembershipId,
        type: 'INITIAL',
        scheduledAt:
          firstScheduledAt,
        durationMinutes: 60,
        reason:
          '  Avaliação nutricional inicial.  ',
      })
      .expect(201);

    const body =
      response.body as AppointmentResponse;

    expect(body).toMatchObject({
      organizationId:
        firstOrganizationId,
      patientId:
        firstPatientId,
      professionalMembershipId:
        nutritionistMembershipId,
      type: 'INITIAL',
      status: 'SCHEDULED',
      durationMinutes: 60,
      reason:
        'Avaliação nutricional inicial.',
      completedAt: null,
      cancelledAt: null,
      cancellationReason: null,
    });

    expect(body.scheduledAt).toBe(
      firstScheduledAt,
    );

    appointmentId = body.id;
  });

  it('lists appointments from the authenticated organization', async () => {
    const response = await request(
      app.getHttpServer(),
    )
      .get('/api/appointments')
      .set(
        'Authorization',
        `Bearer ${ownerTenantAccessToken}`,
      )
      .expect(200);

    expect(
      Array.isArray(response.body),
    ).toBe(true);

    expect(response.body).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: appointmentId,
          organizationId:
            firstOrganizationId,
        }),
      ]),
    );
  });

  it('filters appointments by patient and status', async () => {
    const response = await request(
      app.getHttpServer(),
    )
      .get('/api/appointments')
      .query({
        patientId:
          firstPatientId,
        status: 'SCHEDULED',
      })
      .set(
        'Authorization',
        `Bearer ${ownerTenantAccessToken}`,
      )
      .expect(200);

    expect(response.body).toHaveLength(
      1,
    );

    expect(response.body[0]).toMatchObject({
      id: appointmentId,
      patientId:
        firstPatientId,
      status: 'SCHEDULED',
    });
  });

  it('gets an appointment by id', async () => {
    const response = await request(
      app.getHttpServer(),
    )
      .get(
        `/api/appointments/${appointmentId}`,
      )
      .set(
        'Authorization',
        `Bearer ${ownerTenantAccessToken}`,
      )
      .expect(200);

    expect(response.body).toMatchObject({
      id: appointmentId,
      organizationId:
        firstOrganizationId,
      patientId:
        firstPatientId,
    });
  });

  it('updates an appointment', async () => {
    const response = await request(
      app.getHttpServer(),
    )
      .patch(
        `/api/appointments/${appointmentId}`,
      )
      .set(
        'Authorization',
        `Bearer ${ownerTenantAccessToken}`,
      )
      .send({
        type: 'FOLLOW_UP',
        scheduledAt:
          updatedScheduledAt,
        durationMinutes: 45,
        reason:
          '  Consulta de acompanhamento.  ',
      })
      .expect(200);

    expect(response.body).toMatchObject({
      id: appointmentId,
      type: 'FOLLOW_UP',
      scheduledAt:
        updatedScheduledAt,
      durationMinutes: 45,
      reason:
        'Consulta de acompanhamento.',
      status: 'SCHEDULED',
    });
  });

  it('rejects an appointment in the past', async () => {
    const response = await request(
      app.getHttpServer(),
    )
      .post('/api/appointments')
      .set(
        'Authorization',
        `Bearer ${ownerTenantAccessToken}`,
      )
      .send({
        patientId:
          firstPatientId,
        professionalMembershipId:
          nutritionistMembershipId,
        type: 'INITIAL',
        scheduledAt:
          '2020-01-01T12:00:00.000Z',
        durationMinutes: 60,
      })
      .expect(422);

    expect(response.body).toMatchObject({
      statusCode: 422,
      code: 'INVALID_APPOINTMENT_DATE',
    });
  });

  it('rejects an assistant as the assigned professional', async () => {
    const response = await request(
      app.getHttpServer(),
    )
      .post('/api/appointments')
      .set(
        'Authorization',
        `Bearer ${ownerTenantAccessToken}`,
      )
      .send({
        patientId:
          firstPatientId,
        professionalMembershipId:
          assistantMembershipId,
        type: 'INITIAL',
        scheduledAt:
          firstScheduledAt,
        durationMinutes: 60,
      })
      .expect(422);

    expect(response.body).toMatchObject({
      statusCode: 422,
      code:
        'INVALID_APPOINTMENT_PROFESSIONAL',
    });
  });

  it('confirms the appointment', async () => {
    const response = await request(
      app.getHttpServer(),
    )
      .patch(
        `/api/appointments/${appointmentId}/status`,
      )
      .set(
        'Authorization',
        `Bearer ${ownerTenantAccessToken}`,
      )
      .send({
        status: 'CONFIRMED',
      })
      .expect(200);

    expect(response.body.status).toBe(
      'CONFIRMED',
    );
  });

  it('starts the appointment', async () => {
    const response = await request(
      app.getHttpServer(),
    )
      .patch(
        `/api/appointments/${appointmentId}/status`,
      )
      .set(
        'Authorization',
        `Bearer ${ownerTenantAccessToken}`,
      )
      .send({
        status: 'IN_PROGRESS',
      })
      .expect(200);

    expect(response.body.status).toBe(
      'IN_PROGRESS',
    );
  });

  it('completes the appointment', async () => {
    const response = await request(
      app.getHttpServer(),
    )
      .patch(
        `/api/appointments/${appointmentId}/status`,
      )
      .set(
        'Authorization',
        `Bearer ${ownerTenantAccessToken}`,
      )
      .send({
        status: 'COMPLETED',
      })
      .expect(200);

    expect(response.body.status).toBe(
      'COMPLETED',
    );

    expect(
      response.body.completedAt,
    ).not.toBeNull();
  });

  it('rejects editing a completed appointment', async () => {
    const response = await request(
      app.getHttpServer(),
    )
      .patch(
        `/api/appointments/${appointmentId}`,
      )
      .set(
        'Authorization',
        `Bearer ${ownerTenantAccessToken}`,
      )
      .send({
        durationMinutes: 90,
      })
      .expect(422);

    expect(response.body).toMatchObject({
      statusCode: 422,
      code:
        'INVALID_APPOINTMENT_STATUS_TRANSITION',
    });
  });

  it('rejects an invalid status transition', async () => {
    const response = await request(
      app.getHttpServer(),
    )
      .patch(
        `/api/appointments/${appointmentId}/status`,
      )
      .set(
        'Authorization',
        `Bearer ${ownerTenantAccessToken}`,
      )
      .send({
        status: 'CONFIRMED',
      })
      .expect(422);

    expect(response.body).toMatchObject({
      statusCode: 422,
      code:
        'INVALID_APPOINTMENT_STATUS_TRANSITION',
    });
  });

  it('does not expose an appointment to another tenant', async () => {
    await loginAndSelectAssistantTenant();

    const response = await request(
      app.getHttpServer(),
    )
      .get(
        `/api/appointments/${appointmentId}`,
      )
      .set(
        'Authorization',
        `Bearer ${assistantTenantAccessToken}`,
      )
      .expect(404);

    expect(response.body).toMatchObject({
      statusCode: 404,
      code: 'APPOINTMENT_NOT_FOUND',
    });
  });

  it('allows an assistant to create an appointment for a clinical professional', async () => {
    const futureDate =
      new Date(
        Date.now() +
          14 * 24 * 60 * 60 * 1000,
      ).toISOString();

    const response = await request(
      app.getHttpServer(),
    )
      .post('/api/appointments')
      .set(
        'Authorization',
        `Bearer ${assistantTenantAccessToken}`,
      )
      .send({
        patientId:
          secondPatientId,
        professionalMembershipId:
          ownerMembershipId,
        type: 'REVIEW',
        scheduledAt: futureDate,
        durationMinutes: 30,
        reason:
          'Agendamento operacional.',
      });

    /*
     * ownerMembershipId pertence ao primeiro
     * tenant, portanto esta tentativa deve
     * ser rejeitada pela regra de domínio.
     */
    expect(response.status).toBe(422);

    expect(response.body.code).toBe(
      'INVALID_APPOINTMENT_PROFESSIONAL',
    );
  });

  async function loginAndSelectAssistantTenant(): Promise<void> {
    if (assistantTenantAccessToken) {
      return;
    }

    const loginResponse = await request(
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
        `Bearer ${assistantAccessToken}`,
      )
      .send({
        organizationId:
          secondOrganizationId,
      })
      .expect(200);

    assistantTenantAccessToken =
      (
        selectResponse.body as
          SelectOrganizationResponse
      ).accessToken;
  }

  async function prepareTestData(): Promise<void> {
    const passwordHasher =
      new ScryptPasswordHasher();

    const passwordHash =
      await passwordHasher.hash(password);

    firstOrganizationId =
      randomUUID();

    secondOrganizationId =
      randomUUID();

    ownerUserId = randomUUID();
    assistantUserId =
      randomUUID();

    ownerMembershipId =
      randomUUID();

    nutritionistMembershipId =
      randomUUID();

    assistantMembershipId =
      randomUUID();

    firstPatientId =
      randomUUID();

    secondPatientId =
      randomUUID();

    const nutritionistUserId =
      randomUUID();

    const timestamp =
      new Date();

    await prisma.organization.createMany({
      data: [
        {
          id: firstOrganizationId,
          name:
            'Appointments First Organization',
          slug:
            `appointments-first-${randomUUID()}`,
          status:
            OrganizationStatus.ACTIVE,
          createdAt: timestamp,
          updatedAt: timestamp,
        },
        {
          id: secondOrganizationId,
          name:
            'Appointments Second Organization',
          slug:
            `appointments-second-${randomUUID()}`,
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
          name: 'Appointments Owner',
          email: ownerEmail,
          passwordHash,
          status:
            UserStatus.ACTIVE,
          createdAt: timestamp,
          updatedAt: timestamp,
        },
        {
          id: assistantUserId,
          name:
            'Appointments Assistant',
          email: assistantEmail,
          passwordHash,
          status:
            UserStatus.ACTIVE,
          createdAt: timestamp,
          updatedAt: timestamp,
        },
        {
          id: nutritionistUserId,
          name:
            'Appointments Nutritionist',
          email:
            `appointments-nutritionist-${randomUUID()}@higeia.test`,
          passwordHash: null,
          status:
            UserStatus.ACTIVE,
          createdAt: timestamp,
          updatedAt: timestamp,
        },
      ],
    });

    await prisma.membership.createMany({
      data: [
        {
          id: ownerMembershipId,
          userId: ownerUserId,
          organizationId:
            firstOrganizationId,
          role: MembershipRole.OWNER,
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
          id: assistantMembershipId,
          userId:
            assistantUserId,
          organizationId:
            secondOrganizationId,
          role:
            MembershipRole.ASSISTANT,
          status:
            MembershipStatus.ACTIVE,
          createdAt: timestamp,
          updatedAt: timestamp,
        },
      ],
    });

    await prisma.patient.createMany({
      data: [
        {
          id: firstPatientId,
          organizationId:
            firstOrganizationId,
          name:
            'Appointments First Patient',
          email:
            `appointments-patient-${randomUUID()}@higeia.test`,
          status:
            PatientStatus.ACTIVE,
          createdAt: timestamp,
          updatedAt: timestamp,
        },
        {
          id: secondPatientId,
          organizationId:
            secondOrganizationId,
          name:
            'Appointments Second Patient',
          email:
            `appointments-patient-${randomUUID()}@higeia.test`,
          status:
            PatientStatus.ACTIVE,
          createdAt: timestamp,
          updatedAt: timestamp,
        },
      ],
    });
  }

  async function clearTestData(): Promise<void> {
    await prisma.session.deleteMany({
      where: {
        userId: {
          in: [
            ownerUserId,
            assistantUserId,
          ],
        },
      },
    });

    await prisma.appointment.deleteMany({
      where: {
        organizationId: {
          in: [
            firstOrganizationId,
            secondOrganizationId,
          ],
        },
      },
    });

    await prisma.patient.deleteMany({
      where: {
        organizationId: {
          in: [
            firstOrganizationId,
            secondOrganizationId,
          ],
        },
      },
    });

    await prisma.membership.deleteMany({
      where: {
        organizationId: {
          in: [
            firstOrganizationId,
            secondOrganizationId,
          ],
        },
      },
    });

    await prisma.user.deleteMany({
      where: {
        email: {
          contains:
            'appointments-',
        },
      },
    });

    await prisma.organization.deleteMany({
      where: {
        id: {
          in: [
            firstOrganizationId,
            secondOrganizationId,
          ],
        },
      },
    });
  }
});