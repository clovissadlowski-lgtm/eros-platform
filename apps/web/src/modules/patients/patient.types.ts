export type PatientStatus =
  | 'ACTIVE'
  | 'INACTIVE';

export interface Patient {
  id: string;
  organizationId: string;
  name: string;
  email: string | null;
  phone: string | null;
  birthDate: string | null;
  status: PatientStatus;
  createdAt: string;
  updatedAt: string;
}

export interface CreatePatientInput {
  name: string;
  email?: string;
  phone?: string;
  birthDate?: string;
}

export interface UpdatePatientInput {
  name?: string;
  email?: string;
  phone?: string;
  birthDate?: string;
}