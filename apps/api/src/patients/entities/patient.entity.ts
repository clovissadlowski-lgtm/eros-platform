export enum PatientStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
}

export class Patient {
  id!: string;
  organizationId!: string;
  name!: string;
  email!: string | null;
  phone!: string | null;
  birthDate!: string | null;
  status!: PatientStatus;
  createdAt!: string;
  updatedAt!: string;
}
