import { randomUUID } from 'node:crypto';

import {
  ProfessionalScheduleBlock,
  ProfessionalScheduleBlockType,
} from '../../domain/entities/professional-schedule-block.entity';
import { InMemoryProfessionalScheduleBlocksRepository } from './in-memory-professional-schedule-blocks.repository';

describe(
  'InMemoryProfessionalScheduleBlocksRepository',
  () => {
    let repository:
      InMemoryProfessionalScheduleBlocksRepository;

    beforeEach(() => {
      repository =
        new InMemoryProfessionalScheduleBlocksRepository();
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
          block.organizationId,
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

    it('lists blocks from the requested schedule ordered by start time', async () => {
      const organizationId =
        randomUUID();

      const professionalScheduleId =
        randomUUID();

      const firstBlock =
        createBlock({
          organizationId,
          professionalScheduleId,
          startsAt:
            '2026-08-10T10:00:00.000Z',
          endsAt:
            '2026-08-10T11:00:00.000Z',
        });

      const secondBlock =
        createBlock({
          organizationId,
          professionalScheduleId,
          startsAt:
            '2026-08-10T08:00:00.000Z',
          endsAt:
            '2026-08-10T09:00:00.000Z',
        });

      const anotherScheduleBlock =
        createBlock({
          organizationId,
          professionalScheduleId:
            randomUUID(),
        });

      await repository.create(
        firstBlock,
      );

      await repository.create(
        secondBlock,
      );

      await repository.create(
        anotherScheduleBlock,
      );

      const result =
        await repository.list({
          organizationId,
          professionalScheduleId,
        });

      expect(result).toEqual([
        secondBlock,
        firstBlock,
      ]);
    });

    it('isolates blocks by organization', async () => {
      const organizationId =
        randomUUID();

      const professionalScheduleId =
        randomUUID();

      const expectedBlock =
        createBlock({
          organizationId,
          professionalScheduleId,
        });

      await repository.create(
        expectedBlock,
      );

      await repository.create(
        createBlock({
          organizationId:
            randomUUID(),
          professionalScheduleId,
        }),
      );

      const result =
        await repository.list({
          organizationId,
          professionalScheduleId,
        });

      expect(result).toEqual([
        expectedBlock,
      ]);
    });

    it('lists blocks that overlap the requested period', async () => {
      const organizationId =
        randomUUID();

      const professionalScheduleId =
        randomUUID();

      const overlapsBeginning =
        createBlock({
          organizationId,
          professionalScheduleId,
          startsAt:
            '2026-08-10T09:00:00.000Z',
          endsAt:
            '2026-08-10T11:00:00.000Z',
        });

      const insidePeriod =
        createBlock({
          organizationId,
          professionalScheduleId,
          startsAt:
            '2026-08-10T10:30:00.000Z',
          endsAt:
            '2026-08-10T11:30:00.000Z',
        });

      const overlapsEnding =
        createBlock({
          organizationId,
          professionalScheduleId,
          startsAt:
            '2026-08-10T11:00:00.000Z',
          endsAt:
            '2026-08-10T13:00:00.000Z',
        });

      const beforePeriod =
        createBlock({
          organizationId,
          professionalScheduleId,
          startsAt:
            '2026-08-10T08:00:00.000Z',
          endsAt:
            '2026-08-10T10:00:00.000Z',
        });

      const afterPeriod =
        createBlock({
          organizationId,
          professionalScheduleId,
          startsAt:
            '2026-08-10T12:00:00.000Z',
          endsAt:
            '2026-08-10T13:00:00.000Z',
        });

      await repository.create(
        overlapsBeginning,
      );

      await repository.create(
        insidePeriod,
      );

      await repository.create(
        overlapsEnding,
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
        overlapsBeginning,
        insidePeriod,
        overlapsEnding,
      ]);
    });

    it('finds an overlapping schedule block', async () => {
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
          organizationId:
            block.organizationId,
          professionalScheduleId:
            block.professionalScheduleId,
          startsAt:
            '2026-08-10T11:00:00.000Z',
          endsAt:
            '2026-08-10T13:00:00.000Z',
        });

      expect(conflict).toEqual(
        block,
      );
    });

    it('allows adjacent schedule blocks', async () => {
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
          organizationId:
            block.organizationId,
          professionalScheduleId:
            block.professionalScheduleId,
          startsAt:
            '2026-08-10T12:00:00.000Z',
          endsAt:
            '2026-08-10T13:00:00.000Z',
        });

      expect(conflict).toBeNull();
    });

    it('does not find conflicts from another schedule', async () => {
      const block =
        createBlock();

      await repository.create(
        block,
      );

      const conflict =
        await repository.findConflict({
          organizationId:
            block.organizationId,
          professionalScheduleId:
            randomUUID(),
          startsAt:
            block.startsAt,
          endsAt:
            block.endsAt,
        });

      expect(conflict).toBeNull();
    });

    it('does not find conflicts from another organization', async () => {
      const block =
        createBlock();

      await repository.create(
        block,
      );

      const conflict =
        await repository.findConflict({
          organizationId:
            randomUUID(),
          professionalScheduleId:
            block.professionalScheduleId,
          startsAt:
            block.startsAt,
          endsAt:
            block.endsAt,
        });

      expect(conflict).toBeNull();
    });

    it('ignores the requested block when checking conflicts', async () => {
      const block =
        createBlock();

      await repository.create(
        block,
      );

      const conflict =
        await repository.findConflict({
          organizationId:
            block.organizationId,
          professionalScheduleId:
            block.professionalScheduleId,
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

      const result =
        await repository.update(
          updatedBlock,
        );

      expect(result).toEqual(
        updatedBlock,
      );

      const persisted =
        await repository.findById(
          block.organizationId,
          block.id,
        );

      expect(persisted).toEqual(
        updatedBlock,
      );
    });

    it('throws when updating a block that does not exist', async () => {
      const block =
        createBlock();

      await expect(
        repository.update(
          block,
        ),
      ).rejects.toThrow(
        'Professional schedule block not found in memory repository.',
      );
    });

    it('deletes a schedule block', async () => {
      const block =
        createBlock();

      await repository.create(
        block,
      );

      await repository.delete(
        block.organizationId,
        block.id,
      );

      const found =
        await repository.findById(
          block.organizationId,
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
          block.organizationId,
          block.id,
        );

      expect(found).toEqual(
        block,
      );
    });

    function createBlock(
      overrides:
        Partial<ProfessionalScheduleBlock> = {},
    ): ProfessionalScheduleBlock {
      const timestamp =
        '2026-08-01T12:00:00.000Z';

      return {
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
    }
  },
);