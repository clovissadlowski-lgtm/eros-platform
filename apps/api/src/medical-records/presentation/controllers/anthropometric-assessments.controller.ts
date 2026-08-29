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
  AnthropometricAssessmentsService,
} from '../../application/services/anthropometric-assessments.service';

import type {
  AnthropometricAssessment,
} from '../../domain/entities/anthropometric-assessment.entity';

import {
  CreateAnthropometricAssessmentDto,
} from '../dto/create-anthropometric-assessment.dto';

import {
  AnthropometricAssessmentResponseDto,
} from '../dto/responses/anthropometric-assessment-response.dto';

import {
  UpdateAnthropometricAssessmentDto,
} from '../dto/update-anthropometric-assessment.dto';

@ApiTags(
  'Anthropometric Assessments',
)
@ApiBearerAuth(
  'access-token',
)
@Controller(
  'patients/:patientId/medical-record/anthropometric-assessments',
)
@UseGuards(
  JwtAuthGuard,
  RolesGuard,
)
export class AnthropometricAssessmentsController {
  constructor(
    private readonly service:
      AnthropometricAssessmentsService,
  ) {}

  @Post()
  @Roles(
    MembershipRole.OWNER,
    MembershipRole.ADMIN,
    MembershipRole.NUTRITIONIST,
  )
  @ApiOperation({
    summary:
      'Adicionar avaliação antropométrica ao prontuário',
  })
  @ApiCreatedResponse({
    type:
      AnthropometricAssessmentResponseDto,
  })
  create(
    @Param(
      'patientId',
      new ParseUUIDPipe(),
    )
    patientId: string,

    @Body()
    dto:
      CreateAnthropometricAssessmentDto,

    @CurrentUser()
    currentUser:
      AuthenticatedRequestContext,
  ): Promise<AnthropometricAssessment> {
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
      'Listar avaliações antropométricas do paciente',
  })
  @ApiOkResponse({
    type:
      AnthropometricAssessmentResponseDto,

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
  ): Promise<AnthropometricAssessment[]> {
    return this.service.listByPatient(
      patientId,
      currentUser.organizationId!,
    );
  }

  @Get(
    ':assessmentId',
  )
  @Roles(
    MembershipRole.OWNER,
    MembershipRole.ADMIN,
    MembershipRole.NUTRITIONIST,
  )
  @ApiOperation({
    summary:
      'Consultar uma avaliação antropométrica',
  })
  @ApiOkResponse({
    type:
      AnthropometricAssessmentResponseDto,
  })
  findById(
    @Param(
      'patientId',
      new ParseUUIDPipe(),
    )
    patientId: string,

    @Param(
      'assessmentId',
      new ParseUUIDPipe(),
    )
    assessmentId: string,

    @CurrentUser()
    currentUser:
      AuthenticatedRequestContext,
  ): Promise<AnthropometricAssessment> {
    return this.service.findById(
      patientId,
      currentUser.organizationId!,
      assessmentId,
    );
  }

  @Patch(
    ':assessmentId',
  )
  @Roles(
    MembershipRole.OWNER,
    MembershipRole.ADMIN,
    MembershipRole.NUTRITIONIST,
  )
  @ApiOperation({
    summary:
      'Atualizar avaliação antropométrica',
  })
  @ApiOkResponse({
    type:
      AnthropometricAssessmentResponseDto,
  })
  update(
    @Param(
      'patientId',
      new ParseUUIDPipe(),
    )
    patientId: string,

    @Param(
      'assessmentId',
      new ParseUUIDPipe(),
    )
    assessmentId: string,

    @Body()
    dto:
      UpdateAnthropometricAssessmentDto,

    @CurrentUser()
    currentUser:
      AuthenticatedRequestContext,
  ): Promise<AnthropometricAssessment> {
    return this.service.update(
      patientId,
      currentUser.organizationId!,
      assessmentId,
      dto,
    );
  }

  @Delete(
    ':assessmentId',
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
      'Excluir avaliação antropométrica',
  })
  @ApiNoContentResponse()
  async remove(
    @Param(
      'patientId',
      new ParseUUIDPipe(),
    )
    patientId: string,

    @Param(
      'assessmentId',
      new ParseUUIDPipe(),
    )
    assessmentId: string,

    @CurrentUser()
    currentUser:
      AuthenticatedRequestContext,
  ): Promise<void> {
    await this.service.remove(
      patientId,
      currentUser.organizationId!,
      assessmentId,
    );
  }
}