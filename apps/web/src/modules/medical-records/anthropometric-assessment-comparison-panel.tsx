'use client';

import {
  Fragment,
  useEffect,
  useMemo,
  useState,
} from 'react';

import {
  Maximize2,
  Printer,
  X,
} from 'lucide-react';

import {
  Button,
} from '@/components/ui/button';

import {
  authStorage,
} from '@/lib/auth/auth-storage';

import type {
  AuthUser,
  UserOrganization,
} from '@/modules/auth/auth.types';

import {
  useAnthropometricAssessmentsResults,
} from './hooks/use-anthropometric-assessments-results';

import {
  getCalculationValue,
  getCircumferenceValue,
} from './anthropometry/anthropometric-engine';

import {
  AnthropometricLongitudinalPanel,
} from './anthropometry/anthropometric-longitudinal-panel';

import {
  AnthropometricAssessmentDetail,
} from './anthropometry/anthropometric-assessment-detail';

import {
  AnthropometricHistoryTable,
} from './anthropometry/anthropometric-history-table';

import type {
  AnthropometricAssessment,
  AnthropometricAssessmentResults,
  AnthropometricCalculationCode,
  AnthropometricCircumferenceSite,
  AnthropometricCircumferenceState,
  AnthropometricMeasurementSide,
} from './medical-record.types';

interface AnthropometricAssessmentComparisonPanelProps {
  patientId: string;
  patientName: string;
  patientBirthDate: string | null;
  patientCpf: string | null;
  biologicalSex: 'MALE' | 'FEMALE' | null;
  assessments: AnthropometricAssessment[];

  onEditAssessment: (
    assessment: AnthropometricAssessment,
  ) => void;

  onDeleteAssessment: (
    assessment: AnthropometricAssessment,
  ) => void;

  isDeletingAssessment: boolean;
}

type MetricSection =
  | 'BASIC'
  | 'BODY_COMPOSITION'
  | 'TRUNK'
  | 'UPPER_LIMBS'
  | 'LOWER_LIMBS';

interface LongitudinalMetric {
  key: string;
  label: string;
  section: MetricSection;
  unit: string;
  deltaUnit?: string;

  getValue: (
    assessment: AnthropometricAssessment,
    results:
      | AnthropometricAssessmentResults
      | undefined,
  ) => number | null;
}

const sectionLabels:
  Record<MetricSection, string> = {
    BASIC:
      'Medição básica',

    BODY_COMPOSITION:
      'Composição corporal',

    TRUNK:
      'Circunferências · Tronco',

    UPPER_LIMBS:
      'Circunferências · Membros superiores',

    LOWER_LIMBS:
      'Circunferências · Membros inferiores',
  };

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


function formatValue(
  value: number | null,
  unit: string,
): string {
  if (value === null) {
    return '—';
  }

  const formatted =
    value.toLocaleString(
      'pt-BR',
      {
        maximumFractionDigits:
          unit === 'g/mL'
            ? 6
            : 2,
      },
    );

  return unit
    ? `${formatted} ${unit}`
    : formatted;
}

function getEvolution(
  values: Array<number | null>,
): {
  first: number;
  last: number;
} | null {
  const available =
    values.filter(
      (
        value,
      ): value is number =>
        value !== null,
    );

  if (
    available.length <
    2
  ) {
    return null;
  }

  return {
    first:
      available[0],

    last:
      available[
        available.length -
        1
      ],
  };
}

function formatEvolution(
  values: Array<number | null>,
  unit: string,
): string {
  const evolution =
    getEvolution(
      values,
    );

  if (!evolution) {
    return '—';
  }

  const difference =
    evolution.last -
    evolution.first;

  const prefix =
    difference > 0
      ? '+'
      : '';

  return `${prefix}${difference.toLocaleString(
    'pt-BR',
    {
      maximumFractionDigits: 2,
    },
  )} ${unit}`;
}

