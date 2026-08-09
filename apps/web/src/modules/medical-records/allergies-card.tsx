'use client';

import {
  useEffect,
  useMemo,
  useState,
} from 'react';

import {
  AlertTriangle,
  Check,
  Pencil,
  Plus,
  Search,
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
  useAllergenSearch,
} from './hooks/use-allergen-search';

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
  AllergenCatalogItem,
  AllergenCatalogType,
  AllergySeverity,
  AllergyStatus,
  AllergyType,
  CreateMedicalRecordAllergyInput,
  MedicalRecordAllergy,
  UpdateMedicalRecordAllergyInput,
} from './medical-record.types';

interface AllergiesCardProps {
  patientId: string;
}

interface AllergyFormState {
  allergenCatalogId: string;
  allergenSearch: string;

  reaction: string;
  severity: AllergySeverity | '';
  status: AllergyStatus;

  identifiedAt: string;
  notes: string;
}

const initialFormState:
AllergyFormState = {
  allergenCatalogId: '',
  allergenSearch: '',

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

const allergenCatalogTypeLabels:
Record<AllergenCatalogType, string> = {
  MEDICATION: 'Medicamento',
  ACTIVE_INGREDIENT: 'Princípio ativo',
  FOOD: 'Alimento',
  ENVIRONMENTAL: 'Ambiental',
  CONTACT: 'Contato',
  BIOLOGICAL: 'Biológico',
  CHEMICAL: 'Químico',
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
    value.slice(
      0,
      10,
    );

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
    allergenCatalogId:
      allergy.allergenCatalogId ??
      '',

    allergenSearch:
      allergy.substance,

    reaction:
      allergy.reaction ??
      '',

    severity:
      allergy.severity ??
      '',

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
      allergy.notes ??
      '',
  };
}

function getPrimaryCode(
  allergen:
    AllergenCatalogItem,
): string | null {
  const primary =
    allergen.externalCodes.find(
      (code) =>
        code.isPrimary,
    );

  const selected =
    primary ??
    allergen.externalCodes[0];

  if (!selected) {
    return null;
  }

  return `${selected.system}: ${selected.code}`;
}

