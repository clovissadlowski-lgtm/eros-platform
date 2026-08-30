export type AnthropometricCalculationSource =
  | 'HIGEIA_CALCULATION'
  | 'PROFESSIONAL_INPUT'
  | 'DEVICE';

export type AnthropometricCalculationCode =
  | 'BMI'
  | 'BODY_DENSITY'
  | 'BODY_FAT_PERCENTAGE'
  | 'FAT_MASS_KG'
  | 'LEAN_MASS_KG';

export interface AnthropometricCalculationResult {
  code:
    AnthropometricCalculationCode;

  value:
    number;

  unit:
    | 'kg/m²'
    | 'g/mL'
    | '%'
    | 'kg';

  source:
    AnthropometricCalculationSource;

  method:
    string;
}