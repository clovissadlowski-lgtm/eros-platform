'use client';

import {
  useMemo,
  useState,
} from 'react';

import {
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
  AnthropometricAssessmentComparisonPanel,
} from './anthropometric-assessment-comparison-panel';

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
  AnthropometricCircumferenceMeasurementInput,
  AnthropometricCircumferenceSite,
  AnthropometricCircumferenceState,
  AnthropometricMeasurementSide,
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
  patientName: string;
  patientBirthDate: string | null;
  patientCpf: string | null;
  biologicalSex: 'MALE' | 'FEMALE' | null;
}

interface SkinfoldFormState {
  site: SkinfoldSite;
  side: SkinfoldMeasurementSide;
  readingNumber: number;
  valueMm: string;
}

interface CircumferenceFormState {
  site: AnthropometricCircumferenceSite;
  side: AnthropometricMeasurementSide;
  state: AnthropometricCircumferenceState;
  valueCm: string;
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

  circumferenceMeasurements:
    CircumferenceFormState[];

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

function getJacksonPollockRequiredSites(
  protocol: SkinfoldProtocol | '',
  biologicalSex: 'MALE' | 'FEMALE' | null,
): SkinfoldSite[] {
  if (
    protocol === 'JACKSON_POLLOCK_3'
  ) {
    if (
      biologicalSex === 'MALE'
    ) {
      return [
        'CHEST',
        'ABDOMEN',
        'THIGH',
      ];
    }

    if (
      biologicalSex === 'FEMALE'
    ) {
      return [
        'TRICEPS',
        'SUPRAILIAC',
        'THIGH',
      ];
    }

    return [];
  }

  if (
    protocol === 'JACKSON_POLLOCK_7'
  ) {
    return [
      'CHEST',
      'MIDAXILLARY',
      'TRICEPS',
      'SUBSCAPULAR',
      'ABDOMEN',
      'SUPRAILIAC',
      'THIGH',
    ];
  }

  return [];
}

function createGuidedSkinfoldMeasurements(
  protocol: SkinfoldProtocol | '',
  biologicalSex: 'MALE' | 'FEMALE' | null,
): SkinfoldFormState[] {
  return getJacksonPollockRequiredSites(
    protocol,
    biologicalSex,
  ).map(
    (
      site,
    ) => ({
      site,
      side: 'RIGHT',
      readingNumber: 1,
      valueMm: '',
    }),
  );
}
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

function createInitialCircumferenceFormState():
  CircumferenceFormState[] {
  return [
    {
      site: 'NECK',
      side: 'NOT_APPLICABLE',
      state: 'NOT_APPLICABLE',
      valueCm: '',
    },
    {
      site: 'SHOULDERS',
      side: 'NOT_APPLICABLE',
      state: 'NOT_APPLICABLE',
      valueCm: '',
    },
    {
      site: 'CHEST',
      side: 'NOT_APPLICABLE',
      state: 'NOT_APPLICABLE',
      valueCm: '',
    },
    {
      site: 'WAIST',
      side: 'NOT_APPLICABLE',
      state: 'NOT_APPLICABLE',
      valueCm: '',
    },
    {
      site: 'ABDOMEN',
      side: 'NOT_APPLICABLE',
      state: 'NOT_APPLICABLE',
      valueCm: '',
    },
    {
      site: 'HIP',
      side: 'NOT_APPLICABLE',
      state: 'NOT_APPLICABLE',
      valueCm: '',
    },
    {
      site: 'ARM',
      side: 'RIGHT',
      state: 'RELAXED',
      valueCm: '',
    },
    {
      site: 'ARM',
      side: 'LEFT',
      state: 'RELAXED',
      valueCm: '',
    },
    {
      site: 'ARM',
      side: 'RIGHT',
      state: 'CONTRACTED',
      valueCm: '',
    },
    {
      site: 'ARM',
      side: 'LEFT',
      state: 'CONTRACTED',
      valueCm: '',
    },
    {
      site: 'FOREARM',
      side: 'RIGHT',
      state: 'NOT_APPLICABLE',
      valueCm: '',
    },
    {
      site: 'FOREARM',
      side: 'LEFT',
      state: 'NOT_APPLICABLE',
      valueCm: '',
    },
    {
      site: 'THIGH',
      side: 'RIGHT',
      state: 'NOT_APPLICABLE',
      valueCm: '',
    },
    {
      site: 'THIGH',
      side: 'LEFT',
      state: 'NOT_APPLICABLE',
      valueCm: '',
    },
    {
      site: 'CALF',
      side: 'RIGHT',
      state: 'NOT_APPLICABLE',
      valueCm: '',
    },
    {
      site: 'CALF',
      side: 'LEFT',
      state: 'NOT_APPLICABLE',
      valueCm: '',
    },
  ];
}

function circumferenceMeasurementKey(
  site: AnthropometricCircumferenceSite,
  side: AnthropometricMeasurementSide,
  state: AnthropometricCircumferenceState,
): string {
  return `${site}:${side}:${state}`;
}

function assessmentCircumferencesToFormState(
  assessment: AnthropometricAssessment,
): CircumferenceFormState[] {
  const existingByKey =
    new Map(
      assessment.circumferenceMeasurements.map(
        (
          measurement,
        ) => [
          circumferenceMeasurementKey(
            measurement.site,
            measurement.side,
            measurement.state,
          ),
          measurement,
        ],
      ),
    );

  return createInitialCircumferenceFormState().map(
    (
      measurement,
    ) => {
      const existing =
        existingByKey.get(
          circumferenceMeasurementKey(
            measurement.site,
            measurement.side,
            measurement.state,
          ),
        );

      return {
        ...measurement,
        valueCm:
          existing
            ? String(
                existing.valueCm,
              )
            : '',
      };
    },
  );
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

    circumferenceMeasurements:
      createInitialCircumferenceFormState(),

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

    circumferenceMeasurements:
      assessmentCircumferencesToFormState(
        assessment,
      ),

    notes:
      assessment.notes ??
      '',
  };
}


