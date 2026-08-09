'use client';

import {
  useState,
} from 'react';
import {
  AlertTriangle,
  Pencil,
  Plus,
  Trash2,
} from 'lucide-react';

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
  useAllergies,
} from './hooks/use-allergies';
import {
  useCreateAllergy,
} from './hooks/use-create-allergy';
import {
  useDeleteAllergy,
} from './hooks/use-delete-allergy';
import {
  useUpdateAllergy,
} from './hooks/use-update-allergy';

import type {
  AllergySeverity,
  AllergyStatus,
  AllergyType,
  CreateMedicalRecordAllergyInput,
  MedicalRecordAllergy,
} from './medical-record.types';

interface AllergiesCardProps {
  patientId: string;
}

interface AllergyFormState {
  substance: string;
  type: AllergyType;
  reaction: string;
  severity: AllergySeverity | '';
  status: AllergyStatus;
  identifiedAt: string;
  notes: string;
}

const initialFormState:
AllergyFormState = {
  substance: '',
  type: 'MEDICATION',
  reaction: '',
  severity: '',
  status: 'ACTIVE',
  identifiedAt: '',
  notes: '',
};

const allergyTypeLabels:
Record<AllergyType, string> = {
  MEDICATION: 'Medicamento',
  FOOD: 'Alimento',
  ENVIRONMENTAL: 'Ambiental',
  CONTACT: 'Contato',
  OTHER: 'Outro',
};

const severityLabels:
Record<AllergySeverity, string> = {
  MILD: 'Leve',
  MODERATE: 'Moderada',
  SEVERE: 'Grave',
  LIFE_THREATENING:
    'Risco de vida',
};

const statusLabels:
Record<AllergyStatus, string> = {
  ACTIVE: 'Ativa',
  INACTIVE: 'Inativa',
  RESOLVED: 'Resolvida',
};

function formatDate(
  value: string | null,
): string {
  if (!value) {
    return '';
  }

  const date =
    value.slice(0, 10);

  const [
    year,
    month,
    day,
  ] = date.split('-');

  return `${day}/${month}/${year}`;
}

function allergyToFormState(
  allergy: MedicalRecordAllergy,
): AllergyFormState {
  return {
    substance:
      allergy.substance,
    type:
      allergy.type,
    reaction:
      allergy.reaction ?? '',
    severity:
      allergy.severity ?? '',
    status:
      allergy.status,
    identifiedAt:
      allergy.identifiedAt
        ? allergy.identifiedAt.slice(
            0,
            10,
          )
        : '',
    notes:
      allergy.notes ?? '',
  };
}