function getSynonyms(
  allergen:
    AllergenCatalogItem,
): string[] {
  return allergen.synonyms.map(
    (synonym) =>
      synonym.term,
  );
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

  const [
    debouncedSearch,
    setDebouncedSearch,
  ] = useState('');

  const [
    isSearchOpen,
    setIsSearchOpen,
  ] = useState(false);

  useEffect(
    () => {
      const timeout =
        window.setTimeout(
          () => {
            setDebouncedSearch(
              form.allergenSearch,
            );
          },
          300,
        );

      return () => {
        window.clearTimeout(
          timeout,
        );
      };
    },
    [
      form.allergenSearch,
    ],
  );

  const catalogQuery =
    useAllergenSearch(
      debouncedSearch,
    );

  const editingAllergy =
    useMemo(
      () =>
        allergiesQuery.data?.find(
          (allergy) =>
            allergy.id ===
            editingId,
        ) ??
        null,
      [
        allergiesQuery.data,
        editingId,
      ],
    );

  function resetForm() {
    setForm(
      initialFormState,
    );

    setDebouncedSearch('');
    setIsSearchOpen(false);

    setIsCreating(false);
    setEditingId(null);
  }

  function startCreating() {
    setEditingId(null);

    setForm(
      initialFormState,
    );

    setDebouncedSearch('');
    setIsSearchOpen(false);

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

    const nextForm =
      allergyToFormState(
        allergy,
      );

    setForm(
      nextForm,
    );

    setDebouncedSearch(
      nextForm.allergenSearch,
    );

    setIsSearchOpen(false);
  }

  function selectAllergen(
    allergen:
      AllergenCatalogItem,
  ) {
    setForm(
      (
        current,
      ) => ({
        ...current,

        allergenCatalogId:
          allergen.id,

        allergenSearch:
          allergen.name,
      }),
    );

    setIsSearchOpen(false);
  }

  function createPayload():
  CreateMedicalRecordAllergyInput {
    return {
      allergenCatalogId:
        form.allergenCatalogId,

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

  function updatePayload():
  UpdateMedicalRecordAllergyInput {
    return {
      ...(form.allergenCatalogId
        ? {
            allergenCatalogId:
              form.allergenCatalogId,
          }
        : {}),

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
    };
  }

  async function handleSave() {
    if (editingId) {
      if (
        !editingAllergy
      ) {
        return;
      }

      const originalSearch =
        editingAllergy.substance;

      const searchWasChanged =
        form.allergenSearch.trim() !==
        originalSearch.trim();

      if (
        searchWasChanged &&
        !form.allergenCatalogId
      ) {
        return;
      }

      await updateMutation.mutateAsync({
        allergyId:
          editingId,

        input:
          updatePayload(),
      });

      resetForm();

      return;
    }

    if (
      !form.allergenCatalogId
    ) {
      return;
    }

    await createMutation.mutateAsync(
      createPayload(),
    );

    resetForm();
  }

  async function handleDelete(
    allergy:
      MedicalRecordAllergy,
  ) {
    const confirmed =
      window.confirm(
        `Deseja realmente excluir a alergia "${allergy.substance}"?`,
      );

    if (!confirmed) {
      return;
    }

    await deleteMutation.mutateAsync(
      allergy.id,
    );

    if (
      editingId ===
      allergy.id
    ) {
      resetForm();
    }
  }

  const isSaving =
    createMutation.isPending ||
    updateMutation.isPending;

  function renderAllergenSearch(
    mode:
      | 'create'
      | 'edit',
  ) {
    const results =
      catalogQuery.data ??
      [];

    const hasSearch =
      debouncedSearch
        .trim()
        .length >= 2;

    return (
      <div className="relative space-y-1.5">
        <span className="text-sm font-medium">
          Alérgeno *
        </span>

        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 z-10 size-4 -translate-y-1/2 text-muted-foreground" />

          <input
            value={
              form.allergenSearch
            }
            onFocus={() =>
              setIsSearchOpen(
                true,
              )
            }
            onChange={(
              event,
            ) => {
              const value =
                event.target.value;

              setForm(
                (
                  current,
                ) => ({
                  ...current,

                  allergenSearch:
                    value,

                  allergenCatalogId:
                    '',
                }),
              );

              setIsSearchOpen(
                true,
              );
            }}
            placeholder="Busque por alérgeno, substância ou sinônimo. Ex.: poeira, ácaro, penicilina"
            autoComplete="off"
            className="h-10 w-full rounded-md border bg-background pl-10 pr-3 text-sm"
          />
        </div>

        {form.allergenCatalogId && (
          <p className="flex items-center gap-1 text-xs text-primary">
            <Check className="size-3.5" />
            Alérgeno canônico selecionado
          </p>
        )}

        {isSearchOpen &&
          hasSearch && (
            <div className="absolute z-50 mt-1 max-h-80 w-full overflow-y-auto rounded-lg border bg-background shadow-lg">
              {catalogQuery.isLoading && (
                <p className="p-4 text-sm text-muted-foreground">
                  Pesquisando catálogo de alérgenos...
                </p>
              )}

              {catalogQuery.isError && (
                <p className="p-4 text-sm text-destructive">
                  Não foi possível pesquisar o catálogo de alérgenos.
                </p>
              )}

              {!catalogQuery.isLoading &&
                !catalogQuery.isError &&
                results.length ===
                  0 && (
                  <p className="p-4 text-sm text-muted-foreground">
                    Nenhum alérgeno encontrado.
                  </p>
                )}

              {results.map(
                (
                  allergen,
                ) => {
                  const primaryCode =
                    getPrimaryCode(
                      allergen,
                    );

                  const synonyms =
                    getSynonyms(
                      allergen,
                    );

                  return (
                    <button
                      key={
                        allergen.id
                      }
                      type="button"
                      className="flex w-full flex-col gap-1 border-b px-4 py-3 text-left transition-colors last:border-b-0 hover:bg-muted"
                      onClick={() =>
                        selectAllergen(
                          allergen,
                        )
                      }
                    >
                      <span className="font-medium">
                        {
                          allergen.name
                        }
                      </span>

                      <span className="text-xs text-muted-foreground">
                        Tipo:{' '}
                        {
                          allergenCatalogTypeLabels[
                            allergen.type
                          ]
                        }
                      </span>

                      {synonyms.length >
                        0 && (
                        <span className="text-xs text-muted-foreground">
                          Sinônimos:{' '}
                          {synonyms
                            .slice(
                              0,
                              4,
                            )
                            .join(
                              ', ',
                            )}
                        </span>
                      )}

                      {primaryCode && (
                        <span className="text-xs text-muted-foreground">
                          {
                            primaryCode
                          }
                        </span>
                      )}

                      {allergen.description && (
                        <span className="text-xs text-muted-foreground">
                          {
                            allergen.description
                          }
                        </span>
                      )}
                    </button>
                  );
                },
              )}
            </div>
          )}

        {mode === 'create' &&
          !form.allergenCatalogId &&
          form.allergenSearch
            .trim()
            .length > 0 && (
            <p className="text-xs text-muted-foreground">
              Selecione um alérgeno encontrado no catálogo para continuar.
            </p>
          )}

        {mode === 'edit' &&
          editingAllergy &&
          !editingAllergy.allergenCatalogId &&
          form.allergenSearch ===
            editingAllergy.substance && (
            <p className="text-xs text-muted-foreground">
              Registro legado. Você pode manter os dados atuais ou selecionar um alérgeno do catálogo para padronizá-lo.
            </p>
          )}
      </div>
    );
  }

  function renderForm(
    mode:
      | 'create'
      | 'edit',
  ) {
    const originalSearch =
      editingAllergy
        ?.substance ??
      '';

    const searchWasChanged =
      mode === 'edit' &&
      form.allergenSearch.trim() !==
        originalSearch.trim();

    const canSave =
      mode === 'create'
        ? Boolean(
            form.allergenCatalogId,
          )
        : !searchWasChanged ||
          Boolean(
            form.allergenCatalogId,
          );

    return (
      <div className="grid gap-4 sm:grid-cols-2">
        {renderAllergenSearch(
          mode,
        )}

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
            value={
              form.notes
            }
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
              resetForm
            }
            disabled={
              isSaving
            }
          >
            Cancelar
          </Button>

          <Button
            type="button"
            onClick={() =>
              void handleSave()
            }
            disabled={
              isSaving ||
              !canSave
            }
          >
            {isSaving
              ? 'Salvando...'
              : mode === 'create'
                ? 'Salvar alergia'
                : 'Salvar alterações'}
          </Button>
        </div>
      </div>
    );
  }

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
              Alergias, reações e sensibilidades conhecidas do paciente.
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
              Não foi possível carregar as alergias.
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
              Nenhuma alergia registrada.
            </p>
          )}

        {isCreating && (
          <div className="rounded-xl border p-4">
            {renderForm(
              'create',
            )}
          </div>
        )}

        {allergiesQuery.data?.map(
          (
            allergy,
          ) => (
            <div
              key={
                allergy.id
              }
              className="rounded-xl border p-4"
            >
              {editingId ===
              allergy.id ? (
                renderForm(
                  'edit',
                )
              ) : (
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
                            allergy.type
                          ]
                        }
                      </span>

                      <span className="rounded-full border px-2 py-0.5 text-xs text-muted-foreground">
                        {
                          statusLabels[
                            allergy.status
                          ]
                        }
                      </span>

                      {allergy.severity && (
                        <span className="rounded-full border px-2 py-0.5 text-xs text-muted-foreground">
                          {
                            severityLabels[
                              allergy.severity
                            ]
                          }
                        </span>
                      )}

                      {allergy.allergenCatalogId && (
                        <span className="rounded-full border px-2 py-0.5 text-xs text-primary">
                          Padronizada
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
                      aria-label="Editar alergia"
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
                        void handleDelete(
                          allergy,
                        )
                      }
                      aria-label="Excluir alergia"
                    >
                      <Trash2 className="size-4" />
                    </Button>
                  </div>
                </div>
              )}
            </div>
          ),
        )}

        {(createMutation.isError ||
          updateMutation.isError ||
          deleteMutation.isError) && (
          <p className="text-sm text-destructive">
            Não foi possível concluir a operação. Tente novamente.
          </p>
        )}
      </CardContent>
    </Card>
  );
}