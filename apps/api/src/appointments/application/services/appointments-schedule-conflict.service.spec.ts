import { randomUUID } from 'node:crypto';

import {
  Patient,
  PatientStatus,
} from '../../../patients/domain/entities/patient.entity';
import { InMemoryPatientsRepository } from '../../../patients/infrastructure/repositories/in-memory-patients.repository';
import {
  Membership,
  MembershipRole,
  MembershipStatus,
} from '../../../users/domain/entities/membership.entity';
import { InMemoryMembershipsRepository } from '../../../users/infrastructure/repositories/in-memory-memberships.repository';
import {
  AppointmentStatus,
  AppointmentType,
} from '../../domain/entities/appointment.entity';
import { AppointmentScheduleConflictError } from '../../domain/errors/appointment-schedule-conflict.error';
import { InMemoryAppointmentsRepository } from '../../infrastructure/repositories/in-memory-appointments.repository';
import { AppointmentsService } from './appointments.service';

describe(
  'AppointmentsService schedule conflicts',
  () => {
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

    it('rejects an overlapping appointment for the same professional', async () => {
      const context =
        await prepareContext();

      await service.createAppointment(
        context.organizationId,
        {
          patientId:
            context.patient.id,
          professionalMembershipId:
            context.professional.id,
          type:
            AppointmentType.INITIAL,
          scheduledAt:
            '2026-08-10T14:00:00.000Z',
          durationMinutes: 60,
        },
      );

      await expect(
        service.createAppointment(
          context.organizationId,
          {
            patientId:
              context.patient.id,
            professionalMembershipId:
              context.professional.id,
            type:
              AppointmentType.FOLLOW_UP,
            scheduledAt:
              '2026-08-10T14:30:00.000Z',
            durationMinutes: 60,
          },
        ),
      ).rejects.toBeInstanceOf(
        AppointmentScheduleConflictError,
      );
    });

    it('allows appointments that begin when the previous one ends', async () => {
      const context =
        await prepareContext();

      await service.createAppointment(
        context.organizationId,
        {
          patientId:
            context.patient.id,
          professionalMembershipId:
            context.professional.id,
          type:
            AppointmentType.INITIAL,
          scheduledAt:
            '2026-08-10T14:00:00.000Z',
          durationMinutes: 60,
        },
      );

      const secondAppointment =
        await service.createAppointment(
          context.organizationId,
          {
            patientId:
              context.patient.id,
            professionalMembershipId:
              context.professional.id,
            type:
              AppointmentType.FOLLOW_UP,
            scheduledAt:
              '2026-08-10T15:00:00.000Z',
            durationMinutes: 60,
          },
        );

      expect(
        secondAppointment.scheduledAt,
      ).toBe(
        '2026-08-10T15:00:00.000Z',
      );
    });

    it('allows overlapping appointments for different professionals', async () => {
      const context =
        await prepareContext();

      const secondProfessional =
        createMembership({
          organizationId:
            context.organizationId,
        });

      await membershipsRepository.create(
        secondProfessional,
      );

      await service.createAppointment(
        context.organizationId,
        {
          patientId:
            context.patient.id,
          professionalMembershipId:
            context.professional.id,
          type:
            AppointmentType.INITIAL,
          scheduledAt:
            '2026-08-10T14:00:00.000Z',
          durationMinutes: 60,
        },
      );

      const secondAppointment =
        await service.createAppointment(
          context.organizationId,
          {
            patientId:
              context.patient.id,
            professionalMembershipId:
              secondProfessional.id,
            type:
              AppointmentType.INITIAL,
            scheduledAt:
              '2026-08-10T14:00:00.000Z',
            durationMinutes: 60,
          },
        );

      expect(
        secondAppointment
          .professionalMembershipId,
      ).toBe(
        secondProfessional.id,
      );
    });

    it('allows reuse of a cancelled appointment period', async () => {
      const context =
        await prepareContext();

      const firstAppointment =
        await service.createAppointment(
          context.organizationId,
          {
            patientId:
              context.patient.id,
            professionalMembershipId:
              context.professional.id,
            type:
              AppointmentType.INITIAL,
            scheduledAt:
              '2026-08-10T14:00:00.000Z',
            durationMinutes: 60,
          },
        );

      await service.updateAppointmentStatus(
        firstAppointment.id,
        context.organizationId,
        {
          status:
            AppointmentStatus.CANCELLED,
          cancellationReason:
            'Patient requested cancellation.',
        },
      );

      const replacement =
        await service.createAppointment(
          context.organizationId,
          {
            patientId:
              context.patient.id,
            professionalMembershipId:
              context.professional.id,
            type:
              AppointmentType.FOLLOW_UP,
            scheduledAt:
              '2026-08-10T14:30:00.000Z',
            durationMinutes: 60,
          },
        );

      expect(replacement.status).toBe(
        AppointmentStatus.SCHEDULED,
      );
    });

    it('rejects rescheduling into an occupied period', async () => {
      const context =
        await prepareContext();

      await service.createAppointment(
        context.organizationId,
        {
          patientId:
            context.patient.id,
          professionalMembershipId:
            context.professional.id,
          type:
            AppointmentType.INITIAL,
          scheduledAt:
            '2026-08-10T14:00:00.000Z',
          durationMinutes: 60,
        },
      );

      const secondAppointment =
        await service.createAppointment(
          context.organizationId,
          {
            patientId:
              context.patient.id,
            professionalMembershipId:
              context.professional.id,
            type:
              AppointmentType.FOLLOW_UP,
            scheduledAt:
              '2026-08-10T16:00:00.000Z',
            durationMinutes: 60,
          },
        );

      await expect(
        service.updateAppointment(
          secondAppointment.id,
          context.organizationId,
          {
            scheduledAt:
              '2026-08-10T14:30:00.000Z',
          },
        ),
      ).rejects.toBeInstanceOf(
        AppointmentScheduleConflictError,
      );
    });

    async function prepareContext(): Promise<{
      organizationId: string;
      patient: Patient;
      professional: Membership;
    }> {
      const organizationId =
        randomUUID();

      const patient =
        createPatient({
          organizationId,
        });

      const professional =
        createMembership({
          organizationId,
        });

      await patientsRepository.create(
        patient,
      );

      await membershipsRepository.create(
        professional,
      );

      return {
        organizationId,
        patient,
        professional,
      };
    }

    function createPatient(
      overrides: Partial<Patient> = {},
    ): Patient {
      const timestamp =
        '2026-08-01T12:00:00.000Z';

      return {
        id: randomUUID(),
        organizationId:
          randomUUID(),
        name:
          'Schedule Conflict Patient',
        email:
          `schedule-patient-${randomUUID()}@higeia.test`,
        phone: null,
        birthDate: null,
        status:
          PatientStatus.ACTIVE,
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
        organizationId:
          randomUUID(),
        role:
          MembershipRole.NUTRITIONIST,
        status:
          MembershipStatus.ACTIVE,
        createdAt: timestamp,
        updatedAt: timestamp,
        ...overrides,
      };
    }
  },
);