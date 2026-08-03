import { ProfessionalScheduleBlock } from '../entities/professional-schedule-block.entity';

export interface ListScheduleBlocksInput {
  organizationId: string;
  professionalScheduleId: string;
  startsBefore?: string;
  endsAfter?: string;
}

export interface FindScheduleBlockConflictInput {
  organizationId: string;
  professionalScheduleId: string;
  startsAt: string;
  endsAt: string;
  ignoredBlockId?: string;
}

export abstract class ProfessionalScheduleBlocksRepository {
  abstract create(
    block: ProfessionalScheduleBlock,
  ): Promise<ProfessionalScheduleBlock>;

  abstract findById(
    organizationId: string,
    blockId: string,
  ): Promise<ProfessionalScheduleBlock | null>;

  abstract list(
    input: ListScheduleBlocksInput,
  ): Promise<ProfessionalScheduleBlock[]>;

  abstract findConflict(
    input: FindScheduleBlockConflictInput,
  ): Promise<ProfessionalScheduleBlock | null>;

  abstract update(
    block: ProfessionalScheduleBlock,
  ): Promise<ProfessionalScheduleBlock>;

  abstract delete(
    organizationId: string,
    blockId: string,
  ): Promise<void>;
}