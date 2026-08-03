import { randomUUID } from 'node:crypto';

import { PrismaService } from '../../../common/database/prisma.service';
import {
  AppointmentStatus as PrismaAppointmentStatus,
  AppointmentType as PrismaAppointmentType,
  MembershipRole,
  MembershipStatus,
  OrganizationStatus,
  PatientStatus,
  UserStatus,
} from '../../../generated/prisma/enums';
import {
  Appointment,
  AppointmentStatus,
  AppointmentType,
} from '../../domain/entities/appointment.entity';
import { PrismaAppointmentsRepository } from './prisma-appointments.repository';

describe('PrismaAppointmentsRepository', () => {
  const prisma =
    new PrismaService();

  const repository =
    new PrismaAppointmentsRepository(
      prisma,
    );

  let organizationId: string;
  let patientId: string;
  let userId: string;
  let professionalMembershipId: string;

  beforeAll(async () => {
    await prisma.$connect();
  });

  beforeEach(async () => {
    organizationId = randomUUID();
    patientId = randomUUID();
    userId = randomUUID();
    professionalMembershipId =
      randomUUID();

    const timestamp = new Date();

    await prisma.organization.create({
      data: {
        id: organizationId,
        name:
          'Appointments Integration Organization',
        slug:
          `appointments-${randomUUID()}`,
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
          'Appointments Professional',
        email:
          `appointments-${randomUUID()}@higeia.test`,
        passwordHash: null,
        status: UserStatus.ACTIVE,
        lastLoginAt: null,
        createdAt: timestamp,
        updatedAt: timestamp,
      },
    });

    await prisma.membership.create({
      data: {
        id:
          professionalMembershipId,
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
          'Appointments Integration Patient',
        email:
          `patient-${randomUUID()}@higeia.test`,
        status:
          PatientStatus.ACTIVE,
        createdAt: timestamp,
        updatedAt: timestamp,
      },
    });
  });

  afterEach(async () => {
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
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  it('creates and finds an appointment', async () => {
    const appointment =
      createAppointment();

    const created =
      await repository.create(
        appointment,
      );

    expect(created).toEqual(
      appointment,
    );

    const found =
      await repository.findById(
        organizationId,
        appointment.id,
      );

    expect(found).toEqual(
      appointment,
    );
  });

  it('does not expose an appointment from another organization', async () => {
    const appointment =
      createAppointment();

    await repository.create(
      appointment,
    );

    const result =
      await repository.findById(
        randomUUID(),
        appointment.id,
      );

    expect(result).toBeNull();
  });

  it('lists and filters appointments', async () => {
    const firstAppointment =
      createAppointment({
        scheduledAt:
          '2026-08-10T10:00:00.000Z',
        status:
          AppointmentStatus.CONFIRMED,
      });

    const secondAppointment =
      createAppointment({
        id: randomUUID(),
        scheduledAt:
          '2026-08-10T09:00:00.000Z',
        status:
          AppointmentStatus.SCHEDULED,
      });

    await repository.create(
      firstAppointment,
    );

    await repository.create(
      secondAppointment,
    );

    const result =
      await repository.listByOrganization(
        organizationId,
        {
          patientId,
          professionalMembershipId,
          status:
            AppointmentStatus.CONFIRMED,
          scheduledFrom:
            '2026-08-10T00:00:00.000Z',
          scheduledTo:
            '2026-08-10T23:59:59.999Z',
        },
      );

    expect(result).toEqual([
      firstAppointment,
    ]);
  });

  it('updates an appointment', async () => {
    const appointment =
      createAppointment();

    await repository.create(
      appointment,
    );

    const updatedAppointment: Appointment = {
      ...appointment,
      type:
        AppointmentType.FOLLOW_UP,
      status:
        AppointmentStatus.COMPLETED,
      notes:
        'Appointment completed.',
      completedAt:
        '2026-08-10T15:00:00.000Z',
      updatedAt:
        '2026-08-10T15:00:00.000Z',
    };

    const result =
      await repository.update(
        updatedAppointment,
      );

    expect(result).toEqual(
      updatedAppointment,
    );

    const persisted =
      await repository.findById(
        organizationId,
        appointment.id,
      );

    expect(persisted).toEqual(
      updatedAppointment,
    );
  });

  function createAppointment(
    overrides:
      Partial<Appointment> = {},
  ): Appointment {
    const timestamp =
      '2026-08-01T12:00:00.000Z';

    return {
      id: randomUUID(),
      organizationId,
      patientId,
      professionalMembershipId,
      type: AppointmentType.INITIAL,
      status:
        AppointmentStatus.SCHEDULED,
      scheduledAt:
        '2026-08-10T14:00:00.000Z',
      durationMinutes: 60,
      reason:
        'Initial nutritional consultation.',
      notes: null,
      completedAt: null,
      cancelledAt: null,
      cancellationReason: null,
      createdAt: timestamp,
      updatedAt: timestamp,
      ...overrides,
    };
  }
});