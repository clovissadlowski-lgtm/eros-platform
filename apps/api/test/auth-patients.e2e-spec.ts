import type { INestApplication } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import request from 'supertest';

import { ScryptPasswordHasher } from '../src/auth/infrastructure/crypto/scrypt-password-hasher';
import { PrismaService } from '../src/common/database/prisma.service';
import {
  MembershipRole,
  MembershipStatus,
  OrganizationStatus,
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

interface PatientResponse {
  id: string;
  organizationId: string;
  name: string;
  email: string | null;
  phone: string | null;
  birthDate: string | null;
  status: string;
  createdAt: string;
  updatedAt: string;
}

describe(
  'Authentication and Patients (e2e)',
  () => {
    let app: INestApplication;
    let prisma: PrismaService;

    let ownerUserId: string;
    let assistantUserId: string;

    let firstOrganizationId: string;
    let secondOrganizationId: string;

    let ownerMembershipId: string;
    let assistantMembershipId: string;

    let ownerAccessToken: string;
    let ownerTenantAccessToken: string;

    let assistantAccessToken: string;
    let assistantTenantAccessToken: string;

    let createdPatientId: string;

    const ownerEmail =
      `owner-${randomUUID()}@higeia.test`;

    const assistantEmail =
      `assistant-${randomUUID()}@higeia.test`;

    const password =
      'StrongPassword#2026';

    beforeAll(async () => {
      app = await createTestApp();

      prisma = app.get(PrismaService);

      await prepareTestData();
    });

    afterAll(async () => {
      await clearTestData();
      await app.close();
    });

    it('logs in an active owner user', async () => {
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
        typeof body.accessToken,
      ).toBe('string');

      expect(
        body.accessToken.length,
      ).toBeGreaterThan(20);

      expect(
        typeof body.refreshToken,
      ).toBe('string');

      expect(
        body.refreshToken.length,
      ).toBeGreaterThan(20);

      ownerAccessToken =
        body.accessToken;
    });

    it('rejects patient access before selecting an organization', async () => {
      const response = await request(
        app.getHttpServer(),
      )
        .get('/api/patients')
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

      expect(body.tokenType).toBe(
        'Bearer',
      );

      expect(body.context).toEqual({
        organizationId:
          firstOrganizationId,
        membershipId:
          ownerMembershipId,
        role: MembershipRole.OWNER,
      });

      expect(
        body.accessToken.length,
      ).toBeGreaterThan(20);

      ownerTenantAccessToken =
        body.accessToken;
    });

    it('creates a patient inside the authenticated organization', async () => {
      const response = await request(
        app.getHttpServer(),
      )
        .post('/api/patients')
        .set(
          'Authorization',
          `Bearer ${ownerTenantAccessToken}`,
        )
        .send({
          name: 'Paciente E2E',
          email:
            'paciente.e2e@higeia.test',
          phone: '+5547999999999',
          birthDate: '1990-05-10',
        })
        .expect(201);

      const body =
        response.body as PatientResponse;

      expect(body).toMatchObject({
        organizationId:
          firstOrganizationId,
        name: 'Paciente E2E',
        email:
          'paciente.e2e@higeia.test',
        phone: '+5547999999999',
        birthDate: '1990-05-10',
        status: 'ACTIVE',
      });

      expect(
        typeof body.id,
      ).toBe('string');

      createdPatientId = body.id;
    });

    it('lists patients only from the authenticated organization', async () => {
      const response = await request(
        app.getHttpServer(),
      )
        .get('/api/patients')
        .set(
          'Authorization',
          `Bearer ${ownerTenantAccessToken}`,
        )
        .expect(200);

      const body =
        response.body as PatientResponse[];

      expect(
        Array.isArray(body),
      ).toBe(true);

      expect(body).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            id: createdPatientId,
            organizationId:
              firstOrganizationId,
            name: 'Paciente E2E',
          }),
        ]),
      );

      expect(
        body.every(
          (patient) =>
            patient.organizationId ===
            firstOrganizationId,
        ),
      ).toBe(true);
    });

    it('gets a patient by id inside the authenticated organization', async () => {
      const response = await request(
        app.getHttpServer(),
      )
        .get(
          `/api/patients/${createdPatientId}`,
        )
        .set(
          'Authorization',
          `Bearer ${ownerTenantAccessToken}`,
        )
        .expect(200);

      expect(response.body).toMatchObject({
        id: createdPatientId,
        organizationId:
          firstOrganizationId,
        name: 'Paciente E2E',
      });
    });

    it('logs in the assistant user', async () => {
      const response = await request(
        app.getHttpServer(),
      )
        .post('/api/auth/login')
        .send({
          email: assistantEmail,
          password,
        })
        .expect(200);

      const body =
        response.body as LoginResponse;

      assistantAccessToken =
        body.accessToken;

      expect(
        assistantAccessToken.length,
      ).toBeGreaterThan(20);
    });

    it('selects the assistant organization', async () => {
      const response = await request(
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

      const body =
        response.body as SelectOrganizationResponse;

      expect(body.context).toEqual({
        organizationId:
          secondOrganizationId,
        membershipId:
          assistantMembershipId,
        role:
          MembershipRole.ASSISTANT,
      });

      assistantTenantAccessToken =
        body.accessToken;
    });

    it('allows an assistant to list patients', async () => {
      const response = await request(
        app.getHttpServer(),
      )
        .get('/api/patients')
        .set(
          'Authorization',
          `Bearer ${assistantTenantAccessToken}`,
        )
        .expect(200);

      expect(response.body).toEqual([]);
    });

    it('does not expose a patient from another organization', async () => {
      const response = await request(
        app.getHttpServer(),
      )
        .get(
          `/api/patients/${createdPatientId}`,
        )
        .set(
          'Authorization',
          `Bearer ${assistantTenantAccessToken}`,
        )
        .expect(404);

      expect(response.body).toMatchObject({
        statusCode: 404,
        code: 'PATIENT_NOT_FOUND',
      });
    });

    it('updates a patient', async () => {
  const response = await request(
    app.getHttpServer(),
  )
    .patch(`/api/patients/${createdPatientId}`)
    .set(
      'Authorization',
      `Bearer ${ownerTenantAccessToken}`,
    )
    .send({
      name: 'Paciente Atualizado',
      phone: '+5547888888888',
    })
    .expect(200);

  expect(response.body).toMatchObject({
    id: createdPatientId,
    organizationId: firstOrganizationId,
    name: 'Paciente Atualizado',
    phone: '+5547888888888',
  });
});

    it('rejects duplicate patient email', async () => {
  await request(app.getHttpServer())
    .post('/api/patients')
    .set(
      'Authorization',
      `Bearer ${ownerTenantAccessToken}`,
    )
    .send({
      name: 'Outro Paciente',
      email: 'duplicado@higeia.test',
    })
    .expect(201);

  const response = await request(
    app.getHttpServer(),
  )
    .post('/api/patients')
    .set(
      'Authorization',
      `Bearer ${ownerTenantAccessToken}`,
    )
    .send({
      name: 'Paciente Duplicado',
      email: 'DUPLICADO@HIGEIA.TEST',
    })
    .expect(409);

  expect(response.body.code).toBe(
    'PATIENT_EMAIL_ALREADY_EXISTS',
  );
});

    it('changes patient status', async () => {
  const response = await request(
    app.getHttpServer(),
  )
    .patch(
      `/api/patients/${createdPatientId}/status`,
    )
    .set(
      'Authorization',
      `Bearer ${ownerTenantAccessToken}`,
    )
    .send({
      status: 'INACTIVE',
    })
    .expect(200);

  expect(response.body.status).toBe(
    'INACTIVE',
  );
});

    it('rejects update by assistant', async () => {
  const response = await request(
    app.getHttpServer(),
  )
    .patch(`/api/patients/${createdPatientId}`)
    .set(
      'Authorization',
      `Bearer ${assistantTenantAccessToken}`,
    )
    .send({
      name: 'Hack',
    })
    .expect(403);

  expect(response.body.code).toBe(
    'INSUFFICIENT_ROLE',
  );
});

    it('rejects status update by assistant', async () => {
  const response = await request(
    app.getHttpServer(),
  )
    .patch(
      `/api/patients/${createdPatientId}/status`,
    )
    .set(
      'Authorization',
      `Bearer ${assistantTenantAccessToken}`,
    )
    .send({
      status: 'ACTIVE',
    })
    .expect(403);

  expect(response.body.code).toBe(
    'INSUFFICIENT_ROLE',
  );
});

    it('does not update patient from another organization', async () => {
  const response = await request(
    app.getHttpServer(),
  )
    .patch(`/api/patients/${createdPatientId}`)
    .set(
      'Authorization',
      `Bearer ${assistantTenantAccessToken}`,
    )
    .send({
      name: 'Outro Tenant',
    })
    .expect(403);

  expect(response.body.code).toBe(
    'INSUFFICIENT_ROLE',
  );
});

    


    
    it('rejects patient creation by an assistant', async () => {
      const response = await request(
        app.getHttpServer(),
      )
        .post('/api/patients')
        .set(
          'Authorization',
          `Bearer ${assistantTenantAccessToken}`,
        )
        .send({
          name:
            'Paciente Não Autorizado',
          email:
            'nao.autorizado@higeia.test',
        })
        .expect(403);

      expect(response.body).toMatchObject({
        statusCode: 403,
        code: 'INSUFFICIENT_ROLE',
      });
    });

    async function prepareTestData(): Promise<void> {
      const passwordHasher =
        new ScryptPasswordHasher();

      const passwordHash =
        await passwordHasher.hash(password);

      firstOrganizationId =
        randomUUID();

      secondOrganizationId =
        randomUUID();

      ownerUserId =
        randomUUID();

      assistantUserId =
        randomUUID();

      ownerMembershipId =
        randomUUID();

      assistantMembershipId =
        randomUUID();

      const timestamp = new Date();

      await prisma.organization.createMany({
        data: [
          {
            id: firstOrganizationId,
            name:
              'Clínica E2E Principal',
            slug:
              `clinica-e2e-${randomUUID()}`,
            status:
              OrganizationStatus.ACTIVE,
            createdAt: timestamp,
            updatedAt: timestamp,
          },
          {
            id: secondOrganizationId,
            name:
              'Clínica E2E Secundária',
            slug:
              `clinica-e2e-${randomUUID()}`,
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
            name: 'Owner E2E',
            email: ownerEmail,
            passwordHash,
            status: UserStatus.ACTIVE,
            lastLoginAt: null,
            createdAt: timestamp,
            updatedAt: timestamp,
          },
          {
            id: assistantUserId,
            name: 'Assistant E2E',
            email: assistantEmail,
            passwordHash,
            status: UserStatus.ACTIVE,
            lastLoginAt: null,
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
            id: assistantMembershipId,
            userId: assistantUserId,
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

      await prisma.medicalRecord.deleteMany({
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
          id: {
            in: [
              ownerMembershipId,
              assistantMembershipId,
            ],
          },
        },
      });

      await prisma.user.deleteMany({
        where: {
          id: {
            in: [
              ownerUserId,
              assistantUserId,
            ],
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
  },
);