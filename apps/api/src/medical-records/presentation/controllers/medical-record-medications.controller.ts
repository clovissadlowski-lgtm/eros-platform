import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';

import type {
  AuthenticatedRequestContext,
} from '../../../access/domain/authentication/authenticated-request-context';
import {
  CurrentUser,
} from '../../../access/presentation/decorators/current-user.decorator';
import {
  Roles,
} from '../../../access/presentation/decorators/roles.decorator';
import {
  JwtAuthGuard,
} from '../../../access/presentation/guards/jwt-auth.guard';
import {
  RolesGuard,
} from '../../../access/presentation/guards/roles.guard';
import {
  MembershipRole,
} from '../../../users/domain/entities/membership.entity';
import {
  MedicalRecordMedicationsService,
} from '../../application/services/medical-record-medications.service';
import type {
  MedicalRecordMedication,
} from '../../domain/entities/medical-record-medication.entity';
import {
  CreateMedicalRecordMedicationDto,
} from '../dto/create-medical-record-medication.dto';
import {
  MedicalRecordMedicationResponseDto,
} from '../dto/responses/medical-record-medication-response.dto';
import {
  UpdateMedicalRecordMedicationDto,
} from '../dto/update-medical-record-medication.dto';

@ApiTags('Medical Record Medications')
@ApiBearerAuth('access-token')
@Controller(
  'patients/:patientId/medical-record/medications',
)
@UseGuards(
  JwtAuthGuard,
  RolesGuard,
)
export class MedicalRecordMedicationsController {
  constructor(
    private readonly service:
      MedicalRecordMedicationsService,
  ) {}

  @Post()
  @Roles(
    MembershipRole.OWNER,
    MembershipRole.ADMIN,
    MembershipRole.NUTRITIONIST,
  )
  @ApiOperation({
    summary:
      'Adicionar medicamento ao prontuário',
  })
  @ApiCreatedResponse({
    type:
      MedicalRecordMedicationResponseDto,
  })
  create(
    @Param(
      'patientId',
      new ParseUUIDPipe(),
    )
    patientId: string,
    @Body()
    dto:
      CreateMedicalRecordMedicationDto,
    @CurrentUser()
    currentUser:
      AuthenticatedRequestContext,
  ): Promise<MedicalRecordMedication> {
    return this.service.create(
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
  @ApiOperation({
    summary:
      'Listar medicamentos do paciente',
  })
  @ApiOkResponse({
    type:
      MedicalRecordMedicationResponseDto,
    isArray: true,
  })
  list(
    @Param(
      'patientId',
      new ParseUUIDPipe(),
    )
    patientId: string,
    @CurrentUser()
    currentUser:
      AuthenticatedRequestContext,
  ): Promise<
    MedicalRecordMedication[]
  > {
    return this.service.listByPatient(
      patientId,
      currentUser.organizationId!,
    );
  }

  @Patch(':medicationId')
  @Roles(
    MembershipRole.OWNER,
    MembershipRole.ADMIN,
    MembershipRole.NUTRITIONIST,
  )
  @ApiOperation({
    summary:
      'Atualizar medicamento do prontuário',
  })
  @ApiOkResponse({
    type:
      MedicalRecordMedicationResponseDto,
  })
  update(
    @Param(
      'patientId',
      new ParseUUIDPipe(),
    )
    patientId: string,
    @Param(
      'medicationId',
      new ParseUUIDPipe(),
    )
    medicationId: string,
    @Body()
    dto:
      UpdateMedicalRecordMedicationDto,
    @CurrentUser()
    currentUser:
      AuthenticatedRequestContext,
  ): Promise<MedicalRecordMedication> {
    return this.service.update(
      patientId,
      currentUser.organizationId!,
      medicationId,
      dto,
    );
  }

  @Delete(':medicationId')
  @HttpCode(HttpStatus.NO_CONTENT)
  @Roles(
    MembershipRole.OWNER,
    MembershipRole.ADMIN,
  )
  @ApiOperation({
    summary:
      'Excluir medicamento do prontuário',
  })
  @ApiNoContentResponse()
  async remove(
    @Param(
      'patientId',
      new ParseUUIDPipe(),
    )
    patientId: string,
    @Param(
      'medicationId',
      new ParseUUIDPipe(),
    )
    medicationId: string,
    @CurrentUser()
    currentUser:
      AuthenticatedRequestContext,
  ): Promise<void> {
    await this.service.remove(
      patientId,
      currentUser.organizationId!,
      medicationId,
    );
  }
}