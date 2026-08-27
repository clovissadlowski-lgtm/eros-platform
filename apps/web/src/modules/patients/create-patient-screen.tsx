'use client';

import {
  zodResolver,
} from '@hookform/resolvers/zod';

import {
  ArrowLeft,
  Save,
  UserRound,
} from 'lucide-react';

import {
  useRouter,
} from 'next/navigation';

import {
  useState,
} from 'react';

import {
  useForm,
} from 'react-hook-form';

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
  createPatientSchema,
  type CreatePatientFormData,
} from './create-patient.schema';

import {
  useCreatePatient,
} from './hooks/use-create-patient';

import {
  getPatientErrorMessage,
} from './patient-error-message';

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

export function CreatePatientScreen() {
  const router =
    useRouter();

  const createPatientMutation =
    useCreatePatient();

  const [
    submitError,
    setSubmitError,
  ] =
    useState<
      string | null
    >(
      null,
    );

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: {
      errors,
    },
  } =
    useForm<CreatePatientFormData>({
      resolver:
        zodResolver(
          createPatientSchema,
        ),

      defaultValues: {
        name:
          '',

        cpf:
          '',

        email:
          '',

        phone:
          '',

        birthDate:
          '',

        biologicalSex:
          '',
      },
    });

  const cpfValue =
    watch(
      'cpf',
    );

  async function onSubmit(
    values:
      CreatePatientFormData,
  ): Promise<void> {
    setSubmitError(
      null,
    );

    try {
      const normalizedCpf =
        normalizeCpf(
          values.cpf,
        );

      const patient =
        await createPatientMutation.mutateAsync({
          name:
            values.name.trim(),

          cpf:
            normalizedCpf ||
            undefined,

          email:
            values.email.trim() ||
            undefined,

          phone:
            values.phone.trim() ||
            undefined,

          birthDate:
            values.birthDate ||
            undefined,

          biologicalSex:
            values.biologicalSex ||
            undefined,
        });

      router.push(
        `/patients/${patient.id}`,
      );
    } catch (
      error
    ) {
      setSubmitError(
        getPatientErrorMessage(
          error,
          'Não foi possível cadastrar o paciente. Verifique os dados e tente novamente.',
        ),
      );
    }
  }

  return (
    <div className="mx-auto w-full max-w-4xl space-y-6">
      <div>
        <Button
          type="button"
          variant="ghost"
          className="mb-4"
          onClick={() =>
            router.push(
              '/patients',
            )
          }
        >
          <ArrowLeft className="size-4" />

          Voltar para pacientes
        </Button>

        <div className="flex items-start gap-4">
          <div className="flex size-12 items-center justify-center rounded-full bg-muted">
            <UserRound className="size-5 text-muted-foreground" />
          </div>

          <div>
            <h1 className="text-3xl font-semibold tracking-tight">
              Novo paciente
            </h1>

            <p className="mt-1 text-muted-foreground">
              Cadastre as informações básicas do paciente.
            </p>
          </div>
        </div>
      </div>

      <form
        onSubmit={
          handleSubmit(
            onSubmit,
          )
        }
        className="space-y-6"
      >
        <Card>
          <CardHeader>
            <CardTitle>
              Dados pessoais
            </CardTitle>
          </CardHeader>

          <CardContent className="grid gap-6 md:grid-cols-2">
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="name">
                Nome completo *
              </Label>

              <Input
                id="name"
                autoComplete="name"
                placeholder="Ex.: Maria da Silva"
                {...register(
                  'name',
                )}
              />

              {errors.name && (
                <p className="text-sm text-destructive">
                  {
                    errors.name
                      .message
                  }
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="cpf">
                CPF
              </Label>

              <Input
                id="cpf"
                inputMode="numeric"
                autoComplete="off"
                placeholder="000.000.000-00"
                value={
                  cpfValue
                }
                maxLength={14}
                onChange={(
                  event,
                ) => {
                  setValue(
                    'cpf',
                    maskCpf(
                      event.target.value,
                    ),
                    {
                      shouldDirty:
                        true,

                      shouldValidate:
                        true,
                    },
                  );
                }}
              />

              {errors.cpf && (
                <p className="text-sm text-destructive">
                  {
                    errors.cpf
                      .message
                  }
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">
                E-mail
              </Label>

              <Input
                id="email"
                type="email"
                autoComplete="email"
                placeholder="paciente@email.com"
                {...register(
                  'email',
                )}
              />

              {errors.email && (
                <p className="text-sm text-destructive">
                  {
                    errors.email
                      .message
                  }
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">
                Telefone
              </Label>

              <Input
                id="phone"
                type="tel"
                autoComplete="tel"
                placeholder="47999999999"
                {...register(
                  'phone',
                )}
              />

              {errors.phone && (
                <p className="text-sm text-destructive">
                  {
                    errors.phone
                      .message
                  }
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="birthDate">
                Data de nascimento
              </Label>

              <Input
                id="birthDate"
                type="date"
                {...register(
                  'birthDate',
                )}
              />

              {errors.birthDate && (
                <p className="text-sm text-destructive">
                  {
                    errors
                      .birthDate
                      .message
                  }
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="biologicalSex">
                Sexo biológico
              </Label>

              <select
                id="biologicalSex"
                {...register(
                  'biologicalSex',
                )}
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

              {errors.biologicalSex && (
                <p className="text-sm text-destructive">
                  {
                    errors
                      .biologicalSex
                      .message
                  }
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {submitError && (
          <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-4">
            <p className="text-sm text-destructive">
              {submitError}
            </p>
          </div>
        )}

        <div className="flex justify-end gap-3">
          <Button
            type="button"
            variant="outline"
            disabled={
              createPatientMutation.isPending
            }
            onClick={() =>
              router.push(
                '/patients',
              )
            }
          >
            Cancelar
          </Button>

          <Button
            type="submit"
            disabled={
              createPatientMutation.isPending
            }
          >
            <Save className="size-4" />

            {createPatientMutation.isPending
              ? 'Salvando...'
              : 'Cadastrar paciente'}
          </Button>
        </div>
      </form>
    </div>
  );
}