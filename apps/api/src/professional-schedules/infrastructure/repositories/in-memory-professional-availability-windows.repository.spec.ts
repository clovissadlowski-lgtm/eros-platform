import { randomUUID } from 'node:crypto';

import {
  ProfessionalAvailabilityWindow,
  Weekday,
} from '../../domain/entities/professional-availability-window.entity';
import { InMemoryProfessionalAvailabilityWindowsRepository } from './in-memory-professional-availability-windows.repository';

describe(
  'InMemoryProfessionalAvailabilityWindowsRepository',
  () => {
    let repository:
      InMemoryProfessionalAvailabilityWindowsRepository;

    beforeEach(() => {
      repository =
        new InMemoryProfessionalAvailabilityWindowsRepository();
    });

    it('creates and lists windows by schedule', async () => {
      const organizationId =
        randomUUID();

      const professionalScheduleId =
        randomUUID();

      const mondayMorning =
        createWindow({
          organizationId,
          professionalScheduleId,
          weekday:
            Weekday.MONDAY,
          startMinute: 480,
          endMinute: 720,
        });

      const mondayAfternoon =
        createWindow({
          organizationId,
          professionalScheduleId,
          weekday:
            Weekday.MONDAY,
          startMinute: 810,
          endMinute: 1080,
        });

      await repository.createMany([
        mondayAfternoon,
        mondayMorning,
      ]);

      const result =
        await repository.listBySchedule(
          organizationId,
          professionalScheduleId,
        );

      expect(result).toEqual([
        mondayMorning,
        mondayAfternoon,
      ]);
    });

    it('lists windows by weekday', async () => {
      const organizationId =
        randomUUID();

      const professionalScheduleId =
        randomUUID();

      const mondayWindow =
        createWindow({
          organizationId,
          professionalScheduleId,
          weekday:
            Weekday.MONDAY,
        });

      const tuesdayWindow =
        createWindow({
          organizationId,
          professionalScheduleId,
          weekday:
            Weekday.TUESDAY,
        });

      await repository.createMany([
        mondayWindow,
        tuesdayWindow,
      ]);

      const result =
        await repository.listByScheduleAndWeekday(
          organizationId,
          professionalScheduleId,
          Weekday.MONDAY,
        );

      expect(result).toEqual([
        mondayWindow,
      ]);
    });

    it('does not expose windows from another organization', async () => {
      const window =
        createWindow();

      await repository.createMany([
        window,
      ]);

      const result =
        await repository.listBySchedule(
          randomUUID(),
          window.professionalScheduleId,
        );

      expect(result).toEqual([]);
    });

    it('replaces all windows for a schedule', async () => {
      const organizationId =
        randomUUID();

      const professionalScheduleId =
        randomUUID();

      await repository.createMany([
        createWindow({
          organizationId,
          professionalScheduleId,
          weekday:
            Weekday.MONDAY,
          startMinute: 480,
          endMinute: 720,
        }),
      ]);

      const replacementWindows = [
        createWindow({
          organizationId,
          professionalScheduleId,
          weekday:
            Weekday.TUESDAY,
          startMinute: 540,
          endMinute: 720,
        }),
        createWindow({
          organizationId,
          professionalScheduleId,
          weekday:
            Weekday.TUESDAY,
          startMinute: 780,
          endMinute: 1020,
        }),
      ];

      const result =
        await repository.replaceForSchedule(
          organizationId,
          professionalScheduleId,
          replacementWindows,
        );

      expect(result).toEqual(
        replacementWindows,
      );

      const persisted =
        await repository.listBySchedule(
          organizationId,
          professionalScheduleId,
        );

      expect(persisted).toEqual(
        replacementWindows,
      );
    });

    it('clears the schedule when replaced with an empty list', async () => {
      const window =
        createWindow();

      await repository.createMany([
        window,
      ]);

      const result =
        await repository.replaceForSchedule(
          window.organizationId,
          window.professionalScheduleId,
          [],
        );

      expect(result).toEqual([]);

      const persisted =
        await repository.listBySchedule(
          window.organizationId,
          window.professionalScheduleId,
        );

      expect(persisted).toEqual([]);
    });

    function createWindow(
      overrides:
        Partial<ProfessionalAvailabilityWindow> = {},
    ): ProfessionalAvailabilityWindow {
      const timestamp =
        '2026-08-01T12:00:00.000Z';

      return {
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
    }
  },
);