function buildMetrics():
  LongitudinalMetric[] {
  return [
    {
      key: 'weight',
      label: 'Peso',
      section: 'BASIC',
      unit: 'kg',

      getValue:
        (
          assessment,
        ) =>
          assessment.weightKg,
    },

    {
      key: 'height',
      label: 'Altura',
      section: 'BASIC',
      unit: 'cm',

      getValue:
        (
          assessment,
        ) =>
          assessment.heightCm,
    },

    {
      key: 'bmi',
      label: 'IMC · Higeia',
      section: 'BASIC',
      unit: 'kg/m²',

      getValue:
        (
          _assessment,
          results,
        ) =>
          getCalculationValue(
            results,
            'BMI',
          ),
    },

    {
      key: 'body-fat-observed',
      label: 'Gordura corporal · medida',
      section: 'BODY_COMPOSITION',
      unit: '%',
      deltaUnit: 'p.p.',

      getValue:
        (
          assessment,
        ) =>
          assessment.bodyFatPercentage,
    },

    {
      key: 'body-fat-higeia',
      label: 'Gordura corporal · Higeia',
      section: 'BODY_COMPOSITION',
      unit: '%',
      deltaUnit: 'p.p.',

      getValue:
        (
          _assessment,
          results,
        ) =>
          getCalculationValue(
            results,
            'BODY_FAT_PERCENTAGE',
          ),
    },

    {
      key: 'fat-mass-observed',
      label: 'Massa de gordura · medida',
      section: 'BODY_COMPOSITION',
      unit: 'kg',

      getValue:
        (
          assessment,
        ) =>
          assessment.fatMassKg,
    },

    {
      key: 'fat-mass-higeia',
      label: 'Massa de gordura · Higeia',
      section: 'BODY_COMPOSITION',
      unit: 'kg',

      getValue:
        (
          _assessment,
          results,
        ) =>
          getCalculationValue(
            results,
            'FAT_MASS_KG',
          ),
    },

    {
      key: 'lean-mass-observed',
      label: 'Massa magra · medida',
      section: 'BODY_COMPOSITION',
      unit: 'kg',

      getValue:
        (
          assessment,
        ) =>
          assessment.leanMassKg,
    },

    {
      key: 'lean-mass-higeia',
      label: 'Massa magra · Higeia',
      section: 'BODY_COMPOSITION',
      unit: 'kg',

      getValue:
        (
          _assessment,
          results,
        ) =>
          getCalculationValue(
            results,
            'LEAN_MASS_KG',
          ),
    },

    {
      key: 'muscle-mass',
      label: 'Massa muscular · medida',
      section: 'BODY_COMPOSITION',
      unit: 'kg',

      getValue:
        (
          assessment,
        ) =>
          assessment.muscleMassKg,
    },

    {
      key: 'neck',
      label: 'Pescoço',
      section: 'TRUNK',
      unit: 'cm',

      getValue:
        (
          assessment,
        ) =>
          getCircumferenceValue(
            assessment,
            'NECK',
            'NOT_APPLICABLE',
            'NOT_APPLICABLE',
          ),
    },

    {
      key: 'shoulders',
      label: 'Ombros',
      section: 'TRUNK',
      unit: 'cm',

      getValue:
        (
          assessment,
        ) =>
          getCircumferenceValue(
            assessment,
            'SHOULDERS',
            'NOT_APPLICABLE',
            'NOT_APPLICABLE',
          ),
    },

    {
      key: 'chest',
      label: 'Tórax',
      section: 'TRUNK',
      unit: 'cm',

      getValue:
        (
          assessment,
        ) =>
          getCircumferenceValue(
            assessment,
            'CHEST',
            'NOT_APPLICABLE',
            'NOT_APPLICABLE',
          ),
    },

    {
      key: 'waist',
      label: 'Cintura',
      section: 'TRUNK',
      unit: 'cm',

      getValue:
        (
          assessment,
        ) =>
          getCircumferenceValue(
            assessment,
            'WAIST',
            'NOT_APPLICABLE',
            'NOT_APPLICABLE',
          ),
    },

    {
      key: 'abdomen',
      label: 'Abdômen',
      section: 'TRUNK',
      unit: 'cm',

      getValue:
        (
          assessment,
        ) =>
          getCircumferenceValue(
            assessment,
            'ABDOMEN',
            'NOT_APPLICABLE',
            'NOT_APPLICABLE',
          ),
    },

    {
      key: 'hip',
      label: 'Quadril',
      section: 'TRUNK',
      unit: 'cm',

      getValue:
        (
          assessment,
        ) =>
          getCircumferenceValue(
            assessment,
            'HIP',
            'NOT_APPLICABLE',
            'NOT_APPLICABLE',
          ),
    },

    {
      key: 'arm-right-relaxed',
      label: 'Braço D · relaxado',
      section: 'UPPER_LIMBS',
      unit: 'cm',

      getValue:
        (
          assessment,
        ) =>
          getCircumferenceValue(
            assessment,
            'ARM',
            'RIGHT',
            'RELAXED',
          ),
    },

    {
      key: 'arm-left-relaxed',
      label: 'Braço E · relaxado',
      section: 'UPPER_LIMBS',
      unit: 'cm',

      getValue:
        (
          assessment,
        ) =>
          getCircumferenceValue(
            assessment,
            'ARM',
            'LEFT',
            'RELAXED',
          ),
    },

    {
      key: 'arm-right-contracted',
      label: 'Braço D · contraído',
      section: 'UPPER_LIMBS',
      unit: 'cm',

      getValue:
        (
          assessment,
        ) =>
          getCircumferenceValue(
            assessment,
            'ARM',
            'RIGHT',
            'CONTRACTED',
          ),
    },

    {
      key: 'arm-left-contracted',
      label: 'Braço E · contraído',
      section: 'UPPER_LIMBS',
      unit: 'cm',

      getValue:
        (
          assessment,
        ) =>
          getCircumferenceValue(
            assessment,
            'ARM',
            'LEFT',
            'CONTRACTED',
          ),
    },

    {
      key: 'forearm-right',
      label: 'Antebraço D',
      section: 'UPPER_LIMBS',
      unit: 'cm',

      getValue:
        (
          assessment,
        ) =>
          getCircumferenceValue(
            assessment,
            'FOREARM',
            'RIGHT',
            'NOT_APPLICABLE',
          ),
    },

    {
      key: 'forearm-left',
      label: 'Antebraço E',
      section: 'UPPER_LIMBS',
      unit: 'cm',

      getValue:
        (
          assessment,
        ) =>
          getCircumferenceValue(
            assessment,
            'FOREARM',
            'LEFT',
            'NOT_APPLICABLE',
          ),
    },

    {
      key: 'thigh-right',
      label: 'Coxa D',
      section: 'LOWER_LIMBS',
      unit: 'cm',

      getValue:
        (
          assessment,
        ) =>
          getCircumferenceValue(
            assessment,
            'THIGH',
            'RIGHT',
            'NOT_APPLICABLE',
          ),
    },

    {
      key: 'thigh-left',
      label: 'Coxa E',
      section: 'LOWER_LIMBS',
      unit: 'cm',

      getValue:
        (
          assessment,
        ) =>
          getCircumferenceValue(
            assessment,
            'THIGH',
            'LEFT',
            'NOT_APPLICABLE',
          ),
    },

    {
      key: 'calf-right',
      label: 'Panturrilha D',
      section: 'LOWER_LIMBS',
      unit: 'cm',

      getValue:
        (
          assessment,
        ) =>
          getCircumferenceValue(
            assessment,
            'CALF',
            'RIGHT',
            'NOT_APPLICABLE',
          ),
    },

    {
      key: 'calf-left',
      label: 'Panturrilha E',
      section: 'LOWER_LIMBS',
      unit: 'cm',

      getValue:
        (
          assessment,
        ) =>
          getCircumferenceValue(
            assessment,
            'CALF',
            'LEFT',
            'NOT_APPLICABLE',
          ),
    },
  ];
}

