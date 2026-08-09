'use client';

import {
  Activity,
  Check,
  Pencil,
  Plus,
  Search,
  Trash2,
} from 'lucide-react';
import {
  useEffect,
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

import {
  useClinicalConditionSearch,
} from './hooks/use-clinical-condition-search';
import {
  useCreateHealthCondition,
} from './hooks/use-create-health-condition';
import {
  useDeleteHealthCondition,
} from './hooks/use-delete-health-condition';
import {
  useHealthConditions,
} from './hooks/use-health-conditions';
import {
  useUpdateHealthCondition,
} from './hooks/use-update-health-condition';

import type {
  ClinicalConditionCatalogItem,
  HealthCondition,
  HealthConditionStatus,
} from './medical-record.types';

interface HealthConditionsCardProps {
  patientId: string;
}

interface HealthConditionFormState {
  clinicalConditionId: string;
  conditionSearch: string;
  status: HealthConditionStatus;
  diagnosedAt: string;
  notes: string;
}

const emptyForm:
  HealthConditionFormState = {
    clinicalConditionId: '',
    conditionSearch: '',
    status: 'ACTIVE',
    diagnosedAt: '',
    notes: '',
  };

function getStatusLabel(
  status: HealthConditionStatus,
): string {
  switch (status) {
    case 'ACTIVE':
      return 'Ativa';

    case 'CONTROLLED':
      return 'Controlada';

    case 'RESOLVED':
      return 'Resolvida';

    case 'INACTIVE':
      return 'Inativa';
  }
}

function getConceptTypeLabel(
  conceptType:
    ClinicalConditionCatalogItem['conceptType'],
): string {
  switch (conceptType) {
    case 'DISEASE':
      return 'Doença';

    case 'DISORDER':
      return 'Transtorno';

    case 'SYNDROME':
      return 'Síndrome';

    case 'CLINICAL_FINDING':
      return 'Achado clínico';

    case 'CONDITION':
      return 'Condição';

    default:
      return 'Outro';
  }
}

function getPrimaryCode(
  condition:
    ClinicalConditionCatalogItem,
): string | null {
  const primary =
    condition.externalCodes.find(
      (code) =>
        code.isPrimary,
    );

  const code =
    primary ??
    condition.externalCodes[0];

  if (!code) {
    return null;
  }

  return `${code.system.replace(
    '_',
    '-',
  )}: ${code.code}`;
}

function toDateInputValue(
  value: string | null,
): string {
  if (!value) {
    return '';
  }

  return value.slice(
    0,
    10,
  );
}

export function HealthConditionsCard({
  patientId,
}: HealthConditionsCardProps) {
  const healthConditionsQuery =
    useHealthConditions(
      patientId,
    );

  const createMutation =
    useCreateHealthCondition(
      patientId,
    );

  const updateMutation =
    useUpdateHealthCondition(
      patientId,
    );

  const deleteMutation =
    useDeleteHealthCondition(
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
  ] =
    useState<HealthConditionFormState>(
      emptyForm,
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
              form.conditionSearch,
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
      form.conditionSearch,
    ],
  );

  const catalogQuery =
    useClinicalConditionSearch(
      debouncedSearch,
    );

  function resetForm() {
    setForm(
      emptyForm,
    );

    setDebouncedSearch(
      '',
    );

    setIsSearchOpen(
      false,
    );

    setIsCreating(
      false,
    );

    setEditingId(
      null,
    );
  }

  function beginEdit(
    healthCondition:
      HealthCondition,
  ) {
    setIsCreating(
      false,
    );

    setEditingId(
      healthCondition.id,
    );

    setForm({
      clinicalConditionId:
        healthCondition
          .clinicalConditionId ??
        '',

      conditionSearch:
        healthCondition.name,

      status:
        healthCondition.status,

      diagnosedAt:
        toDateInputValue(
          healthCondition
            .diagnosedAt,
        ),

      notes:
        healthCondition.notes ??
        '',
    });

    setIsSearchOpen(
      false,
    );
  }

  function selectCondition(
    condition:
      ClinicalConditionCatalogItem,
  ) {
    setForm(
      (current) => ({
        ...current,

        clinicalConditionId:
          condition.id,

        conditionSearch:
          condition.name,
      }),
    );

    setIsSearchOpen(
      false,
    );
  }

  async function handleCreate() {
    if (
      !form.clinicalConditionId
    ) {
      return;
    }

    await createMutation.mutateAsync({
      clinicalConditionId:
        form.clinicalConditionId,

      status:
        form.status,

      diagnosedAt:
        form.diagnosedAt ||
        undefined,

      notes:
        form.notes.trim() ||
        undefined,
    });

    resetForm();
  }

  async function handleUpdate() {
    if (!editingId) {
      return;
    }

    await updateMutation.mutateAsync({
      healthConditionId:
        editingId,

      input: {
        ...(form.clinicalConditionId
          ? {
              clinicalConditionId:
                form.clinicalConditionId,
            }
          : {}),

        status:
          form.status,

        diagnosedAt:
          form.diagnosedAt ||
          null,

        notes:
          form.notes.trim() ||
          null,
      },
    });

    resetForm();
  }

  async function handleDelete(
    healthCondition:
      HealthCondition,
  ) {
    const confirmed =
      window.confirm(
        `Excluir a condição "${healthCondition.name}"?`,
      );

    if (!confirmed) {
      return;
    }

    await deleteMutation.mutateAsync(
      healthCondition.id,
    );

    if (
      editingId ===
      healthCondition.id
    ) {
      resetForm();
    }
  }

  function renderConditionSearch(
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
      <div className="relative space-y-2">
        <Label
          htmlFor={`health-condition-name-${mode}`}
        >
          Condição *
        </Label>

        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 z-10 size-4 -translate-y-1/2 text-muted-foreground" />

          <Input
            id={`health-condition-name-${mode}`}
            className="pl-10"
            value={
              form.conditionSearch
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

                  conditionSearch:
                    value,

                  clinicalConditionId:
                    '',
                }),
              );

              setIsSearchOpen(
                true,
              );
            }}
            placeholder="Busque por doença, sigla ou código. Ex.: HAS, hipertensão, I10"
            autoComplete="off"
          />
        </div>

        {form.clinicalConditionId && (
          <p className="flex items-center gap-1 text-xs text-primary">
            <Check className="size-3.5" />
            Condição canônica selecionada
          </p>
        )}

        {isSearchOpen &&
          hasSearch && (
            <div className="absolute z-50 mt-1 max-h-80 w-full overflow-y-auto rounded-lg border bg-background shadow-lg">
              {catalogQuery.isLoading && (
                <p className="p-4 text-sm text-muted-foreground">
                  Pesquisando catálogo clínico...
                </p>
              )}

              {catalogQuery.isError && (
                <p className="p-4 text-sm text-destructive">
                  Não foi possível pesquisar o catálogo clínico.
                </p>
              )}

              {!catalogQuery.isLoading &&
                !catalogQuery.isError &&
                results.length ===
                  0 && (
                  <p className="p-4 text-sm text-muted-foreground">
                    Nenhuma condição encontrada.
                  </p>
                )}

              {results.map(
                (
                  condition,
                ) => {
                  const primaryCode =
                    getPrimaryCode(
                      condition,
                    );

                  return (
                    <button
                      key={
                        condition.id
                      }
                      type="button"
                      className="flex w-full flex-col gap-1 border-b px-4 py-3 text-left transition-colors last:border-b-0 hover:bg-muted"
                      onClick={() =>
                        selectCondition(
                          condition,
                        )
                      }
                    >
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-medium">
                          {
                            condition.name
                          }
                        </span>

                        <span className="rounded-full border px-2 py-0.5 text-xs text-muted-foreground">
                          {getConceptTypeLabel(
                            condition.conceptType,
                          )}
                        </span>

                        {condition.category && (
                          <span className="text-xs text-muted-foreground">
                            {
                              condition.category
                            }
                          </span>
                        )}
                      </div>

                      {primaryCode && (
                        <span className="text-xs text-muted-foreground">
                          {
                            primaryCode
                          }
                        </span>
                      )}

                      {condition.synonyms.length >
                        0 && (
                        <span className="line-clamp-1 text-xs text-muted-foreground">
                          Também encontrado como:{' '}
                          {condition.synonyms
                            .slice(
                              0,
                              4,
                            )
                            .map(
                              (
                                synonym,
                              ) =>
                                synonym.term,
                            )
                            .join(
                              ', ',
                            )}
                        </span>
                      )}
                    </button>
                  );
                },
              )}
            </div>
          )}
      </div>
    );
  }

  function renderForm(
    mode:
      | 'create'
      | 'edit',
  ) {
    const isPending =
      createMutation.isPending ||
      updateMutation.isPending;

    const canSave =
      mode === 'create'
        ? Boolean(
            form.clinicalConditionId,
          )
        : true;

    return (
      <div className="space-y-4 rounded-xl border bg-muted/20 p-4">
        <div className="grid gap-4 md:grid-cols-2">
          {renderConditionSearch(
            mode,
          )}

          <div className="space-y-2">
            <Label>
              Status
            </Label>

            <Select
              value={
                form.status
              }
              onValueChange={(
                value,
              ) =>
                setForm(
                  (
                    current,
                  ) => ({
                    ...current,

                    status:
                      value as HealthConditionStatus,
                  }),
                )
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="ACTIVE">
                  Ativa
                </SelectItem>

                <SelectItem value="CONTROLLED">
                  Controlada
                </SelectItem>

                <SelectItem value="RESOLVED">
                  Resolvida
                </SelectItem>

                <SelectItem value="INACTIVE">
                  Inativa
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label
              htmlFor={`health-condition-date-${mode}`}
            >
              Data do diagnóstico
            </Label>

            <Input
              id={`health-condition-date-${mode}`}
              type="date"
              value={
                form.diagnosedAt
              }
              onChange={(
                event,
              ) =>
                setForm(
                  (
                    current,
                  ) => ({
                    ...current,

                    diagnosedAt:
                      event.target
                        .value,
                  }),
                )
              }
            />
          </div>

          <div className="space-y-2">
            <Label
              htmlFor={`health-condition-notes-${mode}`}
            >
              Observações
            </Label>

            <Input
              id={`health-condition-notes-${mode}`}
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
            />
          </div>
        </div>

        {mode === 'create' &&
          !form.clinicalConditionId &&
          form.conditionSearch
            .trim()
            .length > 0 && (
            <p className="text-sm text-muted-foreground">
              Selecione uma condição encontrada no catálogo para continuar.
            </p>
          )}

        <div className="flex justify-end gap-2">
          <Button
            type="button"
            variant="outline"
            disabled={
              isPending
            }
            onClick={
              resetForm
            }
          >
            Cancelar
          </Button>

          <Button
            type="button"
            disabled={
              isPending ||
              !canSave
            }
            onClick={
              mode ===
              'create'
                ? handleCreate
                : handleUpdate
            }
          >
            {isPending
              ? 'Salvando...'
              : mode ===
                  'create'
                ? 'Salvar condição'
                : 'Salvar alterações'}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <div className="space-y-1">
          <CardTitle className="flex items-center gap-2">
            <Activity className="size-5 text-primary" />
            Condições de saúde
          </CardTitle>

          <p className="text-sm text-muted-foreground">
            Histórico estruturado das condições clínicas do paciente.
          </p>
        </div>

        {!isCreating &&
          !editingId && (
            <Button
              type="button"
              size="sm"
              onClick={() => {
                setForm(
                  emptyForm,
                );

                setIsCreating(
                  true,
                );
              }}
            >
              <Plus className="size-4" />
              Adicionar
            </Button>
          )}
      </CardHeader>

      <CardContent className="space-y-4">
        {isCreating &&
          renderForm(
            'create',
          )}

        {healthConditionsQuery.isLoading && (
          <p className="text-sm text-muted-foreground">
            Carregando condições de saúde...
          </p>
        )}

        {healthConditionsQuery.isError && (
          <p className="text-sm text-destructive">
            Não foi possível carregar as condições de saúde.
          </p>
        )}

        {healthConditionsQuery.data?.length ===
          0 &&
          !isCreating && (
            <div className="rounded-xl border border-dashed p-6 text-center">
              <p className="text-sm font-medium">
                Nenhuma condição registrada
              </p>

              <p className="mt-1 text-sm text-muted-foreground">
                As condições clínicas estruturadas do paciente aparecerão aqui.
              </p>
            </div>
          )}

        {healthConditionsQuery.data?.map(
          (
            healthCondition,
          ) => (
            <div
              key={
                healthCondition.id
              }
            >
              {editingId ===
              healthCondition.id ? (
                renderForm(
                  'edit',
                )
              ) : (
                <div className="flex items-start justify-between gap-4 rounded-xl border p-4">
                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="font-medium">
                        {
                          healthCondition.name
                        }
                      </p>

                      <span className="rounded-full border px-2 py-0.5 text-xs text-muted-foreground">
                        {getStatusLabel(
                          healthCondition.status,
                        )}
                      </span>

                      {healthCondition.clinicalConditionId && (
                        <span className="rounded-full border px-2 py-0.5 text-xs text-primary">
                          Padronizada
                        </span>
                      )}
                    </div>

                    {healthCondition.diagnosedAt && (
                      <p className="text-sm text-muted-foreground">
                        Diagnóstico:{' '}
                        {new Date(
                          healthCondition.diagnosedAt,
                        ).toLocaleDateString(
                          'pt-BR',
                          {
                            timeZone:
                              'UTC',
                          },
                        )}
                      </p>
                    )}

                    {healthCondition.notes && (
                      <p className="text-sm text-muted-foreground">
                        {
                          healthCondition.notes
                        }
                      </p>
                    )}
                  </div>

                  <div className="flex items-center gap-1">
                    <Button
                      type="button"
                      size="icon"
                      variant="ghost"
                      onClick={() =>
                        beginEdit(
                          healthCondition,
                        )
                      }
                      aria-label="Editar condição de saúde"
                    >
                      <Pencil className="size-4" />
                    </Button>

                    <Button
                      type="button"
                      size="icon"
                      variant="ghost"
                      disabled={
                        deleteMutation.isPending
                      }
                      onClick={() =>
                        void handleDelete(
                          healthCondition,
                        )
                      }
                      aria-label="Excluir condição de saúde"
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