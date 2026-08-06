import {
  Body,
  Controller,
  Get,
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
  ApiOkResponse,
  ApiOperation,
  ApiParam,
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
  ApiErrorResponse,
} from '../../../common/presentation/swagger/api-error-response.decorator';
import {
  MembershipRole,
} from '../../../users/domain/entities/membership.entity';

import {
  MedicalRecordsService,
} from '../../application/services/medical-records.service';
import type {
  MedicalRecord,
} from '../../domain/entities/medical-record.entity';

import {
  CreateMedicalRecordDto,
} from '../dto/create-medical-record.dto';
import {
  MedicalRecordResponseDto,
} from '../dto/responses/medical-record-response.dto';
import {
  UpdateMedicalRecordStatusDto,
} from '../dto/update-medical-record-status.dto';
import {
  UpdateMedicalRecordDto,
} from '../dto/update-medical-record.dto';

@ApiTags('Medical Records')
@ApiBearerAuth('access-token')
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
  @ApiOperation({
    summary:
      'Criar prontuário clínico',
    description:
      'Cria o prontuário clínico do paciente dentro da organização selecionada. Cada paciente pode possuir apenas um prontuário.',
  })
  @ApiParam({
    name: 'patientId',
    description:
      'Identificador UUID do paciente.',
    format: 'uuid',
    example:
      '507ff5bd-f2f2-451d-9e2d-5e2d1d3303ab',
  })
  @ApiCreatedResponse({
    description:
      'Prontuário criado com sucesso.',
    type: MedicalRecordResponseDto,
  })
  @ApiErrorResponse({
    status: HttpStatus.BAD_REQUEST,
    description:
      'O identificador do paciente ou os dados do prontuário são inválidos.',
    code:
      'VALIDATION_ERROR',
    message:
      'Request validation failed.',
    details: [
      'chiefComplaint must be shorter than or equal to 5000 characters',
    ],
    path:
      '/api/patients/507ff5bd-f2f2-451d-9e2d-5e2d1d3303ab/medical-record',
  })
  @ApiErrorResponse({
    status: HttpStatus.UNAUTHORIZED,
    description:
      'Access token ausente, inválido ou expirado.',
    code:
      'INVALID_ACCESS_TOKEN',
    message:
      'Invalid or expired access token.',
    path:
      '/api/patients/507ff5bd-f2f2-451d-9e2d-5e2d1d3303ab/medical-record',
  })
  @ApiErrorResponse({
    status: HttpStatus.FORBIDDEN,
    description:
      'O usuário não possui o perfil necessário ou nenhuma organização ativa foi selecionada.',
    code:
      'INSUFFICIENT_ROLE',
    message:
      'You do not have permission to perform this action.',
    path:
      '/api/patients/507ff5bd-f2f2-451d-9e2d-5e2d1d3303ab/medical-record',
  })
  @ApiErrorResponse({
    status: HttpStatus.NOT_FOUND,
    description:
      'Paciente não encontrado na organização selecionada.',
    code:
      'PATIENT_NOT_FOUND',
    message:
      'Patient not found.',
    path:
      '/api/patients/11111111-1111-4111-8111-111111111111/medical-record',
  })
  @ApiErrorResponse({
    status: HttpStatus.CONFLICT,
    description:
      'O paciente já possui um prontuário clínico.',
    code:
      'MEDICAL_RECORD_ALREADY_EXISTS',
    message:
      'A medical record already exists for this patient.',
    path:
      '/api/patients/507ff5bd-f2f2-451d-9e2d-5e2d1d3303ab/medical-record',
  })
  create(
    @Param(
      'patientId',
      new ParseUUIDPipe(),
    )
    patientId: string,
    @Body()
    dto: CreateMedicalRecordDto,
    @CurrentUser()
    currentUser: AuthenticatedRequestContext,
  ): Promise<MedicalRecord> {
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
  @ApiOperation({
    summary:
      'Consultar prontuário clínico',
    description:
      'Retorna o prontuário clínico do paciente, respeitando o isolamento da organização selecionada.',
  })
  @ApiParam({
    name: 'patientId',
    description:
      'Identificador UUID do paciente.',
    format: 'uuid',
    example:
      '507ff5bd-f2f2-451d-9e2d-5e2d1d3303ab',
  })
  @ApiOkResponse({
    description:
      'Prontuário encontrado.',
    type: MedicalRecordResponseDto,
  })
  @ApiErrorResponse({
    status: HttpStatus.BAD_REQUEST,
    description:
      'O identificador informado não é um UUID válido.',
    code:
      'VALIDATION_ERROR',
    message:
      'Validation failed (uuid is expected).',
    path:
      '/api/patients/invalid-id/medical-record',
  })
  @ApiErrorResponse({
    status: HttpStatus.UNAUTHORIZED,
    description:
      'Access token ausente, inválido ou expirado.',
    code:
      'INVALID_ACCESS_TOKEN',
    message:
      'Invalid or expired access token.',
    path:
      '/api/patients/507ff5bd-f2f2-451d-9e2d-5e2d1d3303ab/medical-record',
  })
  @ApiErrorResponse({
    status: HttpStatus.FORBIDDEN,
    description:
      'O usuário não possui o perfil necessário ou nenhuma organização ativa foi selecionada.',
    code:
      'INSUFFICIENT_ROLE',
    message:
      'You do not have permission to perform this action.',
    path:
      '/api/patients/507ff5bd-f2f2-451d-9e2d-5e2d1d3303ab/medical-record',
  })
  @ApiErrorResponse({
    status: HttpStatus.NOT_FOUND,
    description:
      'Paciente ou prontuário não encontrado na organização selecionada.',
    code:
      'MEDICAL_RECORD_NOT_FOUND',
    message:
      'Medical record not found.',
    path:
      '/api/patients/11111111-1111-4111-8111-111111111111/medical-record',
  })
  getByPatient(
    @Param(
      'patientId',
      new ParseUUIDPipe(),
    )
    patientId: string,
    @CurrentUser()
    currentUser: AuthenticatedRequestContext,
  ): Promise<MedicalRecord> {
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
  @ApiOperation({
    summary:
      'Atualizar prontuário clínico',
    description:
      'Atualiza parcialmente os dados clínicos do prontuário do paciente.',
  })
  @ApiParam({
    name: 'patientId',
    description:
      'Identificador UUID do paciente.',
    format: 'uuid',
    example:
      '507ff5bd-f2f2-451d-9e2d-5e2d1d3303ab',
  })
  @ApiOkResponse({
    description:
      'Prontuário atualizado com sucesso.',
    type: MedicalRecordResponseDto,
  })
  @ApiErrorResponse({
    status: HttpStatus.BAD_REQUEST,
    description:
      'O identificador ou os dados enviados são inválidos.',
    code:
      'VALIDATION_ERROR',
    message:
      'Request validation failed.',
    details: [
      'clinicalNotes must be shorter than or equal to 10000 characters',
    ],
    path:
      '/api/patients/507ff5bd-f2f2-451d-9e2d-5e2d1d3303ab/medical-record',
  })
  @ApiErrorResponse({
    status: HttpStatus.UNAUTHORIZED,
    description:
      'Access token ausente, inválido ou expirado.',
    code:
      'INVALID_ACCESS_TOKEN',
    message:
      'Invalid or expired access token.',
    path:
      '/api/patients/507ff5bd-f2f2-451d-9e2d-5e2d1d3303ab/medical-record',
  })
  @ApiErrorResponse({
    status: HttpStatus.FORBIDDEN,
    description:
      'O usuário não possui o perfil necessário ou nenhuma organização ativa foi selecionada.',
    code:
      'INSUFFICIENT_ROLE',
    message:
      'You do not have permission to perform this action.',
    path:
      '/api/patients/507ff5bd-f2f2-451d-9e2d-5e2d1d3303ab/medical-record',
  })
  @ApiErrorResponse({
    status: HttpStatus.NOT_FOUND,
    description:
      'Paciente ou prontuário não encontrado.',
    code:
      'MEDICAL_RECORD_NOT_FOUND',
    message:
      'Medical record not found.',
    path:
      '/api/patients/11111111-1111-4111-8111-111111111111/medical-record',
  })
  update(
    @Param(
      'patientId',
      new ParseUUIDPipe(),
    )
    patientId: string,
    @Body()
    dto: UpdateMedicalRecordDto,
    @CurrentUser()
    currentUser: AuthenticatedRequestContext,
  ): Promise<MedicalRecord> {
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
  @ApiOperation({
    summary:
      'Alterar status do prontuário',
    description:
      'Ativa ou arquiva o prontuário clínico do paciente. Permitido somente para OWNER e ADMIN.',
  })
  @ApiParam({
    name: 'patientId',
    description:
      'Identificador UUID do paciente.',
    format: 'uuid',
    example:
      '507ff5bd-f2f2-451d-9e2d-5e2d1d3303ab',
  })
  @ApiOkResponse({
    description:
      'Status do prontuário atualizado com sucesso.',
    type: MedicalRecordResponseDto,
  })
  @ApiErrorResponse({
    status: HttpStatus.BAD_REQUEST,
    description:
      'O identificador ou o status informado é inválido.',
    code:
      'VALIDATION_ERROR',
    message:
      'Request validation failed.',
    details: [
      'status must be one of the following values: ACTIVE, ARCHIVED',
    ],
    path:
      '/api/patients/507ff5bd-f2f2-451d-9e2d-5e2d1d3303ab/medical-record/status',
  })
  @ApiErrorResponse({
    status: HttpStatus.UNAUTHORIZED,
    description:
      'Access token ausente, inválido ou expirado.',
    code:
      'INVALID_ACCESS_TOKEN',
    message:
      'Invalid or expired access token.',
    path:
      '/api/patients/507ff5bd-f2f2-451d-9e2d-5e2d1d3303ab/medical-record/status',
  })
  @ApiErrorResponse({
    status: HttpStatus.FORBIDDEN,
    description:
      'Somente OWNER e ADMIN podem alterar o status, e uma organização ativa precisa estar selecionada.',
    code:
      'INSUFFICIENT_ROLE',
    message:
      'You do not have permission to perform this action.',
    path:
      '/api/patients/507ff5bd-f2f2-451d-9e2d-5e2d1d3303ab/medical-record/status',
  })
  @ApiErrorResponse({
    status: HttpStatus.NOT_FOUND,
    description:
      'Paciente ou prontuário não encontrado.',
    code:
      'MEDICAL_RECORD_NOT_FOUND',
    message:
      'Medical record not found.',
    path:
      '/api/patients/11111111-1111-4111-8111-111111111111/medical-record/status',
  })
  updateStatus(
    @Param(
      'patientId',
      new ParseUUIDPipe(),
    )
    patientId: string,
    @Body()
    dto: UpdateMedicalRecordStatusDto,
    @CurrentUser()
    currentUser: AuthenticatedRequestContext,
  ): Promise<MedicalRecord> {
    return this.medicalRecordsService.updateMedicalRecordStatus(
      patientId,
      currentUser.organizationId!,
      dto.status,
    );
  }
}