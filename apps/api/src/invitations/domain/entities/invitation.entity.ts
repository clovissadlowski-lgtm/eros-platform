import { MembershipRole } from '../../../users/domain/entities/membership.entity';

export enum InvitationStatus {
  PENDING = 'PENDING',
  ACCEPTED = 'ACCEPTED',
  REVOKED = 'REVOKED',
  EXPIRED = 'EXPIRED',
}

export interface Invitation {
  id: string;
  organizationId: string;
  userId: string;
  membershipId: string;
  email: string;
  role: MembershipRole;
  tokenHash: string;
  status: InvitationStatus;
  expiresAt: string;
  acceptedAt: string | null;
  revokedAt: string | null;
  createdByMembershipId: string;
  createdAt: string;
  updatedAt: string;
}