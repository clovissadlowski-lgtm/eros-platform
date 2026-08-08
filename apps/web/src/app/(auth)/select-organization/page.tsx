import type {
  Metadata,
} from 'next';

import {
  SelectOrganizationScreen,
} from '@/modules/auth/select-organization-screen';

export const metadata: Metadata = {
  title: 'Selecionar organização',
};

export default function SelectOrganizationPage() {
  return (
    <SelectOrganizationScreen />
  );
}