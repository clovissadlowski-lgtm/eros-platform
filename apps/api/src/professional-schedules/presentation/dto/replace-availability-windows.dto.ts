import {
  Type,
} from 'class-transformer';
import {
  IsArray,
  ValidateNested,
} from 'class-validator';

import { AvailabilityWindowDto } from './availability-window.dto';

export class ReplaceAvailabilityWindowsDto {
  @IsArray()
  @ValidateNested({
    each: true,
  })
  @Type(
    () =>
      AvailabilityWindowDto,
  )
  windows!: AvailabilityWindowDto[];
}