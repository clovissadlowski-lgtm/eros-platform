'use client';

import {
  Check,
  Pencil,
  Plus,
  Search,
  Trash2,
} from 'lucide-react';

import {
  useState,
} from 'react';

import {
  Button,
} from '@/components/ui/button';

import {
  useBiomarkerSearch,
} from './hooks/use-biomarker-search';

import {
  useCreateLaboratoryResult,
} from './hooks/use-create-laboratory-result';

import {
  useDeleteLaboratoryResult,
} from './hooks/use-delete-laboratory-result';

import {
  useLaboratoryResults,
} from './hooks/use-laboratory-results';

import {
  useUpdateLaboratoryResult,
} from './hooks/use-update-laboratory-result';

import type {
  BiomarkerCatalogItem,
  LaboratoryResult,
  LaboratoryResultInterpretation,
} from './medical-record.types';

interface LaboratoryResultsSectionProps {
  patientId: string;

  examId: string;
}

interface LaboratoryResultFormState {
  biomarkerCatalogId:
    string | null;

  name: string;

  valueType:
    | 'NUMERIC'
    | 'TEXT';

  value: string;

  textValue: string;

  unit: string;

  referenceRange: string;

  interpretation: string;
}

const initialFormState:
  LaboratoryResultFormState = {
    biomarkerCatalogId:
      null,

    name:
      '',

    valueType:
      'NUMERIC',

    value:
      '',

    textValue:
      '',

    unit:
      '',

    referenceRange:
      '',

    interpretation:
      '',
  };

const interpretationOptions: Array<{
  value:
    LaboratoryResultInterpretation;

  label:
    string;
}> = [
  {
    value:
      'NORMAL',

    label:
      'Normal',
  },

  {
    value:
      'LOW',

    label:
      'Baixo',
  },

  {
    value:
      'HIGH',

    label:
      'Alto',
  },

  {
    value:
      'CRITICAL_LOW',

    label:
      'Criticamente baixo',
  },

  {
    value:
      'CRITICAL_HIGH',

    label:
      'Criticamente alto',
  },

  {
    value:
      'ABNORMAL',

    label:
      'Alterado',
  },

  {
    value:
      'INCONCLUSIVE',

    label:
      'Inconclusivo',
  },
];

function resultToFormState(
  result:
    LaboratoryResult,
): LaboratoryResultFormState {
  return {
    biomarkerCatalogId:
      result.biomarkerCatalogId,

    name:
      result.name,

    valueType:
      result.value !== null
        ? 'NUMERIC'
        : 'TEXT',

    value:
      result.value ??
      '',

    textValue:
      result.textValue ??
      '',

    unit:
      result.unit ??
      '',

    referenceRange:
      result.referenceRange ??
      '',

    interpretation:
      result.interpretation ??
      '',
  };
}

function formatInterpretation(
  value:
    LaboratoryResultInterpretation | null,
): string {
  switch (
    value
  ) {
    case 'NORMAL':
      return 'Normal';

    case 'LOW':
      return 'Baixo';

    case 'HIGH':
      return 'Alto';

    case 'CRITICAL_LOW':
      return 'Criticamente baixo';

    case 'CRITICAL_HIGH':
      return 'Criticamente alto';

    case 'ABNORMAL':
      return 'Alterado';

    case 'INCONCLUSIVE':
      return 'Inconclusivo';

    default:
      return 'Não interpretado';
  }
}

