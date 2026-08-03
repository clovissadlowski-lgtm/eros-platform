import { randomUUID } from 'node:crypto';

import { PrismaService } from '../../../common/database/prisma.service';
import {
  MembershipRole,
  MembershipStatus,
  OrganizationStatus,
  ProfessionalScheduleStatus,
  UserStatus,
} from '../../../generated/prisma/enums';
import {
  ProfessionalScheduleBlock,
  ProfessionalScheduleBlockType,
} from '../../domain/entities/professional-schedule-block.entity';
import { PrismaProfessionalScheduleBlocksRepository } from './prisma-professional-schedule-blocks.repository';

describe(
  'PrismaProfessionalScheduleBlocksRepository integration',
  () => {
    const prisma =
      new PrismaService();

    const repository =
      new PrismaProfessionalScheduleBlocksRepository(
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
            'Schedule Blocks Integration Organization',
          slug:
            `schedule-blocks-${randomUUID()}`,
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
            'Schedule Blocks Professional',
          email:
            `schedule-blocks-${randomUUID()}@higeia.test`,
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
            ProfessionalScheduleStatus.ACTIVE,
          createdAt: timestamp,
          updatedAt: timestamp,
        },
      });
    });

    afterEach(async () => {
      await prisma.professionalScheduleBlock.deleteMany({
        where: {
          organizationId,
        },
      });

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

    it('creates and finds a schedule block', async () => {
      const block =
        createBlock();

      const created =
        await repository.create(
          block,
        );

      expect(created).toEqual(
        block,
      );

      const found =
        await repository.findById(
          organizationId,
          block.id,
        );

      expect(found).toEqual(
        block,
      );
    });

    it('does not expose a block from another organization', async () => {
      const block =
        createBlock();

      await repository.create(
        block,
      );

      const found =
        await repository.findById(
          randomUUID(),
          block.id,
        );

      expect(found).toBeNull();
    });

    it('lists blocks ordered by start time', async () => {
      const laterBlock =
        createBlock({
          startsAt:
            '2026-08-10T15:00:00.000Z',
          endsAt:
            '2026-08-10T16:00:00.000Z',
        });

      const earlierBlock =
        createBlock({
          id: randomUUID(),
          startsAt:
            '2026-08-10T12:00:00.000Z',
          endsAt:
            '2026-08-10T13:00:00.000Z',
        });

      await repository.create(
        laterBlock,
      );

      await repository.create(
        earlierBlock,
      );

      const result =
        await repository.list({
          organizationId,
          professionalScheduleId,
        });

      expect(result).toEqual([
        earlierBlock,
        laterBlock,
      ]);
    });

    it('lists only blocks that overlap the requested period', async () => {
      const overlappingBeginning =
        createBlock({
          startsAt:
            '2026-08-10T09:00:00.000Z',
          endsAt:
            '2026-08-10T11:00:00.000Z',
        });

      const insidePeriod =
        createBlock({
          id: randomUUID(),
          startsAt:
            '2026-08-10T10:30:00.000Z',
          endsAt:
            '2026-08-10T11:30:00.000Z',
        });

      const overlappingEnding =
        createBlock({
          id: randomUUID(),
          startsAt:
            '2026-08-10T11:00:00.000Z',
          endsAt:
            '2026-08-10T13:00:00.000Z',
        });

      const beforePeriod =
        createBlock({
          id: randomUUID(),
          startsAt:
            '2026-08-10T08:00:00.000Z',
          endsAt:
            '2026-08-10T10:00:00.000Z',
        });

      const afterPeriod =
        createBlock({
          id: randomUUID(),
          startsAt:
            '2026-08-10T12:00:00.000Z',
          endsAt:
            '2026-08-10T13:00:00.000Z',
        });

      await repository.create(
        overlappingBeginning,
      );

      await repository.create(
        insidePeriod,
      );

      await repository.create(
        overlappingEnding,
      );

      await repository.create(
        beforePeriod,
      );

      await repository.create(
        afterPeriod,
      );

      const result =
        await repository.list({
          organizationId,
          professionalScheduleId,
          startsBefore:
            '2026-08-10T12:00:00.000Z',
          endsAfter:
            '2026-08-10T10:00:00.000Z',
        });

      expect(result).toEqual([
        overlappingBeginning,
        insidePeriod,
        overlappingEnding,
      ]);
    });

    it('finds an overlapping block', async () => {
      const block =
        createBlock({
          startsAt:
            '2026-08-10T10:00:00.000Z',
          endsAt:
            '2026-08-10T12:00:00.000Z',
        });

      await repository.create(
        block,
      );

      const conflict =
        await repository.findConflict({
          organizationId,
          professionalScheduleId,
          startsAt:
            '2026-08-10T11:00:00.000Z',
          endsAt:
            '2026-08-10T13:00:00.000Z',
        });

      expect(conflict).toEqual(
        block,
      );
    });

    it('allows adjacent blocks', async () => {
      const block =
        createBlock({
          startsAt:
            '2026-08-10T10:00:00.000Z',
          endsAt:
            '2026-08-10T12:00:00.000Z',
        });

      await repository.create(
        block,
      );

      const conflict =
        await repository.findConflict({
          organizationId,
          professionalScheduleId,
          startsAt:
            '2026-08-10T12:00:00.000Z',
          endsAt:
            '2026-08-10T13:00:00.000Z',
        });

      expect(conflict).toBeNull();
    });

    it('ignores the requested block when finding conflicts', async () => {
      const block =
        createBlock();

      await repository.create(
        block,
      );

      const conflict =
        await repository.findConflict({
          organizationId,
          professionalScheduleId,
          startsAt:
            block.startsAt,
          endsAt:
            block.endsAt,
          ignoredBlockId:
            block.id,
        });

      expect(conflict).toBeNull();
    });

    it('updates a schedule block', async () => {
      const block =
        createBlock();

      await repository.create(
        block,
      );

      const updatedBlock:
        ProfessionalScheduleBlock = {
          ...block,
          type:
            ProfessionalScheduleBlockType.MEETING,
          startsAt:
            '2026-08-10T13:00:00.000Z',
          endsAt:
            '2026-08-10T14:00:00.000Z',
          reason:
            'Team meeting.',
          updatedAt:
            '2026-08-02T12:00:00.000Z',
        };

      const updated =
        await repository.update(
          updatedBlock,
        );

      expect(updated).toEqual(
        updatedBlock,
      );

      const persisted =
        await repository.findById(
          organizationId,
          block.id,
        );

      expect(persisted).toEqual(
        updatedBlock,
      );
    });

    it('deletes a schedule block', async () => {
      const block =
        createBlock();

      await repository.create(
        block,
      );

      await repository.delete(
        organizationId,
        block.id,
      );

      const found =
        await repository.findById(
          organizationId,
          block.id,
        );

      expect(found).toBeNull();
    });

    it('does not delete a block from another organization', async () => {
      const block =
        createBlock();

      await repository.create(
        block,
      );

      await repository.delete(
        randomUUID(),
        block.id,
      );

      const found =
        await repository.findById(
          organizationId,
          block.id,
        );

      expect(found).toEqual(
        block,
      );
    });

    it('deletes blocks when the professional schedule is deleted', async () => {
      const block =
        createBlock();

      await repository.create(
        block,
      );

      await prisma.professionalSchedule.delete({
        where: {
          id:
            professionalScheduleId,
        },
      });

      const persisted =
        await prisma.professionalScheduleBlock.findUnique({
          where: {
            id: block.id,
          },
        });

      expect(persisted).toBeNull();
    });

    function createBlock(
      overrides:
        Partial<ProfessionalScheduleBlock> = {},
    ): ProfessionalScheduleBlock {
      const timestamp =
        '2026-08-01T12:00:00.000Z';

      return {
        id: randomUUID(),
        organizationId,
        professionalScheduleId,
        type:
          ProfessionalScheduleBlockType.PERSONAL,
        startsAt:
          '2026-08-10T10:00:00.000Z',
        endsAt:
          '2026-08-10T12:00:00.000Z',
        reason:
          'Personal commitment.',
        createdAt: timestamp,
        updatedAt: timestamp,
        ...overrides,
      };
    }
  },
);