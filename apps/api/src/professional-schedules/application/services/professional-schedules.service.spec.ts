import { randomUUID } from 'node:crypto';

import {
  Membership,
  MembershipRole,
  MembershipStatus,
} from '../../../users/domain/entities/membership.entity';
import { InMemoryMembershipsRepository } from '../../../users/infrastructure/repositories/in-memory-memberships.repository';
import {
  Weekday,
} from '../../domain/entities/professional-availability-window.entity';
import {
  ProfessionalScheduleStatus,
} from '../../domain/entities/professional-schedule.entity';
import { InvalidAvailabilityWindowError } from '../../domain/errors/invalid-availability-window.error';
import { InvalidSlotIntervalError } from '../../domain/errors/invalid-slot-interval.error';
import { InvalidTimeZoneError } from '../../domain/errors/invalid-time-zone.error';
import { OverlappingAvailabilityWindowError } from '../../domain/errors/overlapping-availability-window.error';
import { ProfessionalScheduleAlreadyExistsError } from '../../domain/errors/professional-schedule-already-exists.error';
import { ProfessionalScheduleNotFoundError } from '../../domain/errors/professional-schedule-not-found.error';
import { InMemoryProfessionalAvailabilityWindowsRepository } from '../../infrastructure/repositories/in-memory-professional-availability-windows.repository';
import { InMemoryProfessionalSchedulesRepository } from '../../infrastructure/repositories/in-memory-professional-schedules.repository';
import { ProfessionalSchedulesService } from './professional-schedules.service';

