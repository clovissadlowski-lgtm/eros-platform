import {
  IsEnum,
  IsISO8601,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

import { ProfessionalScheduleBlockType } from '../../domain/entities/professional-schedule-block.entity';

export class CreateProfessionalScheduleBlockDto {
  @IsEnum(
    ProfessionalScheduleBlockType,
  )
  type!: ProfessionalScheduleBlockType;

  @IsISO8601({
    strict: true,
  })
  startsAt!: string;

  @IsISO8601({
    strict: true,
  })
  endsAt!: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  reason?: string | null;
}