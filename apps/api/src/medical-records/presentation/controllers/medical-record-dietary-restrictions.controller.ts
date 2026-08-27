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
  MedicalRecordDietaryRestrictionsService,
} from '../../application/services/medical-record-dietary-restrictions.service';

import type {
  MedicalRecordDietaryRestriction,
} from '../../domain/entities/medical-record-dietary-restriction.entity';

import {
  CreateMedicalRecordDietaryRestrictionDto,
} from '../dto/create-medical-record-dietary-restriction.dto';

import {
  MedicalRecordDietaryRestrictionResponseDto,
} from '../dto/responses/medical-record-dietary-restriction-response.dto';

import {
  UpdateMedicalRecordDietaryRestrictionDto,
} from '../dto/update-medical-record-dietary-restriction.dto';

@ApiTags(
  'Medical Record Dietary Restrictions',
)
@ApiBearerAuth(
  'access-token',
)
@Controller(
  'patients/:patientId/medical-record/dietary-restrictions',
)
@UseGuards(
  JwtAuthGuard,
  RolesGuard,
)
export class MedicalRecordDietaryRestrictionsController {
  constructor(
    private readonly service:
      MedicalRecordDietaryRestrictionsService,
  ) {}

  @Post()
  @Roles(
    MembershipRole.OWNER,
    MembershipRole.ADMIN,
    MembershipRole.NUTRITIONIST,
  )
  @ApiOperation({
    summary:
      'Adicionar preferência ou restrição alimentar ao prontuário',
  })
  @ApiCreatedResponse({
    type:
      MedicalRecordDietaryRestrictionResponseDto,
  })
  create(
    @Param(
      'patientId',
      new ParseUUIDPipe(),
    )
    patientId: string,

    @Body()
    dto:
      CreateMedicalRecordDietaryRestrictionDto,

    @CurrentUser()
    currentUser:
      AuthenticatedRequestContext,
  ): Promise<MedicalRecordDietaryRestriction> {
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
      'Listar preferências e restrições alimentares do paciente',
  })
  @ApiOkResponse({
    type:
      MedicalRecordDietaryRestrictionResponseDto,

    isArray:
      true,
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
  ): Promise<MedicalRecordDietaryRestriction[]> {
    return this.service.listByPatient(
      patientId,
      currentUser.organizationId!,
    );
  }

  @Patch(
    ':restrictionId',
  )
  @Roles(
    MembershipRole.OWNER,
    MembershipRole.ADMIN,
    MembershipRole.NUTRITIONIST,
  )
  @ApiOperation({
    summary:
      'Atualizar preferência ou restrição alimentar',
  })
  @ApiOkResponse({
    type:
      MedicalRecordDietaryRestrictionResponseDto,
  })
  update(
    @Param(
      'patientId',
      new ParseUUIDPipe(),
    )
    patientId: string,

    @Param(
      'restrictionId',
      new ParseUUIDPipe(),
    )
    restrictionId: string,

    @Body()
    dto:
      UpdateMedicalRecordDietaryRestrictionDto,

    @CurrentUser()
    currentUser:
      AuthenticatedRequestContext,
  ): Promise<MedicalRecordDietaryRestriction> {
    return this.service.update(
      patientId,
      currentUser.organizationId!,
      restrictionId,
      dto,
    );
  }

  @Delete(
    ':restrictionId',
  )
  @HttpCode(
    HttpStatus.NO_CONTENT,
  )
  @Roles(
    MembershipRole.OWNER,
    MembershipRole.ADMIN,
  )
  @ApiOperation({
    summary:
      'Excluir preferência ou restrição alimentar',
  })
  @ApiNoContentResponse()
  async remove(
    @Param(
      'patientId',
      new ParseUUIDPipe(),
    )
    patientId: string,

    @Param(
      'restrictionId',
      new ParseUUIDPipe(),
    )
    restrictionId: string,

    @CurrentUser()
    currentUser:
      AuthenticatedRequestContext,
  ): Promise<void> {
    await this.service.remove(
      patientId,
      currentUser.organizationId!,
      restrictionId,
    );
  }
}