import { randomUUID } from 'node:crypto';

import {
  Appointment,
  AppointmentStatus,
  AppointmentType,
} from '../../domain/entities/appointment.entity';
import { InMemoryAppointmentsRepository } from './in-memory-appointments.repository';

describe(
  'InMemoryAppointmentsRepository',
  () => {
    let repository:
      InMemoryAppointmentsRepository;

    beforeEach(() => {
      repository =
        new InMemoryAppointmentsRepository();
    });

    it('creates and finds an appointment by id', async () => {
      const appointment =
        createAppointment();

      await repository.create(
        appointment,
      );

      const result =
        await repository.findById(
          appointment.organizationId,
          appointment.id,
        );

      expect(result).toEqual(
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

    it('lists appointments only from the requested organization', async () => {
      const organizationId =
        randomUUID();

      const firstAppointment =
        createAppointment({
          organizationId,
          scheduledAt:
            '2026-08-10T10:00:00.000Z',
        });

      const secondAppointment =
        createAppointment({
          organizationId,
          scheduledAt:
            '2026-08-10T09:00:00.000Z',
        });

      const anotherOrganizationAppointment =
        createAppointment({
          organizationId:
            randomUUID(),
        });

      await repository.create(
        firstAppointment,
      );

      await repository.create(
        secondAppointment,
      );

      await repository.create(
        anotherOrganizationAppointment,
      );

      const result =
        await repository.listByOrganization(
          organizationId,
        );

      expect(result).toEqual([
        secondAppointment,
        firstAppointment,
      ]);
    });

    it('filters appointments by patient', async () => {
      const organizationId =
        randomUUID();

      const patientId =
        randomUUID();

      const expectedAppointment =
        createAppointment({
          organizationId,
          patientId,
        });

      const anotherAppointment =
        createAppointment({
          organizationId,
        });

      await repository.create(
        expectedAppointment,
      );

      await repository.create(
        anotherAppointment,
      );

      const result =
        await repository.listByOrganization(
          organizationId,
          {
            patientId,
          },
        );

      expect(result).toEqual([
        expectedAppointment,
      ]);
    });

    it('filters appointments by professional membership', async () => {
      const organizationId =
        randomUUID();

      const professionalMembershipId =
        randomUUID();

      const expectedAppointment =
        createAppointment({
          organizationId,
          professionalMembershipId,
        });

      const anotherAppointment =
        createAppointment({
          organizationId,
        });

      await repository.create(
        expectedAppointment,
      );

      await repository.create(
        anotherAppointment,
      );

      const result =
        await repository.listByOrganization(
          organizationId,
          {
            professionalMembershipId,
          },
        );

      expect(result).toEqual([
        expectedAppointment,
      ]);
    });

    it('filters appointments by status', async () => {
      const organizationId =
        randomUUID();

      const confirmedAppointment =
        createAppointment({
          organizationId,
          status:
            AppointmentStatus.CONFIRMED,
        });

      const scheduledAppointment =
        createAppointment({
          organizationId,
          status:
            AppointmentStatus.SCHEDULED,
        });

      await repository.create(
        confirmedAppointment,
      );

      await repository.create(
        scheduledAppointment,
      );

      const result =
        await repository.listByOrganization(
          organizationId,
          {
            status:
              AppointmentStatus.CONFIRMED,
          },
        );

      expect(result).toEqual([
        confirmedAppointment,
      ]);
    });

    it('filters appointments by scheduled date range', async () => {
      const organizationId =
        randomUUID();

      const beforeRange =
        createAppointment({
          organizationId,
          scheduledAt:
            '2026-08-09T08:00:00.000Z',
        });

      const insideRange =
        createAppointment({
          organizationId,
          scheduledAt:
            '2026-08-10T10:00:00.000Z',
        });

      const afterRange =
        createAppointment({
          organizationId,
          scheduledAt:
            '2026-08-11T18:00:00.000Z',
        });

      await repository.create(
        beforeRange,
      );

      await repository.create(
        insideRange,
      );

      await repository.create(
        afterRange,
      );

      const result =
        await repository.listByOrganization(
          organizationId,
          {
            scheduledFrom:
              '2026-08-10T00:00:00.000Z',
            scheduledTo:
              '2026-08-10T23:59:59.999Z',
          },
        );

      expect(result).toEqual([
        insideRange,
      ]);
    });

    it('lists blocking appointments for a professional inside a period', async () => {
      const organizationId =
        randomUUID();

      const professionalMembershipId =
        randomUUID();

      const firstAppointment =
        createAppointment({
          organizationId,
          professionalMembershipId,
          scheduledAt:
            '2026-08-10T12:00:00.000Z',
        });

      const secondAppointment =
        createAppointment({
          organizationId,
          professionalMembershipId,
          scheduledAt:
            '2026-08-10T15:00:00.000Z',
          status:
            AppointmentStatus.CONFIRMED,
        });

      await repository.create(
        secondAppointment,
      );

      await repository.create(
        firstAppointment,
      );

      const result =
        await repository.listBlockingProfessionalAppointments(
          {
            organizationId,
            professionalMembershipId,
            scheduledFrom:
              '2026-08-10T00:00:00.000Z',
            scheduledTo:
              '2026-08-11T00:00:00.000Z',
          },
        );

      expect(result).toEqual([
        firstAppointment,
        secondAppointment,
      ]);
    });

    it('ignores cancelled and no-show appointments when listing blocking periods', async () => {
      const organizationId =
        randomUUID();

      const professionalMembershipId =
        randomUUID();

      const activeAppointment =
        createAppointment({
          organizationId,
          professionalMembershipId,
          scheduledAt:
            '2026-08-10T12:00:00.000Z',
        });

      const cancelledAppointment =
        createAppointment({
          organizationId,
          professionalMembershipId,
          scheduledAt:
            '2026-08-10T14:00:00.000Z',
          status:
            AppointmentStatus.CANCELLED,
          cancelledAt:
            '2026-08-01T12:00:00.000Z',
          cancellationReason:
            'Patient cancelled.',
        });

      const noShowAppointment =
        createAppointment({
          organizationId,
          professionalMembershipId,
          scheduledAt:
            '2026-08-10T16:00:00.000Z',
          status:
            AppointmentStatus.NO_SHOW,
        });

      await repository.create(
        activeAppointment,
      );

      await repository.create(
        cancelledAppointment,
      );

      await repository.create(
        noShowAppointment,
      );

      const result =
        await repository.listBlockingProfessionalAppointments(
          {
            organizationId,
            professionalMembershipId,
            scheduledFrom:
              '2026-08-10T00:00:00.000Z',
            scheduledTo:
              '2026-08-11T00:00:00.000Z',
          },
        );

      expect(result).toEqual([
        activeAppointment,
      ]);
    });

    it('isolates blocking appointments by organization and professional', async () => {
      const organizationId =
        randomUUID();

      const professionalMembershipId =
        randomUUID();

      const expectedAppointment =
        createAppointment({
          organizationId,
          professionalMembershipId,
          scheduledAt:
            '2026-08-10T12:00:00.000Z',
        });

      await repository.create(
        expectedAppointment,
      );

      await repository.create(
        createAppointment({
          organizationId:
            randomUUID(),
          professionalMembershipId,
          scheduledAt:
            '2026-08-10T13:00:00.000Z',
        }),
      );

      await repository.create(
        createAppointment({
          organizationId,
          professionalMembershipId:
            randomUUID(),
          scheduledAt:
            '2026-08-10T14:00:00.000Z',
        }),
      );

      const result =
        await repository.listBlockingProfessionalAppointments(
          {
            organizationId,
            professionalMembershipId,
            scheduledFrom:
              '2026-08-10T00:00:00.000Z',
            scheduledTo:
              '2026-08-11T00:00:00.000Z',
          },
        );

      expect(result).toEqual([
        expectedAppointment,
      ]);
    });

    it('uses an exclusive upper boundary when listing blocking appointments', async () => {
      const organizationId =
        randomUUID();

      const professionalMembershipId =
        randomUUID();

      const insidePeriod =
        createAppointment({
          organizationId,
          professionalMembershipId,
          scheduledAt:
            '2026-08-10T23:59:59.999Z',
        });

      const atNextPeriod =
        createAppointment({
          organizationId,
          professionalMembershipId,
          scheduledAt:
            '2026-08-11T00:00:00.000Z',
        });

      await repository.create(
        insidePeriod,
      );

      await repository.create(
        atNextPeriod,
      );

      const result =
        await repository.listBlockingProfessionalAppointments(
          {
            organizationId,
            professionalMembershipId,
            scheduledFrom:
              '2026-08-10T00:00:00.000Z',
            scheduledTo:
              '2026-08-11T00:00:00.000Z',
          },
        );

      expect(result).toEqual([
        insidePeriod,
      ]);
    });

    it('finds a schedule conflict for the same professional', async () => {
      const organizationId =
        randomUUID();

      const professionalMembershipId =
        randomUUID();

      const appointment =
        createAppointment({
          organizationId,
          professionalMembershipId,
          scheduledAt:
            '2026-08-10T14:00:00.000Z',
          durationMinutes: 60,
        });

      await repository.create(
        appointment,
      );

      const conflict =
        await repository.findScheduleConflict(
          {
            organizationId,
            professionalMembershipId,
            scheduledStart:
              '2026-08-10T14:30:00.000Z',
            scheduledEnd:
              '2026-08-10T15:30:00.000Z',
          },
        );

      expect(conflict).toEqual(
        appointment,
      );
    });

    it('does not report conflict for adjacent appointments', async () => {
      const organizationId =
        randomUUID();

      const professionalMembershipId =
        randomUUID();

      await repository.create(
        createAppointment({
          organizationId,
          professionalMembershipId,
          scheduledAt:
            '2026-08-10T14:00:00.000Z',
          durationMinutes: 60,
        }),
      );

      const conflict =
        await repository.findScheduleConflict(
          {
            organizationId,
            professionalMembershipId,
            scheduledStart:
              '2026-08-10T15:00:00.000Z',
            scheduledEnd:
              '2026-08-10T16:00:00.000Z',
          },
        );

      expect(conflict).toBeNull();
    });

    it('ignores cancelled appointments when checking conflicts', async () => {
      const organizationId =
        randomUUID();

      const professionalMembershipId =
        randomUUID();

      await repository.create(
        createAppointment({
          organizationId,
          professionalMembershipId,
          status:
            AppointmentStatus.CANCELLED,
          scheduledAt:
            '2026-08-10T14:00:00.000Z',
          durationMinutes: 60,
          cancelledAt:
            '2026-08-01T12:00:00.000Z',
          cancellationReason:
            'Patient cancelled.',
        }),
      );

      const conflict =
        await repository.findScheduleConflict(
          {
            organizationId,
            professionalMembershipId,
            scheduledStart:
              '2026-08-10T14:30:00.000Z',
            scheduledEnd:
              '2026-08-10T15:30:00.000Z',
          },
        );

      expect(conflict).toBeNull();
    });

    it('ignores no-show appointments when checking conflicts', async () => {
      const organizationId =
        randomUUID();

      const professionalMembershipId =
        randomUUID();

      await repository.create(
        createAppointment({
          organizationId,
          professionalMembershipId,
          status:
            AppointmentStatus.NO_SHOW,
          scheduledAt:
            '2026-08-10T14:00:00.000Z',
          durationMinutes: 60,
        }),
      );

      const conflict =
        await repository.findScheduleConflict(
          {
            organizationId,
            professionalMembershipId,
            scheduledStart:
              '2026-08-10T14:30:00.000Z',
            scheduledEnd:
              '2026-08-10T15:30:00.000Z',
          },
        );

      expect(conflict).toBeNull();
    });

    it('does not report conflict for another professional', async () => {
      const organizationId =
        randomUUID();

      const firstProfessionalMembershipId =
        randomUUID();

      const secondProfessionalMembershipId =
        randomUUID();

      await repository.create(
        createAppointment({
          organizationId,
          professionalMembershipId:
            firstProfessionalMembershipId,
          scheduledAt:
            '2026-08-10T14:00:00.000Z',
          durationMinutes: 60,
        }),
      );

      const conflict =
        await repository.findScheduleConflict(
          {
            organizationId,
            professionalMembershipId:
              secondProfessionalMembershipId,
            scheduledStart:
              '2026-08-10T14:30:00.000Z',
            scheduledEnd:
              '2026-08-10T15:30:00.000Z',
          },
        );

      expect(conflict).toBeNull();
    });

    it('does not report conflict for another organization', async () => {
      const professionalMembershipId =
        randomUUID();

      const storedOrganizationId =
        randomUUID();

      await repository.create(
        createAppointment({
          organizationId:
            storedOrganizationId,
          professionalMembershipId,
          scheduledAt:
            '2026-08-10T14:00:00.000Z',
          durationMinutes: 60,
        }),
      );

      const conflict =
        await repository.findScheduleConflict(
          {
            organizationId:
              randomUUID(),
            professionalMembershipId,
            scheduledStart:
              '2026-08-10T14:30:00.000Z',
            scheduledEnd:
              '2026-08-10T15:30:00.000Z',
          },
        );

      expect(conflict).toBeNull();
    });

    it('ignores the requested appointment during rescheduling', async () => {
      const appointment =
        createAppointment({
          scheduledAt:
            '2026-08-10T14:00:00.000Z',
          durationMinutes: 60,
        });

      await repository.create(
        appointment,
      );

      const conflict =
        await repository.findScheduleConflict(
          {
            organizationId:
              appointment.organizationId,
            professionalMembershipId:
              appointment
                .professionalMembershipId,
            scheduledStart:
              appointment.scheduledAt,
            scheduledEnd:
              '2026-08-10T15:00:00.000Z',
            ignoredAppointmentId:
              appointment.id,
          },
        );

      expect(conflict).toBeNull();
    });

    it('updates an appointment', async () => {
      const appointment =
        createAppointment();

      await repository.create(
        appointment,
      );

      const updatedAppointment: Appointment = {
        ...appointment,
        status:
          AppointmentStatus.CONFIRMED,
        notes:
          'Confirmed appointment.',
        updatedAt:
          '2026-08-02T12:00:00.000Z',
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
          appointment.organizationId,
          appointment.id,
        );

      expect(persisted).toEqual(
        updatedAppointment,
      );
    });

    it('throws when updating an appointment that does not exist', async () => {
      const appointment =
        createAppointment();

      await expect(
        repository.update(
          appointment,
        ),
      ).rejects.toThrow(
        'Appointment not found in memory repository.',
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
        organizationId:
          randomUUID(),
        patientId:
          randomUUID(),
        professionalMembershipId:
          randomUUID(),
        type:
          AppointmentType.INITIAL,
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
  },
);