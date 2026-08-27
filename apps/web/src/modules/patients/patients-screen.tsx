'use client';

import {
  Plus,
  Search,
  UserRound,
} from 'lucide-react';
import Link from 'next/link';
import {
  useMemo,
  useState,
} from 'react';

import {
  Button,
} from '@/components/ui/button';
import {
  Card,
  CardContent,
} from '@/components/ui/card';
import {
  Input,
} from '@/components/ui/input';
import {
  Skeleton,
} from '@/components/ui/skeleton';

import {
  usePatients,
} from './hooks/use-patients';

export function PatientsScreen() {
  const [
    search,
    setSearch,
  ] = useState('');

  const patientsQuery =
    usePatients();

  const patients =
  useMemo(() => {
    const source =
      patientsQuery.data ??
      [];

    const normalizedSearch =
      search
        .trim()
        .toLowerCase();

    if (
      !normalizedSearch
    ) {
      return source;
    }

    const normalizedCpfSearch =
      normalizedSearch.replace(
        /\D/g,
        '',
      );

    return source.filter(
      (patient) => {
        const matchesName =
          patient.name
            .toLowerCase()
            .includes(
              normalizedSearch,
            );

        const matchesEmail =
          patient.email
            ?.toLowerCase()
            .includes(
              normalizedSearch,
            ) ??
          false;

        const matchesCpf =
          normalizedCpfSearch.length >
            0 &&
          patient.cpf
            ?.replace(
              /\D/g,
              '',
            )
            .includes(
              normalizedCpfSearch,
            );

        return (
          matchesName ||
          matchesEmail ||
          Boolean(
            matchesCpf,
          )
        );
      },
    );
  }, [
    patientsQuery.data,
    search,
  ]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">
            Pacientes
          </h1>

          <p className="mt-1 text-muted-foreground">
            Gerencie os pacientes da organização ativa.
          </p>
        </div>

        <Link
  href="/patients/new"
  className="inline-flex h-9 items-center justify-center gap-2 rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground shadow-xs transition-all hover:bg-primary/90"
>
  <Plus className="size-4" />
  Novo paciente
</Link>
      </div>

      <Card>
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

            <Input
              value={search}
              onChange={(
                event,
              ) =>
                setSearch(
                  event.target
                    .value,
                )
              }
              placeholder="Buscar por nome ou e-mail ou CPF..."
              className="pl-9"
            />
          </div>
        </CardContent>
      </Card>

      {patientsQuery.isLoading && (
        <div className="space-y-3">
          {Array.from({
            length: 4,
          }).map((_, index) => (
            <Skeleton
              key={index}
              className="h-20 w-full rounded-xl"
            />
          ))}
        </div>
      )}

      {patientsQuery.isError && (
        <Card>
          <CardContent className="flex flex-col items-center gap-4 p-8 text-center">
            <p className="font-medium">
              Não foi possível carregar os pacientes.
            </p>

            <Button
              variant="outline"
              onClick={() =>
                patientsQuery.refetch()
              }
            >
              Tentar novamente
            </Button>
          </CardContent>
        </Card>
      )}

      {patientsQuery.isSuccess &&
        patients.length ===
          0 && (
          <Card>
            <CardContent className="flex flex-col items-center gap-4 p-10 text-center">
              <div className="flex size-12 items-center justify-center rounded-full bg-muted">
                <UserRound className="size-5 text-muted-foreground" />
              </div>

              <div>
                <p className="font-medium">
                  Nenhum paciente encontrado
                </p>

                <p className="mt-1 text-sm text-muted-foreground">
                  Cadastre seu primeiro paciente para começar.
                </p>
              </div>

              <Link
  href="/patients/new"
  className="inline-flex h-9 items-center justify-center gap-2 rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground shadow-xs transition-all hover:bg-primary/90"
>
  <Plus className="size-4" />
  Novo paciente
</Link>
            </CardContent>
          </Card>
        )}

      {patients.length >
        0 && (
        <div className="space-y-3">
          {patients.map(
            (patient) => (
              <Link
                key={
                  patient.id
                }
                href={`/patients/${patient.id}`}
                className="block"
              >
                <Card className="transition hover:bg-muted/40">
                  <CardContent className="flex items-center justify-between gap-4 p-5">
                    <div className="flex min-w-0 items-center gap-4">
                      <div className="flex size-11 shrink-0 items-center justify-center rounded-full bg-muted">
                        <UserRound className="size-5 text-muted-foreground" />
                      </div>

                      <div className="min-w-0">
                        <p className="truncate font-medium">
                          {
                            patient.name
                          }
                        </p>

                        <p className="truncate text-sm text-muted-foreground">
                          {patient.email ??
                            'Sem e-mail'}
                        </p>
                      </div>
                    </div>

                    <span className="text-sm text-muted-foreground">
                      {patient.status ===
                      'ACTIVE'
                        ? 'Ativo'
                        : 'Inativo'}
                    </span>
                  </CardContent>
                </Card>
              </Link>
            ),
          )}
        </div>
      )}
    </div>
  );
}