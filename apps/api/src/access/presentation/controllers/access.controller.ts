import {
  Body,
  Controller,
  Get,
  Header,
  HttpCode,
  HttpStatus,
  Ip,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiForbiddenResponse,
  ApiNoContentResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import type { Request } from 'express';

import { ErrorResponseDto } from '../../../common/presentation/dto/error-response.dto';
import { MembershipRole } from '../../../users/domain/entities/membership.entity';

import { ListUserOrganizationsService } from '../../application/services/list-user-organizations.service';
import type { UserOrganizationResult } from '../../application/services/list-user-organizations.service';
import { LoginService } from '../../application/services/login.service';
import type { LoginResult } from '../../application/services/login.service';
import { LogoutAllSessionsService } from '../../application/services/logout-all-sessions.service';
import { LogoutSessionService } from '../../application/services/logout-session.service';
import { RefreshSessionService } from '../../application/services/refresh-session.service';
import type { RefreshSessionResult } from '../../application/services/refresh-session.service';
import { SelectOrganizationService } from '../../application/services/select-organization.service';
import type { SelectOrganizationResult } from '../../application/services/select-organization.service';

import type { AuthenticatedRequestContext } from '../../domain/authentication/authenticated-request-context';

import { CurrentUser } from '../decorators/current-user.decorator';
import { Roles } from '../decorators/roles.decorator';

import { LoginDto } from '../dtos/login.dto';
import { RefreshTokenDto } from '../dtos/refresh-token.dto';
import { AuthenticatedContextResponseDto } from '../dtos/responses/authenticated-context-response.dto';
import { LoginResponseDto } from '../dtos/responses/login-response.dto';
import { OrganizationAdminCheckResponseDto } from '../dtos/responses/organization-admin-check-response.dto';
import { RefreshSessionResponseDto } from '../dtos/responses/refresh-session-response.dto';
import { SelectOrganizationResponseDto } from '../dtos/responses/select-organization-response.dto';
import { UserOrganizationResponseDto } from '../dtos/responses/user-organization-response.dto';
import { SelectOrganizationDto } from '../dtos/select-organization.dto';

import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { RolesGuard } from '../guards/roles.guard';

@ApiTags('Authentication')
@Controller('auth')
export class AccessController {
  constructor(
    private readonly loginService: LoginService,
    private readonly listUserOrganizationsService: ListUserOrganizationsService,
    private readonly refreshSessionService: RefreshSessionService,
    private readonly logoutSessionService: LogoutSessionService,
    private readonly logoutAllSessionsService: LogoutAllSessionsService,
    private readonly selectOrganizationService: SelectOrganizationService,
  ) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @Header('Cache-Control', 'no-store')
  @ApiOperation({
    summary: 'Autenticar usuário',
    description:
      'Valida o e-mail e a senha, cria uma sessão e retorna um access token e um refresh token. O token inicial ainda pode não conter contexto organizacional.',
  })
  @ApiOkResponse({
    description:
      'Usuário autenticado e sessão criada com sucesso.',
    type: LoginResponseDto,
  })
  @ApiUnauthorizedResponse({
    description:
      'E-mail ou senha inválidos, usuário bloqueado ou usuário inativo.',
    type: ErrorResponseDto,
  })
  async login(
    @Body()
    input: LoginDto,
    @Ip()
    ipAddress: string,
    @Req()
    request: Request,
  ): Promise<LoginResult> {
    const userAgent =
      request.headers['user-agent'];

    return this.loginService.execute({
      email: input.email,
      plainPassword: input.password,
      ipAddress,
      userAgent:
        typeof userAgent === 'string'
          ? userAgent
          : null,
    });
  }

  @Get('organizations')
  @UseGuards(JwtAuthGuard)
  @Header('Cache-Control', 'no-store')
  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary:
      'Listar organizações disponíveis para o usuário',
    description:
      'Retorna somente as organizações em que o usuário autenticado possui uma membership ativa. Esse endpoint é utilizado antes da seleção do contexto multi-tenant.',
  })
  @ApiOkResponse({
    description:
      'Organizações disponíveis retornadas com sucesso.',
    type: UserOrganizationResponseDto,
    isArray: true,
  })
  @ApiUnauthorizedResponse({
    description:
      'Access token ausente, inválido ou expirado.',
    type: ErrorResponseDto,
  })
  async listOrganizations(
    @CurrentUser()
    currentUser: AuthenticatedRequestContext,
  ): Promise<UserOrganizationResult[]> {
    return this.listUserOrganizationsService.execute(
      currentUser.userId,
    );
  }

  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  @Header('Cache-Control', 'no-store')
  @ApiOperation({
    summary: 'Renovar sessão',
    description:
      'Valida o refresh token atual, realiza a rotação das credenciais da sessão e retorna novos tokens.',
  })
  @ApiOkResponse({
    description:
      'Sessão renovada e novos tokens emitidos com sucesso.',
    type: RefreshSessionResponseDto,
  })
  @ApiUnauthorizedResponse({
    description:
      'Refresh token inválido, expirado, revogado ou já utilizado.',
    type: ErrorResponseDto,
  })
  async refresh(
    @Body()
    input: RefreshTokenDto,
  ): Promise<RefreshSessionResult> {
    return this.refreshSessionService.execute({
      refreshToken:
        input.refreshToken,
    });
  }

  @Post('logout')
  @HttpCode(HttpStatus.NO_CONTENT)
  @Header('Cache-Control', 'no-store')
  @ApiOperation({
    summary: 'Encerrar uma sessão',
    description:
      'Revoga a sessão correspondente ao refresh token informado.',
  })
  @ApiNoContentResponse({
    description:
      'Sessão encerrada com sucesso.',
  })
  @ApiUnauthorizedResponse({
    description:
      'Refresh token inválido ou sessão não reconhecida.',
    type: ErrorResponseDto,
  })
  async logout(
    @Body()
    input: RefreshTokenDto,
  ): Promise<void> {
    await this.logoutSessionService.execute({
      refreshToken:
        input.refreshToken,
    });
  }

  @Post('logout-all')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  @Header('Cache-Control', 'no-store')
  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: 'Encerrar todas as sessões',
    description:
      'Revoga todas as sessões ativas pertencentes ao usuário autenticado.',
  })
  @ApiNoContentResponse({
    description:
      'Todas as sessões foram encerradas com sucesso.',
  })
  @ApiUnauthorizedResponse({
    description:
      'Access token ausente, inválido ou expirado.',
    type: ErrorResponseDto,
  })
  async logoutAll(
    @CurrentUser()
    currentUser: AuthenticatedRequestContext,
  ): Promise<void> {
    await this.logoutAllSessionsService.execute({
      userId:
        currentUser.userId,
    });
  }

  @Post('select-organization')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  @Header('Cache-Control', 'no-store')
  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: 'Selecionar organização',
    description:
      'Valida a associação do usuário com a organização e emite um novo access token contendo organizationId, membershipId e role.',
  })
  @ApiOkResponse({
    description:
      'Organização selecionada e token contextualizado emitido com sucesso.',
    type: SelectOrganizationResponseDto,
  })
  @ApiUnauthorizedResponse({
    description:
      'Access token ausente, inválido ou expirado.',
    type: ErrorResponseDto,
  })
  @ApiForbiddenResponse({
    description:
      'O usuário não possui uma associação ativa com a organização informada.',
    type: ErrorResponseDto,
  })
  async selectOrganization(
    @Body()
    input: SelectOrganizationDto,
    @CurrentUser()
    currentUser: AuthenticatedRequestContext,
  ): Promise<SelectOrganizationResult> {
    return this.selectOrganizationService.execute({
      userId:
        currentUser.userId,
      sessionId:
        currentUser.sessionId,
      email:
        currentUser.email,
      organizationId:
        input.organizationId,
    });
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  @Header('Cache-Control', 'no-store')
  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: 'Consultar contexto autenticado',
    description:
      'Retorna os dados extraídos do access token atual, incluindo o contexto organizacional quando uma organização já foi selecionada.',
  })
  @ApiOkResponse({
    description:
      'Contexto autenticado retornado com sucesso.',
    type: AuthenticatedContextResponseDto,
  })
  @ApiUnauthorizedResponse({
    description:
      'Access token ausente, inválido ou expirado.',
    type: ErrorResponseDto,
  })
  getMe(
    @CurrentUser()
    currentUser: AuthenticatedRequestContext,
  ): AuthenticatedRequestContext {
    return currentUser;
  }

  @Get('organization-admin-check')
  @UseGuards(
    JwtAuthGuard,
    RolesGuard,
  )
  @Roles(
    MembershipRole.OWNER,
    MembershipRole.ADMIN,
  )
  @Header('Cache-Control', 'no-store')
  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary:
      'Validar acesso administrativo',
    description:
      'Confirma que o usuário possui contexto organizacional e função OWNER ou ADMIN.',
  })
  @ApiOkResponse({
    description:
      'Usuário autorizado como administrador da organização.',
    type: OrganizationAdminCheckResponseDto,
  })
  @ApiUnauthorizedResponse({
    description:
      'Access token ausente, inválido ou expirado.',
    type: ErrorResponseDto,
  })
  @ApiForbiddenResponse({
    description:
      'Usuário sem contexto organizacional ou sem função administrativa.',
    type: ErrorResponseDto,
  })
  organizationAdminCheck(
    @CurrentUser()
    currentUser: AuthenticatedRequestContext,
  ): OrganizationAdminCheckResponseDto {
    return {
      authorized: true,
      organizationId:
        currentUser.organizationId!,
      membershipId:
        currentUser.membershipId!,
      role:
        currentUser.role!,
    };
  }
}