'use client';

import {
  useMemo,
  useState,
} from 'react';

import {
  Pencil,
  Plus,
  Ruler,
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
  useAnthropometricAssessments,
} from './hooks/use-anthropometric-assessments';

import {
  useCreateAnthropometricAssessment,
} from './hooks/use-create-anthropometric-assessment';

import {
  useDeleteAnthropometricAssessment,
} from './hooks/use-delete-anthropometric-assessment';

import {
  useUpdateAnthropometricAssessment,
} from './hooks/use-update-anthropometric-assessment';

import type {
  AnthropometricAssessment,
  AnthropometricSkinfoldMeasurementInput,
  BodyCompositionMethod,
  CreateAnthropometricAssessmentInput,
  SkinfoldMeasurementSide,
  SkinfoldProtocol,
  SkinfoldSite,
  UpdateAnthropometricAssessmentInput,
} from './medical-record.types';

interface AnthropometricAssessmentsCardProps {
  patientId: string;
}

interface SkinfoldFormState {
  site: SkinfoldSite;
  side: SkinfoldMeasurementSide;
  readingNumber: number;
  valueMm: string;
}

interface AnthropometricAssessmentFormState {
  measuredAt: string;

  weightKg: string;
  heightCm: string;

  bodyFatPercentage: string;
  fatMassKg: string;
  leanMassKg: string;
  muscleMassKg: string;

  waistCircumferenceCm: string;
  hipCircumferenceCm: string;
  abdomenCircumferenceCm: string;
  chestCircumferenceCm: string;
  armCircumferenceCm: string;
  thighCircumferenceCm: string;
  calfCircumferenceCm: string;

  bodyCompositionMethod:
    BodyCompositionMethod | '';

  skinfoldProtocol:
    SkinfoldProtocol | '';

  skinfoldMeasurements:
    SkinfoldFormState[];

  notes: string;
}

const bodyCompositionMethodLabels:
  Record<BodyCompositionMethod, string> = {
    BIOIMPEDANCE: 'Bioimpedância',
    SKINFOLD: 'Dobras cutâneas',
    DEXA: 'DEXA',
    OTHER: 'Outro',
  };

const skinfoldProtocolLabels:
  Record<SkinfoldProtocol, string> = {
    JACKSON_POLLOCK_3: 'Jackson-Pollock 3 dobras',
    JACKSON_POLLOCK_7: 'Jackson-Pollock 7 dobras',
    OTHER: 'Outro',
  };

const skinfoldSiteLabels:
  Record<SkinfoldSite, string> = {
    CHEST: 'Peitoral',
    MIDAXILLARY: 'Axilar média',
    TRICEPS: 'Tríceps',
    SUBSCAPULAR: 'Subescapular',
    ABDOMEN: 'Abdominal',
    SUPRAILIAC: 'Supra-ilíaca',
    THIGH: 'Coxa',
    BICEPS: 'Bíceps',
    SUPRASPINALE: 'Supraespinal',
    CALF: 'Panturrilha',
    OTHER: 'Outro',
  };

const skinfoldSideLabels:
  Record<SkinfoldMeasurementSide, string> = {
    RIGHT: 'Direito',
    LEFT: 'Esquerdo',
  };

function todayInputValue(): string {
  const now =
    new Date();

  const year =
    now.getFullYear();

  const month =
    String(
      now.getMonth() + 1,
    ).padStart(
      2,
      '0',
    );

  const day =
    String(
      now.getDate(),
    ).padStart(
      2,
      '0',
    );

  return `${year}-${month}-${day}`;
}

function createInitialFormState():
  AnthropometricAssessmentFormState {
  return {
    measuredAt:
      todayInputValue(),

    weightKg: '',
    heightCm: '',

    bodyFatPercentage: '',
    fatMassKg: '',
    leanMassKg: '',
    muscleMassKg: '',

    waistCircumferenceCm: '',
    hipCircumferenceCm: '',
    abdomenCircumferenceCm: '',
    chestCircumferenceCm: '',
    armCircumferenceCm: '',
    thighCircumferenceCm: '',
    calfCircumferenceCm: '',

    bodyCompositionMethod: '',
    skinfoldProtocol: '',

    skinfoldMeasurements: [],

    notes: '',
  };
}

