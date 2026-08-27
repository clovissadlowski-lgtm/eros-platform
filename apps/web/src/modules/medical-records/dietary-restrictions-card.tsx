'use client';

import {
  AlertTriangle,
  Ban,
  Check,
  CircleGauge,
  HeartHandshake,
  LoaderCircle,
  Pencil,
  Plus,
  Search,
  Trash2,
  Utensils,
} from 'lucide-react';

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
  useCreateDietaryRestriction,
} from './hooks/use-create-dietary-restriction';

import {
  useDeleteDietaryRestriction,
} from './hooks/use-delete-dietary-restriction';

import {
  useDietaryItemSearch,
} from './hooks/use-dietary-item-search';

import {
  useDietaryRestrictions,
} from './hooks/use-dietary-restrictions';

import {
  useUpdateDietaryRestriction,
} from './hooks/use-update-dietary-restriction';

import type {
  CreateMedicalRecordDietaryRestrictionInput,
  DietaryItemCatalogItem,
  DietaryItemCatalogType,
  DietaryRestrictionAction,
  DietaryRestrictionRisk,
  DietaryRestrictionSource,
  DietaryRestrictionStatus,
  DietaryRestrictionType,
  MedicalRecordDietaryRestriction,
  UpdateMedicalRecordDietaryRestrictionInput,
} from './medical-record.types';

interface DietaryRestrictionsCardProps {
  patientId: string;
}

interface DietaryRestrictionFormState {
  dietaryItemCatalogId:
    string | null;

  item: string;

  type:
    DietaryRestrictionType;

  action:
    DietaryRestrictionAction;

  risk:
    DietaryRestrictionRisk;

  source:
    Exclude<
      DietaryRestrictionSource,
      'SYSTEM_DERIVED'
    >;

  reason: string;

  identifiedAt: string;

  status:
    DietaryRestrictionStatus;

  notes: string;
}

const initialFormState:
  DietaryRestrictionFormState = {
    dietaryItemCatalogId:
      null,

    item:
      '',

    type:
      'PREFERENCE',

    action:
      'AVOID',

    risk:
      'NONE',

    source:
      'PATIENT_REPORTED',

    reason:
      '',

    identifiedAt:
      '',

    status:
      'ACTIVE',

    notes:
      '',
  };

const typeLabels:
  Record<
    DietaryRestrictionType,
    string
  > = {
    PREFERENCE:
      'Preferência',

    INTOLERANCE:
      'Intolerância',

    MEDICAL_RESTRICTION:
      'Restrição clínica',

    CULTURAL_RELIGIOUS:
      'Cultural / religiosa',

    ETHICAL_LIFESTYLE:
      'Ética / estilo de vida',

    OTHER:
      'Outra',
  };

const actionLabels:
  Record<
    DietaryRestrictionAction,
    string
  > = {
    AVOID:
      'Evitar',

    LIMIT:
      'Limitar',

    MONITOR:
      'Monitorar',

    KEEP_CONSISTENT:
      'Manter consistente',

    BLOCK:
      'Bloquear',
  };

const riskLabels:
  Record<
    DietaryRestrictionRisk,
    string
  > = {
    NONE:
      'Sem risco clínico',

    LOW:
      'Risco baixo',

    MODERATE:
      'Risco moderado',

    HIGH:
      'Risco alto',

    CRITICAL:
      'Risco crítico',
  };

const sourceLabels:
  Record<
    DietaryRestrictionSource,
    string
  > = {
    PATIENT_REPORTED:
      'Informado pelo paciente',

    PROFESSIONAL_REPORTED:
      'Registrado pelo profissional',

    SYSTEM_DERIVED:
      'Derivado pela Higeia',
  };

const statusLabels:
  Record<
    DietaryRestrictionStatus,
    string
  > = {
    ACTIVE:
      'Ativa',

    INACTIVE:
      'Inativa',

    RESOLVED:
      'Resolvida',
  };

