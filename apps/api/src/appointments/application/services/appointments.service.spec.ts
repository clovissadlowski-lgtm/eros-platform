import { randomUUID } from 'node:crypto';

import {
  Membership,
  MembershipRole,
  MembershipStatus,
} from '../../../users/domain/entities/membership.entity';
import { InMemoryMembershipsRepository } from '../../../users/infrastructure/repositories/in-memory-memberships.repository';
import {
  Patient,
  PatientStatus,
} from '../../../patients/domain/entities/patient.entity';
import { PatientNotFoundError } from '../../../patients/domain/errors/patient-not-found.error';
import { InMemoryPatientsRepository } from '../../../patients/infrastructure/repositories/in-memory-patients.repository';
import {
  Appointment,
  AppointmentStatus,
  AppointmentType,
} from '../../domain/entities/appointment.entity';
import { AppointmentCancellationReasonRequiredError } from '../../domain/errors/appointment-cancellation-reason-required.error';
import { AppointmentNotFoundError } from '../../domain/errors/appointment-not-found.error';
import { InvalidAppointmentDateError } from '../../domain/errors/invalid-appointment-date.error';
import { InvalidAppointmentDurationError } from '../../domain/errors/invalid-appointment-duration.error';
import { InvalidAppointmentProfessionalError } from '../../domain/errors/invalid-appointment-professional.error';
import { InvalidAppointmentStatusTransitionError } from '../../domain/errors/invalid-appointment-status-transition.error';
import { InMemoryAppointmentsRepository } from '../../infrastructure/repositories/in-memory-appointments.repository';
import { AppointmentsService } from './appointments.service';

