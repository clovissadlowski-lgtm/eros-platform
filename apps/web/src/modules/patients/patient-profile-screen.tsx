'use client';

import {
  CalendarDays,
  Mail,
  Phone,
  Stethoscope,
  UserRound,
} from 'lucide-react';
import Link from 'next/link';

import {
  Button,
} from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Skeleton,
} from '@/components/ui/skeleton';

import {
  usePatient,
} from './hooks/use-patient';

interface PatientProfileScreenProps {
  patientId: string;
}

function formatBirthDate(
  value: string | null,
): string {
  if (!value) {
    return 'Não informado';
  }

  const [
    year,
    month,
    day,
  ] = value.split('-');

  return `${day}/${month}/${year}`;
}

export function PatientProfileScreen({
  patientId,
}: PatientProfileScreenProps) {
  const patientQuery =
    usePatient(
      patientId,
    );

  if (
    patientQuery.isLoading
  ) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-72" />
        <Skeleton className="h-48 w-full rounded-xl" />
        <Skeleton className="h-48 w-full rounded-xl" />
      </div>
    );
  }

  if (
    patientQuery.isError ||
    !patientQuery.data
  ) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center gap-4 p-10 text-center">
          <p className="font-medium">
            Não foi possível carregar o paciente.
          </p>

          <Button
            variant="outline"
            onClick={() =>
              patientQuery.refetch()
            }
          >
            Tentar novamente
          </Button>
        </CardContent>
      </Card>
    );
  }

  const patient =
    patientQuery.data;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex items-start gap-4">
          <div className="flex size-14 items-center justify-center rounded-full bg-muted">
            <UserRound className="size-6 text-muted-foreground" />
          </div>

          <div>
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-3xl font-semibold tracking-tight">
                {patient.name}
              </h1>

              <span className="rounded-full border px-2.5 py-1 text-xs font-medium">
                {patient.status ===
                'ACTIVE'
                  ? 'Ativo'
                  : 'Inativo'}
              </span>
            </div>

            <p className="mt-1 text-muted-foreground">
              Perfil clínico do paciente
            </p>
          </div>
        </div>

        <Link
          href={`/patients/${patient.id}/medical-record`}
          className="inline-flex h-9 items-center justify-center gap-2 rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground shadow-xs transition hover:bg-primary/90"
        >
          <Stethoscope className="size-4" />
          Abrir prontuário
        </Link>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>
              Dados do paciente
            </CardTitle>
          </CardHeader>

          <CardContent className="grid gap-6 sm:grid-cols-2">
            <div className="flex gap-3">
              <Mail className="mt-0.5 size-4 text-muted-foreground" />

              <div>
                <p className="text-sm font-medium">
                  E-mail
                </p>

                <p className="mt-1 text-sm text-muted-foreground">
                  {patient.email ??
                    'Não informado'}
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <Phone className="mt-0.5 size-4 text-muted-foreground" />

              <div>
                <p className="text-sm font-medium">
                  Telefone
                </p>

                <p className="mt-1 text-sm text-muted-foreground">
                  {patient.phone ??
                    'Não informado'}
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <CalendarDays className="mt-0.5 size-4 text-muted-foreground" />

              <div>
                <p className="text-sm font-medium">
                  Data de nascimento
                </p>

                <p className="mt-1 text-sm text-muted-foreground">
                  {formatBirthDate(
                    patient.birthDate,
                  )}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>
              Resumo clínico
            </CardTitle>
          </CardHeader>

          <CardContent>
            <p className="text-sm text-muted-foreground">
              Informações clínicas, evolução e alertas aparecerão aqui.
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>
              Próximas consultas
            </CardTitle>
          </CardHeader>

          <CardContent>
            <p className="text-sm text-muted-foreground">
              Nenhuma consulta carregada ainda.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>
              Evolução recente
            </CardTitle>
          </CardHeader>

          <CardContent>
            <p className="text-sm text-muted-foreground">
              A evolução clínica aparecerá aqui nas próximas etapas.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}