function formatPatientCpf(
  value: string | null,
): string {
  if (!value) {
    return 'Não informado';
  }

  const digits =
    value.replace(
      /\D/g,
      '',
    );

  if (
    digits.length !==
    11
  ) {
    return value;
  }

  return digits.replace(
    /(\d{3})(\d{3})(\d{3})(\d{2})/,
    '$1.$2.$3-$4',
  );
}

function formatPatientBirthDate(
  value: string | null,
): string {
  if (!value) {
    return 'Não informado';
  }

  const [
    year,
    month,
    day,
  ] =
    value
      .split('T')[0]
      .split('-');

  if (
    !year ||
    !month ||
    !day
  ) {
    return value;
  }

  return `${day}/${month}/${year}`;
}

function formatBiologicalSex(
  value:
    | 'MALE'
    | 'FEMALE'
    | null,
): string {
  if (
    value ===
    'MALE'
  ) {
    return 'Masculino';
  }

  if (
    value ===
    'FEMALE'
  ) {
    return 'Feminino';
  }

  return 'Não informado';
}

function formatRole(
  role:
    | UserOrganization['role']
    | undefined,
): string {
  switch (role) {
    case 'OWNER':
      return 'Proprietário';

    case 'ADMIN':
      return 'Administrador';

    case 'NUTRITIONIST':
      return 'Nutricionista';

    case 'ASSISTANT':
      return 'Assistente';

    default:
      return 'Não informado';
  }
}

function formatPrintDateTime(
  value: Date | null,
): string {
  if (!value) {
    return '—';
  }

  return value.toLocaleString(
    'pt-BR',
    {
      dateStyle:
        'short',
      timeStyle:
        'short',
    },
  );
}


function formatBodyCompositionMethod(
  value: string | null,
): string | null {
  if (!value) {
    return null;
  }

  const labels:
    Record<string, string> = {
      BIOIMPEDANCE:
        'Bioimpedância',
      SKINFOLD:
        'Dobras cutâneas',
      DEXA:
        'DEXA',
      OTHER:
        'Outro',
    };

  return (
    labels[value] ??
    value
  );
}

function formatSkinfoldProtocol(
  value: string | null,
): string | null {
  if (!value) {
    return null;
  }

  const labels:
    Record<string, string> = {
      JACKSON_POLLOCK_3:
        'Jackson-Pollock 3 dobras',
      JACKSON_POLLOCK_7:
        'Jackson-Pollock 7 dobras',
      OTHER:
        'Outro',
    };

  return (
    labels[value] ??
    value
  );
}

function formatSkinfoldSite(
  value: string,
): string {
  const labels:
    Record<string, string> = {
      CHEST: 'Peitoral',
      MIDAXILLARY:
        'Axilar média',
      TRICEPS: 'Tríceps',
      SUBSCAPULAR:
        'Subescapular',
      ABDOMEN: 'Abdominal',
      SUPRAILIAC:
        'Supra-ilíaca',
      THIGH: 'Coxa',
      BICEPS: 'Bíceps',
      SUPRASPINALE:
        'Supraespinal',
      CALF: 'Panturrilha',
      OTHER: 'Outro',
    };

  return (
    labels[value] ??
    value
  );
}

function formatMeasurementSide(
  value: string,
): string {
  const labels:
    Record<string, string> = {
      RIGHT: 'Direito',
      LEFT: 'Esquerdo',
      NOT_APPLICABLE:
        'Não aplicável',
    };

  return (
    labels[value] ??
    value
  );
}

function formatCalculationLabel(
  code: AnthropometricCalculationCode,
): string {
  const labels:
    Record<AnthropometricCalculationCode, string> = {
      BMI: 'IMC',
      BODY_DENSITY:
        'Densidade corporal',
      BODY_FAT_PERCENTAGE:
        'Gordura corporal',
      FAT_MASS_KG:
        'Massa de gordura',
      LEAN_MASS_KG:
        'Massa magra',
    };

  return labels[code];
}

