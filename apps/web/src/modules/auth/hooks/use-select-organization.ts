'use client';

import {
  useMutation,
} from '@tanstack/react-query';

import {
  selectOrganization,
} from '../auth.service';

export function useSelectOrganization() {
  return useMutation({
    mutationFn:
      selectOrganization,
  });
}