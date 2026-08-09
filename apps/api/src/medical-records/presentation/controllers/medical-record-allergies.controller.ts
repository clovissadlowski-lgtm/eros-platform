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
  MedicalRecordAllergiesService,
} from '../../application/services/medical-record-allergies.service';

import type {
  MedicalRecordAllergy,
} from '../../domain/entities/medical-record-allergy.entity';

import {
  CreateMedicalRecordAllergyDto,
} from '../dto/create-medical-record-allergy.dto';

import {
  MedicalRecordAllergyResponseDto,
} from '../dto/responses/medical-record-allergy-response.dto';

import {
  UpdateMedicalRecordAllergyDto,
} from '../dto/update-medical-record-allergy.dto';

@ApiTags('Medical Record Allergies')
@ApiBearerAuth('access-token')
@Controller(
  'patients/:patientId/medical-record/allergies',
)
@UseGuards(
  JwtAuthGuard,
  RolesGuard,
)
export class MedicalRecordAllergiesController {
  constructor(
    private readonly service:
      MedicalRecordAllergiesService,
  ) {}

  @Post()
  @Roles(
    MembershipRole.OWNER,
    MembershipRole.ADMIN,
    MembershipRole.NUTRITIONIST,
  )
  @ApiOperation({
    summary:
      'Adicionar alergia ou intolerância ao prontuário',
  })
  @ApiCreatedResponse({
    type:
      MedicalRecordAllergyResponseDto,
  })
  create(
    @Param(
      'patientId',
      new ParseUUIDPipe(),
    )
    patientId: string,
    @Body()
    dto:
      CreateMedicalRecordAllergyDto,
    @CurrentUser()
    currentUser:
      AuthenticatedRequestContext,
  ): Promise<MedicalRecordAllergy> {
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
      'Listar alergias e intolerâncias do paciente',
  })
  @ApiOkResponse({
    type:
      MedicalRecordAllergyResponseDto,
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
  ): Promise<MedicalRecordAllergy[]> {
    return this.service.listByPatient(
      patientId,
      currentUser.organizationId!,
    );
  }

  @Patch(':allergyId')
  @Roles(
    MembershipRole.OWNER,
    MembershipRole.ADMIN,
    MembershipRole.NUTRITIONIST,
  )
  @ApiOperation({
    summary:
      'Atualizar alergia ou intolerância do prontuário',
  })
  @ApiOkResponse({
    type:
      MedicalRecordAllergyResponseDto,
  })
  update(
    @Param(
      'patientId',
      new ParseUUIDPipe(),
    )
    patientId: string,
    @Param(
      'allergyId',
      new ParseUUIDPipe(),
    )
    allergyId: string,
    @Body()
    dto:
      UpdateMedicalRecordAllergyDto,
    @CurrentUser()
    currentUser:
      AuthenticatedRequestContext,
  ): Promise<MedicalRecordAllergy> {
    return this.service.update(
      patientId,
      currentUser.organizationId!,
      allergyId,
      dto,
    );
  }

  @Delete(':allergyId')
  @HttpCode(HttpStatus.NO_CONTENT)
  @Roles(
    MembershipRole.OWNER,
    MembershipRole.ADMIN,
  )
  @ApiOperation({
    summary:
      'Excluir alergia ou intolerância do prontuário',
  })
  @ApiNoContentResponse()
  async remove(
    @Param(
      'patientId',
      new ParseUUIDPipe(),
    )
    patientId: string,
    @Param(
      'allergyId',
      new ParseUUIDPipe(),
    )
    allergyId: string,
    @CurrentUser()
    currentUser:
      AuthenticatedRequestContext,
  ): Promise<void> {
    await this.service.remove(
      patientId,
      currentUser.organizationId!,
      allergyId,
    );
  }
}