const catalogTypeLabels:
  Record<
    DietaryItemCatalogType,
    string
  > = {
    FOOD:
      'Alimento',

    NUTRIENT:
      'Nutriente',

    COMPONENT:
      'Componente',

    INGREDIENT:
      'Ingrediente',

    OTHER:
      'Outro',
  };

function formatDate(
  value: string,
): string {
  const normalizedValue =
    value.includes(
      'T',
    )
      ? value
      : `${value}T00:00:00`;

  return new Intl.DateTimeFormat(
    'pt-BR',
  ).format(
    new Date(
      normalizedValue,
    ),
  );
}

function getRiskClassName(
  risk:
    DietaryRestrictionRisk,
): string {
  switch (risk) {
    case 'CRITICAL':
      return 'border-destructive/40 bg-destructive/10 text-destructive';

    case 'HIGH':
      return 'border-destructive/30 text-destructive';

    case 'MODERATE':
      return 'border-amber-500/30 text-amber-600 dark:text-amber-400';

    case 'LOW':
      return 'border-blue-500/30 text-blue-600 dark:text-blue-400';

    case 'NONE':
    default:
      return 'text-muted-foreground';
  }
}

function getTypeIcon(
  type:
    DietaryRestrictionType,
) {
  switch (type) {
    case 'MEDICAL_RESTRICTION':
      return (
        <AlertTriangle className="size-4" />
      );

    case 'INTOLERANCE':
      return (
        <CircleGauge className="size-4" />
      );

    case 'CULTURAL_RELIGIOUS':
    case 'ETHICAL_LIFESTYLE':
      return (
        <HeartHandshake className="size-4" />
      );

    case 'PREFERENCE':
    case 'OTHER':
    default:
      return (
        <Utensils className="size-4" />
      );
  }
}

