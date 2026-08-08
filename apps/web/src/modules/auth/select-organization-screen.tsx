'use client';

import {
  Building2,
  Check,
  LoaderCircle,
} from 'lucide-react';
import {
  useRouter,
} from 'next/navigation';
import {
  useState,
} from 'react';
import {
  toast,
} from 'sonner';

import {
  Button,
} from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  ApiError,
} from '@/lib/api/api-error';
import {
  authStorage,
} from '@/lib/auth/auth-storage';

import {
  useOrganizations,
} from './hooks/use-organizations';
import {
  useSelectOrganization,
} from './hooks/use-select-organization';
import type {
  UserOrganization,
} from './auth.types';

function getRoleLabel(
  role: UserOrganization['role'],
): string {
  const labels: Record<
    UserOrganization['role'],
    string
  > = {
    OWNER: 'Proprietário',
    ADMIN: 'Administrador',
    NUTRITIONIST: 'Nutricionista',
    ASSISTANT: 'Assistente',
  };

  return labels[role];
}

export function SelectOrganizationScreen() {
  const router = useRouter();

  const [
    selectedOrganizationId,
    setSelectedOrganizationId,
  ] = useState<string | null>(
    null,
  );

  const organizationsQuery =
    useOrganizations();

  const selectOrganizationMutation =
    useSelectOrganization();

  async function handleContinue() {
    if (!selectedOrganizationId) {
      toast.error(
        'Selecione uma organização.',
      );

      return;
    }

    try {
      const response =
        await selectOrganizationMutation.mutateAsync(
          selectedOrganizationId,
        );

      const refreshToken =
        authStorage.getRefreshToken();

      if (!refreshToken) {
        authStorage.clear();

        toast.error(
          'Sua sessão não está mais disponível. Faça login novamente.',
        );

        router.replace('/login');

        return;
      }

      authStorage.saveTokens(
        response.accessToken,
        refreshToken,
      );

      toast.success(
        'Organização selecionada com sucesso.',
      );

      router.push('/dashboard');
    } catch (error) {
      if (error instanceof ApiError) {
        if (
          error.code ===
          'INVALID_ACCESS_TOKEN'
        ) {
          authStorage.clear();

          toast.error(
            'Sua sessão expirou. Faça login novamente.',
          );

          router.replace('/login');

          return;
        }

        toast.error(
          error.message,
        );

        return;
      }

      toast.error(
        'Não foi possível selecionar a organização.',
      );
    }
  }

  if (
    organizationsQuery.isLoading
  ) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-muted/30 p-6">
        <div className="flex items-center gap-3 text-muted-foreground">
          <LoaderCircle className="size-5 animate-spin" />

          <span>
            Carregando suas organizações...
          </span>
        </div>
      </main>
    );
  }

  if (
    organizationsQuery.isError
  ) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-muted/30 p-6">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>
              Não foi possível carregar suas organizações
            </CardTitle>

            <CardDescription>
              Verifique sua sessão e tente novamente.
            </CardDescription>
          </CardHeader>

          <CardContent>
            <Button
              className="w-full"
              onClick={() =>
                organizationsQuery.refetch()
              }
            >
              Tentar novamente
            </Button>
          </CardContent>
        </Card>
      </main>
    );
  }

  const organizations =
    organizationsQuery.data ?? [];

  return (
    <main className="flex min-h-screen items-center justify-center bg-muted/30 p-6">
      <Card className="w-full max-w-xl">
        <CardHeader>
          <CardTitle className="text-2xl">
            Selecione sua organização
          </CardTitle>

          <CardDescription>
            Escolha o ambiente que deseja acessar nesta sessão.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          {organizations.length ===
          0 ? (
            <div className="rounded-lg border border-dashed p-6 text-center text-sm text-muted-foreground">
              Nenhuma organização ativa está disponível para este usuário.
            </div>
          ) : (
            <div className="space-y-3">
              {organizations.map(
                (organization) => {
                  const isSelected =
                    selectedOrganizationId ===
                    organization.organizationId;

                  return (
                    <button
                      key={
                        organization.membershipId
                      }
                      type="button"
                      onClick={() =>
                        setSelectedOrganizationId(
                          organization.organizationId,
                        )
                      }
                      className={[
                        'flex w-full items-center gap-4 rounded-xl border p-4 text-left transition',
                        isSelected
                          ? 'border-foreground bg-muted'
                          : 'hover:bg-muted/60',
                      ].join(' ')}
                    >
                      <div className="flex size-11 shrink-0 items-center justify-center rounded-lg bg-foreground text-background">
                        <Building2 className="size-5" />
                      </div>

                      <div className="min-w-0 flex-1">
                        <p className="truncate font-medium">
                          {
                            organization.organizationName
                          }
                        </p>

                        <p className="mt-1 text-sm text-muted-foreground">
                          {
                            getRoleLabel(
                              organization.role,
                            )
                          }
                        </p>
                      </div>

                      {isSelected && (
                        <div className="flex size-7 items-center justify-center rounded-full bg-foreground text-background">
                          <Check className="size-4" />
                        </div>
                      )}
                    </button>
                  );
                },
              )}
            </div>
          )}

          <Button
            type="button"
            className="h-11 w-full"
            disabled={
              !selectedOrganizationId ||
              selectOrganizationMutation.isPending
            }
            onClick={
              handleContinue
            }
          >
            {selectOrganizationMutation.isPending ? (
              <>
                <LoaderCircle className="animate-spin" />
                Entrando...
              </>
            ) : (
              'Continuar'
            )}
          </Button>
        </CardContent>
      </Card>
    </main>
  );
}