import type { MembershipRole } from '../../../users/domain/entities/membership.entity';

export interface AuthenticatedRequestContext {
  userId: string;
  sessionId: string;
  email: string;
  organizationId: string | null;
  membershipId: string | null;
  role: MembershipRole | null;
}