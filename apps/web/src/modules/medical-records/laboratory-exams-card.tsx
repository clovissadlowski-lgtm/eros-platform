'use client';

import {
  useMemo,
  useState,
} from 'react';

import {
  FlaskConical,
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
  useCreateLaboratoryExam,
} from './hooks/use-create-laboratory-exam';

import {
  useDeleteLaboratoryExam,
} from './hooks/use-delete-laboratory-exam';

import {
  useLaboratoryExams,
} from './hooks/use-laboratory-exams';

import {
  useUpdateLaboratoryExam,
} from './hooks/use-update-laboratory-exam';

import type {
  BiomarkerReferenceContext,
  CreateLaboratoryExamInput,
  LaboratoryExam,
  UpdateLaboratoryExamInput,
} from './medical-record.types';

import {
  LaboratoryResultsSection,
} from './laboratory-results-section';

interface LaboratoryExamsCardProps {
  patientId: string;
}

interface LaboratoryExamFormState {
  name: string;
  laboratoryName: string;
  collectedAt: string;
  resultedAt: string;
  collectionContext:
    BiomarkerReferenceContext | '';
  notes: string;
}

const initialFormState:
  LaboratoryExamFormState = {
    name: '',
    laboratoryName: '',
    collectedAt: '',
    resultedAt: '',
    collectionContext: '',
    notes: '',
  };

const collectionContextLabels:
  Record<
    BiomarkerReferenceContext,
    string
  > = {
    GENERAL: 'Geral',
    FASTING: 'Em jejum',
    NON_FASTING: 'Sem jejum',
  };

function dateToInputValue(
  value: string | null,
): string {
  if (!value) {
    return '';
  }

  return value.split('T')[0];
}

function formatDate(
  value: string | null,
): string {
  if (!value) {
    return 'Não informada';
  }

  const datePart =
    value.split('T')[0];

  const [
    year,
    month,
    day,
  ] = datePart.split('-');

  if (
    !year ||
    !month ||
    !day
  ) {
    return value;
  }

  return `${day}/${month}/${year}`;
}

function examToFormState(
  exam: LaboratoryExam,
): LaboratoryExamFormState {
  return {
    name:
      exam.name,

    laboratoryName:
      exam.laboratoryName ??
      '',

    collectedAt:
      dateToInputValue(
        exam.collectedAt,
      ),

    resultedAt:
      dateToInputValue(
        exam.resultedAt,
      ),

    collectionContext:
      exam.collectionContext ??
      '',

    notes:
      exam.notes ??
      '',
  };
}