export function LaboratoryResultsSection({
  patientId,
  examId,
}: LaboratoryResultsSectionProps) {
  const resultsQuery =
    useLaboratoryResults(
      patientId,
      examId,
    );

  const createMutation =
    useCreateLaboratoryResult(
      patientId,
      examId,
    );

  const updateMutation =
    useUpdateLaboratoryResult(
      patientId,
      examId,
    );

  const deleteMutation =
    useDeleteLaboratoryResult(
      patientId,
      examId,
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
    useState<
      LaboratoryResultFormState
    >(
      initialFormState,
    );

  const biomarkerQuery =
    useBiomarkerSearch(
      form.name,
    );

  const isSaving =
    createMutation.isPending ||
    updateMutation.isPending;

  const editingOriginal =
    editingId
      ? resultsQuery.data?.find(
          (
            result,
          ) =>
            result.id ===
            editingId,
        ) ??
        null
      : null;

  const showSuggestions =
    form.name.trim().length >= 2 &&
    !form.biomarkerCatalogId;

  function resetForm(): void {
    setForm(
      initialFormState,
    );

    setIsCreating(
      false,
    );

    setEditingId(
      null,
    );
  }

  function startCreating(): void {
    setEditingId(
      null,
    );

    setForm(
      initialFormState,
    );

    setIsCreating(
      true,
    );
  }

  function startEditing(
    result:
      LaboratoryResult,
  ): void {
    setIsCreating(
      false,
    );

    setEditingId(
      result.id,
    );

    setForm(
      resultToFormState(
        result,
      ),
    );
  }

  function handleBiomarkerNameChange(
    value: string,
  ): void {
    setForm(
      (
        current,
      ) => ({
        ...current,

        name:
          value,

        biomarkerCatalogId:
          null,
      }),
    );
  }

  function selectBiomarker(
    biomarker:
      BiomarkerCatalogItem,
  ): void {
    setForm(
      (
        current,
      ) => ({
        ...current,

        biomarkerCatalogId:
          biomarker.id,

        name:
          biomarker.name,

        unit:
          biomarker.defaultUnit ??
          current.unit,
      }),
    );
  }

  async function handleSave():
  Promise<void> {
    if (
      !form.name.trim()
    ) {
      return;
    }

    const numericMode =
      form.valueType ===
      'NUMERIC';

    if (
      numericMode &&
      !form.value.trim()
    ) {
      return;
    }

    if (
      !numericMode &&
      !form.textValue.trim()
    ) {
      return;
    }

    /*
     * Se o registro originalmente era canônico e o usuário
     * alterou o nome sem selecionar outro biomarcador,
     * não salvamos para evitar manter um ID canônico associado
     * ao nome incorreto.
     */
    if (
      editingOriginal?.biomarkerCatalogId &&
      !form.biomarkerCatalogId
    ) {
      return;
    }

    const interpretation =
      form.interpretation
        ? form.interpretation as
          LaboratoryResultInterpretation
        : undefined;

    if (
      editingId
    ) {
      await updateMutation.mutateAsync({
        resultId:
          editingId,

        input: {
          biomarkerCatalogId:
            form.biomarkerCatalogId ??
            undefined,

          name:
            form.name.trim(),

          value:
            numericMode
              ? form.value.trim()
              : null,

          textValue:
            numericMode
              ? null
              : form.textValue.trim(),

          unit:
            form.unit.trim() ||
            null,

          referenceRange:
            form.referenceRange.trim() ||
            null,

          interpretation:
            interpretation ??
            null,
        },
      });

      resetForm();

      return;
    }

    await createMutation.mutateAsync({
      biomarkerCatalogId:
        form.biomarkerCatalogId ??
        undefined,

      name:
        form.name.trim(),

      value:
        numericMode
          ? form.value.trim()
          : undefined,

      textValue:
        numericMode
          ? undefined
          : form.textValue.trim(),

      unit:
        form.unit.trim() ||
        undefined,

      referenceRange:
        form.referenceRange.trim() ||
        undefined,

      interpretation,
    });

    resetForm();
  }

  async function handleDelete(
    result:
      LaboratoryResult,
  ): Promise<void> {
    const confirmed =
      window.confirm(
        `Deseja excluir o resultado "${result.name}"?`,
      );

    if (
      !confirmed
    ) {
      return;
    }

    await deleteMutation.mutateAsync(
      result.id,
    );

    if (
      editingId ===
      result.id
    ) {
      resetForm();
    }
  }

  function renderForm() {
    const numericMode =
      form.valueType ===
      'NUMERIC';

    const canonicalEditInvalid =
      Boolean(
        editingOriginal?.biomarkerCatalogId,
      ) &&
      !form.biomarkerCatalogId;

    const canSave =
      Boolean(
        form.name.trim(),
      ) &&
      (
        numericMode
          ? Boolean(
              form.value.trim(),
            )
          : Boolean(
              form.textValue.trim(),
            )
      ) &&
      !canonicalEditInvalid;

    return (
      <div className="grid gap-4 rounded-lg border bg-muted/20 p-4 sm:grid-cols-2">
        <div className="relative space-y-1.5">
          <span className="text-sm font-medium">
            Biomarcador / resultado *
          </span>

          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

            <input
              value={
                form.name
              }
              onChange={(
                event,
              ) =>
                handleBiomarkerNameChange(
                  event.target.value,
                )
              }
              placeholder="Ex.: Hemoglobina"
              className="h-10 w-full rounded-md border bg-background pl-9 pr-3 text-sm"
            />
          </div>

          {form.biomarkerCatalogId && (
            <div className="flex items-center gap-1.5 text-xs text-primary">
              <Check className="size-3.5" />

              Biomarcador padronizado selecionado
            </div>
          )}

          {canonicalEditInvalid && (
            <p className="text-xs text-destructive">
              Este resultado estava associado ao catálogo.
              Selecione um biomarcador da lista para alterar o nome.
            </p>
          )}

          {showSuggestions && (
            <div className="absolute z-50 mt-1 max-h-64 w-full overflow-y-auto rounded-md border bg-background shadow-lg">
              {biomarkerQuery.isLoading && (
                <p className="px-3 py-3 text-sm text-muted-foreground">
                  Pesquisando biomarcadores...
                </p>
              )}

              {biomarkerQuery.isError && (
                <p className="px-3 py-3 text-sm text-destructive">
                  Não foi possível pesquisar o catálogo.
                </p>
              )}

              {!biomarkerQuery.isLoading &&
                !biomarkerQuery.isError &&
                biomarkerQuery.data?.length === 0 && (
                  <div className="px-3 py-3">
                    <p className="text-sm text-muted-foreground">
                      Nenhum biomarcador padronizado encontrado.
                    </p>

                    <p className="mt-1 text-xs text-muted-foreground">
                      Você pode continuar e registrar este resultado como texto livre.
                    </p>
                  </div>
                )}

              {biomarkerQuery.data?.map(
                (
                  biomarker,
                ) => (
                  <button
                    key={
                      biomarker.id
                    }
                    type="button"
                    onClick={() =>
                      selectBiomarker(
                        biomarker,
                      )
                    }
                    className="block w-full border-b px-3 py-3 text-left transition last:border-b-0 hover:bg-muted"
                  >
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-sm font-medium">
                        {biomarker.name}
                      </span>

                      {biomarker.code && (
                        <span className="rounded-full border px-2 py-0.5 text-xs text-muted-foreground">
                          {biomarker.code}
                        </span>
                      )}

                      {biomarker.defaultUnit && (
                        <span className="rounded-full border px-2 py-0.5 text-xs text-muted-foreground">
                          {biomarker.defaultUnit}
                        </span>
                      )}
                    </div>

                    {biomarker.description && (
                      <p className="mt-1 text-xs text-muted-foreground">
                        {biomarker.description}
                      </p>
                    )}
                  </button>
                ),
              )}
            </div>
          )}
        </div>

        <label className="space-y-1.5">
          <span className="text-sm font-medium">
            Tipo de resultado
          </span>

          <select
            value={
              form.valueType
            }
            onChange={(
              event,
            ) =>
              setForm(
                (
                  current,
                ) => ({
                  ...current,

                  valueType:
                    event.target.value as
                      | 'NUMERIC'
                      | 'TEXT',

                  value:
                    '',

                  textValue:
                    '',
                }),
              )
            }
            className="h-10 w-full rounded-md border bg-background px-3 text-sm"
          >
            <option value="NUMERIC">
              Numérico
            </option>

            <option value="TEXT">
              Texto
            </option>
          </select>
        </label>

        {numericMode ? (
          <>
            <label className="space-y-1.5">
              <span className="text-sm font-medium">
                Valor *
              </span>

              <input
                value={
                  form.value
                }
                onChange={(
                  event,
                ) =>
                  setForm(
                    (
                      current,
                    ) => ({
                      ...current,

                      value:
                        event.target.value,
                    }),
                  )
                }
                placeholder="Ex.: 15.2"
                className="h-10 w-full rounded-md border bg-background px-3 text-sm"
              />
            </label>

            <label className="space-y-1.5">
              <span className="text-sm font-medium">
                Unidade
              </span>

              <input
                value={
                  form.unit
                }
                onChange={(
                  event,
                ) =>
                  setForm(
                    (
                      current,
                    ) => ({
                      ...current,

                      unit:
                        event.target.value,
                    }),
                  )
                }
                placeholder="Ex.: g/dL"
                className="h-10 w-full rounded-md border bg-background px-3 text-sm"
              />
            </label>
          </>
        ) : (
          <label className="space-y-1.5 sm:col-span-2">
            <span className="text-sm font-medium">
              Resultado *
            </span>

            <input
              value={
                form.textValue
              }
              onChange={(
                event,
              ) =>
                setForm(
                  (
                    current,
                  ) => ({
                    ...current,

                    textValue:
                      event.target.value,
                  }),
                )
              }
              placeholder="Ex.: Não reagente"
              className="h-10 w-full rounded-md border bg-background px-3 text-sm"
            />
          </label>
        )}

        <label className="space-y-1.5">
          <span className="text-sm font-medium">
            Faixa de referência
          </span>

          <input
            value={
              form.referenceRange
            }
            onChange={(
              event,
            ) =>
              setForm(
                (
                  current,
                ) => ({
                  ...current,

                  referenceRange:
                    event.target.value,
                }),
              )
            }
            placeholder="Ex.: 13,5 - 17,5 g/dL"
            className="h-10 w-full rounded-md border bg-background px-3 text-sm"
          />
        </label>

        <label className="space-y-1.5">
          <span className="text-sm font-medium">
            Interpretação
          </span>

          <select
            value={
              form.interpretation
            }
            onChange={(
              event,
            ) =>
              setForm(
                (
                  current,
                ) => ({
                  ...current,

                  interpretation:
                    event.target.value,
                }),
              )
            }
            className="h-10 w-full rounded-md border bg-background px-3 text-sm"
          >
            <option value="">
              Não informada
            </option>

            {interpretationOptions.map(
              (
                option,
              ) => (
                <option
                  key={
                    option.value
                  }
                  value={
                    option.value
                  }
                >
                  {
                    option.label
                  }
                </option>
              ),
            )}
          </select>
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
            disabled={
              !canSave ||
              isSaving
            }
            onClick={() =>
              void handleSave()
            }
          >
            {isSaving
              ? 'Salvando...'
              : editingId
                ? 'Salvar alterações'
                : 'Salvar resultado'}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-4 border-t pt-4">
      <div className="mb-3 flex items-center justify-between gap-3">
        <div>
          <p className="text-sm font-medium">
            Resultados
          </p>

          <p className="text-xs text-muted-foreground">
            Biomarcadores e resultados deste exame.
          </p>
        </div>

        {!isCreating &&
          !editingId && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={
                startCreating
              }
            >
              <Plus className="size-4" />

              Adicionar resultado
            </Button>
          )}
      </div>

      <div className="space-y-3">
        {resultsQuery.isLoading && (
          <p className="text-sm text-muted-foreground">
            Carregando resultados...
          </p>
        )}

        {resultsQuery.isError && (
          <div className="space-y-2">
            <p className="text-sm text-destructive">
              Não foi possível carregar os resultados.
            </p>

            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() =>
                void resultsQuery.refetch()
              }
            >
              Tentar novamente
            </Button>
          </div>
        )}

        {!resultsQuery.isLoading &&
          !resultsQuery.isError &&
          resultsQuery.data?.length === 0 &&
          !isCreating && (
            <p className="text-sm text-muted-foreground">
              Nenhum resultado registrado.
            </p>
          )}

        {isCreating &&
          renderForm()}

        {resultsQuery.data?.map(
          (
            result,
          ) => (
            <div
              key={
                result.id
              }
              className="rounded-lg border p-3"
            >
              {editingId ===
              result.id ? (
                renderForm()
              ) : (
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="font-medium">
                        {result.name}
                      </p>

                      <span className="rounded-full border px-2 py-0.5 text-xs text-muted-foreground">
                        {formatInterpretation(
                          result.interpretation,
                        )}
                      </span>

                      {result.biomarkerCatalogId && (
                        <span className="rounded-full border border-primary/30 px-2 py-0.5 text-xs text-primary">
                          Padronizado
                        </span>
                      )}
                    </div>

                    <p className="mt-1 text-sm">
                      {result.value !== null
                        ? `${result.value}${result.unit ? ` ${result.unit}` : ''}`
                        : result.textValue}
                    </p>

                    {result.referenceRange && (
                      <p className="mt-1 text-xs text-muted-foreground">
                        Referência:{' '}
                        {
                          result.referenceRange
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
                          result,
                        )
                      }
                      aria-label="Editar resultado"
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
                          result,
                        )
                      }
                      aria-label="Excluir resultado"
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
            Não foi possível concluir a operação.
          </p>
        )}
      </div>
    </div>
  );
}