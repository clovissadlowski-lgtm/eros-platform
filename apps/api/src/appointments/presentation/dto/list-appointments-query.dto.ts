import {
  IsEnum,
  IsISO8601,
  IsOptional,
  IsUUID,
} from 'class-validator';

import { AppointmentStatus } from '../../domain/entities/appointment.entity';

export class ListAppointmentsQueryDto {
  @IsOptional()
  @IsUUID()
  patientId?: string;

  @IsOptional()
  @IsUUID()
  professionalMembershipId?: string;

  @IsOptional()
  @IsEnum(AppointmentStatus)
  status?: AppointmentStatus;

  @IsOptional()
  @IsISO8601({
    strict: true,
  })
  scheduledFrom?: string;

  @IsOptional()
  @IsISO8601({
    strict: true,
  })
  scheduledTo?: string;
}
