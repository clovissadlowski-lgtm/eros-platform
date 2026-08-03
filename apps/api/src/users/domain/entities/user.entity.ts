export enum UserStatus {
  INVITED = 'INVITED',
  ACTIVE = 'ACTIVE',
  BLOCKED = 'BLOCKED',
  INACTIVE = 'INACTIVE',
}

export interface User {
  id: string;
  name: string;
  email: string;
  passwordHash: string | null;
  status: UserStatus;
  lastLoginAt: string | null;
  createdAt: string;
  updatedAt: string;
}
