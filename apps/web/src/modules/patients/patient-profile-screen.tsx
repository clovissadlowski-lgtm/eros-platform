'use client';

import {
  Ban,
  Cake,
  CalendarDays,
  CreditCard,
  Mail,
  Pencil,
  Phone,
  Save,
  Stethoscope,
  UserRound,
  X,
} from 'lucide-react';

import Link from 'next/link';

import {
  useState,
} from 'react';

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
  Input,
} from '@/components/ui/input';

import {
  Label,
} from '@/components/ui/label';

import {
  Skeleton,
} from '@/components/ui/skeleton';

import {
  AllergiesCard,
} from '@/modules/medical-records/allergies-card';

import {
  DietaryRestrictionsCard,
} from '@/modules/medical-records/dietary-restrictions-card';

import {
  HealthConditionsCard,
} from '@/modules/medical-records/health-conditions-card';

import {
  LaboratoryExamsCard,
} from '@/modules/medical-records/laboratory-exams-card';

import {
  MedicationsCard,
} from '@/modules/medical-records/medications-card';

import {
  usePatient,
} from './hooks/use-patient';

import {
  useUpdatePatient,
} from './hooks/use-update-patient';

import {
  useUpdatePatientStatus,
} from './hooks/use-update-patient-status';

import type {
  Patient,
  PatientBiologicalSex,
  PatientStatus,
} from './patient.types';

import {
  getPatientErrorMessage,
} from './patient-error-message';

interface PatientProfileScreenProps {
  patientId: string;
}

interface PatientEditForm {
  name: string;

  cpf: string;

  email: string;

  phone: string;

  birthDate: string;

  biologicalSex:
    '' |
    PatientBiologicalSex;
}

function formatCpf(
  value: string | null,
): string {
  if (
    !value
  ) {
    return 'Não informado';
  }

  const digits =
    value.replace(
      /\D/g,
      '',
    );

  if (
    digits.length !==
    11
  ) {
    return value;
  }

  return digits.replace(
    /^(\d{3})(\d{3})(\d{3})(\d{2})$/,
    '$1.$2.$3-$4',
  );
}

function maskCpf(
  value: string,
): string {
  const digits =
    value
      .replace(
        /\D/g,
        '',
      )
      .slice(
        0,
        11,
      );

  if (
    digits.length <=
    3
  ) {
    return digits;
  }

  if (
    digits.length <=
    6
  ) {
    return `${digits.slice(
      0,
      3,
    )}.${digits.slice(
      3,
    )}`;
  }

  if (
    digits.length <=
    9
  ) {
    return `${digits.slice(
      0,
      3,
    )}.${digits.slice(
      3,
      6,
    )}.${digits.slice(
      6,
    )}`;
  }

  return `${digits.slice(
    0,
    3,
  )}.${digits.slice(
    3,
    6,
  )}.${digits.slice(
    6,
    9,
  )}-${digits.slice(
    9,
    11,
  )}`;
}

function normalizeCpf(
  value: string,
): string {
  return value.replace(
    /\D/g,
    '',
  );
}

function formatBirthDate(
  value: string | null,
): string {
  if (
    !value
  ) {
    return 'Não informado';
  }

  const [
    year,
    month,
    day,
  ] =
    value.split(
      '-',
    );

  if (
    !year ||
    !month ||
    !day
  ) {
    return value;
  }

  return `${day}/${month}/${year}`;
}

function calculateCurrentAge(
  birthDate: string | null,
): number | null {
  if (
    !birthDate
  ) {
    return null;
  }

  const [
    yearValue,
    monthValue,
    dayValue,
  ] =
    birthDate
      .split(
        '-',
      )
      .map(
        Number,
      );

  if (
    !yearValue ||
    !monthValue ||
    !dayValue
  ) {
    return null;
  }

  const today =
    new Date();

  let age =
    today.getFullYear() -
    yearValue;

  const currentMonth =
    today.getMonth() +
    1;

  const currentDay =
    today.getDate();

  const birthdayHasNotOccurred =
    currentMonth <
      monthValue ||
    (
      currentMonth ===
        monthValue &&
      currentDay <
        dayValue
    );

  if (
    birthdayHasNotOccurred
  ) {
    age -=
      1;
  }

  return age >= 0
    ? age
    : null;
}

