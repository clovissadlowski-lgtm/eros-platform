import {
  AnthropometricCalculationResult,
} from './anthropometric-calculation-result';

export type JacksonPollockBiologicalSex =
  | 'MALE'
  | 'FEMALE';

export type JacksonPollockProtocol =
  | 'JACKSON_POLLOCK_3'
  | 'JACKSON_POLLOCK_7';

export interface BmiCalculationInput {
  weightKg:
    number;

  heightCm:
    number;
}

export interface JacksonPollockBodyDensityInput {
  biologicalSex:
    JacksonPollockBiologicalSex;

  protocol:
    JacksonPollockProtocol;

  ageYears:
    number;

  sumSkinfoldsMm:
    number;
}

export interface BodyFatFromDensityInput {
  bodyDensity:
    number;
}

export interface BodyMassFromBodyFatInput {
  weightKg:
    number;

  bodyFatPercentage:
    number;
}

export class AnthropometricCalculationsService {
  calculateBmi(
    input:
      BmiCalculationInput,
  ): AnthropometricCalculationResult {
    const {
      weightKg,
      heightCm,
    } = input;

    this.assertPositiveFiniteNumber(
      weightKg,
      'weightKg',
    );

    this.assertPositiveFiniteNumber(
      heightCm,
      'heightCm',
    );

    const heightMeters =
      heightCm / 100;

    const bmi =
      weightKg /
      heightMeters ** 2;

    return {
      code:
        'BMI',

      value:
        this.round(
          bmi,
          2,
        ),

      unit:
        'kg/m²',

      source:
        'HIGEIA_CALCULATION',

      method:
        'WEIGHT_HEIGHT_BMI',
    };
  }

  calculateJacksonPollockBodyDensity(
    input:
      JacksonPollockBodyDensityInput,
  ): AnthropometricCalculationResult {
    const {
      biologicalSex,
      protocol,
      ageYears,
      sumSkinfoldsMm,
    } = input;

    this.assertNonNegativeFiniteNumber(
      ageYears,
      'ageYears',
    );

    this.assertPositiveFiniteNumber(
      sumSkinfoldsMm,
      'sumSkinfoldsMm',
    );

    const squaredSum =
      sumSkinfoldsMm ** 2;

    let bodyDensity:
      number;

    if (
      biologicalSex === 'MALE' &&
      protocol === 'JACKSON_POLLOCK_3'
    ) {
      bodyDensity =
        1.10938 -
        0.0008267 *
          sumSkinfoldsMm +
        0.0000016 *
          squaredSum -
        0.0002574 *
          ageYears;
    } else if (
      biologicalSex === 'MALE' &&
      protocol === 'JACKSON_POLLOCK_7'
    ) {
      bodyDensity =
        1.112 -
        0.00043499 *
          sumSkinfoldsMm +
        0.00000055 *
          squaredSum -
        0.00028826 *
          ageYears;
    } else if (
      biologicalSex === 'FEMALE' &&
      protocol === 'JACKSON_POLLOCK_3'
    ) {
      bodyDensity =
        1.0994921 -
        0.0009929 *
          sumSkinfoldsMm +
        0.0000023 *
          squaredSum -
        0.0001392 *
          ageYears;
    } else if (
      biologicalSex === 'FEMALE' &&
      protocol === 'JACKSON_POLLOCK_7'
    ) {
      bodyDensity =
        1.097 -
        0.00046971 *
          sumSkinfoldsMm +
        0.00000056 *
          squaredSum -
        0.00012828 *
          ageYears;
    } else {
      throw new Error(
        'Unsupported Jackson-Pollock biological sex or protocol.',
      );
    }

    if (
      !Number.isFinite(
        bodyDensity,
      ) ||
      bodyDensity <= 0
    ) {
      throw new Error(
        'Calculated body density must be a positive finite number.',
      );
    }

    return {
      code:
        'BODY_DENSITY',

      value:
        this.round(
          bodyDensity,
          6,
        ),

      unit:
        'g/mL',

      source:
        'HIGEIA_CALCULATION',

      method:
        protocol,
    };
  }

  calculateBodyFatFromDensity(
    input:
      BodyFatFromDensityInput,
  ): AnthropometricCalculationResult {
    const {
      bodyDensity,
    } = input;

    this.assertPositiveFiniteNumber(
      bodyDensity,
      'bodyDensity',
    );

    const bodyFatPercentage =
      495 /
        bodyDensity -
      450;

    return {
      code:
        'BODY_FAT_PERCENTAGE',

      value:
        this.round(
          bodyFatPercentage,
          2,
        ),

      unit:
        '%',

      source:
        'HIGEIA_CALCULATION',

      method:
        'SIRI',
    };
  }

  calculateFatMass(
    input:
      BodyMassFromBodyFatInput,
  ): AnthropometricCalculationResult {
    const {
      weightKg,
      bodyFatPercentage,
    } = input;

    this.assertPositiveFiniteNumber(
      weightKg,
      'weightKg',
    );

    this.assertPercentage(
      bodyFatPercentage,
      'bodyFatPercentage',
    );

    const fatMassKg =
      weightKg *
      (
        bodyFatPercentage /
        100
      );

    return {
      code:
        'FAT_MASS_KG',

      value:
        this.round(
          fatMassKg,
          2,
        ),

      unit:
        'kg',

      source:
        'HIGEIA_CALCULATION',

      method:
        'WEIGHT_BODY_FAT_PERCENTAGE',
    };
  }

  calculateLeanMass(
    input:
      BodyMassFromBodyFatInput,
  ): AnthropometricCalculationResult {
    const {
      weightKg,
      bodyFatPercentage,
    } = input;

    this.assertPositiveFiniteNumber(
      weightKg,
      'weightKg',
    );

    this.assertPercentage(
      bodyFatPercentage,
      'bodyFatPercentage',
    );

    const fatMassKg =
      weightKg *
      (
        bodyFatPercentage /
        100
      );

    const leanMassKg =
      weightKg -
      fatMassKg;

    return {
      code:
        'LEAN_MASS_KG',

      value:
        this.round(
          leanMassKg,
          2,
        ),

      unit:
        'kg',

      source:
        'HIGEIA_CALCULATION',

      method:
        'WEIGHT_BODY_FAT_PERCENTAGE',
    };
  }

  private assertPositiveFiniteNumber(
    value:
      number,

    fieldName:
      string,
  ): void {
    if (
      !Number.isFinite(
        value,
      ) ||
      value <= 0
    ) {
      throw new Error(
        `${fieldName} must be a positive finite number.`,
      );
    }
  }

  private assertNonNegativeFiniteNumber(
    value:
      number,

    fieldName:
      string,
  ): void {
    if (
      !Number.isFinite(
        value,
      ) ||
      value < 0
    ) {
      throw new Error(
        `${fieldName} must be a non-negative finite number.`,
      );
    }
  }

  private assertPercentage(
    value:
      number,

    fieldName:
      string,
  ): void {
    if (
      !Number.isFinite(
        value,
      ) ||
      value < 0 ||
      value > 100
    ) {
      throw new Error(
        `${fieldName} must be between 0 and 100.`,
      );
    }
  }

  private round(
    value:
      number,

    decimalPlaces:
      number,
  ): number {
    const factor =
      10 ** decimalPlaces;

    return (
      Math.round(
        (
          value +
          Number.EPSILON
        ) *
          factor,
      ) /
      factor
    );
  }
}