describe('AppointmentsService', () => {
  let appointmentsRepository:
    InMemoryAppointmentsRepository;

  let patientsRepository:
    InMemoryPatientsRepository;

  let membershipsRepository:
    InMemoryMembershipsRepository;

  let service:
    AppointmentsService;

  beforeEach(() => {
    jest.useFakeTimers();

    jest.setSystemTime(
      new Date(
        '2026-08-01T12:00:00.000Z',
      ),
    );

    appointmentsRepository =
      new InMemoryAppointmentsRepository();

    patientsRepository =
      new InMemoryPatientsRepository();

    membershipsRepository =
      new InMemoryMembershipsRepository();

    service =
      new AppointmentsService(
        appointmentsRepository,
        patientsRepository,
        membershipsRepository,
      );
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('creates an appointment for a valid patient and professional', async () => {
    const context =
      await prepareValidContext();

    const appointment =
      await service.createAppointment(
        context.organizationId,
        {
          patientId:
            context.patient.id,
          professionalMembershipId:
            context.membership.id,
          type:
            AppointmentType.INITIAL,
          scheduledAt:
            '2026-08-10T14:00:00.000Z',
          durationMinutes: 60,
          reason:
            '  Initial consultation.  ',
        },
      );

    expect(appointment).toMatchObject({
      organizationId:
        context.organizationId,
      patientId:
        context.patient.id,
      professionalMembershipId:
        context.membership.id,
      type:
        AppointmentType.INITIAL,
      status:
        AppointmentStatus.SCHEDULED,
      scheduledAt:
        '2026-08-10T14:00:00.000Z',
      durationMinutes: 60,
      reason:
        'Initial consultation.',
      completedAt: null,
      cancelledAt: null,
      cancellationReason: null,
    });
  });

  it('rejects a patient from another organization', async () => {
    const context =
      await prepareValidContext();

    await expect(
      service.createAppointment(
        randomUUID(),
        {
          patientId:
            context.patient.id,
          professionalMembershipId:
            context.membership.id,
          type:
            AppointmentType.INITIAL,
          scheduledAt:
            '2026-08-10T14:00:00.000Z',
          durationMinutes: 60,
        },
      ),
    ).rejects.toBeInstanceOf(
      PatientNotFoundError,
    );
  });

  it('rejects an appointment in the past', async () => {
    const context =
      await prepareValidContext();

    await expect(
      service.createAppointment(
        context.organizationId,
        {
          patientId:
            context.patient.id,
          professionalMembershipId:
            context.membership.id,
          type:
            AppointmentType.INITIAL,
          scheduledAt:
            '2026-07-31T14:00:00.000Z',
          durationMinutes: 60,
        },
      ),
    ).rejects.toBeInstanceOf(
      InvalidAppointmentDateError,
    );
  });

  it('rejects an invalid duration', async () => {
    const context =
      await prepareValidContext();

    await expect(
      service.createAppointment(
        context.organizationId,
        {
          patientId:
            context.patient.id,
          professionalMembershipId:
            context.membership.id,
          type:
            AppointmentType.INITIAL,
          scheduledAt:
            '2026-08-10T14:00:00.000Z',
          durationMinutes: 10,
        },
      ),
    ).rejects.toBeInstanceOf(
      InvalidAppointmentDurationError,
    );
  });

  it('rejects a professional from another organization', async () => {
    const context =
      await prepareValidContext();

    const anotherMembership =
      createMembership({
        organizationId:
          randomUUID(),
      });

    await membershipsRepository.create(
      anotherMembership,
    );

    await expect(
      service.createAppointment(
        context.organizationId,
        {
          patientId:
            context.patient.id,
          professionalMembershipId:
            anotherMembership.id,
          type:
            AppointmentType.INITIAL,
          scheduledAt:
            '2026-08-10T14:00:00.000Z',
          durationMinutes: 60,
        },
      ),
    ).rejects.toBeInstanceOf(
      InvalidAppointmentProfessionalError,
    );
  });

  it('rejects an assistant as the assigned professional', async () => {
    const context =
      await prepareValidContext();

    const assistantMembership =
      createMembership({
        organizationId:
          context.organizationId,
        role:
          MembershipRole.ASSISTANT,
      });

    await membershipsRepository.create(
      assistantMembership,
    );

    await expect(
      service.createAppointment(
        context.organizationId,
        {
          patientId:
            context.patient.id,
          professionalMembershipId:
            assistantMembership.id,
          type:
            AppointmentType.INITIAL,
          scheduledAt:
            '2026-08-10T14:00:00.000Z',
          durationMinutes: 60,
        },
      ),
    ).rejects.toBeInstanceOf(
      InvalidAppointmentProfessionalError,
    );
  });

  it('gets an appointment only inside the organization', async () => {
    const appointment =
      createAppointment();

    await appointmentsRepository.create(
      appointment,
    );

    const result =
      await service.getAppointmentById(
        appointment.id,
        appointment.organizationId,
      );

    expect(result).toEqual(
      appointment,
    );

    await expect(
      service.getAppointmentById(
        appointment.id,
        randomUUID(),
      ),
    ).rejects.toBeInstanceOf(
      AppointmentNotFoundError,
    );
  });

  it('lists appointments with filters', async () => {
    const organizationId =
      randomUUID();

    const patientId =
      randomUUID();

    const expectedAppointment =
      createAppointment({
        organizationId,
        patientId,
        status:
          AppointmentStatus.CONFIRMED,
      });

    await appointmentsRepository.create(
      expectedAppointment,
    );

    await appointmentsRepository.create(
      createAppointment({
        organizationId,
      }),
    );

    const result =
      await service.listAppointments(
        organizationId,
        {
          patientId,
          status:
            AppointmentStatus.CONFIRMED,
        },
      );

    expect(result).toEqual([
      expectedAppointment,
    ]);
  });

  it('updates an editable appointment', async () => {
    const context =
      await prepareValidContext();

    const appointment =
      createAppointment({
        organizationId:
          context.organizationId,
        patientId:
          context.patient.id,
        professionalMembershipId:
          context.membership.id,
      });

    await appointmentsRepository.create(
      appointment,
    );

    const updated =
      await service.updateAppointment(
        appointment.id,
        context.organizationId,
        {
          type:
            AppointmentType.FOLLOW_UP,
          scheduledAt:
            '2026-08-12T15:00:00.000Z',
          durationMinutes: 45,
          reason:
            '  Follow-up consultation.  ',
        },
      );

    expect(updated).toMatchObject({
      id: appointment.id,
      type:
        AppointmentType.FOLLOW_UP,
      scheduledAt:
        '2026-08-12T15:00:00.000Z',
      durationMinutes: 45,
      reason:
        'Follow-up consultation.',
      status:
        AppointmentStatus.SCHEDULED,
    });
  });

  it('moves an appointment through the valid lifecycle', async () => {
    const appointment =
      createAppointment();

    await appointmentsRepository.create(
      appointment,
    );

    const confirmed =
      await service.updateAppointmentStatus(
        appointment.id,
        appointment.organizationId,
        {
          status:
            AppointmentStatus.CONFIRMED,
        },
      );

    expect(confirmed.status).toBe(
      AppointmentStatus.CONFIRMED,
    );

    const inProgress =
      await service.updateAppointmentStatus(
        appointment.id,
        appointment.organizationId,
        {
          status:
            AppointmentStatus.IN_PROGRESS,
        },
      );

    expect(inProgress.status).toBe(
      AppointmentStatus.IN_PROGRESS,
    );

    jest.setSystemTime(
      new Date(
        '2026-08-10T15:00:00.000Z',
      ),
    );

    const completed =
      await service.updateAppointmentStatus(
        appointment.id,
        appointment.organizationId,
        {
          status:
            AppointmentStatus.COMPLETED,
        },
      );

    expect(completed.status).toBe(
      AppointmentStatus.COMPLETED,
    );

    expect(completed.completedAt).toBe(
      '2026-08-10T15:00:00.000Z',
    );
  });

  it('requires a reason when cancelling an appointment', async () => {
    const appointment =
      createAppointment();

    await appointmentsRepository.create(
      appointment,
    );

    await expect(
      service.updateAppointmentStatus(
        appointment.id,
        appointment.organizationId,
        {
          status:
            AppointmentStatus.CANCELLED,
        },
      ),
    ).rejects.toBeInstanceOf(
      AppointmentCancellationReasonRequiredError,
    );
  });

  it('cancels an appointment with reason and timestamp', async () => {
    const appointment =
      createAppointment();

    await appointmentsRepository.create(
      appointment,
    );

    const cancelled =
      await service.updateAppointmentStatus(
        appointment.id,
        appointment.organizationId,
        {
          status:
            AppointmentStatus.CANCELLED,
          cancellationReason:
            '  Patient requested cancellation.  ',
        },
      );

    expect(cancelled).toMatchObject({
      status:
        AppointmentStatus.CANCELLED,
      cancellationReason:
        'Patient requested cancellation.',
      cancelledAt:
        '2026-08-01T12:00:00.000Z',
    });
  });

  it('rejects an invalid status transition', async () => {
    const appointment =
      createAppointment();

    await appointmentsRepository.create(
      appointment,
    );

    await expect(
      service.updateAppointmentStatus(
        appointment.id,
        appointment.organizationId,
        {
          status:
            AppointmentStatus.COMPLETED,
        },
      ),
    ).rejects.toBeInstanceOf(
      InvalidAppointmentStatusTransitionError,
    );
  });

  async function prepareValidContext(): Promise<{
    organizationId: string;
    patient: Patient;
    membership: Membership;
  }> {
    const organizationId =
      randomUUID();

    const patient =
      createPatient({
        organizationId,
      });

    const membership =
      createMembership({
        organizationId,
      });

    await patientsRepository.create(
      patient,
    );

    await membershipsRepository.create(
      membership,
    );

    return {
      organizationId,
      patient,
      membership,
    };
  }

  function createPatient(
    overrides: Partial<Patient> = {},
  ): Patient {
    const timestamp =
      '2026-08-01T12:00:00.000Z';

    return {
      id: randomUUID(),
      organizationId: randomUUID(),
      name: 'Appointment Patient',
      email:
        `appointment-${randomUUID()}@higeia.test`,
      phone: null,
      birthDate: null,
      status: PatientStatus.ACTIVE,
      createdAt: timestamp,
      updatedAt: timestamp,
      ...overrides,
    };
  }

  function createMembership(
    overrides:
      Partial<Membership> = {},
  ): Membership {
    const timestamp =
      '2026-08-01T12:00:00.000Z';

    return {
      id: randomUUID(),
      userId: randomUUID(),
      organizationId: randomUUID(),
      role:
        MembershipRole.NUTRITIONIST,
      status:
        MembershipStatus.ACTIVE,
      createdAt: timestamp,
      updatedAt: timestamp,
      ...overrides,
    };
  }

  function createAppointment(
    overrides:
      Partial<Appointment> = {},
  ): Appointment {
    const timestamp =
      '2026-08-01T12:00:00.000Z';

    return {
      id: randomUUID(),
      organizationId: randomUUID(),
      patientId: randomUUID(),
      professionalMembershipId:
        randomUUID(),
      type: AppointmentType.INITIAL,
      status:
        AppointmentStatus.SCHEDULED,
      scheduledAt:
        '2026-08-10T14:00:00.000Z',
      durationMinutes: 60,
      reason:
        'Initial consultation.',
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