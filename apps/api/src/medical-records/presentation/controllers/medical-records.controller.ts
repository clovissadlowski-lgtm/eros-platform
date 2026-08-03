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
import { MedicalRecordsService } from '../../application/services/medical-records.service';
import { CreateMedicalRecordDto } from '../dto/create-medical-record.dto';
import { UpdateMedicalRecordStatusDto } from '../dto/update-medical-record-status.dto';
import { UpdateMedicalRecordDto } from '../dto/update-medical-record.dto';

@Controller('patients/:patientId/medical-record')
@UseGuards(
  JwtAuthGuard,
  RolesGuard,
)
export class MedicalRecordsController {
  constructor(
    private readonly medicalRecordsService:
      MedicalRecordsService,
  ) {}

  @Post()
  @Roles(
    MembershipRole.OWNER,
    MembershipRole.ADMIN,
    MembershipRole.NUTRITIONIST,
  )
  create(
    @Param('patientId')
    patientId: string,
    @Body()
    dto: CreateMedicalRecordDto,
    @CurrentUser()
    currentUser: AuthenticatedRequestContext,
  ) {
    return this.medicalRecordsService.createMedicalRecord(
      patientId,
      currentUser.organizationId!,
      dto,
    );
  }

  @Get()
  @Roles(
    MembershipRole.OWNER,
    MembershipRole.ADMIN,
    MembershipRole.NUTRITIONIST,
  )
  getByPatient(
    @Param('patientId')
    patientId: string,
    @CurrentUser()
    currentUser: AuthenticatedRequestContext,
  ) {
    return this.medicalRecordsService.getMedicalRecordByPatientId(
      patientId,
      currentUser.organizationId!,
    );
  }

  @Patch()
  @Roles(
    MembershipRole.OWNER,
    MembershipRole.ADMIN,
    MembershipRole.NUTRITIONIST,
  )
  update(
    @Param('patientId')
    patientId: string,
    @Body()
    dto: UpdateMedicalRecordDto,
    @CurrentUser()
    currentUser: AuthenticatedRequestContext,
  ) {
    return this.medicalRecordsService.updateMedicalRecord(
      patientId,
      currentUser.organizationId!,
      dto,
    );
  }

  @Patch('status')
  @Roles(
    MembershipRole.OWNER,
    MembershipRole.ADMIN,
  )
  updateStatus(
    @Param('patientId')
    patientId: string,
    @Body()
    dto: UpdateMedicalRecordStatusDto,
    @CurrentUser()
    currentUser: AuthenticatedRequestContext,
  ) {
    return this.medicalRecordsService.updateMedicalRecordStatus(
      patientId,
      currentUser.organizationId!,
      dto.status,
    );
  }
}
