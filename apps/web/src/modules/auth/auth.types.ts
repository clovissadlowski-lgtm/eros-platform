export interface LoginInput {
  email: string;
  password: string;
}

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  status: string;
  lastLoginAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface AuthSession {
  id: string;
  expiresAt: string;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  tokenType: 'Bearer';
  expiresIn: number;
  user: AuthUser;
  session: AuthSession;
}

export type MembershipRole =
  | 'OWNER'
  | 'ADMIN'
  | 'NUTRITIONIST'
  | 'ASSISTANT';

export type MembershipStatus =
  | 'INVITED'
  | 'ACTIVE'
  | 'SUSPENDED'
  | 'INACTIVE';

export interface UserOrganization {
  organizationId: string;
  organizationName: string;
  organizationSlug: string;
  membershipId: string;
  role: MembershipRole;
  status: MembershipStatus;
}

export interface SelectOrganizationResponse {
  accessToken: string;
}