export function DietaryRestrictionsCard({
  patientId,
}: DietaryRestrictionsCardProps) {
  const restrictionsQuery =
    useDietaryRestrictions(
      patientId,
    );

  const createMutation =
    useCreateDietaryRestriction(
      patientId,
    );

  const updateMutation =
    useUpdateDietaryRestriction(
      patientId,
    );

  const deleteMutation =
    useDeleteDietaryRestriction(
      patientId,
    );

  const [
    isCreating,
    setIsCreating,
  ] =
    useState(
      false,
    );

  const [
    editingId,
    setEditingId,
  ] =
    useState<
      string | null
    >(
      null,
    );

  const [
    form,
    setForm,
  ] =
    useState<DietaryRestrictionFormState>(
      initialFormState,
    );

  const [
    isCatalogOpen,
    setIsCatalogOpen,
  ] =
    useState(
      false,
    );

  const dietaryItemSearch =
    useDietaryItemSearch(
      form.item,
    );

  function resetForm() {
    setForm(
      initialFormState,
    );

    setIsCreating(
      false,
    );

    setEditingId(
      null,
    );

    setIsCatalogOpen(
      false,
    );
  }

  function startCreating() {
    setForm(
      initialFormState,
    );

    setEditingId(
      null,
    );

    setIsCatalogOpen(
      false,
    );

    setIsCreating(
      true,
    );
  }

  function startEditing(
    restriction:
      MedicalRecordDietaryRestriction,
  ) {
    setIsCreating(
      false,
    );

    setEditingId(
      restriction.id,
    );

    setIsCatalogOpen(
      false,
    );

    setForm({
      dietaryItemCatalogId:
        restriction.dietaryItemCatalogId,

      item:
        restriction.item,

      type:
        restriction.type,

      action:
        restriction.action,

      risk:
        restriction.risk,

      source:
        restriction.source ===
        'SYSTEM_DERIVED'
          ? 'PROFESSIONAL_REPORTED'
          : restriction.source,

      reason:
        restriction.reason ??
        '',

      identifiedAt:
        restriction.identifiedAt
          ? restriction.identifiedAt.slice(
              0,
              10,
            )
          : '',

      status:
        restriction.status,

      notes:
        restriction.notes ??
        '',
    });
  }

  function handleItemChange(
    value: string,
  ) {
    setForm(
      (
        current,
      ) => ({
        ...current,

        item:
          value,

        dietaryItemCatalogId:
          null,
      }),
    );

    setIsCatalogOpen(
      value.trim().length >=
        2,
    );
  }

  function selectCatalogItem(
    catalogItem:
      DietaryItemCatalogItem,
  ) {
    setForm(
      (
        current,
      ) => ({
        ...current,

        dietaryItemCatalogId:
          catalogItem.id,

        item:
          catalogItem.name,
      }),
    );

    setIsCatalogOpen(
      false,
    );
  }

  function useFreeText() {
    setForm(
      (
        current,
      ) => ({
        ...current,

        dietaryItemCatalogId:
          null,
      }),
    );

    setIsCatalogOpen(
      false,
    );
  }

  function createPayload():
    CreateMedicalRecordDietaryRestrictionInput {
    return {
      dietaryItemCatalogId:
        form.dietaryItemCatalogId ??
        undefined,

      item:
        form.item.trim(),

      type:
        form.type,

      action:
        form.action,

      risk:
        form.risk,

      source:
        form.source,

      reason:
        form.reason.trim() ||
        undefined,

      identifiedAt:
        form.identifiedAt ||
        undefined,

      status:
        form.status,

      notes:
        form.notes.trim() ||
        undefined,
    };
  }

  function updatePayload():
    UpdateMedicalRecordDietaryRestrictionInput {
    return {
      dietaryItemCatalogId:
        form.dietaryItemCatalogId,

      item:
        form.item.trim(),

      type:
        form.type,

      action:
        form.action,

      risk:
        form.risk,

      source:
        form.source,

      reason:
        form.reason.trim() ||
        null,

      identifiedAt:
        form.identifiedAt ||
        null,

      status:
        form.status,

      notes:
        form.notes.trim() ||
        null,
    };
  }

  async function handleSave() {
    if (
      !form.item.trim()
    ) {
      return;
    }

    if (
      editingId
    ) {
      await updateMutation.mutateAsync({
        restrictionId:
          editingId,

        input:
          updatePayload(),
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
    restriction:
      MedicalRecordDietaryRestriction,
  ) {
    const confirmed =
      window.confirm(
        `Deseja realmente excluir "${restriction.item}" das preferências e restrições alimentares?`,
      );

    if (
      !confirmed
    ) {
      return;
    }

    await deleteMutation.mutateAsync(
      restriction.id,
    );

    if (
      editingId ===
      restriction.id
    ) {
      resetForm();
    }
  }

  const isSaving =
    createMutation.isPending ||
    updateMutation.isPending;

  function renderCatalogSearch() {
    const query =
      form.item.trim();

    const showSuggestions =
      isCatalogOpen &&
      query.length >=
        2 &&
      !form.dietaryItemCatalogId;

    return (
      <div className="relative">
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

          <input
            value={
              form.item
            }
            onChange={(
              event,
            ) =>
              handleItemChange(
                event.target.value,
              )
            }
            onFocus={() => {
              if (
                form.item
                  .trim()
                  .length >=
                  2 &&
                !form.dietaryItemCatalogId
              ) {
                setIsCatalogOpen(
                  true,
                );
              }
            }}
            autoComplete="off"
            placeholder="Ex.: lactose, glúten, tomate, vitamina K"
            className="h-10 w-full rounded-md border bg-background pl-9 pr-9 text-sm"
          />

          {dietaryItemSearch.isFetching &&
            query.length >=
              2 &&
            !form.dietaryItemCatalogId && (
              <LoaderCircle className="absolute right-3 top-1/2 size-4 -translate-y-1/2 animate-spin text-muted-foreground" />
            )}
        </div>

        {form.dietaryItemCatalogId && (
          <div className="mt-2 flex items-center justify-between gap-3 rounded-md border border-primary/30 bg-primary/5 px-3 py-2">
            <div className="flex min-w-0 items-center gap-2">
              <Check className="size-4 shrink-0 text-primary" />

              <div className="min-w-0">
                <p className="text-sm font-medium">
                  {
                    form.item
                  }
                </p>

                <p className="text-xs text-muted-foreground">
                  Item vinculado ao catálogo Higeia
                </p>
              </div>
            </div>

            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={
                useFreeText
              }
            >
              Usar texto livre
            </Button>
          </div>
        )}

        {showSuggestions && (
          <div className="absolute z-50 mt-1 max-h-72 w-full overflow-y-auto rounded-md border bg-popover shadow-md">
            {dietaryItemSearch.isFetching ? (
              <div className="flex items-center gap-2 px-3 py-3 text-sm text-muted-foreground">
                <LoaderCircle className="size-4 animate-spin" />

                Pesquisando catálogo...
              </div>
            ) : dietaryItemSearch.isError ? (
              <div className="px-3 py-3 text-sm text-destructive">
                Não foi possível pesquisar o catálogo.
              </div>
            ) : (
              <>
                {dietaryItemSearch.data?.map(
                  (
                    catalogItem,
                  ) => (
                    <button
                      key={
                        catalogItem.id
                      }
                      type="button"
                      onMouseDown={(
                        event,
                      ) => {
                        event.preventDefault();

                        selectCatalogItem(
                          catalogItem,
                        );
                      }}
                      className="flex w-full items-start justify-between gap-4 border-b px-3 py-3 text-left last:border-b-0 hover:bg-muted/60"
                    >
                      <div className="min-w-0">
                        <p className="font-medium">
                          {
                            catalogItem.name
                          }
                        </p>

                        <div className="mt-1 flex flex-wrap items-center gap-2">
                          <span className="rounded-full border px-2 py-0.5 text-xs text-muted-foreground">
                            {
                              catalogTypeLabels[
                                catalogItem.type
                              ]
                            }
                          </span>

                          {catalogItem.category && (
                            <span className="text-xs text-muted-foreground">
                              {
                                catalogItem.category
                              }
                            </span>
                          )}
                        </div>

                        {catalogItem.description && (
                          <p className="mt-1 text-xs text-muted-foreground">
                            {
                              catalogItem.description
                            }
                          </p>
                        )}
                      </div>

                      <Check className="mt-0.5 size-4 shrink-0 text-primary" />
                    </button>
                  ),
                )}

                {dietaryItemSearch.data
                  ?.length ===
                  0 && (
                  <div className="space-y-1 px-3 py-3">
                    <p className="text-sm font-medium">
                      Nenhum item encontrado no catálogo.
                    </p>

                    <p className="text-xs text-muted-foreground">
                      Você pode registrar “{form.item}” como texto livre.
                    </p>
                  </div>
                )}
              </>
            )}
          </div>
        )}

        {!form.dietaryItemCatalogId &&
          query.length >=
            2 && (
            <p className="mt-1.5 text-xs text-muted-foreground">
              Selecione uma sugestão quando disponível ou continue com texto livre.
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
    return (
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="space-y-1.5 sm:col-span-2">
          <span className="text-sm font-medium">
            Alimento, nutriente ou item *
          </span>

          {renderCatalogSearch()}
        </label>

        <label className="space-y-1.5">
          <span className="text-sm font-medium">
            Tipo
          </span>

          <select
            value={
              form.type
            }
            onChange={(
              event,
            ) =>
              setForm(
                (
                  current,
                ) => ({
                  ...current,

                  type:
                    event.target
                      .value as
                      DietaryRestrictionType,
                }),
              )
            }
            className="h-10 w-full rounded-md border bg-background px-3 text-sm"
          >
            {Object.entries(
              typeLabels,
            ).map(
              ([
                value,
                label,
              ]) => (
                <option
                  key={
                    value
                  }
                  value={
                    value
                  }
                >
                  {label}
                </option>
              ),
            )}
          </select>
        </label>

        <label className="space-y-1.5">
          <span className="text-sm font-medium">
            Conduta
          </span>

          <select
            value={
              form.action
            }
            onChange={(
              event,
            ) =>
              setForm(
                (
                  current,
                ) => ({
                  ...current,

                  action:
                    event.target
                      .value as
                      DietaryRestrictionAction,
                }),
              )
            }
            className="h-10 w-full rounded-md border bg-background px-3 text-sm"
          >
            {Object.entries(
              actionLabels,
            ).map(
              ([
                value,
                label,
              ]) => (
                <option
                  key={
                    value
                  }
                  value={
                    value
                  }
                >
                  {label}
                </option>
              ),
            )}
          </select>
        </label>

        <label className="space-y-1.5">
          <span className="text-sm font-medium">
            Risco
          </span>

          <select
            value={
              form.risk
            }
            onChange={(
              event,
            ) =>
              setForm(
                (
                  current,
                ) => ({
                  ...current,

                  risk:
                    event.target
                      .value as
                      DietaryRestrictionRisk,
                }),
              )
            }
            className="h-10 w-full rounded-md border bg-background px-3 text-sm"
          >
            {Object.entries(
              riskLabels,
            ).map(
              ([
                value,
                label,
              ]) => (
                <option
                  key={
                    value
                  }
                  value={
                    value
                  }
                >
                  {label}
                </option>
              ),
            )}
          </select>
        </label>

        <label className="space-y-1.5">
          <span className="text-sm font-medium">
            Origem
          </span>

          <select
            value={
              form.source
            }
            onChange={(
              event,
            ) =>
              setForm(
                (
                  current,
                ) => ({
                  ...current,

                  source:
                    event.target
                      .value as
                      Exclude<
                        DietaryRestrictionSource,
                        'SYSTEM_DERIVED'
                      >,
                }),
              )
            }
            className="h-10 w-full rounded-md border bg-background px-3 text-sm"
          >
            <option value="PATIENT_REPORTED">
              Informado pelo paciente
            </option>

            <option value="PROFESSIONAL_REPORTED">
              Registrado pelo profissional
            </option>
          </select>
        </label>

        <label className="space-y-1.5 sm:col-span-2">
          <span className="text-sm font-medium">
            Motivo
          </span>

          <input
            value={
              form.reason
            }
            onChange={(
              event,
            ) =>
              setForm(
                (
                  current,
                ) => ({
                  ...current,

                  reason:
                    event.target
                      .value,
                }),
              )
            }
            placeholder="Ex.: desconforto gastrointestinal, preferência pessoal ou orientação clínica"
            className="h-10 w-full rounded-md border bg-background px-3 text-sm"
          />
        </label>

        <label className="space-y-1.5">
          <span className="text-sm font-medium">
            Status
          </span>

          <select
            value={
              form.status
            }
            onChange={(
              event,
            ) =>
              setForm(
                (
                  current,
                ) => ({
                  ...current,

                  status:
                    event.target
                      .value as
                      DietaryRestrictionStatus,
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
                  key={
                    value
                  }
                  value={
                    value
                  }
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
            onChange={(
              event,
            ) =>
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
            onChange={(
              event,
            ) =>
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
              !form.item.trim()
            }
          >
            {isSaving
              ? 'Salvando...'
              : mode ===
                  'create'
                ? 'Salvar restrição'
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
              <Utensils className="size-5 text-primary" />

              Preferências e restrições alimentares
            </CardTitle>

            <p className="mt-1 text-sm text-muted-foreground">
              Preferências, intolerâncias e restrições que devem ser consideradas na prescrição alimentar.
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
        {restrictionsQuery.isLoading && (
          <p className="text-sm text-muted-foreground">
            Carregando preferências e restrições...
          </p>
        )}

        {restrictionsQuery.isError && (
          <div className="space-y-3">
            <p className="text-sm text-destructive">
              Não foi possível carregar as preferências e restrições alimentares.
            </p>

            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                restrictionsQuery.refetch()
              }
            >
              Tentar novamente
            </Button>
          </div>
        )}

        {!restrictionsQuery.isLoading &&
          !restrictionsQuery.isError &&
          restrictionsQuery.data
            ?.length ===
            0 &&
          !isCreating && (
            <p className="text-sm text-muted-foreground">
              Nenhuma preferência ou restrição alimentar registrada.
            </p>
          )}

        {isCreating && (
          <div className="rounded-xl border p-4">
            {renderForm(
              'create',
            )}
          </div>
        )}

        {restrictionsQuery.data?.map(
          (
            restriction,
          ) => (
            <div
              key={
                restriction.id
              }
              className="rounded-xl border p-4"
            >
              {editingId ===
              restriction.id ? (
                renderForm(
                  'edit',
                )
              ) : (
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <div className="flex items-center gap-2 font-medium">
                        {getTypeIcon(
                          restriction.type,
                        )}

                        {
                          restriction.item
                        }
                      </div>

                      {restriction.dietaryItemCatalogId && (
                        <span className="rounded-full border border-primary/30 bg-primary/5 px-2 py-0.5 text-xs text-primary">
                          Catálogo Higeia
                        </span>
                      )}

                      <span className="rounded-full border px-2 py-0.5 text-xs text-muted-foreground">
                        {
                          typeLabels[
                            restriction.type
                          ]
                        }
                      </span>

                      <span className="rounded-full border px-2 py-0.5 text-xs text-muted-foreground">
                        {
                          actionLabels[
                            restriction.action
                          ]
                        }
                      </span>

                      <span
                        className={`rounded-full border px-2 py-0.5 text-xs ${getRiskClassName(
                          restriction.risk,
                        )}`}
                      >
                        {
                          riskLabels[
                            restriction.risk
                          ]
                        }
                      </span>

                      <span className="rounded-full border px-2 py-0.5 text-xs text-muted-foreground">
                        {
                          statusLabels[
                            restriction.status
                          ]
                        }
                      </span>

                      {restriction.source ===
                        'SYSTEM_DERIVED' && (
                        <span className="rounded-full border border-primary/30 bg-primary/5 px-2 py-0.5 text-xs text-primary">
                          Higeia
                        </span>
                      )}
                    </div>

                    <p className="text-xs text-muted-foreground">
                      Origem:{' '}
                      {
                        sourceLabels[
                          restriction.source
                        ]
                      }
                    </p>

                    {restriction.reason && (
                      <p className="text-sm text-muted-foreground">
                        Motivo:{' '}
                        {
                          restriction.reason
                        }
                      </p>
                    )}

                    {restriction.identifiedAt && (
                      <p className="text-sm text-muted-foreground">
                        Identificada em:{' '}
                        {formatDate(
                          restriction.identifiedAt,
                        )}
                      </p>
                    )}

                    {restriction.notes && (
                      <p className="text-sm text-muted-foreground">
                        {
                          restriction.notes
                        }
                      </p>
                    )}

                    {restriction.action ===
                      'BLOCK' && (
                      <div className="flex items-center gap-2 text-sm text-destructive">
                        <Ban className="size-4" />

                        Item bloqueado para prescrição alimentar.
                      </div>
                    )}
                  </div>

                  <div className="flex gap-1">
                    {restriction.source !==
                      'SYSTEM_DERIVED' && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() =>
                          startEditing(
                            restriction,
                          )
                        }
                        aria-label="Editar preferência ou restrição alimentar"
                      >
                        <Pencil className="size-4" />
                      </Button>
                    )}

                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      disabled={
                        deleteMutation.isPending
                      }
                      onClick={() =>
                        void handleDelete(
                          restriction,
                        )
                      }
                      aria-label="Excluir preferência ou restrição alimentar"
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