describe(
  'ProfessionalSchedulesService',
  () => {
    let schedulesRepository:
      InMemoryProfessionalSchedulesRepository;

    let windowsRepository:
      InMemoryProfessionalAvailabilityWindowsRepository;

    let membershipsRepository:
      InMemoryMembershipsRepository;

    let service:
      ProfessionalSchedulesService;

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

      membershipsRepository =
        new InMemoryMembershipsRepository();

      service =
        new ProfessionalSchedulesService(
          schedulesRepository,
          windowsRepository,
          membershipsRepository,
        );
    });

    afterEach(() => {
      jest.useRealTimers();
    });

    it('creates a schedule for an active clinical professional', async () => {
      const organizationId =
        randomUUID();

      const membership =
        createMembership({
          organizationId,
        });

      await membershipsRepository.create(
        membership,
      );

      const schedule =
        await service.createSchedule(
          organizationId,
          {
            professionalMembershipId:
              membership.id,
            timeZone:
              'America/Sao_Paulo',
            slotIntervalMinutes: 30,
          },
        );

      expect(schedule).toMatchObject({
        organizationId,
        professionalMembershipId:
          membership.id,
        timeZone:
          'America/Sao_Paulo',
        slotIntervalMinutes: 30,
        status:
          ProfessionalScheduleStatus.ACTIVE,
      });

      expect(schedule.createdAt).toBe(
        '2026-08-01T12:00:00.000Z',
      );
    });

    it('rejects a duplicate schedule for the same professional', async () => {
      const organizationId =
        randomUUID();

      const membership =
        createMembership({
          organizationId,
        });

      await membershipsRepository.create(
        membership,
      );

      await service.createSchedule(
        organizationId,
        {
          professionalMembershipId:
            membership.id,
          timeZone:
            'America/Sao_Paulo',
          slotIntervalMinutes: 30,
        },
      );

      await expect(
        service.createSchedule(
          organizationId,
          {
            professionalMembershipId:
              membership.id,
            timeZone:
              'America/Sao_Paulo',
            slotIntervalMinutes: 30,
          },
        ),
      ).rejects.toBeInstanceOf(
        ProfessionalScheduleAlreadyExistsError,
      );
    });

    it('rejects an assistant as a clinical professional', async () => {
      const organizationId =
        randomUUID();

      const assistant =
        createMembership({
          organizationId,
          role:
            MembershipRole.ASSISTANT,
        });

      await membershipsRepository.create(
        assistant,
      );

      await expect(
        service.createSchedule(
          organizationId,
          {
            professionalMembershipId:
              assistant.id,
            timeZone:
              'America/Sao_Paulo',
            slotIntervalMinutes: 30,
          },
        ),
      ).rejects.toBeInstanceOf(
        ProfessionalScheduleNotFoundError,
      );
    });

    it('rejects a professional from another organization', async () => {
      const membership =
        createMembership();

      await membershipsRepository.create(
        membership,
      );

      await expect(
        service.createSchedule(
          randomUUID(),
          {
            professionalMembershipId:
              membership.id,
            timeZone:
              'America/Sao_Paulo',
            slotIntervalMinutes: 30,
          },
        ),
      ).rejects.toBeInstanceOf(
        ProfessionalScheduleNotFoundError,
      );
    });

    it('rejects an invalid time zone', async () => {
      const organizationId =
        randomUUID();

      const membership =
        createMembership({
          organizationId,
        });

      await membershipsRepository.create(
        membership,
      );

      await expect(
        service.createSchedule(
          organizationId,
          {
            professionalMembershipId:
              membership.id,
            timeZone:
              'Invalid/Time_Zone',
            slotIntervalMinutes: 30,
          },
        ),
      ).rejects.toBeInstanceOf(
        InvalidTimeZoneError,
      );
    });

    it('rejects an invalid slot interval', async () => {
      const organizationId =
        randomUUID();

      const membership =
        createMembership({
          organizationId,
        });

      await membershipsRepository.create(
        membership,
      );

      await expect(
        service.createSchedule(
          organizationId,
          {
            professionalMembershipId:
              membership.id,
            timeZone:
              'America/Sao_Paulo',
            slotIntervalMinutes: 3,
          },
        ),
      ).rejects.toBeInstanceOf(
        InvalidSlotIntervalError,
      );
    });

    it('gets the schedule with its availability windows', async () => {
      const context =
        await prepareSchedule();

      await service.replaceAvailability(
        context.organizationId,
        context.scheduleId,
        [
          {
            weekday:
              Weekday.MONDAY,
            startMinute: 480,
            endMinute: 720,
          },
          {
            weekday:
              Weekday.MONDAY,
            startMinute: 810,
            endMinute: 1080,
          },
        ],
      );

      const result =
        await service.getScheduleById(
          context.organizationId,
          context.scheduleId,
        );

      expect(result.schedule.id).toBe(
        context.scheduleId,
      );

      expect(
        result.availabilityWindows,
      ).toHaveLength(2);
    });

    it('updates schedule settings', async () => {
      const context =
        await prepareSchedule();

      const updated =
        await service.updateSchedule(
          context.organizationId,
          context.scheduleId,
          {
            timeZone:
              'America/Manaus',
            slotIntervalMinutes: 15,
            status:
              ProfessionalScheduleStatus.INACTIVE,
          },
        );

      expect(updated).toMatchObject({
        id: context.scheduleId,
        timeZone:
          'America/Manaus',
        slotIntervalMinutes: 15,
        status:
          ProfessionalScheduleStatus.INACTIVE,
      });
    });

    it('replaces and orders weekly availability', async () => {
      const context =
        await prepareSchedule();

      const windows =
        await service.replaceAvailability(
          context.organizationId,
          context.scheduleId,
          [
            {
              weekday:
                Weekday.TUESDAY,
              startMinute: 780,
              endMinute: 1020,
            },
            {
              weekday:
                Weekday.MONDAY,
              startMinute: 810,
              endMinute: 1080,
            },
            {
              weekday:
                Weekday.MONDAY,
              startMinute: 480,
              endMinute: 720,
            },
          ],
        );

      expect(
        windows.map(
          (window) => ({
            weekday:
              window.weekday,
            startMinute:
              window.startMinute,
          }),
        ),
      ).toEqual([
        {
          weekday:
            Weekday.MONDAY,
          startMinute: 480,
        },
        {
          weekday:
            Weekday.MONDAY,
          startMinute: 810,
        },
        {
          weekday:
            Weekday.TUESDAY,
          startMinute: 780,
        },
      ]);
    });

    it('allows adjacent availability windows', async () => {
      const context =
        await prepareSchedule();

      const windows =
        await service.replaceAvailability(
          context.organizationId,
          context.scheduleId,
          [
            {
              weekday:
                Weekday.MONDAY,
              startMinute: 480,
              endMinute: 720,
            },
            {
              weekday:
                Weekday.MONDAY,
              startMinute: 720,
              endMinute: 900,
            },
          ],
        );

      expect(windows).toHaveLength(2);
    });

    it('rejects overlapping availability windows', async () => {
      const context =
        await prepareSchedule();

      await expect(
        service.replaceAvailability(
          context.organizationId,
          context.scheduleId,
          [
            {
              weekday:
                Weekday.MONDAY,
              startMinute: 480,
              endMinute: 720,
            },
            {
              weekday:
                Weekday.MONDAY,
              startMinute: 660,
              endMinute: 840,
            },
          ],
        ),
      ).rejects.toBeInstanceOf(
        OverlappingAvailabilityWindowError,
      );
    });

    it('rejects a window with inverted times', async () => {
      const context =
        await prepareSchedule();

      await expect(
        service.replaceAvailability(
          context.organizationId,
          context.scheduleId,
          [
            {
              weekday:
                Weekday.MONDAY,
              startMinute: 720,
              endMinute: 480,
            },
          ],
        ),
      ).rejects.toBeInstanceOf(
        InvalidAvailabilityWindowError,
      );
    });

    it('rejects minutes outside the daily range', async () => {
      const context =
        await prepareSchedule();

      await expect(
        service.replaceAvailability(
          context.organizationId,
          context.scheduleId,
          [
            {
              weekday:
                Weekday.MONDAY,
              startMinute: -1,
              endMinute: 480,
            },
          ],
        ),
      ).rejects.toBeInstanceOf(
        InvalidAvailabilityWindowError,
      );

      await expect(
        service.replaceAvailability(
          context.organizationId,
          context.scheduleId,
          [
            {
              weekday:
                Weekday.MONDAY,
              startMinute: 480,
              endMinute: 1441,
            },
          ],
        ),
      ).rejects.toBeInstanceOf(
        InvalidAvailabilityWindowError,
      );
    });

    it('lists availability only for the requested weekday', async () => {
      const context =
        await prepareSchedule();

      await service.replaceAvailability(
        context.organizationId,
        context.scheduleId,
        [
          {
            weekday:
              Weekday.MONDAY,
            startMinute: 480,
            endMinute: 720,
          },
          {
            weekday:
              Weekday.TUESDAY,
            startMinute: 540,
            endMinute: 720,
          },
        ],
      );

      const mondayWindows =
        await service.listAvailabilityForWeekday(
          context.organizationId,
          context.scheduleId,
          Weekday.MONDAY,
        );

      expect(mondayWindows).toHaveLength(
        1,
      );

      expect(
        mondayWindows[0].weekday,
      ).toBe(
        Weekday.MONDAY,
      );
    });

    it('throws when the schedule does not exist', async () => {
      await expect(
        service.getScheduleById(
          randomUUID(),
          randomUUID(),
        ),
      ).rejects.toBeInstanceOf(
        ProfessionalScheduleNotFoundError,
      );
    });

    async function prepareSchedule(): Promise<{
      organizationId: string;
      scheduleId: string;
    }> {
      const organizationId =
        randomUUID();

      const membership =
        createMembership({
          organizationId,
        });

      await membershipsRepository.create(
        membership,
      );

      const schedule =
        await service.createSchedule(
          organizationId,
          {
            professionalMembershipId:
              membership.id,
            timeZone:
              'America/Sao_Paulo',
            slotIntervalMinutes: 30,
          },
        );

      return {
        organizationId,
        scheduleId:
          schedule.id,
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