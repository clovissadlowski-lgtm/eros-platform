import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';

import type { AuthenticatedRequestContext } from '../../../access/domain/authentication/authenticated-request-context';
import { CurrentUser } from '../../../access/presentation/decorators/current-user.decorator';
import { Roles } from '../../../access/presentation/decorators/roles.decorator';
import { JwtAuthGuard } from '../../../access/presentation/guards/jwt-auth.guard';
import { RolesGuard } from '../../../access/presentation/guards/roles.guard';
import { MembershipRole } from '../../../users/domain/entities/membership.entity';
import { AppointmentsService } from '../../application/services/appointments.service';
import { CreateAppointmentDto } from '../dto/create-appointment.dto';
import { ListAppointmentsQueryDto } from '../dto/list-appointments-query.dto';
import { UpdateAppointmentStatusDto } from '../dto/update-appointment-status.dto';
import { UpdateAppointmentDto } from '../dto/update-appointment.dto';

@Controller('appointments')
@UseGuards(
  JwtAuthGuard,
  RolesGuard,
)
export class AppointmentsController {
  constructor(
    private readonly appointmentsService:
      AppointmentsService,
  ) {}

  @Post()
  @Roles(
    MembershipRole.OWNER,
    MembershipRole.ADMIN,
    MembershipRole.NUTRITIONIST,
    MembershipRole.ASSISTANT,
  )
  create(
    @Body()
    dto: CreateAppointmentDto,
    @CurrentUser()
    currentUser: AuthenticatedRequestContext,
  ) {
    return this.appointmentsService.createAppointment(
      currentUser.organizationId!,
      dto,
    );
  }

  @Get()
  @Roles(
    MembershipRole.OWNER,
    MembershipRole.ADMIN,
    MembershipRole.NUTRITIONIST,
    MembershipRole.ASSISTANT,
  )
  list(
    @Query()
    query: ListAppointmentsQueryDto,
    @CurrentUser()
    currentUser: AuthenticatedRequestContext,
  ) {
    return this.appointmentsService.listAppointments(
      currentUser.organizationId!,
      {
        patientId:
          query.patientId,
        professionalMembershipId:
          query.professionalMembershipId,
        status:
          query.status,
        scheduledFrom:
          query.scheduledFrom,
        scheduledTo:
          query.scheduledTo,
      },
    );
  }

  @Get(':appointmentId')
  @Roles(
    MembershipRole.OWNER,
    MembershipRole.ADMIN,
    MembershipRole.NUTRITIONIST,
    MembershipRole.ASSISTANT,
  )
  getById(
    @Param('appointmentId')
    appointmentId: string,
    @CurrentUser()
    currentUser: AuthenticatedRequestContext,
  ) {
    return this.appointmentsService.getAppointmentById(
      appointmentId,
      currentUser.organizationId!,
    );
  }

  @Patch(':appointmentId')
  @Roles(
    MembershipRole.OWNER,
    MembershipRole.ADMIN,
    MembershipRole.NUTRITIONIST,
    MembershipRole.ASSISTANT,
  )
  update(
    @Param('appointmentId')
    appointmentId: string,
    @Body()
    dto: UpdateAppointmentDto,
    @CurrentUser()
    currentUser: AuthenticatedRequestContext,
  ) {
    return this.appointmentsService.updateAppointment(
      appointmentId,
      currentUser.organizationId!,
      dto,
    );
  }

  @Patch(':appointmentId/status')
  @Roles(
    MembershipRole.OWNER,
    MembershipRole.ADMIN,
    MembershipRole.NUTRITIONIST,
    MembershipRole.ASSISTANT,
  )
  updateStatus(
    @Param('appointmentId')
    appointmentId: string,
    @Body()
    dto: UpdateAppointmentStatusDto,
    @CurrentUser()
    currentUser: AuthenticatedRequestContext,
  ) {
    return this.appointmentsService.updateAppointmentStatus(
      appointmentId,
      currentUser.organizationId!,
      dto,
    );
  }
}