export function LaboratoryExamsCard({
  patientId,
}: LaboratoryExamsCardProps) {
  const examsQuery =
    useLaboratoryExams(
      patientId,
    );

  const createMutation =
    useCreateLaboratoryExam(
      patientId,
    );

  const updateMutation =
    useUpdateLaboratoryExam(
      patientId,
    );

  const deleteMutation =
    useDeleteLaboratoryExam(
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
    useState<
      LaboratoryExamFormState
    >(
      initialFormState,
    );

  const editingExam =
    useMemo(
      () =>
        examsQuery.data?.find(
          (
            exam,
          ) =>
            exam.id ===
            editingId,
        ) ??
        null,
      [
        examsQuery.data,
        editingId,
      ],
    );

  const isSaving =
    createMutation.isPending ||
    updateMutation.isPending;

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
    exam: LaboratoryExam,
  ): void {
    setIsCreating(
      false,
    );

    setEditingId(
      exam.id,
    );

    setForm(
      examToFormState(
        exam,
      ),
    );
  }

  function createPayload():
    CreateLaboratoryExamInput {
    return {
      name:
        form.name.trim(),

      laboratoryName:
        form.laboratoryName
          .trim() ||
        undefined,

      collectedAt:
        form.collectedAt ||
        undefined,

      resultedAt:
        form.resultedAt ||
        undefined,

      collectionContext:
        form.collectionContext ||
        undefined,

      notes:
        form.notes.trim() ||
        undefined,
    };
  }

  function updatePayload():
    UpdateLaboratoryExamInput {
    return {
      name:
        form.name.trim(),

      laboratoryName:
        form.laboratoryName
          .trim() ||
        null,

      collectedAt:
        form.collectedAt ||
        null,

      resultedAt:
        form.resultedAt ||
        null,

      collectionContext:
        form.collectionContext ||
        null,

      notes:
        form.notes.trim() ||
        null,
    };
  }

  async function handleSave():
    Promise<void> {
    if (
      !form.name.trim()
    ) {
      return;
    }

    if (
      editingId
    ) {
      if (
        !editingExam
      ) {
        return;
      }

      await updateMutation.mutateAsync({
        examId:
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
    exam: LaboratoryExam,
  ): Promise<void> {
    const confirmed =
      window.confirm(
        `Deseja realmente excluir o exame "${exam.name}"? Todos os resultados associados também serão excluídos.`,
      );

    if (
      !confirmed
    ) {
      return;
    }

    await deleteMutation.mutateAsync(
      exam.id,
    );

    if (
      editingId ===
      exam.id
    ) {
      resetForm();
    }
  }

  function renderForm() {
    const canSave =
      Boolean(
        form.name.trim(),
      );

    return (
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="space-y-1.5">
          <span className="text-sm font-medium">
            Nome do exame *
          </span>

          <input
            value={
              form.name
            }
            onChange={(
              event,
            ) =>
              setForm(
                (
                  current,
                ) => ({
                  ...current,

                  name:
                    event.target
                      .value,
                }),
              )
            }
            placeholder="Ex.: Hemograma completo"
            className="h-10 w-full rounded-md border bg-background px-3 text-sm"
          />
        </label>

        <label className="space-y-1.5">
          <span className="text-sm font-medium">
            Laboratório
          </span>

          <input
            value={
              form.laboratoryName
            }
            onChange={(
              event,
            ) =>
              setForm(
                (
                  current,
                ) => ({
                  ...current,

                  laboratoryName:
                    event.target
                      .value,
                }),
              )
            }
            placeholder="Ex.: Laboratório Higeia"
            className="h-10 w-full rounded-md border bg-background px-3 text-sm"
          />
        </label>

        <label className="space-y-1.5">
          <span className="text-sm font-medium">
            Data da coleta
          </span>

          <input
            type="date"
            value={
              form.collectedAt
            }
            onChange={(
              event,
            ) =>
              setForm(
                (
                  current,
                ) => ({
                  ...current,

                  collectedAt:
                    event.target
                      .value,
                }),
              )
            }
            className="h-10 w-full rounded-md border bg-background px-3 text-sm"
          />
        </label>

        <label className="space-y-1.5">
          <span className="text-sm font-medium">
            Data do resultado
          </span>

          <input
            type="date"
            value={
              form.resultedAt
            }
            onChange={(
              event,
            ) =>
              setForm(
                (
                  current,
                ) => ({
                  ...current,

                  resultedAt:
                    event.target
                      .value,
                }),
              )
            }
            className="h-10 w-full rounded-md border bg-background px-3 text-sm"
          />
        </label>

        <label className="space-y-1.5">
          <span className="text-sm font-medium">
            Contexto da coleta
          </span>

          <select
            value={
              form.collectionContext
            }
            onChange={(
              event,
            ) =>
              setForm(
                (
                  current,
                ) => ({
                  ...current,

                  collectionContext:
                    event.target.value as
                      BiomarkerReferenceContext | '',
                }),
              )
            }
            className="h-10 w-full rounded-md border bg-background px-3 text-sm"
          >
            <option value="">
              Não informado
            </option>

            <option value="GENERAL">
              Geral
            </option>

            <option value="FASTING">
              Em jejum
            </option>

            <option value="NON_FASTING">
              Sem jejum
            </option>
          </select>
        </label>

        <label className="space-y-1.5">
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
              !canSave
            }
          >
            {isSaving
              ? 'Salvando...'
              : editingId
                ? 'Salvar alterações'
                : 'Salvar exame'}
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
              <FlaskConical className="size-5 text-primary" />

              Exames laboratoriais
            </CardTitle>

            <p className="mt-1 text-sm text-muted-foreground">
              Exames, coletas e resultados laboratoriais do paciente.
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
        {examsQuery.isLoading && (
          <p className="text-sm text-muted-foreground">
            Carregando exames laboratoriais...
          </p>
        )}

        {examsQuery.isError && (
          <div className="space-y-3">
            <p className="text-sm text-destructive">
              Não foi possível carregar os exames laboratoriais.
            </p>

            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() =>
                void examsQuery.refetch()
              }
            >
              Tentar novamente
            </Button>
          </div>
        )}

        {!examsQuery.isLoading &&
          !examsQuery.isError &&
          examsQuery.data
            ?.length === 0 &&
          !isCreating && (
            <p className="text-sm text-muted-foreground">
              Nenhum exame laboratorial registrado.
            </p>
          )}

        {isCreating && (
          <div className="rounded-xl border p-4">
            {renderForm()}
          </div>
        )}

        {examsQuery.data?.map(
          (
            exam,
          ) => (
            <div
              key={
                exam.id
              }
              className="rounded-xl border p-4"
            >
              {editingId ===
              exam.id ? (
                renderForm()
              ) : (
                <div className="space-y-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="space-y-1.5">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="font-medium">
                          {exam.name}
                        </p>

                        <span className="rounded-full border px-2 py-0.5 text-xs text-muted-foreground">
                          Exame laboratorial
                        </span>

                        {exam.collectionContext && (
                          <span className="rounded-full border px-2 py-0.5 text-xs text-muted-foreground">
                            {
                              collectionContextLabels[
                                exam.collectionContext
                              ]
                            }
                          </span>
                        )}
                      </div>

                      {exam.laboratoryName && (
                        <p className="text-sm text-muted-foreground">
                          Laboratório:{' '}
                          {
                            exam.laboratoryName
                          }
                        </p>
                      )}

                      {exam.collectedAt && (
                        <p className="text-sm text-muted-foreground">
                          Coleta:{' '}
                          {formatDate(
                            exam.collectedAt,
                          )}
                        </p>
                      )}

                      {exam.collectionContext && (
                        <p className="text-sm text-muted-foreground">
                          Contexto:{' '}
                          {
                            collectionContextLabels[
                              exam.collectionContext
                            ]
                          }
                        </p>
                      )}

                      {exam.resultedAt && (
                        <p className="text-sm text-muted-foreground">
                          Resultado:{' '}
                          {formatDate(
                            exam.resultedAt,
                          )}
                        </p>
                      )}

                      {exam.notes && (
                        <p className="text-sm text-muted-foreground">
                          {exam.notes}
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
                            exam,
                          )
                        }
                        aria-label="Editar exame laboratorial"
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
                            exam,
                          )
                        }
                        aria-label="Excluir exame laboratorial"
                      >
                        <Trash2 className="size-4" />
                      </Button>
                    </div>
                  </div>

                  <LaboratoryResultsSection
                    patientId={
                      patientId
                    }
                    examId={
                      exam.id
                    }
                  />
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