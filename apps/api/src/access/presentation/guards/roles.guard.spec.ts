import {
  ExecutionContext,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import type { Request } from 'express';

import {
  MembershipRole,
} from '../../../users/domain/entities/membership.entity';
import { InsufficientRoleError } from '../../domain/errors/insufficient-role.error';
import { TenantContextRequiredError } from '../../domain/errors/tenant-context-required.error';
import { ROLES_METADATA_KEY } from '../decorators/roles.decorator';
import { RolesGuard } from './roles.guard';

describe('RolesGuard', () => {
  let reflector: Reflector;
  let guard: RolesGuard;

  beforeEach(() => {
    reflector = new Reflector();
    guard = new RolesGuard(reflector);
  });

  it('allows access when the route does not require roles', () => {
    const context =
      createExecutionContext({
        auth: undefined,
      });

    expect(
      guard.canActivate(context),
    ).toBe(true);
  });

  it('allows an OWNER when OWNER is required', () => {
    const context =
      createExecutionContext(
        createAuthenticatedRequest(
          MembershipRole.OWNER,
        ),
        [
          MembershipRole.OWNER,
        ],
      );

    expect(
      guard.canActivate(context),
    ).toBe(true);
  });

  it('allows an ADMIN when OWNER or ADMIN is required', () => {
    const context =
      createExecutionContext(
        createAuthenticatedRequest(
          MembershipRole.ADMIN,
        ),
        [
          MembershipRole.OWNER,
          MembershipRole.ADMIN,
        ],
      );

    expect(
      guard.canActivate(context),
    ).toBe(true);
  });

  it('rejects a user without tenant context', () => {
    const context =
      createExecutionContext(
        {
          auth: {
            userId: 'user-id',
            sessionId: 'session-id',
            email: 'user@higeia.test',
            organizationId: null,
            membershipId: null,
            role: null,
          },
        } as Request,
        [
          MembershipRole.OWNER,
        ],
      );

    expect(() =>
      guard.canActivate(context),
    ).toThrow(
      TenantContextRequiredError,
    );
  });

  it('rejects an unauthorized role', () => {
    const context =
      createExecutionContext(
        createAuthenticatedRequest(
          MembershipRole.ASSISTANT,
        ),
        [
          MembershipRole.OWNER,
          MembershipRole.ADMIN,
        ],
      );

    expect(() =>
      guard.canActivate(context),
    ).toThrow(
      InsufficientRoleError,
    );
  });

  it.each([
    MembershipRole.OWNER,
    MembershipRole.ADMIN,
    MembershipRole.NUTRITIONIST,
    MembershipRole.ASSISTANT,
  ])(
    'allows role %s when explicitly required',
    (role) => {
      const context =
        createExecutionContext(
          createAuthenticatedRequest(role),
          [
            role,
          ],
        );

      expect(
        guard.canActivate(context),
      ).toBe(true);
    },
  );

  function createAuthenticatedRequest(
    role: MembershipRole,
  ): Request {
    return {
      auth: {
        userId: 'user-id',
        sessionId: 'session-id',
        email: 'user@higeia.test',
        organizationId:
          'organization-id',
        membershipId:
          'membership-id',
        role,
      },
    } as Request;
  }

  function createExecutionContext(
    request: Request,
    requiredRoles?: MembershipRole[],
  ): ExecutionContext {
    const handler = () => undefined;
    const controller = class TestController {};

    if (requiredRoles) {
      Reflect.defineMetadata(
        ROLES_METADATA_KEY,
        requiredRoles,
        handler,
      );
    }

    return {
      getHandler: () => handler,
      getClass: () => controller,
      switchToHttp: () => ({
        getRequest: () => request,
        getResponse: () => undefined,
        getNext: () => undefined,
      }),
    } as ExecutionContext;
  }
});