function formatCalculationMethod(
  value: string,
): string {
  const labels:
    Record<string, string> = {
      WEIGHT_HEIGHT_BMI:
        'Peso e altura',
      JACKSON_POLLOCK_3:
        'Jackson-Pollock 3 dobras',
      JACKSON_POLLOCK_7:
        'Jackson-Pollock 7 dobras',
      SIRI:
        'Equação de Siri',
      WEIGHT_BODY_FAT_PERCENTAGE:
        'Peso e percentual de gordura',
    };

  return (
    labels[value] ??
    value
  );
}











const HIGEIA_PRINT_STYLES = `
  @page {
    size: A4 portrait;
    margin: 5.5mm;
  }

  * {
    box-sizing: border-box;
  }

  html,
  body {
    margin: 0;
    padding: 0;
    background: #ffffff;
    color: #1d2926;
    font-family:
      Inter,
      ui-sans-serif,
      system-ui,
      -apple-system,
      BlinkMacSystemFont,
      "Segoe UI",
      sans-serif;
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }

  body {
    width: 100%;
  }

  .higeia-print-report {
    display: block;
    width: 100%;
    min-height: 285mm;
    background: #ffffff;
    color: #1d2926;
    font-size: 7.35pt;
    line-height: 1.24;
  }

  .higeia-print-document-header {
    display: grid;
    grid-template-columns: 1fr auto;
    gap: 14px;
    align-items: start;
    padding-bottom: 6px;
    margin-bottom: 6px;
    border-bottom: 2px solid #0f766e;
  }

  .higeia-print-brand-row {
    display: flex;
    align-items: center;
    gap: 7px;
    margin-bottom: 3px;
  }

  .higeia-print-brand-mark {
    display: inline-flex;
    width: 22px;
    height: 22px;
    align-items: center;
    justify-content: center;
    border-radius: 6px;
    background: #0f766e;
    color: #ffffff;
    font-size: 10pt;
    font-weight: 800;
  }

  .higeia-print-brand {
    margin: 0;
    color: #0f766e;
    font-size: 8.2pt;
    font-weight: 800;
    letter-spacing: 0.15em;
  }

  .higeia-print-document-header h1 {
    margin: 0;
    color: #111827;
    font-size: 16.2pt;
    line-height: 1.05;
    font-weight: 720;
    letter-spacing: -0.02em;
  }

  .higeia-print-subtitle {
    margin: 2px 0 0;
    color: #64748b;
    font-size: 7.2pt;
  }

  .higeia-print-emission {
    min-width: 105px;
    padding-top: 1px;
    text-align: right;
  }

  .higeia-print-kicker {
    display: block;
    margin-bottom: 1px;
    color: #64748b;
    font-size: 5.7pt;
    font-weight: 700;
    letter-spacing: 0.07em;
    text-transform: uppercase;
  }

  .higeia-print-emission strong {
    color: #1d2926;
    font-size: 6.8pt;
  }

  .higeia-print-patient {
    display: grid;
    grid-template-columns: 1.25fr 1.6fr 0.55fr;
    gap: 8px;
    align-items: end;
    padding: 6px 8px;
    margin-bottom: 5px;
    border: 1px solid #dce7e4;
    border-radius: 6px;
    background: #f8fbfa;
  }

  .higeia-print-patient-name strong {
    display: block;
    margin-top: 1px;
    color: #111827;
    font-size: 10.2pt;
    line-height: 1.05;
  }

  .higeia-print-inline-detail {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 7px;
  }

  .higeia-print-detail-value {
    display: block;
    margin-top: 1px;
    color: #26332f;
    font-size: 7.0pt;
    font-weight: 650;
  }

  .higeia-print-professional {
    display: grid;
    grid-template-columns: 1.25fr 1fr 0.7fr;
    gap: 8px;
    padding: 5px 8px;
    margin-bottom: 5px;
    border-left: 2px solid #0f766e;
    background: #f3f8f7;
  }

  .higeia-print-period {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 10px;
    padding: 4px 7px;
    margin-bottom: 5px;
    border-radius: 5px;
    background: #ecf5f3;
    color: #23413b;
    font-size: 6.7pt;
  }

  .higeia-print-period strong {
    color: #0f5f58;
  }

  .higeia-print-summary {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 5px;
    margin-bottom: 6px;
  }

  .higeia-print-summary-card {
    min-height: 38px;
    padding: 5px 7px;
    border: 1px solid #dce7e4;
    border-radius: 6px;
    background: #ffffff;
  }

  .higeia-print-summary-card .label {
    display: block;
    margin-bottom: 2px;
    color: #64748b;
    font-size: 5.5pt;
    font-weight: 700;
    letter-spacing: 0.04em;
    text-transform: uppercase;
  }

  .higeia-print-summary-card .values {
    display: flex;
    align-items: baseline;
    gap: 4px;
    color: #1d2926;
  }

  .higeia-print-summary-card .values strong {
    font-size: 8.2pt;
  }

  .higeia-print-summary-card .arrow {
    color: #94a3b8;
    font-size: 6pt;
  }

  .higeia-print-summary-card .delta {
    display: block;
    margin-top: 1px;
    color: #0f766e;
    font-size: 5.8pt;
    font-weight: 700;
  }

  .higeia-print-table {
    margin-top: 0;
  }

  .higeia-print-table-title {
    display: flex;
    align-items: baseline;
    justify-content: space-between;
    gap: 10px;
    margin-bottom: 3px;
  }

  .higeia-print-table-title h2 {
    margin: 0;
    color: #1d2926;
    font-size: 9.2pt;
  }

  .higeia-print-table-title span {
    color: #64748b;
    font-size: 5.5pt;
  }

  .higeia-print-table > div {
    overflow: visible !important;
    border: 1px solid #d8e2df !important;
    border-radius: 5px !important;
  }

  .higeia-print-table table {
    width: 100% !important;
    min-width: 0 !important;
    border-collapse: collapse !important;
    table-layout: fixed;
    font-size: 6.25pt;
    line-height: 1.15;
  }

  .higeia-print-table thead {
    display: table-header-group;
  }

  .higeia-print-table thead th {
    position: static !important;
    min-width: 0 !important;
    height: 52px;
    padding: 3px 2.5px !important;
    border: 0 !important;
    border-right: 1px solid #c9d8d4 !important;
    border-bottom: 1px solid #aebfba !important;
    background: #eaf3f1 !important;
    color: #23413b !important;
    font-size: 6.1pt;
    font-weight: 800 !important;
    text-align: center !important;
    vertical-align: middle !important;
  }

  .higeia-print-table thead th:first-child {
    width: 42%;
    padding-left: 6px !important;
    text-align: left !important;
  }

  .higeia-print-table thead th:last-child {
    width: 16%;
    border-right: 0 !important;
  }

  .higeia-print-date-header {
    display: inline-flex;
    height: 44px;
    align-items: center;
    justify-content: center;
    writing-mode: vertical-rl;
    transform: rotate(180deg);
    white-space: nowrap;
    line-height: 1;
    letter-spacing: 0.01em;
  }

  .higeia-print-table tbody td {
    position: static !important;
    min-width: 0 !important;
    padding: 2.35px 3.5px !important;
    border: 0 !important;
    border-right: 1px solid #edf2f1 !important;
    border-bottom: 1px solid #e3ebe8 !important;
    background: #ffffff !important;
    color: #24302d !important;
    text-align: center !important;
    vertical-align: middle !important;
  }

  .higeia-print-table tbody tr:last-child td {
    border-bottom: 0 !important;
  }

  .higeia-print-table tbody tr[class*='bg-muted'] td {
    padding-top: 2.7px !important;
    padding-bottom: 2.7px !important;
    border-right: 0 !important;
    border-bottom: 1px solid #c5d6d1 !important;
    background: #edf5f3 !important;
    color: #0f5f58 !important;
    font-size: 5.95pt !important;
    font-weight: 800 !important;
    letter-spacing: 0.035em;
    text-align: left !important;
  }

  .higeia-print-table tbody td:first-child {
    padding-left: 6px !important;
    color: #475569 !important;
    font-weight: 540;
    text-align: left !important;
  }

  .higeia-print-table tbody td:last-child {
    border-right: 0 !important;
    color: #0f5f58 !important;
    font-weight: 760 !important;
    text-align: center !important;
  }

  .higeia-print-table tbody tr:not([class*='bg-muted']):nth-child(even) td {
    background: #fbfdfc !important;
  }

  .higeia-print-table tr {
    break-inside: avoid;
    page-break-inside: avoid;
  }

  .higeia-print-notes {
    margin-top: 5px;
    padding: 5px 7px;
    border-radius: 5px;
    background: #f8faf9;
    color: #52605c;
    break-inside: avoid;
    page-break-inside: avoid;
  }

  .higeia-print-notes h2 {
    margin: 0 0 2px;
    color: #334155;
    font-size: 6.7pt;
  }

  .higeia-print-notes p {
    margin: 1px 0;
    font-size: 5.4pt;
    line-height: 1.25;
  }

  .higeia-print-footer {
    display: grid;
    grid-template-columns: 1fr 180px;
    gap: 18px;
    align-items: end;
    margin-top: 6px;
    padding-top: 5px;
    border-top: 1px solid #d6e1de;
    color: #64748b;
    font-size: 5.2pt;
    break-inside: avoid;
    page-break-inside: avoid;
  }

  .higeia-print-footer-copy strong {
    display: block;
    margin-bottom: 1px;
    color: #0f766e;
    font-size: 5.8pt;
    letter-spacing: 0.08em;
  }

  .higeia-print-signature {
    text-align: center;
    color: #24302d;
  }

  .higeia-print-signature-line {
    display: block;
    margin-bottom: 3px;
    border-top: 1px solid #64748b;
  }

  .higeia-print-signature strong,
  .higeia-print-signature small {
    display: block;
  }

  .higeia-print-signature small {
    margin-top: 1px;
    color: #64748b;
  }
`;

