import { randomUUID } from 'node:crypto';

import {
  ProfessionalScheduleBlock,
  ProfessionalScheduleBlockType,
} from '../../domain/entities/professional-schedule-block.entity';
import {
  ProfessionalSchedule,
  ProfessionalScheduleStatus,
} from '../../domain/entities/professional-schedule.entity';
import { InvalidScheduleBlockPeriodError } from '../../domain/errors/invalid-schedule-block-period.error';
import { OverlappingScheduleBlockError } from '../../domain/errors/overlapping-schedule-block.error';
import { ProfessionalScheduleBlockNotFoundError } from '../../domain/errors/professional-schedule-block-not-found.error';
import { ProfessionalScheduleNotFoundError } from '../../domain/errors/professional-schedule-not-found.error';
import { InMemoryProfessionalScheduleBlocksRepository } from '../../infrastructure/repositories/in-memory-professional-schedule-blocks.repository';
import { InMemoryProfessionalSchedulesRepository } from '../../infrastructure/repositories/in-memory-professional-schedules.repository';
import { ProfessionalScheduleBlocksService } from './professional-schedule-blocks.service';

describe(
  'ProfessionalScheduleBlocksService',
  () => {
    let schedulesRepository:
      InMemoryProfessionalSchedulesRepository;

    let blocksRepository:
      InMemoryProfessionalScheduleBlocksRepository;

    let service:
      ProfessionalScheduleBlocksService;

    beforeEach(() => {
      jest.useFakeTimers();

      jest.setSystemTime(
        new Date(
          '2026-08-01T12:00:00.000Z',
        ),
      );

      schedulesRepository =
        new InMemoryProfessionalSchedulesRepository();

      blocksRepository =
        new InMemoryProfessionalScheduleBlocksRepository();

      service =
        new ProfessionalScheduleBlocksService(
          schedulesRepository,
          blocksRepository,
        );
    });

    afterEach(() => {
      jest.useRealTimers();
    });

    it('creates a schedule block', async () => {
      const schedule =
        await createSchedule();

      const block =
        await service.createBlock({
          organizationId:
            schedule.organizationId,
          professionalScheduleId:
            schedule.id,
          type:
            ProfessionalScheduleBlockType.PERSONAL,
          startsAt:
            '2026-08-10T10:00:00.000Z',
          endsAt:
            '2026-08-10T12:00:00.000Z',
          reason:
            'Personal commitment.',
        });

      expect(block).toMatchObject({
        organizationId:
          schedule.organizationId,
        professionalScheduleId:
          schedule.id,
        type:
          ProfessionalScheduleBlockType.PERSONAL,
        startsAt:
          '2026-08-10T10:00:00.000Z',
        endsAt:
          '2026-08-10T12:00:00.000Z',
        reason:
          'Personal commitment.',
        createdAt:
          '2026-08-01T12:00:00.000Z',
        updatedAt:
          '2026-08-01T12:00:00.000Z',
      });

      expect(block.id).toEqual(
        expect.any(String),
      );
    });

    it('creates a block with a null reason', async () => {
      const schedule =
        await createSchedule();

      const block =
        await service.createBlock({
          organizationId:
            schedule.organizationId,
          professionalScheduleId:
            schedule.id,
          type:
            ProfessionalScheduleBlockType.HOLIDAY,
          startsAt:
            '2026-08-10T10:00:00.000Z',
          endsAt:
            '2026-08-10T12:00:00.000Z',
        });

      expect(block.reason).toBeNull();
    });

    it('rejects a block when the schedule does not exist', async () => {
      await expect(
        service.createBlock({
          organizationId:
            randomUUID(),
          professionalScheduleId:
            randomUUID(),
          type:
            ProfessionalScheduleBlockType.PERSONAL,
          startsAt:
            '2026-08-10T10:00:00.000Z',
          endsAt:
            '2026-08-10T12:00:00.000Z',
        }),
      ).rejects.toBeInstanceOf(
        ProfessionalScheduleNotFoundError,
      );
    });

    it('rejects a block with an inverted period', async () => {
      const schedule =
        await createSchedule();

      await expect(
        service.createBlock({
          organizationId:
            schedule.organizationId,
          professionalScheduleId:
            schedule.id,
          type:
            ProfessionalScheduleBlockType.PERSONAL,
          startsAt:
            '2026-08-10T12:00:00.000Z',
          endsAt:
            '2026-08-10T10:00:00.000Z',
        }),
      ).rejects.toBeInstanceOf(
        InvalidScheduleBlockPeriodError,
      );
    });

    it('rejects a zero-duration block', async () => {
      const schedule =
        await createSchedule();

      await expect(
        service.createBlock({
          organizationId:
            schedule.organizationId,
          professionalScheduleId:
            schedule.id,
          type:
            ProfessionalScheduleBlockType.PERSONAL,
          startsAt:
            '2026-08-10T10:00:00.000Z',
          endsAt:
            '2026-08-10T10:00:00.000Z',
        }),
      ).rejects.toBeInstanceOf(
        InvalidScheduleBlockPeriodError,
      );
    });

    it('rejects an invalid block date', async () => {
      const schedule =
        await createSchedule();

      await expect(
        service.createBlock({
          organizationId:
            schedule.organizationId,
          professionalScheduleId:
            schedule.id,
          type:
            ProfessionalScheduleBlockType.PERSONAL,
          startsAt:
            'invalid-date',
          endsAt:
            '2026-08-10T12:00:00.000Z',
        }),
      ).rejects.toBeInstanceOf(
        InvalidScheduleBlockPeriodError,
      );
    });

    it('rejects an overlapping block', async () => {
      const schedule =
        await createSchedule();

      await createBlock({
        organizationId:
          schedule.organizationId,
        professionalScheduleId:
          schedule.id,
        startsAt:
          '2026-08-10T10:00:00.000Z',
        endsAt:
          '2026-08-10T12:00:00.000Z',
      });

      await expect(
        service.createBlock({
          organizationId:
            schedule.organizationId,
          professionalScheduleId:
            schedule.id,
          type:
            ProfessionalScheduleBlockType.MEETING,
          startsAt:
            '2026-08-10T11:00:00.000Z',
          endsAt:
            '2026-08-10T13:00:00.000Z',
        }),
      ).rejects.toBeInstanceOf(
        OverlappingScheduleBlockError,
      );
    });

    it('allows adjacent blocks', async () => {
      const schedule =
        await createSchedule();

      await createBlock({
        organizationId:
          schedule.organizationId,
        professionalScheduleId:
          schedule.id,
        startsAt:
          '2026-08-10T10:00:00.000Z',
        endsAt:
          '2026-08-10T12:00:00.000Z',
      });

      const created =
        await service.createBlock({
          organizationId:
            schedule.organizationId,
          professionalScheduleId:
            schedule.id,
          type:
            ProfessionalScheduleBlockType.MEETING,
          startsAt:
            '2026-08-10T12:00:00.000Z',
          endsAt:
            '2026-08-10T13:00:00.000Z',
        });

      expect(created.startsAt).toBe(
        '2026-08-10T12:00:00.000Z',
      );
    });

    it('gets a block by id', async () => {
      const schedule =
        await createSchedule();

      const block =
        await createBlock({
          organizationId:
            schedule.organizationId,
          professionalScheduleId:
            schedule.id,
        });

      const result =
        await service.getBlockById(
          schedule.organizationId,
          block.id,
        );

      expect(result).toEqual(
        block,
      );
    });

    it('does not expose a block from another organization', async () => {
      const schedule =
        await createSchedule();

      const block =
        await createBlock({
          organizationId:
            schedule.organizationId,
          professionalScheduleId:
            schedule.id,
        });

      await expect(
        service.getBlockById(
          randomUUID(),
          block.id,
        ),
      ).rejects.toBeInstanceOf(
        ProfessionalScheduleBlockNotFoundError,
      );
    });

    it('lists blocks from a schedule', async () => {
      const schedule =
        await createSchedule();

      const laterBlock =
        await createBlock({
          organizationId:
            schedule.organizationId,
          professionalScheduleId:
            schedule.id,
          startsAt:
            '2026-08-10T15:00:00.000Z',
          endsAt:
            '2026-08-10T16:00:00.000Z',
        });

      const earlierBlock =
        await createBlock({
          organizationId:
            schedule.organizationId,
          professionalScheduleId:
            schedule.id,
          startsAt:
            '2026-08-10T10:00:00.000Z',
          endsAt:
            '2026-08-10T11:00:00.000Z',
        });

      const result =
        await service.listBlocks({
          organizationId:
            schedule.organizationId,
          professionalScheduleId:
            schedule.id,
        });

      expect(result).toEqual([
        earlierBlock,
        laterBlock,
      ]);
    });

    it('lists only blocks that overlap the requested period', async () => {
      const schedule =
        await createSchedule();

      const overlappingBlock =
        await createBlock({
          organizationId:
            schedule.organizationId,
          professionalScheduleId:
            schedule.id,
          startsAt:
            '2026-08-10T09:00:00.000Z',
          endsAt:
            '2026-08-10T11:00:00.000Z',
        });

      await createBlock({
        organizationId:
          schedule.organizationId,
        professionalScheduleId:
          schedule.id,
        startsAt:
          '2026-08-10T12:00:00.000Z',
        endsAt:
          '2026-08-10T13:00:00.000Z',
      });

      const result =
        await service.listBlocks({
          organizationId:
            schedule.organizationId,
          professionalScheduleId:
            schedule.id,
          endsAfter:
            '2026-08-10T10:00:00.000Z',
          startsBefore:
            '2026-08-10T12:00:00.000Z',
        });

      expect(result).toEqual([
        overlappingBlock,
      ]);
    });

    it('rejects an invalid list period', async () => {
      const schedule =
        await createSchedule();

      await expect(
        service.listBlocks({
          organizationId:
            schedule.organizationId,
          professionalScheduleId:
            schedule.id,
          endsAfter:
            '2026-08-10T12:00:00.000Z',
          startsBefore:
            '2026-08-10T10:00:00.000Z',
        }),
      ).rejects.toBeInstanceOf(
        InvalidScheduleBlockPeriodError,
      );
    });

    it('updates a schedule block', async () => {
      const schedule =
        await createSchedule();

      const block =
        await createBlock({
          organizationId:
            schedule.organizationId,
          professionalScheduleId:
            schedule.id,
        });

      jest.setSystemTime(
        new Date(
          '2026-08-02T12:00:00.000Z',
        ),
      );

      const updated =
        await service.updateBlock({
          organizationId:
            schedule.organizationId,
          blockId: block.id,
          type:
            ProfessionalScheduleBlockType.MEETING,
          startsAt:
            '2026-08-10T13:00:00.000Z',
          endsAt:
            '2026-08-10T14:00:00.000Z',
          reason:
            'Team meeting.',
        });

      expect(updated).toMatchObject({
        id: block.id,
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
      });
    });

    it('updates only the supplied block fields', async () => {
      const schedule =
        await createSchedule();

      const block =
        await createBlock({
          organizationId:
            schedule.organizationId,
          professionalScheduleId:
            schedule.id,
        });

      const updated =
        await service.updateBlock({
          organizationId:
            schedule.organizationId,
          blockId: block.id,
          reason:
            'Updated reason.',
        });

      expect(updated).toMatchObject({
        id: block.id,
        type: block.type,
        startsAt:
          block.startsAt,
        endsAt: block.endsAt,
        reason:
          'Updated reason.',
      });
    });

    it('allows clearing the block reason', async () => {
      const schedule =
        await createSchedule();

      const block =
        await createBlock({
          organizationId:
            schedule.organizationId,
          professionalScheduleId:
            schedule.id,
          reason:
            'Original reason.',
        });

      const updated =
        await service.updateBlock({
          organizationId:
            schedule.organizationId,
          blockId: block.id,
          reason: null,
        });

      expect(updated.reason).toBeNull();
    });

    it('rejects an update that overlaps another block', async () => {
      const schedule =
        await createSchedule();

      const firstBlock =
        await createBlock({
          organizationId:
            schedule.organizationId,
          professionalScheduleId:
            schedule.id,
          startsAt:
            '2026-08-10T10:00:00.000Z',
          endsAt:
            '2026-08-10T11:00:00.000Z',
        });

      await createBlock({
        organizationId:
          schedule.organizationId,
        professionalScheduleId:
          schedule.id,
        startsAt:
          '2026-08-10T12:00:00.000Z',
        endsAt:
          '2026-08-10T13:00:00.000Z',
      });

      await expect(
        service.updateBlock({
          organizationId:
            schedule.organizationId,
          blockId:
            firstBlock.id,
          startsAt:
            '2026-08-10T11:30:00.000Z',
          endsAt:
            '2026-08-10T12:30:00.000Z',
        }),
      ).rejects.toBeInstanceOf(
        OverlappingScheduleBlockError,
      );
    });

    it('updates a block without conflicting with itself', async () => {
      const schedule =
        await createSchedule();

      const block =
        await createBlock({
          organizationId:
            schedule.organizationId,
          professionalScheduleId:
            schedule.id,
        });

      const updated =
        await service.updateBlock({
          organizationId:
            schedule.organizationId,
          blockId: block.id,
          reason:
            'Same period, new reason.',
        });

      expect(updated.reason).toBe(
        'Same period, new reason.',
      );
    });

    it('rejects updating a block that does not exist', async () => {
      await expect(
        service.updateBlock({
          organizationId:
            randomUUID(),
          blockId:
            randomUUID(),
          reason:
            'Updated reason.',
        }),
      ).rejects.toBeInstanceOf(
        ProfessionalScheduleBlockNotFoundError,
      );
    });

    it('deletes a schedule block', async () => {
      const schedule =
        await createSchedule();

      const block =
        await createBlock({
          organizationId:
            schedule.organizationId,
          professionalScheduleId:
            schedule.id,
        });

      await service.deleteBlock(
        schedule.organizationId,
        block.id,
      );

      await expect(
        service.getBlockById(
          schedule.organizationId,
          block.id,
        ),
      ).rejects.toBeInstanceOf(
        ProfessionalScheduleBlockNotFoundError,
      );
    });

    it('rejects deleting a block that does not exist', async () => {
      await expect(
        service.deleteBlock(
          randomUUID(),
          randomUUID(),
        ),
      ).rejects.toBeInstanceOf(
        ProfessionalScheduleBlockNotFoundError,
      );
    });

    async function createSchedule(
      overrides:
        Partial<ProfessionalSchedule> = {},
    ): Promise<ProfessionalSchedule> {
      const timestamp =
        '2026-08-01T12:00:00.000Z';

      const schedule:
        ProfessionalSchedule = {
          id: randomUUID(),
          organizationId:
            randomUUID(),
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

      return schedulesRepository.create(
        schedule,
      );
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
            '2026-08-10T10:00:00.000Z',
          endsAt:
            '2026-08-10T12:00:00.000Z',
          reason:
            'Personal commitment.',
          createdAt: timestamp,
          updatedAt: timestamp,
          ...overrides,
        };

      return blocksRepository.create(
        block,
      );
    }
  },
);