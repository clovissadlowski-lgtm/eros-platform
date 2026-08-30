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

interface DietaryRestrictionResponse {
  id: string;
  organizationId: string;
  medicalRecordId: string;
  patientId: string;
  item: string;
  type:
    | 'PREFERENCE'
    | 'INTOLERANCE'
    | 'MEDICAL_RESTRICTION'
    | 'CULTURAL_RELIGIOUS'
    | 'ETHICAL_LIFESTYLE'
    | 'OTHER';
  action:
    | 'AVOID'
    | 'LIMIT'
    | 'MONITOR'
    | 'KEEP_CONSISTENT'
    | 'BLOCK';
  risk:
    | 'NONE'
    | 'LOW'
    | 'MODERATE'
    | 'HIGH'
    | 'CRITICAL';
  source:
    | 'PATIENT_REPORTED'
    | 'PROFESSIONAL_REPORTED'
    | 'SYSTEM_DERIVED';
  reason: string | null;
  identifiedAt: string | null;
  status:
    | 'ACTIVE'
    | 'INACTIVE'
    | 'RESOLVED';
  notes: string | null;
  createdAt: string;
  updatedAt: string;
}

interface AnthropometricSkinfoldMeasurementResponse {
  id: string;
  anthropometricAssessmentId: string;
  site:
    | 'CHEST'
    | 'MIDAXILLARY'
    | 'TRICEPS'
    | 'SUBSCAPULAR'
    | 'ABDOMEN'
    | 'SUPRAILIAC'
    | 'THIGH'
    | 'BICEPS'
    | 'SUPRASPINALE'
    | 'CALF'
    | 'OTHER';
  side: 'RIGHT' | 'LEFT';
  readingNumber: number;
  valueMm: number;
  createdAt: string;
  updatedAt: string;
}

interface AnthropometricAssessmentResponse {
  id: string;
  organizationId: string;
  medicalRecordId: string;
  patientId: string;
  measuredAt: string;
  weightKg: number | null;
  heightCm: number | null;
  bodyFatPercentage: number | null;
  fatMassKg: number | null;
  leanMassKg: number | null;
  muscleMassKg: number | null;
  waistCircumferenceCm: number | null;
  hipCircumferenceCm: number | null;
  abdomenCircumferenceCm: number | null;
  chestCircumferenceCm: number | null;
  armCircumferenceCm: number | null;
  thighCircumferenceCm: number | null;
  calfCircumferenceCm: number | null;
  bodyCompositionMethod:
    | 'BIOIMPEDANCE'
    | 'SKINFOLD'
    | 'DEXA'
    | 'OTHER'
    | null;
  skinfoldProtocol:
    | 'JACKSON_POLLOCK_3'
    | 'JACKSON_POLLOCK_7'
    | 'OTHER'
    | null;
  skinfoldMeasurements:
    AnthropometricSkinfoldMeasurementResponse[];
  notes: string | null;
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
  let dietaryRestrictionId: string;
  let anthropometricAssessmentId: string;

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

  it('creates a dietary preference for the patient', async () => {
    const response = await request(
      app.getHttpServer(),
    )
      .post(
        `/api/patients/${patientId}/medical-record/dietary-restrictions`,
      )
      .set(
        'Authorization',
        `Bearer ${ownerTenantAccessToken}`,
      )
      .send({
        item:
          '  Tomate  ',
        type:
          'PREFERENCE',
        action:
          'AVOID',
        reason:
          '  Paciente não gosta de tomate.  ',
        notes:
          '  Preferência pessoal, sem risco clínico.  ',
      })
      .expect(201);

    const body =
      response.body as DietaryRestrictionResponse;

    expect(body).toMatchObject({
      organizationId,
      medicalRecordId,
      patientId,
      item: 'Tomate',
      type: 'PREFERENCE',
      action: 'AVOID',
      risk: 'NONE',
      source: 'PATIENT_REPORTED',
      reason:
        'Paciente não gosta de tomate.',
      status: 'ACTIVE',
      notes:
        'Preferência pessoal, sem risco clínico.',
    });

    expect(typeof body.id).toBe(
      'string',
    );

    dietaryRestrictionId =
      body.id;
  });

