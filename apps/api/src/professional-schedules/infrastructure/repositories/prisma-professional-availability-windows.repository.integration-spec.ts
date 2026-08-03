import { randomUUID } from 'node:crypto';

import { PrismaService } from '../../../common/database/prisma.service';
import {
  MembershipRole,
  MembershipStatus,
  OrganizationStatus,
  ProfessionalScheduleStatus as PrismaProfessionalScheduleStatus,
  UserStatus,
  Weekday as PrismaWeekday,
} from '../../../generated/prisma/enums';
import {
  ProfessionalAvailabilityWindow,
  Weekday,
} from '../../domain/entities/professional-availability-window.entity';
import { PrismaProfessionalAvailabilityWindowsRepository } from './prisma-professional-availability-windows.repository';

describe(
  'PrismaProfessionalAvailabilityWindowsRepository integration',
  () => {
    const prisma =
      new PrismaService();

    const repository =
      new PrismaProfessionalAvailabilityWindowsRepository(
        prisma,
      );

    let organizationId: string;
    let userId: string;
    let professionalMembershipId: string;
    let professionalScheduleId: string;

    beforeAll(async () => {
      await prisma.$connect();
    });

    beforeEach(async () => {
      organizationId =
        randomUUID();

      userId =
        randomUUID();

      professionalMembershipId =
        randomUUID();

      professionalScheduleId =
        randomUUID();

      const timestamp =
        new Date();

      await prisma.organization.create({
        data: {
          id: organizationId,
          name:
            'Availability Windows Integration Organization',
          slug:
            `availability-windows-${randomUUID()}`,
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
            'Availability Windows Nutritionist',
          email:
            `availability-windows-${randomUUID()}@higeia.test`,
          passwordHash: null,
          status:
            UserStatus.ACTIVE,
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

      await prisma.professionalSchedule.create({
        data: {
          id:
            professionalScheduleId,
          organizationId,
          professionalMembershipId,
          timeZone:
            'America/Sao_Paulo',
          slotIntervalMinutes: 30,
          status:
            PrismaProfessionalScheduleStatus.ACTIVE,
          createdAt: timestamp,
          updatedAt: timestamp,
        },
      });
    });

    afterEach(async () => {
      await prisma.professionalAvailabilityWindow.deleteMany({
        where: {
          organizationId,
        },
      });

      await prisma.professionalSchedule.deleteMany({
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

    it('creates and lists availability windows', async () => {
      const mondayMorning =
        createWindow({
          weekday:
            Weekday.MONDAY,
          startMinute: 480,
          endMinute: 720,
        });

      const mondayAfternoon =
        createWindow({
          weekday:
            Weekday.MONDAY,
          startMinute: 810,
          endMinute: 1080,
        });

      const created =
        await repository.createMany([
          mondayAfternoon,
          mondayMorning,
        ]);

      expect(created).toEqual([
        mondayMorning,
        mondayAfternoon,
      ]);

      const persisted =
        await repository.listBySchedule(
          organizationId,
          professionalScheduleId,
        );

      expect(persisted).toEqual([
        mondayMorning,
        mondayAfternoon,
      ]);
    });

    it('orders windows by weekday and start time', async () => {
      const tuesdayAfternoon =
        createWindow({
          weekday:
            Weekday.TUESDAY,
          startMinute: 780,
          endMinute: 1020,
        });

      const mondayAfternoon =
        createWindow({
          weekday:
            Weekday.MONDAY,
          startMinute: 810,
          endMinute: 1080,
        });

      const mondayMorning =
        createWindow({
          weekday:
            Weekday.MONDAY,
          startMinute: 480,
          endMinute: 720,
        });

      await repository.createMany([
        tuesdayAfternoon,
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
        tuesdayAfternoon,
      ]);
    });

    it('lists windows only for the requested weekday', async () => {
      const mondayWindow =
        createWindow({
          weekday:
            Weekday.MONDAY,
        });

      const tuesdayWindow =
        createWindow({
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
          professionalScheduleId,
        );

      expect(result).toEqual([]);
    });

    it('replaces all availability windows transactionally', async () => {
      const originalWindow =
        createWindow({
          weekday:
            Weekday.MONDAY,
          startMinute: 480,
          endMinute: 720,
        });

      await repository.createMany([
        originalWindow,
      ]);

      const tuesdayMorning =
        createWindow({
          id: randomUUID(),
          weekday:
            Weekday.TUESDAY,
          startMinute: 540,
          endMinute: 720,
        });

      const tuesdayAfternoon =
        createWindow({
          id: randomUUID(),
          weekday:
            Weekday.TUESDAY,
          startMinute: 780,
          endMinute: 1020,
        });

      const replaced =
        await repository.replaceForSchedule(
          organizationId,
          professionalScheduleId,
          [
            tuesdayAfternoon,
            tuesdayMorning,
          ],
        );

      expect(replaced).toEqual([
        tuesdayMorning,
        tuesdayAfternoon,
      ]);

      const persisted =
        await repository.listBySchedule(
          organizationId,
          professionalScheduleId,
        );

      expect(persisted).toEqual([
        tuesdayMorning,
        tuesdayAfternoon,
      ]);

      const originalStored =
        await prisma.professionalAvailabilityWindow.findUnique({
          where: {
            id: originalWindow.id,
          },
        });

      expect(
        originalStored,
      ).toBeNull();
    });

    it('clears the schedule when replacing with an empty list', async () => {
      const window =
        createWindow();

      await repository.createMany([
        window,
      ]);

      const result =
        await repository.replaceForSchedule(
          organizationId,
          professionalScheduleId,
          [],
        );

      expect(result).toEqual([]);

      const persisted =
        await repository.listBySchedule(
          organizationId,
          professionalScheduleId,
        );

      expect(persisted).toEqual([]);
    });

    it('deletes availability windows when the schedule is deleted', async () => {
      const window =
        createWindow();

      await repository.createMany([
        window,
      ]);

      await prisma.professionalSchedule.delete({
        where: {
          id:
            professionalScheduleId,
        },
      });

      const persistedWindow =
        await prisma.professionalAvailabilityWindow.findUnique({
          where: {
            id: window.id,
          },
        });

      expect(
        persistedWindow,
      ).toBeNull();
    });

    function createWindow(
      overrides:
        Partial<ProfessionalAvailabilityWindow> = {},
    ): ProfessionalAvailabilityWindow {
      const timestamp =
        '2026-08-01T12:00:00.000Z';

      return {
        id: randomUUID(),
        organizationId,
        professionalScheduleId,
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