import { MembershipRole } from '../../../users/domain/entities/membership.entity';

export interface AccessTokenPayload {
  sub: string;
  sessionId: string;
  email: string;
  organizationId?: string;
  membershipId?: string;
  role?: MembershipRole;
}

export abstract class AccessTokenProvider {
  abstract generate(
    payload: AccessTokenPayload,
  ): Promise<string>;

  abstract verify(
    accessToken: string,
  ): Promise<AccessTokenPayload>;
}