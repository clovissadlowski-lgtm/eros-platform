import {
  IsInt,
  IsString,
  IsUUID,
  Max,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';

export class CreateProfessionalScheduleDto {
  @IsUUID()
  professionalMembershipId!: string;

  @IsString()
  @MinLength(1)
  @MaxLength(100)
  timeZone!: string;

  @IsInt()
  @Min(5)
  @Max(240)
  slotIntervalMinutes!: number;
}