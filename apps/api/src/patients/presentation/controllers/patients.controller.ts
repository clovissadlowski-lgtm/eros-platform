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

import type { AuthenticatedRequestContext } from '../../../access/domain/authentication/authenticated-request-context';
import { CurrentUser } from '../../../access/presentation/decorators/current-user.decorator';
import { Roles } from '../../../access/presentation/decorators/roles.decorator';
import { JwtAuthGuard } from '../../../access/presentation/guards/jwt-auth.guard';
import { RolesGuard } from '../../../access/presentation/guards/roles.guard';
import { ApiErrorResponse } from '../../../common/presentation/swagger/api-error-response.decorator';
import { MembershipRole } from '../../../users/domain/entities/membership.entity';

import { PatientsService } from '../../application/services/patients.service';
import type { Patient } from '../../domain/entities/patient.entity';

import { CreatePatientDto } from '../dto/create-patient.dto';
import { PatientResponseDto } from '../dto/responses/patient-response.dto';
import { UpdatePatientStatusDto } from '../dto/update-patient-status.dto';
import { UpdatePatientDto } from '../dto/update-patient.dto';

@ApiTags('Patients')
@ApiBearerAuth('access-token')
@Controller('patients')
@UseGuards(
  JwtAuthGuard,
  RolesGuard,
)
export class PatientsController {
  constructor(
    private readonly patientsService:
      PatientsService,
  ) {}

  @Post()
  @Roles(
    MembershipRole.OWNER,
    MembershipRole.ADMIN,
    MembershipRole.NUTRITIONIST,
  )
  @ApiOperation({
    summary: 'Criar paciente',
    description:
      'Cria um paciente dentro da organização selecionada no access token. Permitido para OWNER, ADMIN e NUTRITIONIST.',
  })
  @ApiCreatedResponse({
    description:
      'Paciente criado com sucesso.',
    type: PatientResponseDto,
  })
  @ApiErrorResponse({
    status: HttpStatus.BAD_REQUEST,
    description:
      'Os dados enviados para criação do paciente são inválidos.',
    code: 'VALIDATION_ERROR',
    message:
      'Request validation failed.',
    details: [
      'name must be longer than or equal to 2 characters',
    ],
    path:
      '/api/patients',
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
      '/api/patients',
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
      '/api/patients',
  })
  @ApiErrorResponse({
    status: HttpStatus.CONFLICT,
    description:
      'Já existe um paciente com o mesmo e-mail dentro da organização.',
    code:
      'PATIENT_EMAIL_ALREADY_EXISTS',
    message:
      'A patient with this email already exists in the organization.',
    path:
      '/api/patients',
  })
  create(
    @Body()
    dto: CreatePatientDto,
    @CurrentUser()
    currentUser: AuthenticatedRequestContext,
  ): Promise<Patient> {
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
  @ApiOperation({
    summary: 'Listar pacientes',
    description:
      'Retorna somente os pacientes pertencentes à organização selecionada no access token.',
  })
  @ApiOkResponse({
    description:
      'Lista de pacientes retornada com sucesso.',
    type: PatientResponseDto,
    isArray: true,
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
      '/api/patients',
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
      '/api/patients',
  })
  list(
    @CurrentUser()
    currentUser: AuthenticatedRequestContext,
  ): Promise<Patient[]> {
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
  @ApiOperation({
    summary: 'Consultar paciente pelo ID',
    description:
      'Retorna um paciente pelo UUID, respeitando o isolamento da organização selecionada.',
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
      'Paciente encontrado.',
    type: PatientResponseDto,
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
      '/api/patients/invalid-id',
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
      '/api/patients/507ff5bd-f2f2-451d-9e2d-5e2d1d3303ab',
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
      '/api/patients/507ff5bd-f2f2-451d-9e2d-5e2d1d3303ab',
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
      '/api/patients/11111111-1111-4111-8111-111111111111',
  })
  getById(
    @Param(
      'patientId',
      new ParseUUIDPipe(),
    )
    patientId: string,
    @CurrentUser()
    currentUser: AuthenticatedRequestContext,
  ): Promise<Patient> {
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
  @ApiOperation({
    summary: 'Atualizar paciente',
    description:
      'Atualiza os dados cadastrais de um paciente da organização selecionada. Permitido para OWNER, ADMIN e NUTRITIONIST.',
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
      'Paciente atualizado com sucesso.',
    type: PatientResponseDto,
  })
  @ApiErrorResponse({
    status: HttpStatus.BAD_REQUEST,
    description:
      'O identificador ou os dados de atualização são inválidos.',
    code:
      'VALIDATION_ERROR',
    message:
      'Request validation failed.',
    details: [
      'email must be an email',
    ],
    path:
      '/api/patients/507ff5bd-f2f2-451d-9e2d-5e2d1d3303ab',
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
      '/api/patients/507ff5bd-f2f2-451d-9e2d-5e2d1d3303ab',
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
      '/api/patients/507ff5bd-f2f2-451d-9e2d-5e2d1d3303ab',
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
      '/api/patients/11111111-1111-4111-8111-111111111111',
  })
  @ApiErrorResponse({
    status: HttpStatus.CONFLICT,
    description:
      'O novo e-mail já pertence a outro paciente da organização.',
    code:
      'PATIENT_EMAIL_ALREADY_EXISTS',
    message:
      'A patient with this email already exists in the organization.',
    path:
      '/api/patients/507ff5bd-f2f2-451d-9e2d-5e2d1d3303ab',
  })
  update(
    @Param(
      'patientId',
      new ParseUUIDPipe(),
    )
    patientId: string,
    @Body()
    dto: UpdatePatientDto,
    @CurrentUser()
    currentUser: AuthenticatedRequestContext,
  ): Promise<Patient> {
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
  @ApiOperation({
    summary: 'Alterar status do paciente',
    description:
      'Ativa ou inativa um paciente da organização selecionada. Permitido somente para OWNER e ADMIN.',
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
      'Status do paciente atualizado com sucesso.',
    type: PatientResponseDto,
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
      'status must be one of the following values: ACTIVE, INACTIVE',
    ],
    path:
      '/api/patients/507ff5bd-f2f2-451d-9e2d-5e2d1d3303ab/status',
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
      '/api/patients/507ff5bd-f2f2-451d-9e2d-5e2d1d3303ab/status',
  })
  @ApiErrorResponse({
    status: HttpStatus.FORBIDDEN,
    description:
      'Somente OWNER e ADMIN podem alterar o status do paciente, e uma organização ativa precisa estar selecionada.',
    code:
      'INSUFFICIENT_ROLE',
    message:
      'You do not have permission to perform this action.',
    path:
      '/api/patients/507ff5bd-f2f2-451d-9e2d-5e2d1d3303ab/status',
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
      '/api/patients/11111111-1111-4111-8111-111111111111/status',
  })
  updateStatus(
    @Param(
      'patientId',
      new ParseUUIDPipe(),
    )
    patientId: string,
    @Body()
    dto: UpdatePatientStatusDto,
    @CurrentUser()
    currentUser: AuthenticatedRequestContext,
  ): Promise<Patient> {
    return this.patientsService.updatePatientStatus(
      patientId,
      currentUser.organizationId!,
      dto.status,
    );
  }
}