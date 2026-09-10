export enum BodyCompositionMethod {
  BIOIMPEDANCE = 'BIOIMPEDANCE',
  SKINFOLD = 'SKINFOLD',
  DEXA = 'DEXA',
  OTHER = 'OTHER',
}

export enum SkinfoldProtocol {
  JACKSON_POLLOCK_3 = 'JACKSON_POLLOCK_3',
  JACKSON_POLLOCK_7 = 'JACKSON_POLLOCK_7',
  OTHER = 'OTHER',
}

export enum SkinfoldSite {
  CHEST = 'CHEST',
  MIDAXILLARY = 'MIDAXILLARY',
  TRICEPS = 'TRICEPS',
  SUBSCAPULAR = 'SUBSCAPULAR',
  ABDOMEN = 'ABDOMEN',
  SUPRAILIAC = 'SUPRAILIAC',
  THIGH = 'THIGH',
  BICEPS = 'BICEPS',
  SUPRASPINALE = 'SUPRASPINALE',
  CALF = 'CALF',
  OTHER = 'OTHER',
}

export enum SkinfoldMeasurementSide {
  RIGHT = 'RIGHT',
  LEFT = 'LEFT',
}

export enum AnthropometricCircumferenceSite {
  NECK = 'NECK',
  SHOULDERS = 'SHOULDERS',
  CHEST = 'CHEST',
  WAIST = 'WAIST',
  ABDOMEN = 'ABDOMEN',
  HIP = 'HIP',
  ARM = 'ARM',
  FOREARM = 'FOREARM',
  THIGH = 'THIGH',
  CALF = 'CALF',
  OTHER = 'OTHER',
}

export enum AnthropometricMeasurementSide {
  RIGHT = 'RIGHT',
  LEFT = 'LEFT',
  NOT_APPLICABLE = 'NOT_APPLICABLE',
}

export enum AnthropometricCircumferenceState {
  RELAXED = 'RELAXED',
  CONTRACTED = 'CONTRACTED',
  NOT_APPLICABLE = 'NOT_APPLICABLE',
}

export class AnthropometricSkinfoldMeasurement {
  id!: string;
  anthropometricAssessmentId!: string;
  site!: SkinfoldSite;
  side!: SkinfoldMeasurementSide;
  readingNumber!: number;
  valueMm!: number;
  createdAt!: string;
  updatedAt!: string;
}

export class AnthropometricCircumferenceMeasurement {
  id!: string;
  anthropometricAssessmentId!: string;
  site!: AnthropometricCircumferenceSite;
  side!: AnthropometricMeasurementSide;
  state!: AnthropometricCircumferenceState;
  valueCm!: number;
  createdAt!: string;
  updatedAt!: string;
}

export class AnthropometricAssessment {
  id!: string;
  organizationId!: string;
  medicalRecordId!: string;
  patientId!: string;
  measuredAt!: string;

  weightKg!: number | null;
  heightCm!: number | null;

  bodyFatPercentage!: number | null;
  fatMassKg!: number | null;
  leanMassKg!: number | null;
  muscleMassKg!: number | null;

  waistCircumferenceCm!: number | null;
  hipCircumferenceCm!: number | null;
  abdomenCircumferenceCm!: number | null;
  chestCircumferenceCm!: number | null;
  armCircumferenceCm!: number | null;
  thighCircumferenceCm!: number | null;
  calfCircumferenceCm!: number | null;

  bodyCompositionMethod!: BodyCompositionMethod | null;
  skinfoldProtocol!: SkinfoldProtocol | null;

  skinfoldMeasurements!: AnthropometricSkinfoldMeasurement[];
  circumferenceMeasurements!: AnthropometricCircumferenceMeasurement[];

  notes!: string | null;

  createdAt!: string;
  updatedAt!: string;
}