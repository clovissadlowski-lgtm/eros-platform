import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';

import type { AuthenticatedRequestContext } from '../../../access/domain/authentication/authenticated-request-context';
import { CurrentUser } from '../../../access/presentation/decorators/current-user.decorator';
import { Roles } from '../../../access/presentation/decorators/roles.decorator';
import { JwtAuthGuard } from '../../../access/presentation/guards/jwt-auth.guard';
import { RolesGuard } from '../../../access/presentation/guards/roles.guard';
import { MembershipRole } from '../../../users/domain/entities/membership.entity';
import { PatientsService } from '../../application/services/patients.service';
import { CreatePatientDto } from '../dto/create-patient.dto';
import { UpdatePatientStatusDto } from '../dto/update-patient-status.dto';
import { UpdatePatientDto } from '../dto/update-patient.dto';

@Controller('patients')
@UseGuards(
  JwtAuthGuard,
  RolesGuard,
)
export class PatientsController {
  constructor(
    private readonly patientsService: PatientsService,
  ) {}

  @Post()
  @Roles(
    MembershipRole.OWNER,
    MembershipRole.ADMIN,
    MembershipRole.NUTRITIONIST,
  )
  create(
    @Body() dto: CreatePatientDto,
    @CurrentUser()
    currentUser: AuthenticatedRequestContext,
  ) {
    return this.patientsService.createPatient(
      dto,
      currentUser.organizationId!,
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
    @CurrentUser()
    currentUser: AuthenticatedRequestContext,
  ) {
    return this.patientsService.listPatients(
      currentUser.organizationId!,
    );
  }

  @Get(':patientId')
  @Roles(
    MembershipRole.OWNER,
    MembershipRole.ADMIN,
    MembershipRole.NUTRITIONIST,
    MembershipRole.ASSISTANT,
  )
  getById(
    @Param('patientId')
    patientId: string,
    @CurrentUser()
    currentUser: AuthenticatedRequestContext,
  ) {
    return this.patientsService.getPatientById(
      patientId,
      currentUser.organizationId!,
    );
  }

  @Patch(':patientId')
  @Roles(
    MembershipRole.OWNER,
    MembershipRole.ADMIN,
    MembershipRole.NUTRITIONIST,
  )
  update(
    @Param('patientId')
    patientId: string,
    @Body()
    dto: UpdatePatientDto,
    @CurrentUser()
    currentUser: AuthenticatedRequestContext,
  ) {
    return this.patientsService.updatePatient(
      patientId,
      currentUser.organizationId!,
      dto,
    );
  }

  @Patch(':patientId/status')
  @Roles(
    MembershipRole.OWNER,
    MembershipRole.ADMIN,
  )
  updateStatus(
    @Param('patientId')
    patientId: string,
    @Body()
    dto: UpdatePatientStatusDto,
    @CurrentUser()
    currentUser: AuthenticatedRequestContext,
  ) {
    return this.patientsService.updatePatientStatus(
      patientId,
      currentUser.organizationId!,
      dto.status,
    );
  }
}