export function AnthropometricAssessmentComparisonPanel({
  patientId,
  patientName,
  patientBirthDate,
  patientCpf,
  biologicalSex,
  assessments,
  onEditAssessment,
  onDeleteAssessment,
  isDeletingAssessment,
}: AnthropometricAssessmentComparisonPanelProps) {
  const [
    isExpanded,
    setIsExpanded,
  ] =
    useState(
      false,
    );

  const [
    authenticatedUser,
    setAuthenticatedUser,
  ] =
    useState<AuthUser | null>(
      null,
    );

  const [
    activeOrganization,
    setActiveOrganization,
  ] =
    useState<UserOrganization | null>(
      null,
    );

  const [
    printGeneratedAt,
    setPrintGeneratedAt,
  ] =
    useState<Date | null>(
      null,
    );

  const [
    selectedAssessmentId,
    setSelectedAssessmentId,
  ] =
    useState<string | null>(
      null,
    );

  useEffect(
    () => {
      setAuthenticatedUser(
        authStorage.getUser(),
      );

      setActiveOrganization(
        authStorage.getActiveOrganization(),
      );
    },
    [],
  );

  
  const sortedAssessments =
    useMemo(
      () =>
        [...assessments].sort(
          (
            first,
            second,
          ) =>
            new Date(
              first.measuredAt,
            ).getTime() -
            new Date(
              second.measuredAt,
            ).getTime(),
        ),
      [
        assessments,
      ],
    );

  const assessmentIds =
    useMemo(
      () =>
        sortedAssessments.map(
          (
            assessment,
          ) =>
            assessment.id,
        ),
      [
        sortedAssessments,
      ],
    );

  const resultsEntries =
    useAnthropometricAssessmentsResults(
      patientId,
      assessmentIds,
    );

  const resultsByAssessmentId =
    useMemo(
      () =>
        new Map(
          resultsEntries.map(
            (
              entry,
            ) => [
              entry.assessmentId,
              entry.data,
            ],
          ),
        ),
      [
        resultsEntries,
      ],
    );

  const selectedAssessment =
    useMemo(
      () =>
        selectedAssessmentId
          ? sortedAssessments.find(
              (
                assessment,
              ) =>
                assessment.id ===
                selectedAssessmentId,
            ) ??
            null
          : null,
      [
        selectedAssessmentId,
        sortedAssessments,
      ],
    );

  const selectedAssessmentResults =
    selectedAssessment
      ? resultsByAssessmentId.get(
          selectedAssessment.id,
        )
      : undefined;

  const selectedAssessmentIndex =
    selectedAssessment
      ? sortedAssessments.findIndex(
          (
            assessment,
          ) =>
            assessment.id ===
            selectedAssessment.id,
        )
      : -1;

  const previousAssessment =
    selectedAssessmentIndex >
    0
      ? sortedAssessments[
          selectedAssessmentIndex -
            1
        ]
      : null;

  const previousAssessmentResults =
    previousAssessment
      ? resultsByAssessmentId.get(
          previousAssessment.id,
        )
      : undefined;

  const metrics =
    useMemo(
      () =>
        buildMetrics(),
      [],
    );

  const compactAssessments =
    sortedAssessments.slice(
      -3,
    );

  const hasLoadingResults =
    resultsEntries.some(
      (
        entry,
      ) =>
        entry.isLoading,
    );

  const printSummaryMetrics =
    metrics.filter(
      (
        metric,
      ) =>
        [
          'weight',
          'bmi',
          'body-fat-higeia',
        ].includes(
          metric.key,
        ),
    );

  if (
    assessments.length ===
    0
  ) {
    return null;
  }

  function renderPrintTable() {
    const groupedSections:
      MetricSection[] = [
        'BASIC',
        'BODY_COMPOSITION',
        'TRUNK',
        'UPPER_LIMBS',
        'LOWER_LIMBS',
      ];

    return (
      <div>
        <table>
          <thead>
            <tr>
              <th>
                Indicador
              </th>

              {sortedAssessments.map(
                (
                  assessment,
                ) => (
                  <th
                    key={
                      assessment.id
                    }
                  >
                    <span className="higeia-print-date-header">
                      {formatDate(
                        assessment.measuredAt,
                      )}
                    </span>
                  </th>
                ),
              )}

              <th>
                <span className="higeia-print-date-header">
                  Evolução
                </span>
              </th>
            </tr>
          </thead>

          <tbody>
            {groupedSections.map(
              (
                section,
              ) => {
                const sectionMetrics =
                  metrics
                    .filter(
                      (
                        metric,
                      ) =>
                        metric.section ===
                        section,
                    )
                    .filter(
                      (
                        metric,
                      ) =>
                        sortedAssessments.some(
                          (
                            assessment,
                          ) =>
                            metric.getValue(
                              assessment,
                              resultsByAssessmentId.get(
                                assessment.id,
                              ),
                            ) !==
                            null,
                        ),
                    );

                if (
                  sectionMetrics.length ===
                  0
                ) {
                  return null;
                }

                return (
                  <Fragment
                    key={section}
                  >
                    <tr className="bg-muted">
                      <td
                        colSpan={
                          sortedAssessments.length +
                          2
                        }
                      >
                        {
                          sectionLabels[
                            section
                          ]
                        }
                      </td>
                    </tr>

                    {sectionMetrics.map(
                      (
                        metric,
                      ) => {
                        const values =
                          sortedAssessments.map(
                            (
                              assessment,
                            ) =>
                              metric.getValue(
                                assessment,
                                resultsByAssessmentId.get(
                                  assessment.id,
                                ),
                              ),
                          );

                        return (
                          <tr
                            key={
                              metric.key
                            }
                          >
                            <td>
                              {
                                metric.label
                              }
                            </td>

                            {values.map(
                              (
                                value,
                                index,
                              ) => (
                                <td
                                  key={
                                    sortedAssessments[
                                      index
                                    ].id
                                  }
                                >
                                  {formatValue(
                                    value,
                                    metric.unit,
                                  )}
                                </td>
                              ),
                            )}

                            <td>
                              {formatEvolution(
                                values,
                                metric.deltaUnit ??
                                  metric.unit,
                              )}
                            </td>
                          </tr>
                        );
                      },
                    )}
                  </Fragment>
                );
              },
            )}
          </tbody>
        </table>
      </div>
    );
  }

  function handlePrint(): void {
    const generatedAt =
      new Date();

    setPrintGeneratedAt(
      generatedAt,
    );

    const printWindow =
      window.open(
        '',
        '_blank',
        'width=1400,height=900',
      );

    if (!printWindow) {
      window.print();
      return;
    }

    window.requestAnimationFrame(
      () => {
        window.requestAnimationFrame(
          () => {
            const report =
              document.querySelector(
                '.higeia-print-report',
              );

            if (!report) {
              printWindow.close();
              window.print();
              return;
            }

            printWindow.document.open();
            printWindow.document.write(
              `<!doctype html>
<html lang="pt-BR">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Ficha de Evolução Antropométrica - ${patientName}</title>
  <style>${HIGEIA_PRINT_STYLES}</style>
</head>
<body>
  ${report.outerHTML}
</body>
</html>`,
            );
            printWindow.document.close();
            printWindow.focus();

            window.setTimeout(
              () => {
                printWindow.print();
              },
              250,
            );
          },
        );
      },
    );
  }

  return (
    <>
      <div className="space-y-4 rounded-xl border bg-muted/10 p-4">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h4 className="font-medium">
              Evolução antropométrica
            </h4>

            <p className="mt-1 text-xs text-muted-foreground">
              Últimas{' '}
              {
                compactAssessments.length
              }{' '}
              avaliações registradas. Expanda para consultar o histórico completo.
            </p>
          </div>

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() =>
              setIsExpanded(
                true,
              )
            }
          >
            <Maximize2 className="size-4" />

            Expandir histórico
          </Button>
        </div>

        {hasLoadingResults && (
          <p className="text-xs text-muted-foreground">
            Atualizando resultados calculados pela Higeia...
          </p>
        )}

        <AnthropometricHistoryTable
          assessments={
            compactAssessments
          }
          resultsByAssessmentId={
            resultsByAssessmentId
          }
          metrics={
            metrics
          }
          expanded={
            false
          }
          isDeletingAssessment={
            isDeletingAssessment
          }
          onEditAssessment={
            onEditAssessment
          }
          onDeleteAssessment={
            onDeleteAssessment
          }
        />

        <p className="text-[11px] text-muted-foreground">
          A coluna Evolução considera a primeira e a última medição disponível do indicador dentro do período exibido. Traço indica dado não registrado.
        </p>
      </div>

      {isExpanded && (
        <div className="fixed inset-0 z-50 flex bg-background/95">
          <div className="flex min-h-0 w-full flex-col">
            <div className="flex flex-wrap items-start justify-between gap-4 border-b bg-background px-6 py-4">
              <div>
                <h2 className="text-xl font-semibold">
                  Histórico antropométrico
                </h2>

                <p className="mt-1 text-sm text-muted-foreground">
                  {
                    sortedAssessments.length
                  }{' '}
                  avaliação(ões) registrada(s)
                </p>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={
                    handlePrint
                  }
                >
                  <Printer className="size-4" />

                  Imprimir
                </Button>

                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => {
                    setSelectedAssessmentId(
                      null,
                    );

                    setIsExpanded(
                      false,
                    );
                  }}
                  aria-label="Fechar histórico antropométrico"
                >
                  <X className="size-5" />
                </Button>
              </div>
            </div>

            <div className="min-h-0 flex-1 overflow-auto p-6">
              <div className="mx-auto max-w-none space-y-4">
                <AnthropometricLongitudinalPanel
                  assessments={
                    sortedAssessments
                  }
                  resultsByAssessmentId={
                    resultsByAssessmentId
                  }
                  isLoading={
                    hasLoadingResults
                  }
                />

                <div className="rounded-xl border bg-background p-4">
                  <div className="mb-4">
                    <h3 className="font-medium">
                      Evolução completa
                    </h3>

                    <p className="mt-1 text-xs text-muted-foreground">
                      Todas as avaliações antropométricas registradas no prontuário.
                    </p>
                  </div>

                  <AnthropometricHistoryTable
                    assessments={
                      sortedAssessments
                    }
                    resultsByAssessmentId={
                      resultsByAssessmentId
                    }
                    metrics={
                      metrics
                    }
                    expanded={
                      true
                    }
                    isDeletingAssessment={
                      isDeletingAssessment
                    }
                    onOpenAssessment={(
                      assessment,
                    ) =>
                      setSelectedAssessmentId(
                        assessment.id,
                      )
                    }
                    onEditAssessment={
                      onEditAssessment
                    }
                    onDeleteAssessment={
                      onDeleteAssessment
                    }
                  />
                </div>

                <p className="text-xs text-muted-foreground">
                  Resultados identificados como Higeia são valores derivados dos dados registrados e não substituem medições realizadas por equipamento ou método profissional.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
      {selectedAssessment && (
        <AnthropometricAssessmentDetail
          assessment={
            selectedAssessment
          }
          previousAssessment={
            previousAssessment
          }
          results={
            selectedAssessmentResults
          }
          previousResults={
            previousAssessmentResults
          }
          metrics={
            metrics
          }
          onEdit={
            onEditAssessment
          }
          onClose={() =>
            setSelectedAssessmentId(
              null,
            )
          }
        />
      )}
      <div className="higeia-print-report">
        <header className="higeia-print-document-header">
          <div>
            <div className="higeia-print-brand-row">
              <span className="higeia-print-brand-mark">H</span>
              <p className="higeia-print-brand">HIGEIA</p>
            </div>
            <h1>Ficha de Evolução Antropométrica</h1>
            <p className="higeia-print-subtitle">Histórico longitudinal de avaliação corporal</p>
          </div>
          <div className="higeia-print-emission">
            <span className="higeia-print-kicker">Emitido em</span>
            <strong>{formatPrintDateTime(printGeneratedAt)}</strong>
          </div>
        </header>

        <section className="higeia-print-patient">
          <div className="higeia-print-patient-name">
            <span className="higeia-print-kicker">Paciente</span>
            <strong>{patientName}</strong>
          </div>
          <div className="higeia-print-inline-detail">
            <div><span className="higeia-print-kicker">CPF</span><span className="higeia-print-detail-value">{formatPatientCpf(patientCpf)}</span></div>
            <div><span className="higeia-print-kicker">Nascimento</span><span className="higeia-print-detail-value">{formatPatientBirthDate(patientBirthDate)}</span></div>
            <div><span className="higeia-print-kicker">Sexo</span><span className="higeia-print-detail-value">{formatBiologicalSex(biologicalSex)}</span></div>
          </div>
          <div>
            <span className="higeia-print-kicker">Avaliações no período</span>
            <span className="higeia-print-detail-value">{sortedAssessments.length}</span>
          </div>
        </section>

        <section className="higeia-print-professional">
          <div><span className="higeia-print-kicker">Organização</span><span className="higeia-print-detail-value">{activeOrganization?.organizationName ?? 'Não informado'}</span></div>
          <div><span className="higeia-print-kicker">Emitido por</span><span className="higeia-print-detail-value">{authenticatedUser?.name ?? 'Não informado'}</span></div>
          <div><span className="higeia-print-kicker">Função</span><span className="higeia-print-detail-value">{formatRole(activeOrganization?.role)}</span></div>
        </section>

        <section className="higeia-print-period">
          <div>
            <strong>Período analisado</strong>{' '}
            {sortedAssessments.length > 0
              ? `${formatDate(sortedAssessments[0].measuredAt)} — ${formatDate(sortedAssessments[sortedAssessments.length - 1].measuredAt)}`
              : '—'}
          </div>
          <div>Histórico completo do prontuário antropométrico</div>
        </section>

        <section className="higeia-print-summary">
          {printSummaryMetrics.map(
            (
              metric,
            ) => {
              const values =
                sortedAssessments.map(
                  (
                    assessment,
                  ) =>
                    metric.getValue(
                      assessment,
                      resultsByAssessmentId.get(
                        assessment.id,
                      ),
                    ),
                );

              const availableValues =
                values.filter(
                  (
                    value,
                  ): value is number =>
                    value !== null,
                );

              const firstValue =
                availableValues.length >
                0
                  ? availableValues[0]
                  : null;

              const lastValue =
                availableValues.length >
                0
                  ? availableValues[
                      availableValues.length -
                        1
                    ]
                  : null;

              const hasEvolution =
                availableValues.length >
                1;

              return (
                <div
                  key={
                    metric.key
                  }
                  className="higeia-print-summary-card"
                >
                  <span className="label">
                    {
                      metric.label.replace(
                        ' · Higeia',
                        '',
                      )
                    }
                  </span>

                  <div className="values">
                    <strong>
                      {formatValue(
                        firstValue,
                        metric.unit,
                      )}
                    </strong>

                    {hasEvolution && (
                      <>
                        <span className="arrow">
                          →
                        </span>

                        <strong>
                          {formatValue(
                            lastValue,
                            metric.unit,
                          )}
                        </strong>
                      </>
                    )}
                  </div>

                  <span className="delta">
                    {hasEvolution
                      ? formatEvolution(
                          values,
                          metric.deltaUnit ??
                            metric.unit,
                        )
                      : availableValues.length ===
                          1
                        ? '1 registro disponível'
                        : 'Sem dados disponíveis'}
                  </span>
                </div>
              );
            },
          )}
        </section>

        <section className="higeia-print-table">
          <div className="higeia-print-table-title">
            <h2>Evolução antropométrica completa</h2>
            <span>Traço (—) indica dado não registrado</span>
          </div>
          {renderPrintTable()}
        </section>

        <section className="higeia-print-notes">
          <h2>Informações e metodologia</h2>
          <p>Resultados identificados como Higeia são derivados dos dados registrados no prontuário e devem ser interpretados pelo profissional responsável em conjunto com a avaliação clínica.</p>
          <p>A coluna Evolução considera a primeira e a última medição disponível de cada indicador dentro do período apresentado. Valores ausentes não são interpolados.</p>
        </section>

        <footer className="higeia-print-footer">
          <div className="higeia-print-footer-copy">
            <strong>HIGEIA</strong>
            Documento gerado a partir das informações registradas no prontuário eletrônico.
          </div>
          <div className="higeia-print-signature">
            <span className="higeia-print-signature-line" />
            <strong>{authenticatedUser?.name ?? 'Profissional responsável'}</strong>
            <small>{formatRole(activeOrganization?.role)}{activeOrganization?.organizationName ? ` · ${activeOrganization.organizationName}` : ''}</small>
          </div>
        </footer>
      </div>

      <style jsx global>{`
        .higeia-print-report {
          display: none;
        }
      `}</style>
    </>
  );
}