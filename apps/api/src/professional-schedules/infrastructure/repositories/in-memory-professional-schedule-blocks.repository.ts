import { ProfessionalScheduleBlock } from '../../domain/entities/professional-schedule-block.entity';
import {
  FindScheduleBlockConflictInput,
  ListScheduleBlocksInput,
  ProfessionalScheduleBlocksRepository,
} from '../../domain/repositories/professional-schedule-blocks.repository';

export class InMemoryProfessionalScheduleBlocksRepository
  implements ProfessionalScheduleBlocksRepository
{
  private readonly blocks:
    ProfessionalScheduleBlock[] = [];

  async create(
    block: ProfessionalScheduleBlock,
  ): Promise<ProfessionalScheduleBlock> {
    const storedBlock = {
      ...block,
    };

    this.blocks.push(storedBlock);

    return {
      ...storedBlock,
    };
  }

  async findById(
    organizationId: string,
    blockId: string,
  ): Promise<ProfessionalScheduleBlock | null> {
    const block =
      this.blocks.find(
        (storedBlock) =>
          storedBlock.id === blockId &&
          storedBlock.organizationId ===
            organizationId,
      );

    return block
      ? {
          ...block,
        }
      : null;
  }

  async list(
    input: ListScheduleBlocksInput,
  ): Promise<ProfessionalScheduleBlock[]> {
    const startsBefore =
      input.startsBefore
        ? new Date(
            input.startsBefore,
          ).getTime()
        : null;

    const endsAfter =
      input.endsAfter
        ? new Date(
            input.endsAfter,
          ).getTime()
        : null;

    return this.blocks
      .filter(
        (block) =>
          block.organizationId ===
            input.organizationId &&
          block.professionalScheduleId ===
            input.professionalScheduleId,
      )
      .filter((block) => {
        const blockStart =
          new Date(
            block.startsAt,
          ).getTime();

        const blockEnd =
          new Date(
            block.endsAt,
          ).getTime();

        if (
          startsBefore !== null &&
          blockStart >= startsBefore
        ) {
          return false;
        }

        if (
          endsAfter !== null &&
          blockEnd <= endsAfter
        ) {
          return false;
        }

        return true;
      })
      .sort(
        (
          firstBlock,
          secondBlock,
        ) =>
          new Date(
            firstBlock.startsAt,
          ).getTime() -
          new Date(
            secondBlock.startsAt,
          ).getTime(),
      )
      .map((block) => ({
        ...block,
      }));
  }

  async findConflict(
    input: FindScheduleBlockConflictInput,
  ): Promise<ProfessionalScheduleBlock | null> {
    const candidateStart =
      new Date(
        input.startsAt,
      ).getTime();

    const candidateEnd =
      new Date(
        input.endsAt,
      ).getTime();

    const conflict =
      this.blocks.find(
        (block) => {
          if (
            block.organizationId !==
              input.organizationId ||
            block.professionalScheduleId !==
              input.professionalScheduleId
          ) {
            return false;
          }

          if (
            input.ignoredBlockId &&
            block.id ===
              input.ignoredBlockId
          ) {
            return false;
          }

          const blockStart =
            new Date(
              block.startsAt,
            ).getTime();

          const blockEnd =
            new Date(
              block.endsAt,
            ).getTime();

          return (
            candidateStart < blockEnd &&
            candidateEnd > blockStart
          );
        },
      );

    return conflict
      ? {
          ...conflict,
        }
      : null;
  }

  async update(
    block: ProfessionalScheduleBlock,
  ): Promise<ProfessionalScheduleBlock> {
    const blockIndex =
      this.blocks.findIndex(
        (storedBlock) =>
          storedBlock.id === block.id &&
          storedBlock.organizationId ===
            block.organizationId,
      );

    if (blockIndex < 0) {
      throw new Error(
        'Professional schedule block not found in memory repository.',
      );
    }

    const updatedBlock = {
      ...block,
    };

    this.blocks[blockIndex] =
      updatedBlock;

    return {
      ...updatedBlock,
    };
  }

  async delete(
    organizationId: string,
    blockId: string,
  ): Promise<void> {
    const blockIndex =
      this.blocks.findIndex(
        (block) =>
          block.id === blockId &&
          block.organizationId ===
            organizationId,
      );

    if (blockIndex < 0) {
      return;
    }

    this.blocks.splice(
      blockIndex,
      1,
    );
  }
}