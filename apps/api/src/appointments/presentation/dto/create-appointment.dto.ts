import {
  IsEnum,
  IsInt,
  IsISO8601,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  Max,
  MaxLength,
  Min,
} from 'class-validator';

import { AppointmentType } from '../../domain/entities/appointment.entity';

export class CreateAppointmentDto {
  @IsUUID()
  patientId!: string;

  @IsUUID()
  professionalMembershipId!: string;

  @IsEnum(AppointmentType)
  type!: AppointmentType;

  @IsISO8601({
    strict: true,
  })
  scheduledAt!: string;

  @IsInt()
  @Min(15)
  @Max(480)
  durationMinutes!: number;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @MaxLength(2000)
  reason?: string;

  @IsOptional()
  @IsString()
  @MaxLength(10000)
  notes?: string;
}