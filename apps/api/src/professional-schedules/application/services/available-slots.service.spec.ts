import { randomUUID } from 'node:crypto';

import {
  Appointment,
  AppointmentStatus,
  AppointmentType,
} from '../../../appointments/domain/entities/appointment.entity';
import { InMemoryAppointmentsRepository } from '../../../appointments/infrastructure/repositories/in-memory-appointments.repository';
import {
  ProfessionalScheduleBlock,
  ProfessionalScheduleBlockType,
} from '../../domain/entities/professional-schedule-block.entity';
import {
  ProfessionalAvailabilityWindow,
  Weekday,
} from '../../domain/entities/professional-availability-window.entity';
import {
  ProfessionalSchedule,
  ProfessionalScheduleStatus,
} from '../../domain/entities/professional-schedule.entity';
import { InvalidAvailabilityDateError } from '../../domain/errors/invalid-availability-date.error';
import { InvalidSlotDurationError } from '../../domain/errors/invalid-slot-duration.error';
import { ProfessionalScheduleNotFoundError } from '../../domain/errors/professional-schedule-not-found.error';
import { InMemoryProfessionalAvailabilityWindowsRepository } from '../../infrastructure/repositories/in-memory-professional-availability-windows.repository';
import { InMemoryProfessionalScheduleBlocksRepository } from '../../infrastructure/repositories/in-memory-professional-schedule-blocks.repository';
import { InMemoryProfessionalSchedulesRepository } from '../../infrastructure/repositories/in-memory-professional-schedules.repository';
import { AvailableSlotsService } from './available-slots.service';

