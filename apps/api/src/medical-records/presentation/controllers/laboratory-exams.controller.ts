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
  LaboratoryExamsService,
} from '../../application/services/laboratory-exams.service';

import type {
  LaboratoryExam,
} from '../../domain/entities/laboratory-exam.entity';

import type {
  LaboratoryResult,
} from '../../domain/entities/laboratory-result.entity';

import type {
  LaboratoryExamWithResults,
} from '../../domain/repositories/laboratory-exams.repository';

import {
  CreateLaboratoryExamDto,
} from '../dto/create-laboratory-exam.dto';

import {
  CreateLaboratoryResultDto,
} from '../dto/create-laboratory-result.dto';

import {
  LaboratoryExamResponseDto,
  LaboratoryExamWithResultsResponseDto,
  LaboratoryResultResponseDto,
} from '../dto/responses/laboratory-exam-response.dto';

import {
  UpdateLaboratoryExamDto,
} from '../dto/update-laboratory-exam.dto';

import {
  UpdateLaboratoryResultDto,
} from '../dto/update-laboratory-result.dto';

@ApiTags('Medical Record Laboratory Exams')
@ApiBearerAuth('access-token')
@Controller(
  'patients/:patientId/medical-record/laboratory-exams',
)
@UseGuards(
  JwtAuthGuard,
  RolesGuard,
)
export class LaboratoryExamsController {
  constructor(
    private readonly service:
      LaboratoryExamsService,
  ) {}

  @Post()
  @Roles(
    MembershipRole.OWNER,
    MembershipRole.ADMIN,
    MembershipRole.NUTRITIONIST,
  )
  @ApiOperation({
    summary:
      'Adicionar exame laboratorial ao prontuário',
  })
  @ApiCreatedResponse({
    type:
      LaboratoryExamResponseDto,
  })
  createExam(
    @Param(
      'patientId',
      new ParseUUIDPipe(),
    )
    patientId: string,

    @Body()
    dto:
      CreateLaboratoryExamDto,

    @CurrentUser()
    currentUser:
      AuthenticatedRequestContext,
  ): Promise<LaboratoryExam> {
    return this.service.createExam(
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
      'Listar exames laboratoriais do paciente',
  })
  @ApiOkResponse({
    type:
      LaboratoryExamResponseDto,
    isArray: true,
  })
  listExams(
    @Param(
      'patientId',
      new ParseUUIDPipe(),
    )
    patientId: string,

    @CurrentUser()
    currentUser:
      AuthenticatedRequestContext,
  ): Promise<LaboratoryExam[]> {
    return this.service.listExamsByPatient(
      patientId,
      currentUser.organizationId!,
    );
  }

  @Get(':examId')
  @Roles(
    MembershipRole.OWNER,
    MembershipRole.ADMIN,
    MembershipRole.NUTRITIONIST,
  )
  @ApiOperation({
    summary:
      'Consultar exame laboratorial com resultados',
  })
  @ApiOkResponse({
    type:
      LaboratoryExamWithResultsResponseDto,
  })
  getExam(
    @Param(
      'patientId',
      new ParseUUIDPipe(),
    )
    patientId: string,

    @Param(
      'examId',
      new ParseUUIDPipe(),
    )
    examId: string,

    @CurrentUser()
    currentUser:
      AuthenticatedRequestContext,
  ): Promise<LaboratoryExamWithResults> {
    return this.service.getExamWithResults(
      patientId,
      currentUser.organizationId!,
      examId,
    );
  }

  @Patch(':examId')
  @Roles(
    MembershipRole.OWNER,
    MembershipRole.ADMIN,
    MembershipRole.NUTRITIONIST,
  )
  @ApiOperation({
    summary:
      'Atualizar exame laboratorial',
  })
  @ApiOkResponse({
    type:
      LaboratoryExamResponseDto,
  })
  updateExam(
    @Param(
      'patientId',
      new ParseUUIDPipe(),
    )
    patientId: string,

    @Param(
      'examId',
      new ParseUUIDPipe(),
    )
    examId: string,

    @Body()
    dto:
      UpdateLaboratoryExamDto,

    @CurrentUser()
    currentUser:
      AuthenticatedRequestContext,
  ): Promise<LaboratoryExam> {
    return this.service.updateExam(
      patientId,
      currentUser.organizationId!,
      examId,
      dto,
    );
  }

