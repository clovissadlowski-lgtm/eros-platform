import {
  Type,
} from 'class-transformer';
import {
  IsDateString,
  IsInt,
  Max,
  Min,
} from 'class-validator';

export class GetAvailableSlotsQueryDto {
  @IsDateString({
    strict: true,
  })
  date!: string;

  @Type(
    () => Number,
  )
  @IsInt()
  @Min(5)
  @Max(480)
  durationMinutes!: number;
}