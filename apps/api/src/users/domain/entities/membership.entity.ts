export enum MembershipRole {
  OWNER = 'OWNER',
  ADMIN = 'ADMIN',
  NUTRITIONIST = 'NUTRITIONIST',
  ASSISTANT = 'ASSISTANT',
}

export enum MembershipStatus {
  INVITED = 'INVITED',
  ACTIVE = 'ACTIVE',
  SUSPENDED = 'SUSPENDED',
  INACTIVE = 'INACTIVE',
}

export interface Membership {
  id: string;
  userId: string;
  organizationId: string;
  role: MembershipRole;
  status: MembershipStatus;
  createdAt: string;
  updatedAt: string;
}
