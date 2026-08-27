export enum PatientStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
}

export enum PatientBiologicalSex {
  MALE = 'MALE',
  FEMALE = 'FEMALE',
}

export class Patient {
  id!: string;

  organizationId!: string;

  name!: string;

  cpf!: string | null;

  email!: string | null;

  phone!: string | null;

  birthDate!: string | null;

  biologicalSex!: PatientBiologicalSex | null;

  status!: PatientStatus;

  createdAt!: string;

  updatedAt!: string;
}