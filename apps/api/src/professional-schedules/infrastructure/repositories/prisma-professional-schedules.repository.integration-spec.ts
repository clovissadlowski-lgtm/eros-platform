import { randomUUID } from 'node:crypto';

import { PrismaService } from '../../../common/database/prisma.service';
import {
  MembershipRole,
  MembershipStatus,
  OrganizationStatus,
  UserStatus,
} from '../../../generated/prisma/enums';
import {
  ProfessionalSchedule,
  ProfessionalScheduleStatus,
} from '../../domain/entities/professional-schedule.entity';
import { PrismaProfessionalSchedulesRepository } from './prisma-professional-schedules.repository';

describe(
  'PrismaProfessionalSchedulesRepository integration',
  () => {
    const prisma =
      new PrismaService();

    const repository =
      new PrismaProfessionalSchedulesRepository(
        prisma,
      );

    let organizationId: string;
    let userId: string;
    let professionalMembershipId: string;

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

      const timestamp =
        new Date();

      await prisma.organization.create({
        data: {
          id: organizationId,
          name:
            'Professional Schedules Integration Organization',
          slug:
            `professional-schedules-${randomUUID()}`,
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
            'Professional Schedule Nutritionist',
          email:
            `professional-schedule-${randomUUID()}@higeia.test`,
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

    it('creates and finds a professional schedule', async () => {
      const schedule =
        createSchedule();

      const created =
        await repository.create(
          schedule,
        );

      expect(created).toEqual(
        schedule,
      );

      const found =
        await repository.findById(
          organizationId,
          schedule.id,
        );

      expect(found).toEqual(
        schedule,
      );
    });

    it('finds a schedule by professional membership', async () => {
      const schedule =
        createSchedule();

      await repository.create(
        schedule,
      );

      const found =
        await repository.findByProfessional(
          organizationId,
          professionalMembershipId,
        );

      expect(found).toEqual(
        schedule,
      );
    });

    it('does not expose a schedule from another organization', async () => {
      const schedule =
        createSchedule();

      await repository.create(
        schedule,
      );

      const found =
        await repository.findById(
          randomUUID(),
          schedule.id,
        );

      expect(found).toBeNull();
    });

    it('does not find a professional schedule inside another organization', async () => {
      const schedule =
        createSchedule();

      await repository.create(
        schedule,
      );

      const found =
        await repository.findByProfessional(
          randomUUID(),
          professionalMembershipId,
        );

      expect(found).toBeNull();
    });

    it('updates a professional schedule', async () => {
      const schedule =
        createSchedule();

      await repository.create(
        schedule,
      );

      const updatedSchedule: ProfessionalSchedule = {
        ...schedule,
        timeZone:
          'America/Manaus',
        slotIntervalMinutes: 15,
        status:
          ProfessionalScheduleStatus.INACTIVE,
        updatedAt:
          '2026-08-02T12:00:00.000Z',
      };

      const updated =
        await repository.update(
          updatedSchedule,
        );

      expect(updated).toEqual(
        updatedSchedule,
      );

      const persisted =
        await repository.findById(
          organizationId,
          schedule.id,
        );

      expect(persisted).toEqual(
        updatedSchedule,
      );
    });

    it('persists only one schedule for the same professional', async () => {
      const firstSchedule =
        createSchedule();

      const secondSchedule =
        createSchedule({
          id: randomUUID(),
        });

      await repository.create(
        firstSchedule,
      );

      await expect(
        repository.create(
          secondSchedule,
        ),
      ).rejects.toBeDefined();

      const schedules =
        await prisma.professionalSchedule.findMany({
          where: {
            organizationId,
            professionalMembershipId,
          },
        });

      expect(schedules).toHaveLength(
        1,
      );
    });

    function createSchedule(
      overrides:
        Partial<ProfessionalSchedule> = {},
    ): ProfessionalSchedule {
      const timestamp =
        '2026-08-01T12:00:00.000Z';

      return {
        id: randomUUID(),
        organizationId,
        professionalMembershipId,
        timeZone:
          'America/Sao_Paulo',
        slotIntervalMinutes: 30,
        status:
          ProfessionalScheduleStatus.ACTIVE,
        createdAt: timestamp,
        updatedAt: timestamp,
        ...overrides,
      };
    }
  },
);