  it('lists dietary preferences and restrictions from the patient', async () => {
    const response = await request(
      app.getHttpServer(),
    )
      .get(
        `/api/patients/${patientId}/medical-record/dietary-restrictions`,
      )
      .set(
        'Authorization',
        `Bearer ${ownerTenantAccessToken}`,
      )
      .expect(200);

    const body =
      response.body as DietaryRestrictionResponse[];

    expect(
      Array.isArray(body),
    ).toBe(true);

    expect(body).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id:
            dietaryRestrictionId,
          item:
            'Tomate',
          type:
            'PREFERENCE',
          action:
            'AVOID',
          risk:
            'NONE',
          source:
            'PATIENT_REPORTED',
          status:
            'ACTIVE',
        }),
      ]),
    );
  });

  it('updates a dietary preference into a clinical restriction', async () => {
    const response = await request(
      app.getHttpServer(),
    )
      .patch(
        `/api/patients/${patientId}/medical-record/dietary-restrictions/${dietaryRestrictionId}`,
      )
      .set(
        'Authorization',
        `Bearer ${ownerTenantAccessToken}`,
      )
      .send({
        item:
          'Glúten',
        type:
          'MEDICAL_RESTRICTION',
        action:
          'BLOCK',
        risk:
          'HIGH',
        source:
          'PROFESSIONAL_REPORTED',
        reason:
          'Restrição clínica registrada pelo profissional.',
        notes:
          'Evitar alimentos que contenham glúten.',
      })
      .expect(200);

    const body =
      response.body as DietaryRestrictionResponse;

    expect(body).toMatchObject({
      id:
        dietaryRestrictionId,
      organizationId,
      medicalRecordId,
      patientId,
      item:
        'Glúten',
      type:
        'MEDICAL_RESTRICTION',
      action:
        'BLOCK',
      risk:
        'HIGH',
      source:
        'PROFESSIONAL_REPORTED',
      reason:
        'Restrição clínica registrada pelo profissional.',
      status:
        'ACTIVE',
      notes:
        'Evitar alimentos que contenham glúten.',
    });
  });

  it('rejects an invalid dietary restriction type', async () => {
    const response = await request(
      app.getHttpServer(),
    )
      .post(
        `/api/patients/${patientId}/medical-record/dietary-restrictions`,
      )
      .set(
        'Authorization',
        `Bearer ${ownerTenantAccessToken}`,
      )
      .send({
        item:
          'Teste inválido',
        type:
          'INVALID_TYPE',
        action:
          'AVOID',
      })
      .expect(400);

    expect(response.body).toMatchObject({
      statusCode: 400,
      code: 'VALIDATION_ERROR',
    });
  });

  it('rejects an invalid dietary restriction action', async () => {
    const response = await request(
      app.getHttpServer(),
    )
      .post(
        `/api/patients/${patientId}/medical-record/dietary-restrictions`,
      )
      .set(
        'Authorization',
        `Bearer ${ownerTenantAccessToken}`,
      )
      .send({
        item:
          'Teste inválido',
        type:
          'PREFERENCE',
        action:
          'INVALID_ACTION',
      })
      .expect(400);

    expect(response.body).toMatchObject({
      statusCode: 400,
      code: 'VALIDATION_ERROR',
    });
  });

  it('rejects SYSTEM_DERIVED source from the external API', async () => {
    const response = await request(
      app.getHttpServer(),
    )
      .post(
        `/api/patients/${patientId}/medical-record/dietary-restrictions`,
      )
      .set(
        'Authorization',
        `Bearer ${ownerTenantAccessToken}`,
      )
      .send({
        item:
          'Vitamina K',
        type:
          'MEDICAL_RESTRICTION',
        action:
          'KEEP_CONSISTENT',
        risk:
          'HIGH',
        source:
          'SYSTEM_DERIVED',
      })
      .expect(400);

    expect(response.body).toMatchObject({
      statusCode: 400,
      code: 'VALIDATION_ERROR',
    });
  });

  it('does not expose dietary restrictions from another organization', async () => {
    const response = await request(
      app.getHttpServer(),
    )
      .get(
        `/api/patients/${secondOrganizationPatientId}/medical-record/dietary-restrictions`,
      )
      .set(
        'Authorization',
        `Bearer ${ownerTenantAccessToken}`,
      )
      .expect(404);

    expect(response.body).toMatchObject({
      statusCode: 404,
    });
  });

  it('creates an anthropometric assessment with seven skinfold sites', async () => {
    const response = await request(app.getHttpServer())
      .post(
        `/api/patients/${patientId}/medical-record/anthropometric-assessments`,
      )
      .set(
        'Authorization',
        `Bearer ${ownerTenantAccessToken}`,
      )
      .send({
        measuredAt: '2026-08-29',
        weightKg: 76.7,
        heightCm: 170,
        bodyFatPercentage: 19.1,
        fatMassKg: 14.65,
        leanMassKg: 62.05,
        waistCircumferenceCm: 83,
        hipCircumferenceCm: 88.5,
        abdomenCircumferenceCm: 85,
        chestCircumferenceCm: 101,
        armCircumferenceCm: 36,
        thighCircumferenceCm: 58,
        calfCircumferenceCm: 38,
        bodyCompositionMethod: 'SKINFOLD',
        skinfoldProtocol: 'JACKSON_POLLOCK_7',
        skinfoldMeasurements: [
          {
            site: 'CHEST',
            side: 'RIGHT',
            readingNumber: 1,
            valueMm: 12.4,
          },
          {
            site: 'MIDAXILLARY',
            side: 'RIGHT',
            readingNumber: 1,
            valueMm: 14.1,
          },
          {
            site: 'TRICEPS',
            side: 'RIGHT',
            readingNumber: 1,
            valueMm: 11.8,
          },
          {
            site: 'SUBSCAPULAR',
            side: 'RIGHT',
            readingNumber: 1,
            valueMm: 16.2,
          },
          {
            site: 'ABDOMEN',
            side: 'RIGHT',
            readingNumber: 1,
            valueMm: 20.5,
          },
          {
            site: 'SUPRAILIAC',
            side: 'RIGHT',
            readingNumber: 1,
            valueMm: 15.3,
          },
          {
            site: 'THIGH',
            side: 'RIGHT',
            readingNumber: 1,
            valueMm: 18.7,
          },
        ],
        notes: '  Avaliação antropométrica inicial.  ',
      })
      .expect(201);

    const body =
      response.body as AnthropometricAssessmentResponse;

    expect(body).toMatchObject({
      organizationId,
      medicalRecordId,
      patientId,
      measuredAt: '2026-08-29',
      weightKg: 76.7,
      heightCm: 170,
      bodyFatPercentage: 19.1,
      waistCircumferenceCm: 83,
      hipCircumferenceCm: 88.5,
      bodyCompositionMethod: 'SKINFOLD',
      skinfoldProtocol: 'JACKSON_POLLOCK_7',
      notes: 'Avaliação antropométrica inicial.',
    });

    expect(body.skinfoldMeasurements).toHaveLength(7);

    anthropometricAssessmentId = body.id;

    const persisted =
      await prisma.anthropometricAssessment.findFirst({
        where: {
          id: anthropometricAssessmentId,
          organizationId,
          patientId,
        },
        include: {
          skinfoldMeasurements: true,
        },
      });

    expect(persisted).not.toBeNull();
    expect(
      persisted?.skinfoldMeasurements,
    ).toHaveLength(7);
  });

  it('lists anthropometric assessments from the patient', async () => {
    const response = await request(app.getHttpServer())
      .get(
        `/api/patients/${patientId}/medical-record/anthropometric-assessments`,
      )
      .set(
        'Authorization',
        `Bearer ${ownerTenantAccessToken}`,
      )
      .expect(200);

    const body =
      response.body as AnthropometricAssessmentResponse[];

    expect(body).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: anthropometricAssessmentId,
          organizationId,
          medicalRecordId,
          patientId,
          measuredAt: '2026-08-29',
        }),
      ]),
    );
  });

  it('gets an anthropometric assessment by id', async () => {
    const response = await request(app.getHttpServer())
      .get(
        `/api/patients/${patientId}/medical-record/anthropometric-assessments/${anthropometricAssessmentId}`,
      )
      .set(
        'Authorization',
        `Bearer ${ownerTenantAccessToken}`,
      )
      .expect(200);

    const body =
      response.body as AnthropometricAssessmentResponse;

    expect(body).toMatchObject({
      id: anthropometricAssessmentId,
      organizationId,
      medicalRecordId,
      patientId,
      weightKg: 76.7,
      heightCm: 170,
    });

    expect(body.skinfoldMeasurements).toHaveLength(7);
  });

  it('returns calculated anthropometric assessment results with clinical context', async () => {
    const response = await request(app.getHttpServer())
      .get(
        `/api/patients/${patientId}/medical-record/anthropometric-assessments/${anthropometricAssessmentId}/results`,
      )
      .set(
        'Authorization',
        `Bearer ${ownerTenantAccessToken}`,
      )
      .expect(200);

    expect(response.body).toMatchObject({
      assessment: {
        id: anthropometricAssessmentId,
        organizationId,
        medicalRecordId,
        patientId,
        measuredAt: '2026-08-29',
        weightKg: 76.7,
        heightCm: 170,
      },
      clinicalContext: {
        assessmentDate: '2026-08-29',
        biologicalSex: 'MALE',
        age: {
          years: 36,
          months: 4,
          totalMonths: 436,
        },
        population: 'ADULT',
        hasBirthDate: true,
        hasBiologicalSex: true,
      },
      calculations: expect.arrayContaining([
        expect.objectContaining({
          code: 'BMI',
          value: 26.54,
          unit: 'kg/m²',
          source: 'HIGEIA_CALCULATION',
          method: 'WEIGHT_HEIGHT_BMI',
        }),
        expect.objectContaining({
          code: 'BODY_DENSITY',
          unit: 'g/mL',
          source: 'HIGEIA_CALCULATION',
          method: 'JACKSON_POLLOCK_7',
        }),
        expect.objectContaining({
          code: 'BODY_FAT_PERCENTAGE',
          unit: '%',
          source: 'HIGEIA_CALCULATION',
          method: 'SIRI',
        }),
        expect.objectContaining({
          code: 'FAT_MASS_KG',
          unit: 'kg',
          source: 'HIGEIA_CALCULATION',
          method: 'WEIGHT_BODY_FAT_PERCENTAGE',
        }),
        expect.objectContaining({
          code: 'LEAN_MASS_KG',
          unit: 'kg',
          source: 'HIGEIA_CALCULATION',
          method: 'WEIGHT_BODY_FAT_PERCENTAGE',
        }),
      ]),
    });
  });

  it('does not expose anthropometric assessment results to another organization', async () => {
    await request(app.getHttpServer())
      .get(
        `/api/patients/${secondOrganizationPatientId}/medical-record/anthropometric-assessments/${anthropometricAssessmentId}/results`,
      )
      .set(
        'Authorization',
        `Bearer ${ownerTenantAccessToken}`,
      )
      .expect(404);
  });
  it('updates an anthropometric assessment and replaces skinfold measurements', async () => {
    const response = await request(app.getHttpServer())
      .patch(
        `/api/patients/${patientId}/medical-record/anthropometric-assessments/${anthropometricAssessmentId}`,
      )
      .set(
        'Authorization',
        `Bearer ${ownerTenantAccessToken}`,
      )
      .send({
        weightKg: 75.9,
        waistCircumferenceCm: 81.5,
        skinfoldProtocol: 'JACKSON_POLLOCK_7',
        skinfoldMeasurements: [
          {
            site: 'CHEST',
            side: 'RIGHT',
            readingNumber: 1,
            valueMm: 11.8,
          },
          {
            site: 'CHEST',
            side: 'RIGHT',
            readingNumber: 2,
            valueMm: 11.6,
          },
          {
            site: 'ABDOMEN',
            side: 'RIGHT',
            readingNumber: 1,
            valueMm: 18.9,
          },
        ],
        notes: '  Avaliação revisada.  ',
      })
      .expect(200);

    const body =
      response.body as AnthropometricAssessmentResponse;

    expect(body).toMatchObject({
      id: anthropometricAssessmentId,
      weightKg: 75.9,
      heightCm: 170,
      waistCircumferenceCm: 81.5,
      notes: 'Avaliação revisada.',
    });

    expect(body.skinfoldMeasurements).toHaveLength(3);

    const persisted =
      await prisma.anthropometricAssessment.findUnique({
        where: {
          id: anthropometricAssessmentId,
        },
        include: {
          skinfoldMeasurements: true,
        },
      });

    expect(
      persisted?.skinfoldMeasurements,
    ).toHaveLength(3);
  });

  it('rejects an anthropometric skinfold reading above the API limit', async () => {
    const response = await request(app.getHttpServer())
      .post(
        `/api/patients/${patientId}/medical-record/anthropometric-assessments`,
      )
      .set(
        'Authorization',
        `Bearer ${ownerTenantAccessToken}`,
      )
      .send({
        measuredAt: '2026-08-29',
        skinfoldProtocol: 'JACKSON_POLLOCK_7',
        skinfoldMeasurements: [
          {
            site: 'TRICEPS',
            side: 'RIGHT',
            readingNumber: 4,
            valueMm: 12,
          },
        ],
      })
      .expect(400);

    expect(response.body).toMatchObject({
      statusCode: 400,
      code: 'VALIDATION_ERROR',
    });
  });

  it('does not expose anthropometric assessments from another organization', async () => {
    const response = await request(app.getHttpServer())
      .get(
        `/api/patients/${secondOrganizationPatientId}/medical-record/anthropometric-assessments`,
      )
      .set(
        'Authorization',
        `Bearer ${ownerTenantAccessToken}`,
      )
      .expect(404);

    expect(response.body).toMatchObject({
      statusCode: 404,
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

  it('rejects dietary restriction access by an assistant', async () => {
    const response = await request(
      app.getHttpServer(),
    )
      .get(
        `/api/patients/${secondOrganizationPatientId}/medical-record/dietary-restrictions`,
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

  it('rejects anthropometric assessment access by an assistant', async () => {
    const response = await request(app.getHttpServer())
      .get(
        `/api/patients/${secondOrganizationPatientId}/medical-record/anthropometric-assessments`,
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

  it('rejects anthropometric assessment results access by an assistant', async () => {
    await request(app.getHttpServer())
      .get(
        `/api/patients/${secondOrganizationPatientId}/medical-record/anthropometric-assessments/${anthropometricAssessmentId}/results`,
      )
      .set(
        'Authorization',
        `Bearer ${assistantTenantAccessToken}`,
      )
      .expect(403);
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

  it('deletes an anthropometric assessment', async () => {
    await request(app.getHttpServer())
      .delete(
        `/api/patients/${patientId}/medical-record/anthropometric-assessments/${anthropometricAssessmentId}`,
      )
      .set(
        'Authorization',
        `Bearer ${ownerTenantAccessToken}`,
      )
      .expect(204);

    const persisted =
      await prisma.anthropometricAssessment.findUnique({
        where: {
          id: anthropometricAssessmentId,
        },
      });

    expect(persisted).toBeNull();
  });

  it('deletes a dietary restriction', async () => {
    await request(
      app.getHttpServer(),
    )
      .delete(
        `/api/patients/${patientId}/medical-record/dietary-restrictions/${dietaryRestrictionId}`,
      )
      .set(
        'Authorization',
        `Bearer ${ownerTenantAccessToken}`,
      )
      .expect(204);

    const listResponse =
      await request(
        app.getHttpServer(),
      )
        .get(
          `/api/patients/${patientId}/medical-record/dietary-restrictions`,
        )
        .set(
          'Authorization',
          `Bearer ${ownerTenantAccessToken}`,
        )
        .expect(200);

    const body =
      listResponse.body as DietaryRestrictionResponse[];

    expect(body).not.toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id:
            dietaryRestrictionId,
        }),
      ]),
    );
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
          birthDate:
            new Date('1990-04-10T00:00:00.000Z'),
          biologicalSex:
            'MALE',
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

    await prisma.medicalRecordDietaryRestriction.deleteMany({
      where: {
        organizationId: {
          in: [
            organizationId,
            secondOrganizationId,
          ],
        },
      },
    });

    await prisma.anthropometricAssessment.deleteMany({
      where: {
        organizationId: {
          in: [
            organizationId,
            secondOrganizationId,
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