function dateToInputValue(
  value: string,
): string {
  return value.split('T')[0];
}

function formatDate(
  value: string,
): string {
  const datePart =
    value.split('T')[0];

  const [
    year,
    month,
    day,
  ] =
    datePart.split('-');

  if (
    !year ||
    !month ||
    !day
  ) {
    return value;
  }

  return `${day}/${month}/${year}`;
}

function numberToFormValue(
  value: number | null,
): string {
  return value === null
    ? ''
    : String(value);
}

function parseOptionalNumber(
  value: string,
): number | undefined {
  const normalized =
    value
      .trim()
      .replace(
        ',',
        '.',
      );

  if (!normalized) {
    return undefined;
  }

  const parsed =
    Number(normalized);

  return Number.isFinite(parsed)
    ? parsed
    : undefined;
}

function parseNullableNumber(
  value: string,
): number | null {
  return (
    parseOptionalNumber(
      value,
    ) ??
    null
  );
}

function assessmentToFormState(
  assessment: AnthropometricAssessment,
): AnthropometricAssessmentFormState {
  return {
    measuredAt:
      dateToInputValue(
        assessment.measuredAt,
      ),

    weightKg:
      numberToFormValue(
        assessment.weightKg,
      ),

    heightCm:
      numberToFormValue(
        assessment.heightCm,
      ),

    bodyFatPercentage:
      numberToFormValue(
        assessment.bodyFatPercentage,
      ),

    fatMassKg:
      numberToFormValue(
        assessment.fatMassKg,
      ),

    leanMassKg:
      numberToFormValue(
        assessment.leanMassKg,
      ),

    muscleMassKg:
      numberToFormValue(
        assessment.muscleMassKg,
      ),

    waistCircumferenceCm:
      numberToFormValue(
        assessment.waistCircumferenceCm,
      ),

    hipCircumferenceCm:
      numberToFormValue(
        assessment.hipCircumferenceCm,
      ),

    abdomenCircumferenceCm:
      numberToFormValue(
        assessment.abdomenCircumferenceCm,
      ),

    chestCircumferenceCm:
      numberToFormValue(
        assessment.chestCircumferenceCm,
      ),

    armCircumferenceCm:
      numberToFormValue(
        assessment.armCircumferenceCm,
      ),

    thighCircumferenceCm:
      numberToFormValue(
        assessment.thighCircumferenceCm,
      ),

    calfCircumferenceCm:
      numberToFormValue(
        assessment.calfCircumferenceCm,
      ),

    bodyCompositionMethod:
      assessment.bodyCompositionMethod ??
      '',

    skinfoldProtocol:
      assessment.skinfoldProtocol ??
      '',

    skinfoldMeasurements:
      assessment.skinfoldMeasurements.map(
        (
          measurement,
        ) => ({
          site:
            measurement.site,

          side:
            measurement.side,

          readingNumber:
            measurement.readingNumber,

          valueMm:
            String(
              measurement.valueMm,
            ),
        }),
      ),

    notes:
      assessment.notes ??
      '',
  };
}

function formatMeasurement(
  value: number | null,
  unit: string,
): string | null {
  if (value === null) {
    return null;
  }

  return `${value} ${unit}`;
}