export function AnthropometricAssessmentsCard({
  patientId,
  patientName,
  patientBirthDate,
  patientCpf,
  biologicalSex,
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

  function handleSkinfoldProtocolChange(
    protocol: SkinfoldProtocol | '',
  ): void {
    setForm(
      (
        current,
      ) => {
        if (
          protocol ===
          'JACKSON_POLLOCK_3' ||
          protocol ===
          'JACKSON_POLLOCK_7'
        ) {
          return {
            ...current,
            bodyCompositionMethod:
              'SKINFOLD',
            skinfoldProtocol:
              protocol,
            skinfoldMeasurements:
              createGuidedSkinfoldMeasurements(
                protocol,
                biologicalSex,
              ),
          };
        }

        return {
          ...current,
          skinfoldProtocol:
            protocol,
          skinfoldMeasurements:
            protocol === 'OTHER'
              ? current.skinfoldMeasurements
              : [],
        };
      },
    );
  }
  function addGuidedSkinfoldReading(
    site: SkinfoldSite,
  ): void {
    setForm(
      (
        current,
      ) => {
        const siteMeasurements =
          current.skinfoldMeasurements.filter(
            (
              measurement,
            ) =>
              measurement.site === site &&
              measurement.side === 'RIGHT',
          );

        if (
          siteMeasurements.length >= 3
        ) {
          return current;
        }

        const nextReadingNumber =
          Math.max(
            0,
            ...siteMeasurements.map(
              (
                measurement,
              ) =>
                measurement.readingNumber,
            ),
          ) + 1;

        return {
          ...current,
          skinfoldMeasurements: [
            ...current.skinfoldMeasurements,
            {
              site,
              side: 'RIGHT',
              readingNumber:
                nextReadingNumber,
              valueMm: '',
            },
          ],
        };
      },
    );
  }

  function removeGuidedSkinfoldReading(
    site: SkinfoldSite,
    readingNumber: number,
  ): void {
    if (
      readingNumber === 1
    ) {
      return;
    }

    setForm(
      (
        current,
      ) => ({
        ...current,
        skinfoldMeasurements:
          current.skinfoldMeasurements.filter(
            (
              measurement,
            ) =>
              !(
                measurement.site === site &&
                measurement.side === 'RIGHT' &&
                measurement.readingNumber ===
                  readingNumber
              ),
          ),
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

  function buildCircumferencePayload():
    AnthropometricCircumferenceMeasurementInput[] {
    const measurements:
      AnthropometricCircumferenceMeasurementInput[] = [];

    for (
      const measurement of
        form.circumferenceMeasurements
    ) {
      const valueCm =
        parseOptionalNumber(
          measurement.valueCm,
        );

      if (
        valueCm === undefined
      ) {
        continue;
      }

      measurements.push({
        site:
          measurement.site,

        side:
          measurement.side,

        state:
          measurement.state,

        valueCm,
      });
    }

    return measurements;
  }

  function createPayload():
    CreateAnthropometricAssessmentInput {
    const skinfoldMeasurements =
      buildSkinfoldPayload();

    const circumferenceMeasurements =
      buildCircumferencePayload();

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

      circumferenceMeasurements:
        circumferenceMeasurements.length >
        0
          ? circumferenceMeasurements
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

      circumferenceMeasurements:
        buildCircumferencePayload(),

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

  function updateCircumferenceValue(
    site: AnthropometricCircumferenceSite,
    side: AnthropometricMeasurementSide,
    state: AnthropometricCircumferenceState,
    valueCm: string,
  ): void {
    setForm(
      (
        current,
      ) => ({
        ...current,

        circumferenceMeasurements:
          current.circumferenceMeasurements.map(
            (
              measurement,
            ) =>
              measurement.site ===
                site &&
              measurement.side ===
                side &&
              measurement.state ===
                state
                ? {
                    ...measurement,
                    valueCm,
                  }
                : measurement,
          ),
      }),
    );
  }

  function getCircumferenceValue(
    site: AnthropometricCircumferenceSite,
    side: AnthropometricMeasurementSide,
    state: AnthropometricCircumferenceState,
  ): string {
    return (
      form.circumferenceMeasurements.find(
        (
          measurement,
        ) =>
          measurement.site ===
            site &&
          measurement.side ===
            side &&
          measurement.state ===
            state,
      )?.valueCm ??
      ''
    );
  }

  function renderCircumferenceInput(
    label: string,
    site: AnthropometricCircumferenceSite,
    side: AnthropometricMeasurementSide,
    state: AnthropometricCircumferenceState,
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
              getCircumferenceValue(
                site,
                side,
                state,
              )
            }
            onChange={(
              event,
            ) =>
              updateCircumferenceValue(
                site,
                side,
                state,
                event.target.value,
              )
            }
            className="h-10 w-full rounded-md border bg-background px-3 pr-12 text-sm"
          />

          <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-xs text-muted-foreground">
            cm
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
      form.circumferenceMeasurements.some(
        (
          measurement,
        ) =>
          Boolean(
            measurement.valueCm.trim(),
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

        <section className="space-y-5 border-t pt-5">
          <div>
            <h4 className="font-medium">
              Circunferências
            </h4>

            <p className="text-xs text-muted-foreground">
              Registre os perímetros corporais em centímetros. Medidas bilaterais são separadas entre lado direito e esquerdo para permitir acompanhamento de simetria e evolução corporal.
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <h5 className="text-sm font-medium">
                Tronco
              </h5>

              <p className="mt-1 text-xs text-muted-foreground">
                Medidas centrais utilizadas no acompanhamento antropométrico e da composição corporal.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {renderCircumferenceInput(
                'Pescoço',
                'NECK',
                'NOT_APPLICABLE',
                'NOT_APPLICABLE',
              )}

              {renderCircumferenceInput(
                'Ombros',
                'SHOULDERS',
                'NOT_APPLICABLE',
                'NOT_APPLICABLE',
              )}

              {renderCircumferenceInput(
                'Tórax',
                'CHEST',
                'NOT_APPLICABLE',
                'NOT_APPLICABLE',
              )}

              {renderCircumferenceInput(
                'Cintura',
                'WAIST',
                'NOT_APPLICABLE',
                'NOT_APPLICABLE',
              )}

              {renderCircumferenceInput(
                'Abdômen',
                'ABDOMEN',
                'NOT_APPLICABLE',
                'NOT_APPLICABLE',
              )}

              {renderCircumferenceInput(
                'Quadril',
                'HIP',
                'NOT_APPLICABLE',
                'NOT_APPLICABLE',
              )}
            </div>
          </div>

          <div className="space-y-4 border-t border-dashed pt-4">
            <div>
              <h5 className="text-sm font-medium">
                Membros superiores
              </h5>

              <p className="mt-1 text-xs text-muted-foreground">
                Braços são registrados relaxados e contraídos. Antebraços são separados por lado.
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <p className="mb-3 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  Braço relaxado
                </p>

                <div className="grid gap-4 sm:grid-cols-2">
                  {renderCircumferenceInput(
                    'Direito',
                    'ARM',
                    'RIGHT',
                    'RELAXED',
                  )}

                  {renderCircumferenceInput(
                    'Esquerdo',
                    'ARM',
                    'LEFT',
                    'RELAXED',
                  )}
                </div>
              </div>

              <div>
                <p className="mb-3 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  Braço contraído
                </p>

                <div className="grid gap-4 sm:grid-cols-2">
                  {renderCircumferenceInput(
                    'Direito',
                    'ARM',
                    'RIGHT',
                    'CONTRACTED',
                  )}

                  {renderCircumferenceInput(
                    'Esquerdo',
                    'ARM',
                    'LEFT',
                    'CONTRACTED',
                  )}
                </div>
              </div>

              <div>
                <p className="mb-3 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  Antebraço
                </p>

                <div className="grid gap-4 sm:grid-cols-2">
                  {renderCircumferenceInput(
                    'Direito',
                    'FOREARM',
                    'RIGHT',
                    'NOT_APPLICABLE',
                  )}

                  {renderCircumferenceInput(
                    'Esquerdo',
                    'FOREARM',
                    'LEFT',
                    'NOT_APPLICABLE',
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4 border-t border-dashed pt-4">
            <div>
              <h5 className="text-sm font-medium">
                Membros inferiores
              </h5>

              <p className="mt-1 text-xs text-muted-foreground">
                Coxas e panturrilhas são registradas bilateralmente para acompanhar hipertrofia, evolução e possíveis assimetrias.
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <p className="mb-3 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  Coxa
                </p>

                <div className="grid gap-4 sm:grid-cols-2">
                  {renderCircumferenceInput(
                    'Direita',
                    'THIGH',
                    'RIGHT',
                    'NOT_APPLICABLE',
                  )}

                  {renderCircumferenceInput(
                    'Esquerda',
                    'THIGH',
                    'LEFT',
                    'NOT_APPLICABLE',
                  )}
                </div>
              </div>

              <div>
                <p className="mb-3 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  Panturrilha
                </p>

                <div className="grid gap-4 sm:grid-cols-2">
                  {renderCircumferenceInput(
                    'Direita',
                    'CALF',
                    'RIGHT',
                    'NOT_APPLICABLE',
                  )}

                  {renderCircumferenceInput(
                    'Esquerda',
                    'CALF',
                    'LEFT',
                    'NOT_APPLICABLE',
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="space-y-4 border-t pt-5">
          <div>
            <h4 className="font-medium">
              Dobras cutâneas
            </h4>

            <p className="text-xs text-muted-foreground">
              Selecione o protocolo. A Higeia organiza automaticamente os pontos de medição necessários.
            </p>
          </div>

          <label className="block max-w-sm space-y-1.5">
            <span className="text-sm font-medium">
              Protocolo
            </span>

            <select
              value={
                form.skinfoldProtocol
              }
              onChange={(
                event,
              ) =>
                handleSkinfoldProtocolChange(
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

          {form.skinfoldProtocol ===
            'JACKSON_POLLOCK_3' &&
            !biologicalSex && (
              <div className="rounded-lg border border-dashed p-4">
                <p className="text-sm font-medium">
                  Sexo biológico necessário
                </p>

                <p className="mt-1 text-xs text-muted-foreground">
                  O protocolo Jackson-Pollock 3 utiliza pontos de medição diferentes conforme o sexo biológico. Cadastre essa informação no perfil do paciente para a Higeia montar a coleta automaticamente.
                </p>
              </div>
            )}

          {(form.skinfoldProtocol ===
            'JACKSON_POLLOCK_3' ||
            form.skinfoldProtocol ===
              'JACKSON_POLLOCK_7') &&
            form.skinfoldMeasurements.length >
              0 && (
              <div className="space-y-4">
                <div className="rounded-lg bg-muted/40 p-3">
                  <p className="text-sm font-medium">
                    Coleta guiada
                  </p>

                  <p className="mt-1 text-xs text-muted-foreground">
                    Os locais abaixo foram definidos automaticamente pelo protocolo selecionado. As medições são registradas no lado direito.
                  </p>
                </div>

                {getJacksonPollockRequiredSites(
                  form.skinfoldProtocol,
                  biologicalSex,
                ).map(
                  (
                    site,
                  ) => {
                    const siteMeasurements =
                      form.skinfoldMeasurements
                        .map(
                          (
                            measurement,
                            index,
                          ) => ({
                            measurement,
                            index,
                          }),
                        )
                        .filter(
                          ({
                            measurement,
                          }) =>
                            measurement.site ===
                              site &&
                            measurement.side ===
                              'RIGHT',
                        )
                        .sort(
                          (
                            first,
                            second,
                          ) =>
                            first.measurement
                              .readingNumber -
                            second.measurement
                              .readingNumber,
                        );

                    return (
                      <div
                        key={site}
                        className="space-y-3 rounded-lg border p-4"
                      >
                        <div className="flex flex-wrap items-center justify-between gap-3">
                          <div>
                            <p className="font-medium">
                              {
                                skinfoldSiteLabels[
                                  site
                                ]
                              }
                            </p>

                            <p className="text-xs text-muted-foreground">
                              Lado direito
                            </p>
                          </div>

                          {siteMeasurements.length <
                            3 && (
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() =>
                                addGuidedSkinfoldReading(
                                  site,
                                )
                              }
                            >
                              <Plus className="size-4" />

                              Adicionar leitura
                            </Button>
                          )}
                        </div>

                        <div className="grid gap-3 sm:grid-cols-3">
                          {siteMeasurements.map(
                            ({
                              measurement,
                              index,
                            }) => (
                              <div
                                key={`${site}-${measurement.readingNumber}`}
                                className="space-y-1.5"
                              >
                                <span className="text-xs font-medium">
                                  Leitura{' '}
                                  {
                                    measurement.readingNumber
                                  }
                                </span>

                                <div className="flex gap-2">
                                  <div className="relative flex-1">
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
                                              event
                                                .target
                                                .value,
                                          },
                                        )
                                      }
                                      placeholder="0,0"
                                      className="h-10 w-full rounded-md border bg-background px-3 pr-10 text-sm"
                                    />

                                    <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-xs text-muted-foreground">
                                      mm
                                    </span>
                                  </div>

                                  {measurement.readingNumber >
                                    1 && (
                                    <Button
                                      type="button"
                                      variant="ghost"
                                      size="icon"
                                      onClick={() =>
                                        removeGuidedSkinfoldReading(
                                          site,
                                          measurement.readingNumber,
                                        )
                                      }
                                      aria-label={`Remover leitura ${measurement.readingNumber} de ${skinfoldSiteLabels[site]}`}
                                    >
                                      <Trash2 className="size-4" />
                                    </Button>
                                  )}
                                </div>
                              </div>
                            ),
                          )}
                        </div>
                      </div>
                    );
                  },
                )}
              </div>
            )}

          {form.skinfoldProtocol ===
            'OTHER' && (
            <div className="space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-medium">
                    Protocolo personalizado
                  </p>

                  <p className="text-xs text-muted-foreground">
                    Adicione livremente os locais e leituras necessários.
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
                        key={`${index}-${measurement.site}-${measurement.side}-${measurement.readingNumber}`}
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
                            Valor
                          </span>

                          <div className="relative">
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
                              placeholder="0,0"
                              className="h-10 w-full rounded-md border bg-background px-3 pr-10 text-sm"
                            />

                            <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-xs text-muted-foreground">
                              mm
                            </span>
                          </div>
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
            </div>
          )}

          {!form.skinfoldProtocol && (
            <p className="text-sm text-muted-foreground">
              Selecione um protocolo para iniciar a coleta de dobras cutâneas.
            </p>
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
          !isCreating &&
          !editingId && (
          <p className="text-sm text-muted-foreground">
            Nenhuma avaliação antropométrica registrada.
          </p>
        )}

        {(isCreating || editingId) && (
          <div className="rounded-xl border p-4">
            {renderForm()}
          </div>
        )}

        {assessmentsQuery.data &&
          assessmentsQuery.data.length >
            0 &&
          !isCreating &&
          !editingId && (
            <AnthropometricAssessmentComparisonPanel
              patientId={
                patientId
              }
              patientName={
                patientName
              }
              patientBirthDate={
                patientBirthDate
              }
              patientCpf={
                patientCpf
              }
              biologicalSex={
                biologicalSex
              }
              assessments={
                assessmentsQuery.data
              }
              onEditAssessment={
                startEditing
              }
              onDeleteAssessment={(
                assessment,
              ) =>
                void handleDelete(
                  assessment,
                )
              }
              isDeletingAssessment={
                deleteMutation.isPending
              }
            />
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