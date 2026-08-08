'use client';

import {
  Toaster,
} from '@/components/ui/sonner';

import {
  QueryProvider,
} from './query-provider';

interface AppProvidersProps {
  children: React.ReactNode;
}

export function AppProviders({
  children,
}: AppProvidersProps) {
  return (
    <QueryProvider>
      {children}

      <Toaster
        position="top-right"
        richColors
        closeButton
      />
    </QueryProvider>
  );
}