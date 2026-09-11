import {
  getCalculationValue,
  getCircumferenceValue,
} from './anthropometric-engine';

import type {
  AnthropometricAssessment,
  AnthropometricAssessmentResults,
} from '../medical-record.types';

export type AnthropometricMetricSection =
  | 'BASIC'
  | 'BODY_COMPOSITION'
  | 'TRUNK'
  | 'UPPER_LIMBS'
  | 'LOWER_LIMBS';

export interface AnthropometricMetric {
  key: string;
  label: string;
  section: AnthropometricMetricSection;
  unit: string;
  deltaUnit?: string;

  getValue: (
    assessment: AnthropometricAssessment,
    results:
      | AnthropometricAssessmentResults
      | undefined,
  ) => number | null;
}

export function buildAnthropometricMetrics():
  AnthropometricMetric[] {
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