export function AllergiesCard({
  patientId,
}: AllergiesCardProps) {
  const allergiesQuery =
    useAllergies(
      patientId,
    );

  const createMutation =
    useCreateAllergy(
      patientId,
    );

  const updateMutation =
    useUpdateAllergy(
      patientId,
    );

  const deleteMutation =
    useDeleteAllergy(
      patientId,
    );

  const [
    isCreating,
    setIsCreating,
  ] = useState(false);

  const [
    editingId,
    setEditingId,
  ] = useState<
    string | null
  >(null);

  const [
    form,
    setForm,
  ] = useState<
    AllergyFormState
  >(
    initialFormState,
  );

  function resetForm() {
    setForm(
      initialFormState,
    );

    setIsCreating(false);
    setEditingId(null);
  }

  function startCreating() {
    setEditingId(null);

    setForm(
      initialFormState,
    );

    setIsCreating(true);
  }

  function startEditing(
    allergy:
      MedicalRecordAllergy,
  ) {
    setIsCreating(false);

    setEditingId(
      allergy.id,
    );

    setForm(
      allergyToFormState(
        allergy,
      ),
    );
  }

  function createPayload():
  CreateMedicalRecordAllergyInput {
    return {
      substance:
        form.substance.trim(),

      type:
        form.type,

      reaction:
        form.reaction.trim() ||
        undefined,

      severity:
        form.severity ||
        undefined,

      status:
        form.status,

      identifiedAt:
        form.identifiedAt ||
        undefined,

      notes:
        form.notes.trim() ||
        undefined,
    };
  }

  async function handleSave() {
    if (
      !form.substance.trim()
    ) {
      return;
    }

    if (editingId) {
      await updateMutation.mutateAsync({
        allergyId:
          editingId,

        input: {
          substance:
            form.substance.trim(),

          type:
            form.type,

          reaction:
            form.reaction.trim() ||
            null,

          severity:
            form.severity ||
            null,

          status:
            form.status,

          identifiedAt:
            form.identifiedAt ||
            null,

          notes:
            form.notes.trim() ||
            null,
        },
      });

      resetForm();

      return;
    }

    await createMutation.mutateAsync(
      createPayload(),
    );

    resetForm();
  }

  async function handleDelete(
    allergyId: string,
  ) {
    const confirmed =
      window.confirm(
        'Deseja realmente excluir esta alergia?',
      );

    if (!confirmed) {
      return;
    }

    await deleteMutation.mutateAsync(
      allergyId,
    );

    if (
      editingId ===
      allergyId
    ) {
      resetForm();
    }
  }

  const isSaving =
    createMutation.isPending ||
    updateMutation.isPending;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between gap-4">
          <div>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="size-5 text-primary" />

              Alergias
            </CardTitle>

            <p className="mt-1 text-sm text-muted-foreground">
              Alergias, reações e
              sensibilidades conhecidas
              do paciente.
            </p>
          </div>

          {!isCreating &&
            !editingId && (
              <Button
                size="sm"
                onClick={
                  startCreating
                }
              >
                <Plus className="size-4" />
                Adicionar
              </Button>
            )}
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {allergiesQuery.isLoading && (
          <p className="text-sm text-muted-foreground">
            Carregando alergias...
          </p>
        )}

        {allergiesQuery.isError && (
          <div className="space-y-3">
            <p className="text-sm text-destructive">
              Não foi possível
              carregar as alergias.
            </p>

            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                allergiesQuery.refetch()
              }
            >
              Tentar novamente
            </Button>
          </div>
        )}

        {!allergiesQuery.isLoading &&
          !allergiesQuery.isError &&
          allergiesQuery.data
            ?.length === 0 &&
          !isCreating && (
            <p className="text-sm text-muted-foreground">
              Nenhuma alergia
              registrada.
            </p>
          )}

        {allergiesQuery.data?.map(
          (allergy) => (
            <div
              key={
                allergy.id
              }
              className="rounded-xl border p-4"
            >
              {editingId !==
              allergy.id ? (
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="font-medium">
                        {
                          allergy.substance
                        }
                      </p>

                      <span className="rounded-full border px-2 py-0.5 text-xs text-muted-foreground">
                        {
                          allergyTypeLabels[
                            allergy
                              .type
                          ]
                        }
                      </span>

                      <span className="rounded-full border px-2 py-0.5 text-xs text-muted-foreground">
                        {
                          statusLabels[
                            allergy
                              .status
                          ]
                        }
                      </span>

                      {allergy.severity && (
                        <span className="rounded-full border px-2 py-0.5 text-xs text-muted-foreground">
                          {
                            severityLabels[
                              allergy
                                .severity
                            ]
                          }
                        </span>
                      )}
                    </div>

                    {allergy.reaction && (
                      <p className="text-sm text-muted-foreground">
                        Reação:{' '}
                        {
                          allergy.reaction
                        }
                      </p>
                    )}

                    {allergy.identifiedAt && (
                      <p className="text-sm text-muted-foreground">
                        Identificada em:{' '}
                        {formatDate(
                          allergy.identifiedAt,
                        )}
                      </p>
                    )}

                    {allergy.notes && (
                      <p className="text-sm text-muted-foreground">
                        {
                          allergy.notes
                        }
                      </p>
                    )}
                  </div>

                  <div className="flex gap-1">
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() =>
                        startEditing(
                          allergy,
                        )
                      }
                    >
                      <Pencil className="size-4" />
                    </Button>

                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      disabled={
                        deleteMutation.isPending
                      }
                      onClick={() =>
                        handleDelete(
                          allergy.id,
                        )
                      }
                    >
                      <Trash2 className="size-4" />
                    </Button>
                  </div>
                </div>
              ) : (
                <AllergyForm
                  form={form}
                  setForm={
                    setForm
                  }
                  isSaving={
                    isSaving
                  }
                  onCancel={
                    resetForm
                  }
                  onSave={
                    handleSave
                  }
                  submitLabel="Salvar alterações"
                />
              )}
            </div>
          ),
        )}

        {isCreating && (
          <div className="rounded-xl border p-4">
            <AllergyForm
              form={form}
              setForm={
                setForm
              }
              isSaving={
                isSaving
              }
              onCancel={
                resetForm
              }
              onSave={
                handleSave
              }
              submitLabel="Salvar alergia"
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
}

interface AllergyFormProps {
  form: AllergyFormState;

  setForm:
    React.Dispatch<
      React.SetStateAction<
        AllergyFormState
      >
    >;

  isSaving: boolean;
  onCancel: () => void;
  onSave: () => void;

  submitLabel: string;
}

function AllergyForm({
  form,
  setForm,
  isSaving,
  onCancel,
  onSave,
  submitLabel,
}: AllergyFormProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <label className="space-y-1.5">
        <span className="text-sm font-medium">
          Substância *
        </span>

        <input
          value={
            form.substance
          }
          onChange={(event) =>
            setForm(
              (
                current,
              ) => ({
                ...current,
                substance:
                  event.target
                    .value,
              }),
            )
          }
          placeholder="Ex.: Penicilina"
          className="h-10 w-full rounded-md border bg-background px-3 text-sm"
        />
      </label>

      <label className="space-y-1.5">
        <span className="text-sm font-medium">
          Tipo
        </span>

        <select
          value={form.type}
          onChange={(event) =>
            setForm(
              (
                current,
              ) => ({
                ...current,
                type:
                  event.target
                    .value as AllergyType,
              }),
            )
          }
          className="h-10 w-full rounded-md border bg-background px-3 text-sm"
        >
          {Object.entries(
            allergyTypeLabels,
          ).map(
            ([
              value,
              label,
            ]) => (
              <option
                key={value}
                value={value}
              >
                {label}
              </option>
            ),
          )}
        </select>
      </label>

      <label className="space-y-1.5">
        <span className="text-sm font-medium">
          Reação
        </span>

        <input
          value={
            form.reaction
          }
          onChange={(event) =>
            setForm(
              (
                current,
              ) => ({
                ...current,
                reaction:
                  event.target
                    .value,
              }),
            )
          }
          placeholder="Ex.: Urticária"
          className="h-10 w-full rounded-md border bg-background px-3 text-sm"
        />
      </label>

      <label className="space-y-1.5">
        <span className="text-sm font-medium">
          Gravidade
        </span>

        <select
          value={
            form.severity
          }
          onChange={(event) =>
            setForm(
              (
                current,
              ) => ({
                ...current,
                severity:
                  event.target
                    .value as
                    | AllergySeverity
                    | '',
              }),
            )
          }
          className="h-10 w-full rounded-md border bg-background px-3 text-sm"
        >
          <option value="">
            Não informada
          </option>

          {Object.entries(
            severityLabels,
          ).map(
            ([
              value,
              label,
            ]) => (
              <option
                key={value}
                value={value}
              >
                {label}
              </option>
            ),
          )}
        </select>
      </label>

      <label className="space-y-1.5">
        <span className="text-sm font-medium">
          Status
        </span>

        <select
          value={
            form.status
          }
          onChange={(event) =>
            setForm(
              (
                current,
              ) => ({
                ...current,
                status:
                  event.target
                    .value as AllergyStatus,
              }),
            )
          }
          className="h-10 w-full rounded-md border bg-background px-3 text-sm"
        >
          {Object.entries(
            statusLabels,
          ).map(
            ([
              value,
              label,
            ]) => (
              <option
                key={value}
                value={value}
              >
                {label}
              </option>
            ),
          )}
        </select>
      </label>

      <label className="space-y-1.5">
        <span className="text-sm font-medium">
          Data de identificação
        </span>

        <input
          type="date"
          value={
            form.identifiedAt
          }
          onChange={(event) =>
            setForm(
              (
                current,
              ) => ({
                ...current,
                identifiedAt:
                  event.target
                    .value,
              }),
            )
          }
          className="h-10 w-full rounded-md border bg-background px-3 text-sm"
        />
      </label>

      <label className="space-y-1.5 sm:col-span-2">
        <span className="text-sm font-medium">
          Observações
        </span>

        <input
          value={form.notes}
          onChange={(event) =>
            setForm(
              (
                current,
              ) => ({
                ...current,
                notes:
                  event.target
                    .value,
              }),
            )
          }
          placeholder="Informações complementares"
          className="h-10 w-full rounded-md border bg-background px-3 text-sm"
        />
      </label>

      <div className="flex justify-end gap-2 sm:col-span-2">
        <Button
          type="button"
          variant="outline"
          onClick={
            onCancel
          }
          disabled={
            isSaving
          }
        >
          Cancelar
        </Button>

        <Button
          type="button"
          onClick={
            onSave
          }
          disabled={
            isSaving ||
            !form.substance.trim()
          }
        >
          {isSaving
            ? 'Salvando...'
            : submitLabel}
        </Button>
      </div>
    </div>
  );
}