import {
  CanActivate,
  ExecutionContext,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import type { Request } from 'express';

import type { MembershipRole } from '../../../users/domain/entities/membership.entity';
import { InsufficientRoleError } from '../../domain/errors/insufficient-role.error';
import { TenantContextRequiredError } from '../../domain/errors/tenant-context-required.error';
import { ROLES_METADATA_KEY } from '../decorators/roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
  ) {}

  canActivate(
    context: ExecutionContext,
  ): boolean {
    const requiredRoles =
      this.reflector.getAllAndOverride<
        MembershipRole[]
      >(
        ROLES_METADATA_KEY,
        [
          context.getHandler(),
          context.getClass(),
        ],
      );

    if (
      !requiredRoles ||
      requiredRoles.length === 0
    ) {
      return true;
    }

    const request =
      context.switchToHttp().getRequest<Request>();

    const authenticatedContext =
      request.auth;

    if (
      !authenticatedContext ||
      !authenticatedContext.organizationId ||
      !authenticatedContext.membershipId ||
      !authenticatedContext.role
    ) {
      throw new TenantContextRequiredError();
    }

    const hasRequiredRole =
      requiredRoles.includes(
        authenticatedContext.role,
      );

    if (!hasRequiredRole) {
      throw new InsufficientRoleError();
    }

    return true;
  }
}