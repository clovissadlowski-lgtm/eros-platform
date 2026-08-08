'use client';

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
  type FieldErrors,
  useForm,
} from 'react-hook-form';
import {
  zodResolver,
} from '@hookform/resolvers/zod';

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

export function CreatePatientScreen() {
  const router =
    useRouter();

  const createPatientMutation =
    useCreatePatient();

  const [
    submitError,
    setSubmitError,
  ] = useState<
    string | null
  >(null);

  const {
    register,
    handleSubmit,
    formState: {
      errors,
    },
  } = useForm<CreatePatientFormData>({
    resolver:
      zodResolver(
        createPatientSchema,
      ),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      birthDate: '',
    },
  });

  async function onSubmit(
    values: CreatePatientFormData,
  ) {
    console.log(
      '[Higeia] submit válido:',
      values,
    );

    setSubmitError(
      null,
    );

    try {
      const patient =
        await createPatientMutation.mutateAsync({
          name:
            values.name.trim(),

          email:
            values.email.trim() ||
            undefined,

          phone:
            values.phone.trim() ||
            undefined,

          birthDate:
            values.birthDate ||
            undefined,
        });

      router.push(
        `/patients/${patient.id}`,
      );
    } catch (error) {
      console.error(
        '[Higeia] erro ao cadastrar paciente:',
        error,
      );

      setSubmitError(
        'Não foi possível cadastrar o paciente. Verifique os dados e tente novamente.',
      );
    }
  }

  function onInvalid(
    formErrors:
      FieldErrors<CreatePatientFormData>,
  ) {
    console.error(
      '[Higeia] formulário inválido:',
      formErrors,
    );

    setSubmitError(
      'Existem dados inválidos no formulário. Verifique os campos destacados.',
    );
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
            onInvalid,
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