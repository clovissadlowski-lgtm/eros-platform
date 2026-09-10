import {
  JacksonPollockBiologicalSex,
} from './anthropometric-calculations.service';

export type JacksonPollockEligibilityReason =
  | 'ELIGIBLE'
  | 'MISSING_AGE'
  | 'MISSING_BIOLOGICAL_SEX'
  | 'BELOW_REFERENCE_AGE'
  | 'ABOVE_REFERENCE_AGE';

export interface JacksonPollockEligibilityResult {
  eligible: boolean;
  reason: JacksonPollockEligibilityReason;
  referenceAgeRange: {
    minimumYears: number;
    maximumYears: number;
  } | null;
}

export interface JacksonPollockEligibilityInput {
  biologicalSex:
    JacksonPollockBiologicalSex | null;

  ageYears:
    number | null;
}

export class AnthropometricJacksonPollockEligibilityService {
  evaluate(
    input:
      JacksonPollockEligibilityInput,
  ): JacksonPollockEligibilityResult {
    if (
      !input.biologicalSex
    ) {
      return {
        eligible: false,
        reason:
          'MISSING_BIOLOGICAL_SEX',
        referenceAgeRange:
          null,
      };
    }

    if (
      input.ageYears === null
    ) {
      return {
        eligible: false,
        reason:
          'MISSING_AGE',
        referenceAgeRange:
          this.getReferenceAgeRange(
            input.biologicalSex,
          ),
      };
    }

    const referenceAgeRange =
      this.getReferenceAgeRange(
        input.biologicalSex,
      );

    if (
      input.ageYears <
      referenceAgeRange.minimumYears
    ) {
      return {
        eligible: false,
        reason:
          'BELOW_REFERENCE_AGE',
        referenceAgeRange,
      };
    }

    if (
      input.ageYears >
      referenceAgeRange.maximumYears
    ) {
      return {
        eligible: false,
        reason:
          'ABOVE_REFERENCE_AGE',
        referenceAgeRange,
      };
    }

    return {
      eligible: true,
      reason:
        'ELIGIBLE',
      referenceAgeRange,
    };
  }

  private getReferenceAgeRange(
    biologicalSex:
      JacksonPollockBiologicalSex,
  ): {
    minimumYears: number;
    maximumYears: number;
  } {
    if (
      biologicalSex === 'MALE'
    ) {
      return {
        minimumYears: 18,
        maximumYears: 61,
      };
    }

    return {
      minimumYears: 18,
      maximumYears: 55,
    };
  }
}