  @Delete(':examId')
  @HttpCode(
    HttpStatus.NO_CONTENT,
  )
  @Roles(
    MembershipRole.OWNER,
    MembershipRole.ADMIN,
  )
  @ApiOperation({
    summary:
      'Excluir exame laboratorial',
  })
  @ApiNoContentResponse()
  async removeExam(
    @Param(
      'patientId',
      new ParseUUIDPipe(),
    )
    patientId: string,

    @Param(
      'examId',
      new ParseUUIDPipe(),
    )
    examId: string,

    @CurrentUser()
    currentUser:
      AuthenticatedRequestContext,
  ): Promise<void> {
    await this.service.removeExam(
      patientId,
      currentUser.organizationId!,
      examId,
    );
  }

  @Post(':examId/results')
  @Roles(
    MembershipRole.OWNER,
    MembershipRole.ADMIN,
    MembershipRole.NUTRITIONIST,
  )
  @ApiOperation({
    summary:
      'Adicionar resultado ao exame laboratorial',
  })
  @ApiCreatedResponse({
    type:
      LaboratoryResultResponseDto,
  })
  createResult(
    @Param(
      'patientId',
      new ParseUUIDPipe(),
    )
    patientId: string,

    @Param(
      'examId',
      new ParseUUIDPipe(),
    )
    examId: string,

    @Body()
    dto:
      CreateLaboratoryResultDto,

    @CurrentUser()
    currentUser:
      AuthenticatedRequestContext,
  ): Promise<LaboratoryResult> {
    return this.service.createResult(
      patientId,
      currentUser.organizationId!,
      examId,
      dto,
    );
  }

  @Get(':examId/results')
  @Roles(
    MembershipRole.OWNER,
    MembershipRole.ADMIN,
    MembershipRole.NUTRITIONIST,
  )
  @ApiOperation({
    summary:
      'Listar resultados do exame laboratorial',
  })
  @ApiOkResponse({
    type:
      LaboratoryResultResponseDto,
    isArray: true,
  })
  listResults(
    @Param(
      'patientId',
      new ParseUUIDPipe(),
    )
    patientId: string,

    @Param(
      'examId',
      new ParseUUIDPipe(),
    )
    examId: string,

    @CurrentUser()
    currentUser:
      AuthenticatedRequestContext,
  ): Promise<LaboratoryResult[]> {
    return this.service.listResults(
      patientId,
      currentUser.organizationId!,
      examId,
    );
  }

  @Patch(
    ':examId/results/:resultId',
  )
  @Roles(
    MembershipRole.OWNER,
    MembershipRole.ADMIN,
    MembershipRole.NUTRITIONIST,
  )
  @ApiOperation({
    summary:
      'Atualizar resultado laboratorial',
  })
  @ApiOkResponse({
    type:
      LaboratoryResultResponseDto,
  })
  updateResult(
    @Param(
      'patientId',
      new ParseUUIDPipe(),
    )
    patientId: string,

    @Param(
      'examId',
      new ParseUUIDPipe(),
    )
    examId: string,

    @Param(
      'resultId',
      new ParseUUIDPipe(),
    )
    resultId: string,

    @Body()
    dto:
      UpdateLaboratoryResultDto,

    @CurrentUser()
    currentUser:
      AuthenticatedRequestContext,
  ): Promise<LaboratoryResult> {
    return this.service.updateResult(
      patientId,
      currentUser.organizationId!,
      examId,
      resultId,
      dto,
    );
  }

  @Delete(
    ':examId/results/:resultId',
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
      'Excluir resultado laboratorial',
  })
  @ApiNoContentResponse()
  async removeResult(
    @Param(
      'patientId',
      new ParseUUIDPipe(),
    )
    patientId: string,

    @Param(
      'examId',
      new ParseUUIDPipe(),
    )
    examId: string,

    @Param(
      'resultId',
      new ParseUUIDPipe(),
    )
    resultId: string,

    @CurrentUser()
    currentUser:
      AuthenticatedRequestContext,
  ): Promise<void> {
    await this.service.removeResult(
      patientId,
      currentUser.organizationId!,
      examId,
      resultId,
    );
  }
}