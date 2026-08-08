import type {
  Metadata,
} from 'next';

import {
  PatientsScreen,
} from '@/modules/patients/patients-screen';

export const metadata: Metadata = {
  title: 'Pacientes',
};

export default function PatientsPage() {
  return (
    <PatientsScreen />
  );
}