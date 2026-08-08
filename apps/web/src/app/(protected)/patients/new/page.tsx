import type {
  Metadata,
} from 'next';

import {
  CreatePatientScreen,
} from '@/modules/patients/create-patient-screen';

export const metadata: Metadata = {
  title: 'Novo paciente',
};

export default function NewPatientPage() {
  return (
    <CreatePatientScreen />
  );
}