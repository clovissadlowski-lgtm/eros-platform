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

interface MedicalRecordResponse {
  id: string;
  organizationId: string;
  patientId: string;
  chiefComplaint: string | null;
  clinicalHistory: string | null;
  familyHistory: string | null;
  allergies: string | null;
  currentMedications: string | null;
  healthConditions: string | null;
  clinicalNotes: string | null;
  treatmentGoals: string | null;
  status: 'ACTIVE' | 'ARCHIVED';
  createdAt: string;
  updatedAt: string;
}

describe('Medical Records (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;

  let organizationId: string;
  let secondOrganizationId: string;

  let ownerUserId: string;
  let assistantUserId: string;

  let ownerMembershipId: string;
  let assistantMembershipId: string;

  let patientId: string;
  let secondOrganizationPatientId: string;

  let ownerAccessToken: string;
  let ownerTenantAccessToken: string;

  let assistantAccessToken: string;
  let assistantTenantAccessToken: string;

  let medicalRecordId: string;

  const password =
    'StrongPassword#2026';

  const ownerEmail =
    `medical-owner-${randomUUID()}@higeia.test`;

  const assistantEmail =
    `medical-assistant-${randomUUID()}@higeia.test`;

  beforeAll(async () => {
    app = await createTestApp();
    prisma = app.get(PrismaService);

    await prepareTestData();
  });

  afterAll(async () => {
    await clearTestData();
    await app.close();
  });

  it('logs in the owner', async () => {
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

    expect(
      body.refreshToken.length,
    ).toBeGreaterThan(20);

    ownerAccessToken =
      body.accessToken;
  });

  it('rejects medical record access without tenant context', async () => {
    const response = await request(
      app.getHttpServer(),
    )
      .get(
        `/api/patients/${patientId}/medical-record`,
      )
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
        organizationId,
      })
      .expect(200);

    const body =
      response.body as SelectOrganizationResponse;

    expect(body.context).toEqual({
      organizationId,
      membershipId:
        ownerMembershipId,
      role: MembershipRole.OWNER,
    });

    ownerTenantAccessToken =
      body.accessToken;
  });

  it('returns not found before a medical record exists', async () => {
    const response = await request(
      app.getHttpServer(),
    )
      .get(
        `/api/patients/${patientId}/medical-record`,
      )
      .set(
        'Authorization',
        `Bearer ${ownerTenantAccessToken}`,
      )
      .expect(404);

    expect(response.body).toMatchObject({
      statusCode: 404,
      code: 'MEDICAL_RECORD_NOT_FOUND',
    });
  });

  it('creates a medical record for the patient', async () => {
    const response = await request(
      app.getHttpServer(),
    )
      .post(
        `/api/patients/${patientId}/medical-record`,
      )
      .set(
        'Authorization',
        `Bearer ${ownerTenantAccessToken}`,
      )
      .send({
        chiefComplaint:
          '  Dificuldade para perder gordura abdominal.  ',
        clinicalHistory:
          'Ganho de peso nos últimos dois anos.',
        familyHistory:
          'Histórico familiar de hipertensão.',
        allergies:
          'Nenhuma conhecida.',
        currentMedications:
          'Nenhum medicamento informado.',
        healthConditions:
          'Nenhuma condição diagnosticada.',
        clinicalNotes:
          '  Paciente motivado.  ',
        treatmentGoals:
          'Reduzir gordura corporal.',
      })
      .expect(201);

    const body =
      response.body as MedicalRecordResponse;

    expect(body).toMatchObject({
      organizationId,
      patientId,
      chiefComplaint:
        'Dificuldade para perder gordura abdominal.',
      clinicalHistory:
        'Ganho de peso nos últimos dois anos.',
      clinicalNotes:
        'Paciente motivado.',
      treatmentGoals:
        'Reduzir gordura corporal.',
      status: 'ACTIVE',
    });

    expect(typeof body.id).toBe(
      'string',
    );

    medicalRecordId = body.id;
  });

  it('rejects a second medical record for the same patient', async () => {
    const response = await request(
      app.getHttpServer(),
    )
      .post(
        `/api/patients/${patientId}/medical-record`,
      )
      .set(
        'Authorization',
        `Bearer ${ownerTenantAccessToken}`,
      )
      .send({
        chiefComplaint:
          'Segundo prontuário indevido.',
      })
      .expect(409);

    expect(response.body).toMatchObject({
      statusCode: 409,
      code:
        'MEDICAL_RECORD_ALREADY_EXISTS',
    });
  });

  it('gets the medical record by patient', async () => {
    const response = await request(
      app.getHttpServer(),
    )
      .get(
        `/api/patients/${patientId}/medical-record`,
      )
      .set(
        'Authorization',
        `Bearer ${ownerTenantAccessToken}`,
      )
      .expect(200);

    expect(response.body).toMatchObject({
      id: medicalRecordId,
      organizationId,
      patientId,
      status: 'ACTIVE',
    });
  });

  it('updates only the supplied clinical fields', async () => {
    const response = await request(
      app.getHttpServer(),
    )
      .patch(
        `/api/patients/${patientId}/medical-record`,
      )
      .set(
        'Authorization',
        `Bearer ${ownerTenantAccessToken}`,
      )
      .send({
        clinicalNotes:
          '  Paciente apresentou boa adesão inicial.  ',
        treatmentGoals:
          '  Reduzir cinco quilos de gordura.  ',
      })
      .expect(200);

    const body =
      response.body as MedicalRecordResponse;

    expect(body).toMatchObject({
      id: medicalRecordId,
      organizationId,
      patientId,
      chiefComplaint:
        'Dificuldade para perder gordura abdominal.',
      clinicalHistory:
        'Ganho de peso nos últimos dois anos.',
      clinicalNotes:
        'Paciente apresentou boa adesão inicial.',
      treatmentGoals:
        'Reduzir cinco quilos de gordura.',
      status: 'ACTIVE',
    });
  });

  it('archives the medical record', async () => {
    const response = await request(
      app.getHttpServer(),
    )
      .patch(
        `/api/patients/${patientId}/medical-record/status`,
      )
      .set(
        'Authorization',
        `Bearer ${ownerTenantAccessToken}`,
      )
      .send({
        status: 'ARCHIVED',
      })
      .expect(200);

    expect(response.body).toMatchObject({
      id: medicalRecordId,
      status: 'ARCHIVED',
    });
  });

  it('reactivates the medical record', async () => {
    const response = await request(
      app.getHttpServer(),
    )
      .patch(
        `/api/patients/${patientId}/medical-record/status`,
      )
      .set(
        'Authorization',
        `Bearer ${ownerTenantAccessToken}`,
      )
      .send({
        status: 'ACTIVE',
      })
      .expect(200);

    expect(response.body).toMatchObject({
      id: medicalRecordId,
      status: 'ACTIVE',
    });
  });

  it('rejects an invalid medical record status', async () => {
    const response = await request(
      app.getHttpServer(),
    )
      .patch(
        `/api/patients/${patientId}/medical-record/status`,
      )
      .set(
        'Authorization',
        `Bearer ${ownerTenantAccessToken}`,
      )
      .send({
        status: 'DELETED',
      })
      .expect(400);

    expect(response.body).toMatchObject({
      statusCode: 400,
      code: 'VALIDATION_ERROR',
    });
  });

  it('does not expose a patient from another organization', async () => {
    const response = await request(
      app.getHttpServer(),
    )
      .get(
        `/api/patients/${secondOrganizationPatientId}/medical-record`,
      )
      .set(
        'Authorization',
        `Bearer ${ownerTenantAccessToken}`,
      )
      .expect(404);

    expect(response.body).toMatchObject({
      statusCode: 404,
      code: 'PATIENT_NOT_FOUND',
    });
  });

  it('logs in and selects the assistant organization', async () => {
    const loginResponse = await request(
      app.getHttpServer(),
    )
      .post('/api/auth/login')
      .send({
        email: assistantEmail,
        password,
      })
      .expect(200);

    const loginBody =
      loginResponse.body as LoginResponse;

    assistantAccessToken =
      loginBody.accessToken;

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

    const selectBody =
      selectResponse.body as SelectOrganizationResponse;

    expect(selectBody.context).toEqual({
      organizationId:
        secondOrganizationId,
      membershipId:
        assistantMembershipId,
      role: MembershipRole.ASSISTANT,
    });

    assistantTenantAccessToken =
      selectBody.accessToken;
  });

  it('rejects medical record access by an assistant', async () => {
    const response = await request(
      app.getHttpServer(),
    )
      .get(
        `/api/patients/${secondOrganizationPatientId}/medical-record`,
      )
      .set(
        'Authorization',
        `Bearer ${assistantTenantAccessToken}`,
      )
      .expect(403);

    expect(response.body).toMatchObject({
      statusCode: 403,
      code: 'INSUFFICIENT_ROLE',
    });
  });

  it('rejects medical record creation by an assistant', async () => {
    const response = await request(
      app.getHttpServer(),
    )
      .post(
        `/api/patients/${secondOrganizationPatientId}/medical-record`,
      )
      .set(
        'Authorization',
        `Bearer ${assistantTenantAccessToken}`,
      )
      .send({
        chiefComplaint:
          'Tentativa não autorizada.',
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

    organizationId = randomUUID();
    secondOrganizationId =
      randomUUID();

    ownerUserId = randomUUID();
    assistantUserId =
      randomUUID();

    ownerMembershipId =
      randomUUID();

    assistantMembershipId =
      randomUUID();

    patientId = randomUUID();

    secondOrganizationPatientId =
      randomUUID();

    const timestamp = new Date();

    await prisma.organization.createMany({
      data: [
        {
          id: organizationId,
          name:
            'Medical Records E2E Organization',
          slug:
            `medical-records-e2e-${randomUUID()}`,
          status:
            OrganizationStatus.ACTIVE,
          createdAt: timestamp,
          updatedAt: timestamp,
        },
        {
          id: secondOrganizationId,
          name:
            'Medical Records E2E Second Organization',
          slug:
            `medical-records-e2e-${randomUUID()}`,
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
            'Medical Records Owner',
          email: ownerEmail,
          passwordHash,
          status: UserStatus.ACTIVE,
          lastLoginAt: null,
          createdAt: timestamp,
          updatedAt: timestamp,
        },
        {
          id: assistantUserId,
          name:
            'Medical Records Assistant',
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
          organizationId,
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

    await prisma.patient.createMany({
      data: [
        {
          id: patientId,
          organizationId,
          name:
            'Medical Records E2E Patient',
          email:
            `medical-patient-${randomUUID()}@higeia.test`,
          status: PatientStatus.ACTIVE,
          createdAt: timestamp,
          updatedAt: timestamp,
        },
        {
          id:
            secondOrganizationPatientId,
          organizationId:
            secondOrganizationId,
          name:
            'Second Tenant Patient',
          email:
            `second-medical-patient-${randomUUID()}@higeia.test`,
          status: PatientStatus.ACTIVE,
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
            organizationId,
            secondOrganizationId,
          ],
        },
      },
    });

    await prisma.patient.deleteMany({
      where: {
        organizationId: {
          in: [
            organizationId,
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
            organizationId,
            secondOrganizationId,
          ],
        },
      },
    });
  }
});