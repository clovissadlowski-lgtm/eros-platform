import { SetMetadata } from '@nestjs/common';

import type { MembershipRole } from '../../../users/domain/entities/membership.entity';

export const ROLES_METADATA_KEY =
  'higeia:required-roles';

export const Roles = (
  ...roles: MembershipRole[]
): MethodDecorator & ClassDecorator =>
  SetMetadata(
    ROLES_METADATA_KEY,
    roles,
  );