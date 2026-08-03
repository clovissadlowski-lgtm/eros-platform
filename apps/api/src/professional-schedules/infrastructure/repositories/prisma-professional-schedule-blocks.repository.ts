import { Injectable } from '@nestjs/common';

import { PrismaService } from '../../../common/database/prisma.service';
import {
  ProfessionalScheduleBlockType as PrismaProfessionalScheduleBlockType,
} from '../../../generated/prisma/enums';
import type {
  ProfessionalScheduleBlock as PrismaProfessionalScheduleBlock,
} from '../../../generated/prisma/client';
import {
  ProfessionalScheduleBlock,
  ProfessionalScheduleBlockType,
} from '../../domain/entities/professional-schedule-block.entity';
import {
  FindScheduleBlockConflictInput,
  ListScheduleBlocksInput,
  ProfessionalScheduleBlocksRepository,
} from '../../domain/repositories/professional-schedule-blocks.repository';

@Injectable()
export class PrismaProfessionalScheduleBlocksRepository
  implements ProfessionalScheduleBlocksRepository
{
  constructor(
    private readonly prisma: PrismaService,
  ) {}

  async create(
    block: ProfessionalScheduleBlock,
  ): Promise<ProfessionalScheduleBlock> {
    const createdBlock =
      await this.prisma.professionalScheduleBlock.create({
        data: {
          id: block.id,
          organizationId:
            block.organizationId,
          professionalScheduleId:
            block.professionalScheduleId,
          type: this.toPrismaType(
            block.type,
          ),
          startsAt: new Date(
            block.startsAt,
          ),
          endsAt: new Date(
            block.endsAt,
          ),
          reason: block.reason,
          createdAt: new Date(
            block.createdAt,
          ),
          updatedAt: new Date(
            block.updatedAt,
          ),
        },
      });

    return this.toDomain(
      createdBlock,
    );
  }

  async findById(
    organizationId: string,
    blockId: string,
  ): Promise<ProfessionalScheduleBlock | null> {
    const block =
      await this.prisma.professionalScheduleBlock.findFirst({
        where: {
          id: blockId,
          organizationId,
        },
      });

    return block
      ? this.toDomain(block)
      : null;
  }

  async list(
    input: ListScheduleBlocksInput,
  ): Promise<ProfessionalScheduleBlock[]> {
    const blocks =
      await this.prisma.professionalScheduleBlock.findMany({
        where: {
          organizationId:
            input.organizationId,
          professionalScheduleId:
            input.professionalScheduleId,
          ...(input.startsBefore ||
          input.endsAfter
            ? {
                AND: [
                  ...(input.startsBefore
                    ? [
                        {
                          startsAt: {
                            lt: new Date(
                              input.startsBefore,
                            ),
                          },
                        },
                      ]
                    : []),
                  ...(input.endsAfter
                    ? [
                        {
                          endsAt: {
                            gt: new Date(
                              input.endsAfter,
                            ),
                          },
                        },
                      ]
                    : []),
                ],
              }
            : {}),
        },
        orderBy: {
          startsAt: 'asc',
        },
      });

    return blocks.map(
      (block) =>
        this.toDomain(block),
    );
  }

  async findConflict(
    input: FindScheduleBlockConflictInput,
  ): Promise<ProfessionalScheduleBlock | null> {
    const block =
      await this.prisma.professionalScheduleBlock.findFirst({
        where: {
          organizationId:
            input.organizationId,
          professionalScheduleId:
            input.professionalScheduleId,
          ...(input.ignoredBlockId
            ? {
                id: {
                  not:
                    input.ignoredBlockId,
                },
              }
            : {}),
          startsAt: {
            lt: new Date(
              input.endsAt,
            ),
          },
          endsAt: {
            gt: new Date(
              input.startsAt,
            ),
          },
        },
        orderBy: {
          startsAt: 'asc',
        },
      });

    return block
      ? this.toDomain(block)
      : null;
  }

  async update(
    block: ProfessionalScheduleBlock,
  ): Promise<ProfessionalScheduleBlock> {
    const updatedBlock =
      await this.prisma.professionalScheduleBlock.update({
        where: {
          id: block.id,
        },
        data: {
          type: this.toPrismaType(
            block.type,
          ),
          startsAt: new Date(
            block.startsAt,
          ),
          endsAt: new Date(
            block.endsAt,
          ),
          reason: block.reason,
          updatedAt: new Date(
            block.updatedAt,
          ),
        },
      });

    return this.toDomain(
      updatedBlock,
    );
  }

  async delete(
    organizationId: string,
    blockId: string,
  ): Promise<void> {
    await this.prisma.professionalScheduleBlock.deleteMany({
      where: {
        id: blockId,
        organizationId,
      },
    });
  }

  private toDomain(
    block: PrismaProfessionalScheduleBlock,
  ): ProfessionalScheduleBlock {
    return {
      id: block.id,
      organizationId:
        block.organizationId,
      professionalScheduleId:
        block.professionalScheduleId,
      type:
        block.type as ProfessionalScheduleBlockType,
      startsAt:
        block.startsAt.toISOString(),
      endsAt:
        block.endsAt.toISOString(),
      reason: block.reason,
      createdAt:
        block.createdAt.toISOString(),
      updatedAt:
        block.updatedAt.toISOString(),
    };
  }

  private toPrismaType(
    type: ProfessionalScheduleBlockType,
  ): PrismaProfessionalScheduleBlockType {
    return type as PrismaProfessionalScheduleBlockType;
  }
}