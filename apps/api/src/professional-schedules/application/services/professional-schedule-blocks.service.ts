import { Injectable } from '@nestjs/common';
import { randomUUID } from 'node:crypto';

import {
  ProfessionalScheduleBlock,
  ProfessionalScheduleBlockType,
} from '../../domain/entities/professional-schedule-block.entity';
import { InvalidScheduleBlockPeriodError } from '../../domain/errors/invalid-schedule-block-period.error';
import { OverlappingScheduleBlockError } from '../../domain/errors/overlapping-schedule-block.error';
import { ProfessionalScheduleBlockNotFoundError } from '../../domain/errors/professional-schedule-block-not-found.error';
import { ProfessionalScheduleNotFoundError } from '../../domain/errors/professional-schedule-not-found.error';
import { ProfessionalScheduleBlocksRepository } from '../../domain/repositories/professional-schedule-blocks.repository';
import { ProfessionalSchedulesRepository } from '../../domain/repositories/professional-schedules.repository';

export interface CreateProfessionalScheduleBlockInput {
  organizationId: string;
  professionalScheduleId: string;
  type: ProfessionalScheduleBlockType;
  startsAt: string;
  endsAt: string;
  reason?: string | null;
}

export interface UpdateProfessionalScheduleBlockInput {
  organizationId: string;
  blockId: string;
  type?: ProfessionalScheduleBlockType;
  startsAt?: string;
  endsAt?: string;
  reason?: string | null;
}

export interface ListProfessionalScheduleBlocksInput {
  organizationId: string;
  professionalScheduleId: string;
  startsBefore?: string;
  endsAfter?: string;
}

@Injectable()
export class ProfessionalScheduleBlocksService {
  constructor(
    private readonly professionalSchedulesRepository:
      ProfessionalSchedulesRepository,
    private readonly professionalScheduleBlocksRepository:
      ProfessionalScheduleBlocksRepository,
  ) {}

  async createBlock(
    input: CreateProfessionalScheduleBlockInput,
  ): Promise<ProfessionalScheduleBlock> {
    await this.ensureScheduleExists(
      input.organizationId,
      input.professionalScheduleId,
    );

    this.ensurePeriodIsValid(
      input.startsAt,
      input.endsAt,
    );

    const conflict =
      await this.professionalScheduleBlocksRepository.findConflict({
        organizationId:
          input.organizationId,
        professionalScheduleId:
          input.professionalScheduleId,
        startsAt: input.startsAt,
        endsAt: input.endsAt,
      });

    if (conflict) {
      throw new OverlappingScheduleBlockError();
    }

    const timestamp =
      new Date().toISOString();

    const block: ProfessionalScheduleBlock = {
      id: randomUUID(),
      organizationId:
        input.organizationId,
      professionalScheduleId:
        input.professionalScheduleId,
      type: input.type,
      startsAt:
        new Date(
          input.startsAt,
        ).toISOString(),
      endsAt:
        new Date(
          input.endsAt,
        ).toISOString(),
      reason:
        input.reason ?? null,
      createdAt: timestamp,
      updatedAt: timestamp,
    };

    return this.professionalScheduleBlocksRepository.create(
      block,
    );
  }

  async getBlockById(
    organizationId: string,
    blockId: string,
  ): Promise<ProfessionalScheduleBlock> {
    const block =
      await this.professionalScheduleBlocksRepository.findById(
        organizationId,
        blockId,
      );

    if (!block) {
      throw new ProfessionalScheduleBlockNotFoundError();
    }

    return block;
  }

  async listBlocks(
    input: ListProfessionalScheduleBlocksInput,
  ): Promise<ProfessionalScheduleBlock[]> {
    await this.ensureScheduleExists(
      input.organizationId,
      input.professionalScheduleId,
    );

    if (input.startsBefore) {
      this.ensureDateIsValid(
        input.startsBefore,
      );
    }

    if (input.endsAfter) {
      this.ensureDateIsValid(
        input.endsAfter,
      );
    }

    if (
      input.startsBefore &&
      input.endsAfter
    ) {
      this.ensurePeriodIsValid(
        input.endsAfter,
        input.startsBefore,
      );
    }

    return this.professionalScheduleBlocksRepository.list(
      {
        organizationId:
          input.organizationId,
        professionalScheduleId:
          input.professionalScheduleId,
        startsBefore:
          input.startsBefore,
        endsAfter:
          input.endsAfter,
      },
    );
  }

  async updateBlock(
    input: UpdateProfessionalScheduleBlockInput,
  ): Promise<ProfessionalScheduleBlock> {
    const existingBlock =
      await this.professionalScheduleBlocksRepository.findById(
        input.organizationId,
        input.blockId,
      );

    if (!existingBlock) {
      throw new ProfessionalScheduleBlockNotFoundError();
    }

    const startsAt =
      input.startsAt ??
      existingBlock.startsAt;

    const endsAt =
      input.endsAt ??
      existingBlock.endsAt;

    this.ensurePeriodIsValid(
      startsAt,
      endsAt,
    );

    const conflict =
      await this.professionalScheduleBlocksRepository.findConflict({
        organizationId:
          input.organizationId,
        professionalScheduleId:
          existingBlock.professionalScheduleId,
        startsAt,
        endsAt,
        ignoredBlockId:
          existingBlock.id,
      });

    if (conflict) {
      throw new OverlappingScheduleBlockError();
    }

    const updatedBlock:
      ProfessionalScheduleBlock = {
        ...existingBlock,
        type:
          input.type ??
          existingBlock.type,
        startsAt:
          new Date(
            startsAt,
          ).toISOString(),
        endsAt:
          new Date(
            endsAt,
          ).toISOString(),
        reason:
          input.reason !== undefined
            ? input.reason
            : existingBlock.reason,
        updatedAt:
          new Date().toISOString(),
      };

    return this.professionalScheduleBlocksRepository.update(
      updatedBlock,
    );
  }

  async deleteBlock(
    organizationId: string,
    blockId: string,
  ): Promise<void> {
    const block =
      await this.professionalScheduleBlocksRepository.findById(
        organizationId,
        blockId,
      );

    if (!block) {
      throw new ProfessionalScheduleBlockNotFoundError();
    }

    await this.professionalScheduleBlocksRepository.delete(
      organizationId,
      blockId,
    );
  }

  private async ensureScheduleExists(
    organizationId: string,
    professionalScheduleId: string,
  ): Promise<void> {
    const schedule =
      await this.professionalSchedulesRepository.findById(
        organizationId,
        professionalScheduleId,
      );

    if (!schedule) {
      throw new ProfessionalScheduleNotFoundError();
    }
  }

  private ensurePeriodIsValid(
    startsAt: string,
    endsAt: string,
  ): void {
    this.ensureDateIsValid(
      startsAt,
    );

    this.ensureDateIsValid(
      endsAt,
    );

    const startsAtTimestamp =
      new Date(
        startsAt,
      ).getTime();

    const endsAtTimestamp =
      new Date(
        endsAt,
      ).getTime();

    if (
      endsAtTimestamp <=
      startsAtTimestamp
    ) {
      throw new InvalidScheduleBlockPeriodError();
    }
  }

  private ensureDateIsValid(
    value: string,
  ): void {
    const timestamp =
      new Date(
        value,
      ).getTime();

    if (
      Number.isNaN(
        timestamp,
      )
    ) {
      throw new InvalidScheduleBlockPeriodError();
    }
  }
}