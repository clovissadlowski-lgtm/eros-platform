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
  MedicalRecordHealthConditionsService,
} from '../../application/services/medical-record-health-conditions.service';
import type {
  MedicalRecordHealthCondition,
} from '../../domain/entities/medical-record-health-condition.entity';
import {
  CreateMedicalRecordHealthConditionDto,
} from '../dto/create-medical-record-health-condition.dto';
import {
  MedicalRecordHealthConditionResponseDto,
} from '../dto/responses/medical-record-health-condition-response.dto';
import {
  UpdateMedicalRecordHealthConditionDto,
} from '../dto/update-medical-record-health-condition.dto';

@ApiTags('Medical Record Health Conditions')
@ApiBearerAuth('access-token')
@Controller(
  'patients/:patientId/medical-record/health-conditions',
)
@UseGuards(
  JwtAuthGuard,
  RolesGuard,
)
export class MedicalRecordHealthConditionsController {
  constructor(
    private readonly service:
      MedicalRecordHealthConditionsService,
  ) {}

  @Post()
  @Roles(
    MembershipRole.OWNER,
    MembershipRole.ADMIN,
    MembershipRole.NUTRITIONIST,
  )
  @ApiOperation({
    summary:
      'Adicionar condição de saúde ao prontuário',
  })
  @ApiCreatedResponse({
    type:
      MedicalRecordHealthConditionResponseDto,
  })
  create(
    @Param(
      'patientId',
      new ParseUUIDPipe(),
    )
    patientId: string,
    @Body()
    dto:
      CreateMedicalRecordHealthConditionDto,
    @CurrentUser()
    currentUser:
      AuthenticatedRequestContext,
  ): Promise<MedicalRecordHealthCondition> {
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
      'Listar condições de saúde do paciente',
  })
  @ApiOkResponse({
    type:
      MedicalRecordHealthConditionResponseDto,
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
    MedicalRecordHealthCondition[]
  > {
    return this.service.listByPatient(
      patientId,
      currentUser.organizationId!,
    );
  }

  @Patch(':healthConditionId')
  @Roles(
    MembershipRole.OWNER,
    MembershipRole.ADMIN,
    MembershipRole.NUTRITIONIST,
  )
  @ApiOperation({
    summary:
      'Atualizar condição de saúde',
  })
  @ApiOkResponse({
    type:
      MedicalRecordHealthConditionResponseDto,
  })
  update(
    @Param(
      'patientId',
      new ParseUUIDPipe(),
    )
    patientId: string,
    @Param(
      'healthConditionId',
      new ParseUUIDPipe(),
    )
    healthConditionId: string,
    @Body()
    dto:
      UpdateMedicalRecordHealthConditionDto,
    @CurrentUser()
    currentUser:
      AuthenticatedRequestContext,
  ): Promise<MedicalRecordHealthCondition> {
    return this.service.update(
      patientId,
      currentUser.organizationId!,
      healthConditionId,
      dto,
    );
  }

  @Delete(':healthConditionId')
  @HttpCode(HttpStatus.NO_CONTENT)
  @Roles(
    MembershipRole.OWNER,
    MembershipRole.ADMIN,
  )
  @ApiOperation({
    summary:
      'Excluir condição de saúde',
  })
  @ApiNoContentResponse()
  async remove(
    @Param(
      'patientId',
      new ParseUUIDPipe(),
    )
    patientId: string,
    @Param(
      'healthConditionId',
      new ParseUUIDPipe(),
    )
    healthConditionId: string,
    @CurrentUser()
    currentUser:
      AuthenticatedRequestContext,
  ): Promise<void> {
    await this.service.remove(
      patientId,
      currentUser.organizationId!,
      healthConditionId,
    );
  }
}