function formatAge(
  birthDate: string | null,
): string {
  const age =
    calculateCurrentAge(
      birthDate,
    );

  if (
    age === null
  ) {
    return 'Não informado';
  }

  return age === 1
    ? '1 ano'
    : `${age} anos`;
}

function formatBiologicalSex(
  value:
    PatientBiologicalSex | null,
): string {
  if (
    value ===
    'MALE'
  ) {
    return 'Masculino';
  }

  if (
    value ===
    'FEMALE'
  ) {
    return 'Feminino';
  }

  return 'Não informado';
}

function createEditForm(
  patient: Patient,
): PatientEditForm {
  return {
    name:
      patient.name,

    cpf:
      patient.cpf
        ? formatCpf(
            patient.cpf,
          )
        : '',

    email:
      patient.email ??
      '',

    phone:
      patient.phone ??
      '',

    birthDate:
      patient.birthDate ??
      '',

    biologicalSex:
      patient.biologicalSex ??
      '',
  };
}

export function PatientProfileScreen({
  patientId,
}: PatientProfileScreenProps) {
  const patientQuery =
    usePatient(
      patientId,
    );

  const updatePatientMutation =
    useUpdatePatient(
      patientId,
    );

  const updatePatientStatusMutation =
    useUpdatePatientStatus(
      patientId,
    );

  const [
    isEditing,
    setIsEditing,
  ] =
    useState(
      false,
    );

  const [
    editForm,
    setEditForm,
  ] =
    useState<PatientEditForm | null>(
      null,
    );

  const [
    editError,
    setEditError,
  ] =
    useState<
      string | null
    >(
      null,
    );

  const [
    statusError,
    setStatusError,
  ] =
    useState<
      string | null
    >(
      null,
    );

  if (
    patientQuery.isLoading
  ) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Skeleton className="size-14 rounded-full" />

          <div className="space-y-2">
            <Skeleton className="h-8 w-64" />
            <Skeleton className="h-4 w-40" />
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <Skeleton className="h-52 lg:col-span-2" />
          <Skeleton className="h-52" />
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <Skeleton className="h-36" />
          <Skeleton className="h-36" />
        </div>
      </div>
    );
  }

  if (
    patientQuery.isError ||
    !patientQuery.data
  ) {
    return (
      <Card>
        <CardContent className="space-y-4 py-8">
          <p className="text-sm text-destructive">
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

  function startEditing(): void {
    setEditForm(
      createEditForm(
        patient,
      ),
    );

    setEditError(
      null,
    );

    setIsEditing(
      true,
    );
  }

  function cancelEditing(): void {
    setEditForm(
      null,
    );

    setEditError(
      null,
    );

    setIsEditing(
      false,
    );
  }

  async function savePatient():
    Promise<void> {
    if (
      !editForm
    ) {
      return;
    }

    const name =
      editForm.name.trim();

    if (
      name.length <
      2
    ) {
      setEditError(
        'Informe o nome completo do paciente.',
      );

      return;
    }

    const cpf =
      normalizeCpf(
        editForm.cpf,
      );

    if (
      cpf &&
      cpf.length !==
      11
    ) {
      setEditError(
        'Informe um CPF com 11 dígitos.',
      );

      return;
    }

    const email =
      editForm.email.trim();

    if (
      email &&
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
        email,
      )
    ) {
      setEditError(
        'Informe um e-mail válido.',
      );

      return;
    }

    const phone =
      editForm.phone.trim();

    if (
      phone &&
      !/^\+?[0-9]{8,20}$/.test(
        phone,
      )
    ) {
      setEditError(
        'Informe um telefone com 8 a 20 dígitos.',
      );

      return;
    }

    setEditError(
      null,
    );

    try {
      await updatePatientMutation.mutateAsync({
        name,

        cpf:
          cpf ||
          null,

        email:
          email ||
          null,

        phone:
          phone ||
          null,

        birthDate:
          editForm.birthDate ||
          null,

        biologicalSex:
          editForm.biologicalSex ||
          null,
      });

      setEditForm(
        null,
      );

      setIsEditing(
        false,
      );
    } catch (
      error
    ) {
      setEditError(
        getPatientErrorMessage(
          error,
          'Não foi possível atualizar os dados do paciente. Verifique as informações e tente novamente.',
        ),
      );
    }
  }

  async function changePatientStatus():
    Promise<void> {
    const nextStatus:
      PatientStatus =
      patient.status ===
        'ACTIVE'
        ? 'INACTIVE'
        : 'ACTIVE';

    const confirmationMessage =
      nextStatus ===
      'INACTIVE'
        ? 'Deseja bloquear este paciente? O cadastro, o prontuário e todo o histórico clínico permanecerão preservados. O paciente poderá ser desbloqueado posteriormente.'
        : 'Deseja desbloquear este paciente? O paciente voltará a ficar ativo na plataforma e todo o histórico existente continuará vinculado ao mesmo cadastro.';

    if (
      !window.confirm(
        confirmationMessage,
      )
    ) {
      return;
    }

    setStatusError(
      null,
    );

    try {
      await updatePatientStatusMutation.mutateAsync(
        nextStatus,
      );
    } catch {
      setStatusError(
        nextStatus ===
        'INACTIVE'
          ? 'Não foi possível bloquear o paciente. Tente novamente.'
          : 'Não foi possível desbloquear o paciente. Tente novamente.',
      );
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center gap-4">
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
                  : 'Bloqueado'}
              </span>
            </div>

            <p className="mt-1 text-muted-foreground">
              Perfil clínico do paciente
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-2 sm:flex-row">
          <Button
            type="button"
            variant="outline"
            disabled={
              updatePatientStatusMutation.isPending
            }
            className={
              patient.status ===
              'ACTIVE'
                ? 'h-9 w-[170px] gap-2 border-destructive/40 px-4 text-destructive hover:bg-destructive/10 hover:text-destructive'
                : 'h-9 w-[170px] gap-2 px-4'
            }
            onClick={() =>
              void changePatientStatus()
            }
          >
            {updatePatientStatusMutation.isPending ? (
              'Atualizando...'
            ) : patient.status ===
              'ACTIVE' ? (
              <>
                <Ban className="size-4 shrink-0" />

                Bloquear paciente
              </>
            ) : (
              'Desbloquear paciente'
            )}
          </Button>

          <Link
            href={`/patients/${patient.id}/medical-record`}
            className="inline-flex h-9 w-[170px] items-center justify-center gap-2 rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground shadow-xs transition hover:bg-primary/90"
          >
            <Stethoscope className="size-4 shrink-0" />

            Abrir prontuário
          </Link>
        </div>
      </div>

      {statusError && (
        <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-4">
          <p className="text-sm text-destructive">
            {statusError}
          </p>
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex flex-wrap items-center justify-between gap-3">
              <CardTitle>
                Dados do paciente
              </CardTitle>

              {!isEditing && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={
                    startEditing
                  }
                >
                  <Pencil className="size-4" />

                  Editar dados
                </Button>
              )}
            </div>
          </CardHeader>

          <CardContent>
            {isEditing &&
            editForm ? (
              <div className="space-y-6">
                <div className="grid gap-5 sm:grid-cols-2">
                  <div className="space-y-2 sm:col-span-2">
                    <Label htmlFor="patient-name">
                      Nome completo *
                    </Label>

                    <Input
                      id="patient-name"
                      value={
                        editForm.name
                      }
                      onChange={(
                        event,
                      ) =>
                        setEditForm({
                          ...editForm,

                          name:
                            event.target.value,
                        })
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="patient-cpf">
                      CPF
                    </Label>

                    <Input
                      id="patient-cpf"
                      inputMode="numeric"
                      value={
                        editForm.cpf
                      }
                      onChange={(
                        event,
                      ) =>
                        setEditForm({
                          ...editForm,

                          cpf:
                            maskCpf(
                              event.target.value,
                            ),
                        })
                      }
                      placeholder="000.000.000-00"
                      maxLength={14}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="patient-email">
                      E-mail
                    </Label>

                    <Input
                      id="patient-email"
                      type="email"
                      value={
                        editForm.email
                      }
                      onChange={(
                        event,
                      ) =>
                        setEditForm({
                          ...editForm,

                          email:
                            event.target.value,
                        })
                      }
                      placeholder="paciente@email.com"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="patient-phone">
                      Telefone
                    </Label>

                    <Input
                      id="patient-phone"
                      type="tel"
                      value={
                        editForm.phone
                      }
                      onChange={(
                        event,
                      ) =>
                        setEditForm({
                          ...editForm,

                          phone:
                            event.target.value,
                        })
                      }
                      placeholder="47999999999"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="patient-birth-date">
                      Data de nascimento
                    </Label>

                    <Input
                      id="patient-birth-date"
                      type="date"
                      value={
                        editForm.birthDate
                      }
                      onChange={(
                        event,
                      ) =>
                        setEditForm({
                          ...editForm,

                          birthDate:
                            event.target.value,
                        })
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="patient-biological-sex">
                      Sexo biológico
                    </Label>

                    <select
                      id="patient-biological-sex"
                      value={
                        editForm.biologicalSex
                      }
                      onChange={(
                        event,
                      ) =>
                        setEditForm({
                          ...editForm,

                          biologicalSex:
                            event.target.value as
                              | ''
                              | PatientBiologicalSex,
                        })
                      }
                      className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs outline-none transition-[color,box-shadow] focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
                    >
                      <option value="">
                        Não informado
                      </option>

                      <option value="MALE">
                        Masculino
                      </option>

                      <option value="FEMALE">
                        Feminino
                      </option>
                    </select>
                  </div>
                </div>

                {editError && (
                  <p className="text-sm text-destructive">
                    {editError}
                  </p>
                )}

                <div className="flex justify-end gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    disabled={
                      updatePatientMutation.isPending
                    }
                    onClick={
                      cancelEditing
                    }
                  >
                    <X className="size-4" />

                    Cancelar
                  </Button>

                  <Button
                    type="button"
                    disabled={
                      updatePatientMutation.isPending
                    }
                    onClick={() =>
                      void savePatient()
                    }
                  >
                    <Save className="size-4" />

                    {updatePatientMutation.isPending
                      ? 'Salvando...'
                      : 'Salvar alterações'}
                  </Button>
                </div>
              </div>
            ) : (
              <div className="grid gap-6 sm:grid-cols-2">
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
                  <CreditCard className="mt-0.5 size-4 text-muted-foreground" />

                  <div>
                    <p className="text-sm font-medium">
                      CPF
                    </p>

                    <p className="mt-1 text-sm text-muted-foreground">
                      {formatCpf(
                        patient.cpf,
                      )}
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

                <div className="flex gap-3">
                  <Cake className="mt-0.5 size-4 text-muted-foreground" />

                  <div>
                    <p className="text-sm font-medium">
                      Idade atual
                    </p>

                    <p className="mt-1 text-sm text-muted-foreground">
                      {formatAge(
                        patient.birthDate,
                      )}
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <UserRound className="mt-0.5 size-4 text-muted-foreground" />

                  <div>
                    <p className="text-sm font-medium">
                      Sexo biológico
                    </p>

                    <p className="mt-1 text-sm text-muted-foreground">
                      {formatBiologicalSex(
                        patient.biologicalSex,
                      )}
                    </p>
                  </div>
                </div>
              </div>
            )}
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

      <HealthConditionsCard
        patientId={
          patient.id
        }
      />

      <MedicationsCard
        patientId={
          patient.id
        }
      />

      <AllergiesCard
        patientId={
          patient.id
        }
      />

      <DietaryRestrictionsCard
        patientId={
          patient.id
        }
      />

      <LaboratoryExamsCard
        patientId={
          patient.id
        }
      />

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