export function AnthropometricAssessmentsCard({
  patientId,
}: AnthropometricAssessmentsCardProps) {
  const assessmentsQuery =
    useAnthropometricAssessments(
      patientId,
    );

  const createMutation =
    useCreateAnthropometricAssessment(
      patientId,
    );

  const updateMutation =
    useUpdateAnthropometricAssessment(
      patientId,
    );

  const deleteMutation =
    useDeleteAnthropometricAssessment(
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
    useState<string | null>(
      null,
    );

  const [
    form,
    setForm,
  ] =
    useState<AnthropometricAssessmentFormState>(
      createInitialFormState,
    );

  const editingAssessment =
    useMemo(
      () =>
        assessmentsQuery.data?.find(
          (
            assessment,
          ) =>
            assessment.id ===
            editingId,
        ) ??
        null,
      [
        assessmentsQuery.data,
        editingId,
      ],
    );

  const isSaving =
    createMutation.isPending ||
    updateMutation.isPending;

  function resetForm(): void {
    setForm(
      createInitialFormState(),
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
      createInitialFormState(),
    );

    setIsCreating(
      true,
    );
  }

  function startEditing(
    assessment: AnthropometricAssessment,
  ): void {
    setIsCreating(
      false,
    );

    setEditingId(
      assessment.id,
    );

    setForm(
      assessmentToFormState(
        assessment,
      ),
    );
  }

  function updateField(
    field:
      keyof AnthropometricAssessmentFormState,
    value:
      AnthropometricAssessmentFormState[
        keyof AnthropometricAssessmentFormState
      ],
  ): void {
    setForm(
      (
        current,
      ) => ({
        ...current,
        [field]:
          value,
      }),
    );
  }

  function addSkinfold(): void {
    setForm(
      (
        current,
      ) => ({
        ...current,

        skinfoldMeasurements: [
          ...current.skinfoldMeasurements,
          {
            site:
              'CHEST',

            side:
              'RIGHT',

            readingNumber:
              1,

            valueMm:
              '',
          },
        ],
      }),
    );
  }

  function updateSkinfold(
    index: number,
    changes: Partial<SkinfoldFormState>,
  ): void {
    setForm(
      (
        current,
      ) => ({
        ...current,

        skinfoldMeasurements:
          current.skinfoldMeasurements.map(
            (
              measurement,
              measurementIndex,
            ) =>
              measurementIndex ===
              index
                ? {
                    ...measurement,
                    ...changes,
                  }
                : measurement,
          ),
      }),
    );
  }

  function removeSkinfold(
    index: number,
  ): void {
    setForm(
      (
        current,
      ) => ({
        ...current,

        skinfoldMeasurements:
          current.skinfoldMeasurements.filter(
            (
              _measurement,
              measurementIndex,
            ) =>
              measurementIndex !==
              index,
          ),
      }),
    );
  }

  function buildSkinfoldPayload():
    AnthropometricSkinfoldMeasurementInput[] {
    const measurements:
      AnthropometricSkinfoldMeasurementInput[] = [];

    for (
      const measurement of
        form.skinfoldMeasurements
    ) {
      const valueMm =
        parseOptionalNumber(
          measurement.valueMm,
        );

      if (
        valueMm === undefined
      ) {
        continue;
      }

      measurements.push({
        site:
          measurement.site,

        side:
          measurement.side,

        readingNumber:
          measurement.readingNumber,

        valueMm,
      });
    }

    return measurements;
  }

  function createPayload():
    CreateAnthropometricAssessmentInput {
    const skinfoldMeasurements =
      buildSkinfoldPayload();

    return {
      measuredAt:
        form.measuredAt,

      weightKg:
        parseOptionalNumber(
          form.weightKg,
        ),

      heightCm:
        parseOptionalNumber(
          form.heightCm,
        ),

      bodyFatPercentage:
        parseOptionalNumber(
          form.bodyFatPercentage,
        ),

      fatMassKg:
        parseOptionalNumber(
          form.fatMassKg,
        ),

      leanMassKg:
        parseOptionalNumber(
          form.leanMassKg,
        ),

      muscleMassKg:
        parseOptionalNumber(
          form.muscleMassKg,
        ),

      waistCircumferenceCm:
        parseOptionalNumber(
          form.waistCircumferenceCm,
        ),

      hipCircumferenceCm:
        parseOptionalNumber(
          form.hipCircumferenceCm,
        ),

      abdomenCircumferenceCm:
        parseOptionalNumber(
          form.abdomenCircumferenceCm,
        ),

      chestCircumferenceCm:
        parseOptionalNumber(
          form.chestCircumferenceCm,
        ),

      armCircumferenceCm:
        parseOptionalNumber(
          form.armCircumferenceCm,
        ),

      thighCircumferenceCm:
        parseOptionalNumber(
          form.thighCircumferenceCm,
        ),

      calfCircumferenceCm:
        parseOptionalNumber(
          form.calfCircumferenceCm,
        ),

      bodyCompositionMethod:
        form.bodyCompositionMethod ||
        undefined,

      skinfoldProtocol:
        skinfoldMeasurements.length > 0
          ? form.skinfoldProtocol ||
            undefined
          : undefined,

      skinfoldMeasurements:
        skinfoldMeasurements.length >
        0
          ? skinfoldMeasurements
          : undefined,

      notes:
        form.notes.trim() ||
        undefined,
    };
  }

  function updatePayload():
    UpdateAnthropometricAssessmentInput {
    return {
      measuredAt:
        form.measuredAt,

      weightKg:
        parseNullableNumber(
          form.weightKg,
        ),

      heightCm:
        parseNullableNumber(
          form.heightCm,
        ),

      bodyFatPercentage:
        parseNullableNumber(
          form.bodyFatPercentage,
        ),

      fatMassKg:
        parseNullableNumber(
          form.fatMassKg,
        ),

      leanMassKg:
        parseNullableNumber(
          form.leanMassKg,
        ),

      muscleMassKg:
        parseNullableNumber(
          form.muscleMassKg,
        ),

      waistCircumferenceCm:
        parseNullableNumber(
          form.waistCircumferenceCm,
        ),

      hipCircumferenceCm:
        parseNullableNumber(
          form.hipCircumferenceCm,
        ),

      abdomenCircumferenceCm:
        parseNullableNumber(
          form.abdomenCircumferenceCm,
        ),

      chestCircumferenceCm:
        parseNullableNumber(
          form.chestCircumferenceCm,
        ),

      armCircumferenceCm:
        parseNullableNumber(
          form.armCircumferenceCm,
        ),

      thighCircumferenceCm:
        parseNullableNumber(
          form.thighCircumferenceCm,
        ),

      calfCircumferenceCm:
        parseNullableNumber(
          form.calfCircumferenceCm,
        ),

      bodyCompositionMethod:
        form.bodyCompositionMethod ||
        null,

      skinfoldProtocol:
        buildSkinfoldPayload().length > 0
          ? form.skinfoldProtocol ||
            null
          : null,

      skinfoldMeasurements:
        buildSkinfoldPayload(),

      notes:
        form.notes.trim() ||
        null,
    };
  }

  async function handleSave():
    Promise<void> {
    if (
      !form.measuredAt
    ) {
      return;
    }

    if (
      form.skinfoldMeasurements.length >
        0 &&
      !form.skinfoldProtocol
    ) {
      return;
    }

    if (
      editingId
    ) {
      if (
        !editingAssessment
      ) {
        return;
      }

      await updateMutation.mutateAsync({
        assessmentId:
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
    assessment: AnthropometricAssessment,
  ): Promise<void> {
    const confirmed =
      window.confirm(
        `Deseja realmente excluir a avaliação antropométrica de ${formatDate(
          assessment.measuredAt,
        )}?`,
      );

    if (!confirmed) {
      return;
    }

    await deleteMutation.mutateAsync(
      assessment.id,
    );

    if (
      editingId ===
      assessment.id
    ) {
      resetForm();
    }
  }

  function renderNumberInput(
    label: string,
    field:
      | 'weightKg'
      | 'heightCm'
      | 'bodyFatPercentage'
      | 'fatMassKg'
      | 'leanMassKg'
      | 'muscleMassKg'
      | 'waistCircumferenceCm'
      | 'hipCircumferenceCm'
      | 'abdomenCircumferenceCm'
      | 'chestCircumferenceCm'
      | 'armCircumferenceCm'
      | 'thighCircumferenceCm'
      | 'calfCircumferenceCm',
    unit: string,
  ) {
    return (
      <label className="space-y-1.5">
        <span className="text-sm font-medium">
          {label}
        </span>

        <div className="relative">
          <input
            type="text"
            inputMode="decimal"
            value={
              form[field]
            }
            onChange={(
              event,
            ) =>
              updateField(
                field,
                event.target.value,
              )
            }
            className="h-10 w-full rounded-md border bg-background px-3 pr-12 text-sm"
          />

          <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-xs text-muted-foreground">
            {unit}
          </span>
        </div>
      </label>
    );
  }

  function renderForm() {
    const hasPrimaryMeasurement =
      [
        form.weightKg,
        form.heightCm,
        form.bodyFatPercentage,
        form.fatMassKg,
        form.leanMassKg,
        form.muscleMassKg,
        form.waistCircumferenceCm,
        form.hipCircumferenceCm,
        form.abdomenCircumferenceCm,
        form.chestCircumferenceCm,
        form.armCircumferenceCm,
        form.thighCircumferenceCm,
        form.calfCircumferenceCm,
      ].some(
        (
          value,
        ) =>
          Boolean(
            value.trim(),
          ),
      ) ||
      form.skinfoldMeasurements.some(
        (
          measurement,
        ) =>
          Boolean(
            measurement.valueMm.trim(),
          ),
      );

    const skinfoldProtocolIsValid =
      form.skinfoldMeasurements.length ===
        0 ||
      Boolean(
        form.skinfoldProtocol,
      );

    const canSave =
      Boolean(
        form.measuredAt,
      ) &&
      hasPrimaryMeasurement &&
      skinfoldProtocolIsValid;

    return (
      <div className="space-y-6">
        <section className="space-y-4">
          <div>
            <h4 className="font-medium">
              Medição básica
            </h4>

            <p className="text-xs text-muted-foreground">
              Dados gerais registrados nesta avaliação.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <label className="space-y-1.5">
              <span className="text-sm font-medium">
                Data da avaliação *
              </span>

              <input
                type="date"
                value={
                  form.measuredAt
                }
                onChange={(
                  event,
                ) =>
                  updateField(
                    'measuredAt',
                    event.target.value,
                  )
                }
                className="h-10 w-full rounded-md border bg-background px-3 text-sm"
              />
            </label>

            {renderNumberInput(
              'Peso',
              'weightKg',
              'kg',
            )}

            {renderNumberInput(
              'Altura',
              'heightCm',
              'cm',
            )}
          </div>
        </section>

        <section className="space-y-4 border-t pt-5">
          <div>
            <h4 className="font-medium">
              Composição corporal
            </h4>

            <p className="text-xs text-muted-foreground">
              Valores medidos por equipamento ou método profissional.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {renderNumberInput(
              'Gordura corporal',
              'bodyFatPercentage',
              '%',
            )}

            {renderNumberInput(
              'Massa de gordura',
              'fatMassKg',
              'kg',
            )}

            {renderNumberInput(
              'Massa magra',
              'leanMassKg',
              'kg',
            )}

            {renderNumberInput(
              'Massa muscular',
              'muscleMassKg',
              'kg',
            )}
          </div>

          <label className="block max-w-sm space-y-1.5">
            <span className="text-sm font-medium">
              Método de composição corporal
            </span>

            <select
              value={
                form.bodyCompositionMethod
              }
              onChange={(
                event,
              ) =>
                updateField(
                  'bodyCompositionMethod',
                  event.target.value as
                    BodyCompositionMethod | '',
                )
              }
              className="h-10 w-full rounded-md border bg-background px-3 text-sm"
            >
              <option value="">
                Não informado
              </option>

              {Object.entries(
                bodyCompositionMethodLabels,
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
        </section>

        <section className="space-y-4 border-t pt-5">
          <div>
            <h4 className="font-medium">
              Circunferências
            </h4>

            <p className="text-xs text-muted-foreground">
              Perímetros corporais em centímetros.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {renderNumberInput(
              'Cintura',
              'waistCircumferenceCm',
              'cm',
            )}

            {renderNumberInput(
              'Quadril',
              'hipCircumferenceCm',
              'cm',
            )}

            {renderNumberInput(
              'Abdômen',
              'abdomenCircumferenceCm',
              'cm',
            )}

            {renderNumberInput(
              'Tórax',
              'chestCircumferenceCm',
              'cm',
            )}

            {renderNumberInput(
              'Braço',
              'armCircumferenceCm',
              'cm',
            )}

            {renderNumberInput(
              'Coxa',
              'thighCircumferenceCm',
              'cm',
            )}

            {renderNumberInput(
              'Panturrilha',
              'calfCircumferenceCm',
              'cm',
            )}
          </div>
        </section>

        <section className="space-y-4 border-t pt-5">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <h4 className="font-medium">
                Dobras cutâneas
              </h4>

              <p className="text-xs text-muted-foreground">
                Leituras brutas preservadas para cálculos posteriores.
              </p>
            </div>

            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={
                addSkinfold
              }
            >
              <Plus className="size-4" />

              Adicionar dobra
            </Button>
          </div>

          {form.skinfoldMeasurements.length >
            0 && (
            <label className="block max-w-sm space-y-1.5">
              <span className="text-sm font-medium">
                Protocolo *
              </span>

              <select
                value={
                  form.skinfoldProtocol
                }
                onChange={(
                  event,
                ) =>
                  updateField(
                    'skinfoldProtocol',
                    event.target.value as
                      SkinfoldProtocol | '',
                  )
                }
                className="h-10 w-full rounded-md border bg-background px-3 text-sm"
              >
                <option value="">
                  Selecione
                </option>

                {Object.entries(
                  skinfoldProtocolLabels,
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
          )}

          {form.skinfoldMeasurements.length ===
            0 ? (
            <p className="text-sm text-muted-foreground">
              Nenhuma dobra cutânea adicionada.
            </p>
          ) : (
            <div className="space-y-3">
              {form.skinfoldMeasurements.map(
                (
                  measurement,
                  index,
                ) => (
                  <div
                    key={`${index}-${measurement.site}-${measurement.readingNumber}`}
                    className="grid gap-3 rounded-lg border p-3 sm:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr_1fr_auto]"
                  >
                    <label className="space-y-1.5">
                      <span className="text-xs font-medium">
                        Local
                      </span>

                      <select
                        value={
                          measurement.site
                        }
                        onChange={(
                          event,
                        ) =>
                          updateSkinfold(
                            index,
                            {
                              site:
                                event.target.value as
                                  SkinfoldSite,
                            },
                          )
                        }
                        className="h-10 w-full rounded-md border bg-background px-3 text-sm"
                      >
                        {Object.entries(
                          skinfoldSiteLabels,
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
                      <span className="text-xs font-medium">
                        Lado
                      </span>

                      <select
                        value={
                          measurement.side
                        }
                        onChange={(
                          event,
                        ) =>
                          updateSkinfold(
                            index,
                            {
                              side:
                                event.target.value as
                                  SkinfoldMeasurementSide,
                            },
                          )
                        }
                        className="h-10 w-full rounded-md border bg-background px-3 text-sm"
                      >
                        {Object.entries(
                          skinfoldSideLabels,
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
                      <span className="text-xs font-medium">
                        Leitura
                      </span>

                      <select
                        value={
                          measurement.readingNumber
                        }
                        onChange={(
                          event,
                        ) =>
                          updateSkinfold(
                            index,
                            {
                              readingNumber:
                                Number(
                                  event.target.value,
                                ),
                            },
                          )
                        }
                        className="h-10 w-full rounded-md border bg-background px-3 text-sm"
                      >
                        <option value={1}>
                          1
                        </option>

                        <option value={2}>
                          2
                        </option>

                        <option value={3}>
                          3
                        </option>
                      </select>
                    </label>

                    <label className="space-y-1.5">
                      <span className="text-xs font-medium">
                        Valor (mm)
                      </span>

                      <input
                        type="text"
                        inputMode="decimal"
                        value={
                          measurement.valueMm
                        }
                        onChange={(
                          event,
                        ) =>
                          updateSkinfold(
                            index,
                            {
                              valueMm:
                                event.target.value,
                            },
                          )
                        }
                        className="h-10 w-full rounded-md border bg-background px-3 text-sm"
                      />
                    </label>

                    <div className="flex items-end">
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() =>
                          removeSkinfold(
                            index,
                          )
                        }
                        aria-label="Remover dobra cutânea"
                      >
                        <Trash2 className="size-4" />
                      </Button>
                    </div>
                  </div>
                ),
              )}
            </div>
          )}
        </section>

        <section className="space-y-2 border-t pt-5">
          <label className="space-y-1.5">
            <span className="text-sm font-medium">
              Observações
            </span>

            <textarea
              value={
                form.notes
              }
              onChange={(
                event,
              ) =>
                updateField(
                  'notes',
                  event.target.value,
                )
              }
              rows={3}
              placeholder="Informações complementares da avaliação"
              className="w-full rounded-md border bg-background px-3 py-2 text-sm"
            />
          </label>
        </section>

        {form.skinfoldMeasurements.length >
          0 &&
          !form.skinfoldProtocol && (
          <p className="text-sm text-destructive">
            Selecione o protocolo das dobras cutâneas.
          </p>
        )}

        <div className="flex justify-end gap-2">
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
                : 'Salvar avaliação'}
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
              <Ruler className="size-5 text-primary" />

              Avaliações antropométricas
            </CardTitle>

            <p className="mt-1 text-sm text-muted-foreground">
              Histórico de peso, medidas corporais, composição corporal e dobras cutâneas.
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
        {assessmentsQuery.isLoading && (
          <p className="text-sm text-muted-foreground">
            Carregando avaliações antropométricas...
          </p>
        )}

        {assessmentsQuery.isError && (
          <div className="space-y-3">
            <p className="text-sm text-destructive">
              Não foi possível carregar as avaliações antropométricas.
            </p>

            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() =>
                void assessmentsQuery.refetch()
              }
            >
              Tentar novamente
            </Button>
          </div>
        )}

        {!assessmentsQuery.isLoading &&
          !assessmentsQuery.isError &&
          assessmentsQuery.data?.length ===
            0 &&
          !isCreating && (
          <p className="text-sm text-muted-foreground">
            Nenhuma avaliação antropométrica registrada.
          </p>
        )}

        {isCreating && (
          <div className="rounded-xl border p-4">
            {renderForm()}
          </div>
        )}

        {assessmentsQuery.data?.map(
          (
            assessment,
          ) => {
            const summaryMeasurements = [
              [
                'Peso',
                formatMeasurement(
                  assessment.weightKg,
                  'kg',
                ),
              ],
              [
                'Altura',
                formatMeasurement(
                  assessment.heightCm,
                  'cm',
                ),
              ],
              [
                'Gordura corporal',
                formatMeasurement(
                  assessment.bodyFatPercentage,
                  '%',
                ),
              ],
              [
                'Cintura',
                formatMeasurement(
                  assessment.waistCircumferenceCm,
                  'cm',
                ),
              ],
              [
                'Quadril',
                formatMeasurement(
                  assessment.hipCircumferenceCm,
                  'cm',
                ),
              ],
            ].filter(
              (
                item,
              ) =>
                item[1] !==
                null,
            );

            return (
              <div
                key={
                  assessment.id
                }
                className="rounded-xl border p-4"
              >
                {editingId ===
                assessment.id ? (
                  renderForm()
                ) : (
                  <div className="space-y-4">
                    <div className="flex items-start justify-between gap-4">
                      <div className="space-y-2">
                        <div className="flex flex-wrap items-center gap-2">
                          <p className="font-medium">
                            Avaliação de{' '}
                            {formatDate(
                              assessment.measuredAt,
                            )}
                          </p>

                          {assessment.bodyCompositionMethod && (
                            <span className="rounded-full border px-2 py-0.5 text-xs text-muted-foreground">
                              {
                                bodyCompositionMethodLabels[
                                  assessment.bodyCompositionMethod
                                ]
                              }
                            </span>
                          )}

                          {assessment.skinfoldProtocol && (
                            <span className="rounded-full border px-2 py-0.5 text-xs text-muted-foreground">
                              {
                                skinfoldProtocolLabels[
                                  assessment.skinfoldProtocol
                                ]
                              }
                            </span>
                          )}
                        </div>

                        {summaryMeasurements.length >
                          0 && (
                          <div className="flex flex-wrap gap-x-5 gap-y-1 text-sm text-muted-foreground">
                            {summaryMeasurements.map(
                              (
                                [
                                  label,
                                  value,
                                ],
                              ) => (
                                <span
                                  key={
                                    label
                                  }
                                >
                                  {label}:{' '}
                                  {value}
                                </span>
                              ),
                            )}
                          </div>
                        )}

                        {assessment.skinfoldMeasurements.length >
                          0 && (
                          <p className="text-sm text-muted-foreground">
                            Dobras cutâneas:{' '}
                            {
                              assessment.skinfoldMeasurements.length
                            }{' '}
                            leitura(s)
                          </p>
                        )}

                        {assessment.notes && (
                          <p className="text-sm text-muted-foreground">
                            {assessment.notes}
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
                              assessment,
                            )
                          }
                          aria-label="Editar avaliação antropométrica"
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
                              assessment,
                            )
                          }
                          aria-label="Excluir avaliação antropométrica"
                        >
                          <Trash2 className="size-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          },
        )}

        {(createMutation.isError ||
          updateMutation.isError ||
          deleteMutation.isError) && (
          <p className="text-sm text-destructive">
            Não foi possível concluir a operação. Verifique os dados e tente novamente.
          </p>
        )}
      </CardContent>
    </Card>
  );
}