describe(
  'AvailableSlotsService',
  () => {
    let schedulesRepository:
      InMemoryProfessionalSchedulesRepository;

    let windowsRepository:
      InMemoryProfessionalAvailabilityWindowsRepository;

    let appointmentsRepository:
      InMemoryAppointmentsRepository;

    let blocksRepository:
      InMemoryProfessionalScheduleBlocksRepository;

    let service:
      AvailableSlotsService;

    beforeEach(() => {
      jest.useFakeTimers();

      jest.setSystemTime(
        new Date(
          '2026-08-01T12:00:00.000Z',
        ),
      );

      schedulesRepository =
        new InMemoryProfessionalSchedulesRepository();

      windowsRepository =
        new InMemoryProfessionalAvailabilityWindowsRepository();

      appointmentsRepository =
        new InMemoryAppointmentsRepository();

      blocksRepository =
        new InMemoryProfessionalScheduleBlocksRepository();

      service =
        new AvailableSlotsService(
          schedulesRepository,
          windowsRepository,
          appointmentsRepository,
          blocksRepository,
        );
    });

    afterEach(() => {
      jest.useRealTimers();
    });

    it('generates available slots for the requested weekday', async () => {
      const context =
        await prepareSchedule();

      await createWindow({
        organizationId:
          context.organizationId,
        professionalScheduleId:
          context.schedule.id,
        weekday:
          Weekday.MONDAY,
        startMinute: 480,
        endMinute: 720,
      });

      const result =
        await service.getAvailableSlots({
          organizationId:
            context.organizationId,
          scheduleId:
            context.schedule.id,
          date: '2026-08-10',
          durationMinutes: 60,
        });

      expect(
        result.slots.map(
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
      ]);
    });

    it('removes slots that overlap an existing appointment', async () => {
      const context =
        await prepareSchedule();

      await createWindow({
        organizationId:
          context.organizationId,
        professionalScheduleId:
          context.schedule.id,
        weekday:
          Weekday.MONDAY,
        startMinute: 480,
        endMinute: 720,
      });

      await appointmentsRepository.create(
        createAppointment({
          organizationId:
            context.organizationId,
          professionalMembershipId:
            context.schedule
              .professionalMembershipId,
          scheduledAt:
            '2026-08-10T12:00:00.000Z',
          durationMinutes: 60,
        }),
      );

      const result =
        await service.getAvailableSlots({
          organizationId:
            context.organizationId,
          scheduleId:
            context.schedule.id,
          date: '2026-08-10',
          durationMinutes: 60,
        });

      expect(
        result.slots.map(
          (slot) =>
            slot.startTime,
        ),
      ).toEqual([
        '08:00',
        '10:00',
        '10:30',
        '11:00',
      ]);
    });


    it('removes slots that overlap a schedule block', async () => {
      const context =
        await prepareSchedule();

      await createWindow({
        organizationId:
          context.organizationId,
        professionalScheduleId:
          context.schedule.id,
        weekday:
          Weekday.MONDAY,
        startMinute: 480,
        endMinute: 720,
      });

      await createBlock({
        organizationId:
          context.organizationId,
        professionalScheduleId:
          context.schedule.id,
        startsAt:
          '2026-08-10T12:00:00.000Z',
        endsAt:
          '2026-08-10T13:00:00.000Z',
      });

      const result =
        await service.getAvailableSlots({
          organizationId:
            context.organizationId,
          scheduleId:
            context.schedule.id,
          date: '2026-08-10',
          durationMinutes: 60,
        });

      expect(
        result.slots.map(
          (slot) =>
            slot.startTime,
        ),
      ).toEqual([
        '08:00',
        '10:00',
        '10:30',
        '11:00',
      ]);
    });

    it('allows a slot that starts when a schedule block ends', async () => {
      const context =
        await prepareSchedule();

      await createWindow({
        organizationId:
          context.organizationId,
        professionalScheduleId:
          context.schedule.id,
        weekday:
          Weekday.MONDAY,
        startMinute: 480,
        endMinute: 600,
      });

      await createBlock({
        organizationId:
          context.organizationId,
        professionalScheduleId:
          context.schedule.id,
        startsAt:
          '2026-08-10T11:00:00.000Z',
        endsAt:
          '2026-08-10T12:00:00.000Z',
      });

      const result =
        await service.getAvailableSlots({
          organizationId:
            context.organizationId,
          scheduleId:
            context.schedule.id,
          date: '2026-08-10',
          durationMinutes: 60,
        });

      expect(
        result.slots.some(
          (slot) =>
            slot.startTime ===
            '09:00',
        ),
      ).toBe(true);
    });

    it('allows a slot that ends when a schedule block starts', async () => {
      const context =
        await prepareSchedule();

      await createWindow({
        organizationId:
          context.organizationId,
        professionalScheduleId:
          context.schedule.id,
        weekday:
          Weekday.MONDAY,
        startMinute: 480,
        endMinute: 600,
      });

      await createBlock({
        organizationId:
          context.organizationId,
        professionalScheduleId:
          context.schedule.id,
        startsAt:
          '2026-08-10T12:00:00.000Z',
        endsAt:
          '2026-08-10T13:00:00.000Z',
      });

      const result =
        await service.getAvailableSlots({
          organizationId:
            context.organizationId,
          scheduleId:
            context.schedule.id,
          date: '2026-08-10',
          durationMinutes: 60,
        });

      expect(
        result.slots.some(
          (slot) =>
            slot.startTime ===
            '08:00',
        ),
      ).toBe(true);
    });

    it('ignores schedule blocks from another schedule', async () => {
      const context =
        await prepareSchedule();

      await createWindow({
        organizationId:
          context.organizationId,
        professionalScheduleId:
          context.schedule.id,
        weekday:
          Weekday.MONDAY,
        startMinute: 480,
        endMinute: 600,
      });

      await createBlock({
        organizationId:
          context.organizationId,
        professionalScheduleId:
          randomUUID(),
        startsAt:
          '2026-08-10T11:00:00.000Z',
        endsAt:
          '2026-08-10T13:00:00.000Z',
      });

      const result =
        await service.getAvailableSlots({
          organizationId:
            context.organizationId,
          scheduleId:
            context.schedule.id,
          date: '2026-08-10',
          durationMinutes: 60,
        });

      expect(
        result.slots.map(
          (slot) =>
            slot.startTime,
        ),
      ).toEqual([
        '08:00',
        '08:30',
        '09:00',
      ]);
    });

    it('ignores schedule blocks from another organization', async () => {
      const context =
        await prepareSchedule();

      await createWindow({
        organizationId:
          context.organizationId,
        professionalScheduleId:
          context.schedule.id,
        weekday:
          Weekday.MONDAY,
        startMinute: 480,
        endMinute: 600,
      });

      await createBlock({
        organizationId:
          randomUUID(),
        professionalScheduleId:
          context.schedule.id,
        startsAt:
          '2026-08-10T11:00:00.000Z',
        endsAt:
          '2026-08-10T13:00:00.000Z',
      });

      const result =
        await service.getAvailableSlots({
          organizationId:
            context.organizationId,
          scheduleId:
            context.schedule.id,
          date: '2026-08-10',
          durationMinutes: 60,
        });

      expect(
        result.slots.map(
          (slot) =>
            slot.startTime,
        ),
      ).toEqual([
        '08:00',
        '08:30',
        '09:00',
      ]);
    });

    it('combines appointment and schedule-block conflicts', async () => {
      const context =
        await prepareSchedule();

      await createWindow({
        organizationId:
          context.organizationId,
        professionalScheduleId:
          context.schedule.id,
        weekday:
          Weekday.MONDAY,
        startMinute: 480,
        endMinute: 720,
      });

      await appointmentsRepository.create(
        createAppointment({
          organizationId:
            context.organizationId,
          professionalMembershipId:
            context.schedule
              .professionalMembershipId,
          scheduledAt:
            '2026-08-10T12:00:00.000Z',
          durationMinutes: 60,
        }),
      );

      await createBlock({
        organizationId:
          context.organizationId,
        professionalScheduleId:
          context.schedule.id,
        startsAt:
          '2026-08-10T14:00:00.000Z',
        endsAt:
          '2026-08-10T15:00:00.000Z',
      });

      const result =
        await service.getAvailableSlots({
          organizationId:
            context.organizationId,
          scheduleId:
            context.schedule.id,
          date: '2026-08-10',
          durationMinutes: 60,
        });

      expect(
        result.slots.map(
          (slot) =>
            slot.startTime,
        ),
      ).toEqual([
        '08:00',
        '10:00',
      ]);
    });

    it('allows a slot that starts when an appointment ends', async () => {
      const context =
        await prepareSchedule();

      await createWindow({
        organizationId:
          context.organizationId,
        professionalScheduleId:
          context.schedule.id,
        weekday:
          Weekday.MONDAY,
        startMinute: 480,
        endMinute: 720,
      });

      await appointmentsRepository.create(
        createAppointment({
          organizationId:
            context.organizationId,
          professionalMembershipId:
            context.schedule
              .professionalMembershipId,
          scheduledAt:
            '2026-08-10T11:00:00.000Z',
          durationMinutes: 60,
        }),
      );

      const result =
        await service.getAvailableSlots({
          organizationId:
            context.organizationId,
          scheduleId:
            context.schedule.id,
          date: '2026-08-10',
          durationMinutes: 60,
        });

      expect(
        result.slots.some(
          (slot) =>
            slot.startTime ===
            '09:00',
        ),
      ).toBe(true);
    });

    it('converts local slot times to UTC', async () => {
      const context =
        await prepareSchedule();

      await createWindow({
        organizationId:
          context.organizationId,
        professionalScheduleId:
          context.schedule.id,
        weekday:
          Weekday.MONDAY,
        startMinute: 480,
        endMinute: 540,
      });

      const result =
        await service.getAvailableSlots({
          organizationId:
            context.organizationId,
          scheduleId:
            context.schedule.id,
          date: '2026-08-10',
          durationMinutes: 60,
        });

      expect(
        result.slots[0],
      ).toMatchObject({
        startMinute: 480,
        endMinute: 540,
        startTime: '08:00',
        endTime: '09:00',
        startsAt:
          '2026-08-10T11:00:00.000Z',
        endsAt:
          '2026-08-10T12:00:00.000Z',
      });
    });

    it('returns no slots when the schedule is inactive', async () => {
      const context =
        await prepareSchedule({
          status:
            ProfessionalScheduleStatus.INACTIVE,
        });

      await createWindow({
        organizationId:
          context.organizationId,
        professionalScheduleId:
          context.schedule.id,
        weekday:
          Weekday.MONDAY,
      });

      const result =
        await service.getAvailableSlots({
          organizationId:
            context.organizationId,
          scheduleId:
            context.schedule.id,
          date: '2026-08-10',
          durationMinutes: 60,
        });

      expect(result.slots).toEqual(
        [],
      );
    });

    it('returns no slots when there are no windows for the weekday', async () => {
      const context =
        await prepareSchedule();

      await createWindow({
        organizationId:
          context.organizationId,
        professionalScheduleId:
          context.schedule.id,
        weekday:
          Weekday.TUESDAY,
      });

      const result =
        await service.getAvailableSlots({
          organizationId:
            context.organizationId,
          scheduleId:
            context.schedule.id,
          date: '2026-08-10',
          durationMinutes: 60,
        });

      expect(result.slots).toEqual(
        [],
      );
    });

    it('does not expose appointments from another professional', async () => {
      const context =
        await prepareSchedule();

      await createWindow({
        organizationId:
          context.organizationId,
        professionalScheduleId:
          context.schedule.id,
        weekday:
          Weekday.MONDAY,
        startMinute: 480,
        endMinute: 600,
      });

      await appointmentsRepository.create(
        createAppointment({
          organizationId:
            context.organizationId,
          professionalMembershipId:
            randomUUID(),
          scheduledAt:
            '2026-08-10T11:00:00.000Z',
          durationMinutes: 60,
        }),
      );

      const result =
        await service.getAvailableSlots({
          organizationId:
            context.organizationId,
          scheduleId:
            context.schedule.id,
          date: '2026-08-10',
          durationMinutes: 60,
        });

      expect(
        result.slots.map(
          (slot) =>
            slot.startTime,
        ),
      ).toEqual([
        '08:00',
        '08:30',
        '09:00',
      ]);
    });

    it('rejects an invalid date format', async () => {
      await expect(
        service.getAvailableSlots({
          organizationId:
            randomUUID(),
          scheduleId:
            randomUUID(),
          date: '10/08/2026',
          durationMinutes: 60,
        }),
      ).rejects.toBeInstanceOf(
        InvalidAvailabilityDateError,
      );
    });

    it('rejects a nonexistent calendar date', async () => {
      await expect(
        service.getAvailableSlots({
          organizationId:
            randomUUID(),
          scheduleId:
            randomUUID(),
          date: '2026-02-30',
          durationMinutes: 60,
        }),
      ).rejects.toBeInstanceOf(
        InvalidAvailabilityDateError,
      );
    });

    it('rejects an invalid duration', async () => {
      await expect(
        service.getAvailableSlots({
          organizationId:
            randomUUID(),
          scheduleId:
            randomUUID(),
          date: '2026-08-10',
          durationMinutes: 0,
        }),
      ).rejects.toBeInstanceOf(
        InvalidSlotDurationError,
      );
    });

    it('throws when the schedule does not exist', async () => {
      await expect(
        service.getAvailableSlots({
          organizationId:
            randomUUID(),
          scheduleId:
            randomUUID(),
          date: '2026-08-10',
          durationMinutes: 60,
        }),
      ).rejects.toBeInstanceOf(
        ProfessionalScheduleNotFoundError,
      );
    });

    async function prepareSchedule(
      overrides:
        Partial<ProfessionalSchedule> = {},
    ): Promise<{
      organizationId: string;
      schedule: ProfessionalSchedule;
    }> {
      const organizationId =
        overrides.organizationId ??
        randomUUID();

      const timestamp =
        '2026-08-01T12:00:00.000Z';

      const schedule: ProfessionalSchedule = {
        id: randomUUID(),
        organizationId,
        professionalMembershipId:
          randomUUID(),
        timeZone:
          'America/Sao_Paulo',
        slotIntervalMinutes: 30,
        status:
          ProfessionalScheduleStatus.ACTIVE,
        createdAt: timestamp,
        updatedAt: timestamp,
        ...overrides,
      };

      await schedulesRepository.create(
        schedule,
      );

      return {
        organizationId,
        schedule,
      };
    }

    async function createWindow(
      overrides:
        Partial<ProfessionalAvailabilityWindow> = {},
    ): Promise<ProfessionalAvailabilityWindow> {
      const timestamp =
        '2026-08-01T12:00:00.000Z';

      const window:
        ProfessionalAvailabilityWindow = {
          id: randomUUID(),
          organizationId:
            randomUUID(),
          professionalScheduleId:
            randomUUID(),
          weekday:
            Weekday.MONDAY,
          startMinute: 480,
          endMinute: 720,
          createdAt: timestamp,
          updatedAt: timestamp,
          ...overrides,
        };

      await windowsRepository.createMany(
        [
          window,
        ],
      );

      return window;
    }


    async function createBlock(
      overrides:
        Partial<ProfessionalScheduleBlock> = {},
    ): Promise<ProfessionalScheduleBlock> {
      const timestamp =
        '2026-08-01T12:00:00.000Z';

      const block:
        ProfessionalScheduleBlock = {
          id: randomUUID(),
          organizationId:
            randomUUID(),
          professionalScheduleId:
            randomUUID(),
          type:
            ProfessionalScheduleBlockType.PERSONAL,
          startsAt:
            '2026-08-10T12:00:00.000Z',
          endsAt:
            '2026-08-10T13:00:00.000Z',
          reason: null,
          createdAt: timestamp,
          updatedAt: timestamp,
          ...overrides,
        };

      return blocksRepository.create(
        block,
      );
    }

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
          '2026-08-10T11:00:00.000Z',
        durationMinutes: 60,
        reason: null,
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