import {
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';

import { ProfessionalScheduleStatus } from '../../domain/entities/professional-schedule.entity';

export class UpdateProfessionalScheduleDto {
  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(100)
  timeZone?: string;

  @IsOptional()
  @IsInt()
  @Min(5)
  @Max(240)
  slotIntervalMinutes?: number;

  @IsOptional()
  @IsEnum(
    ProfessionalScheduleStatus,
  )
  status?: ProfessionalScheduleStatus;
}