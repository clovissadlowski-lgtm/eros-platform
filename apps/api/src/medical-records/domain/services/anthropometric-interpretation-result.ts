export type AnthropometricInterpretationCode =
  | 'BMI';

export type AnthropometricPopulation =
  | 'ADULT'
  | 'OLDER_ADULT'
  | 'CHILD'
  | 'ADOLESCENT'
  | 'PREGNANCY'
  | 'UNKNOWN';

export type AnthropometricInterpretationLevel =
  | 'BELOW_REFERENCE'
  | 'WITHIN_REFERENCE'
  | 'ABOVE_REFERENCE'
  | 'HIGH'
  | 'VERY_HIGH'
  | 'NOT_CLASSIFIED';

export interface AnthropometricInterpretationReference {
  organization: string;

  guideline: string;

  version?: string;
}

export interface AnthropometricInterpretationResult {
  code:
    AnthropometricInterpretationCode;

  population:
    AnthropometricPopulation;

  level:
    AnthropometricInterpretationLevel;

  label: string;

  reference:
    AnthropometricInterpretationReference;

  clinicallyInterpretable: boolean;
}