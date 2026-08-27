export type PatientStatus =
  | 'ACTIVE'
  | 'INACTIVE';

export type PatientBiologicalSex =
  | 'MALE'
  | 'FEMALE';

export interface Patient {
  id: string;

  organizationId: string;

  name: string;

  cpf: string | null;

  email: string | null;

  phone: string | null;

  birthDate: string | null;

  biologicalSex:
    PatientBiologicalSex | null;

  status:
    PatientStatus;

  createdAt: string;

  updatedAt: string;
}

export interface CreatePatientInput {
  name: string;

  cpf?: string;

  email?: string;

  phone?: string;

  birthDate?: string;

  biologicalSex?:
    PatientBiologicalSex;
}

export interface UpdatePatientInput {
  name?: string;

  cpf?:
    string | null;

  email?:
    string | null;

  phone?:
    string | null;

  birthDate?:
    string | null;

  biologicalSex?:
    PatientBiologicalSex | null;
}