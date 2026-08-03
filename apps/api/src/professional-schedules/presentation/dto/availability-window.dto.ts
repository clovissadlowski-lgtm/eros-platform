import {
  IsEnum,
  IsInt,
  Max,
  Min,
} from 'class-validator';

import { Weekday } from '../../domain/entities/professional-availability-window.entity';

export class AvailabilityWindowDto {
  @IsEnum(Weekday)
  weekday!: Weekday;

  @IsInt()
  @Min(0)
  @Max(1439)
  startMinute!: number;

  @IsInt()
  @Min(1)
  @Max(1440)
  endMinute!: number;
}