import type {
  Metadata,
} from 'next';

import {
  PatientProfileScreen,
} from '@/modules/patients/patient-profile-screen';

export const metadata: Metadata = {
  title: 'Perfil do paciente',
};

interface PatientPageProps {
  params: Promise<{
    patientId: string;
  }>;
}

export default async function PatientPage({
  params,
}: PatientPageProps) {
  const {
    patientId,
  } = await params;

  return (
    <PatientProfileScreen
      patientId={
        patientId
      }
    />
  );
}