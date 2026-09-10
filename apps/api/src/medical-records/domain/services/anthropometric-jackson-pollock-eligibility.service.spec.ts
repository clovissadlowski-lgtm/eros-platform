import {
  AnthropometricJacksonPollockEligibilityService,
} from './anthropometric-jackson-pollock-eligibility.service';

describe(
  'AnthropometricJacksonPollockEligibilityService',
  () => {
    const service =
      new AnthropometricJacksonPollockEligibilityService();

    it(
      'accepts an adult male inside the reference age range',
      () => {
        expect(
          service.evaluate({
            biologicalSex:
              'MALE',
            ageYears:
              36,
          }),
        ).toEqual({
          eligible:
            true,
          reason:
            'ELIGIBLE',
          referenceAgeRange: {
            minimumYears:
              18,
            maximumYears:
              61,
          },
        });
      },
    );

    it(
      'accepts an adult female inside the reference age range',
      () => {
        expect(
          service.evaluate({
            biologicalSex:
              'FEMALE',
            ageYears:
              35,
          }),
        ).toEqual({
          eligible:
            true,
          reason:
            'ELIGIBLE',
          referenceAgeRange: {
            minimumYears:
              18,
            maximumYears:
              55,
          },
        });
      },
    );

    it(
      'rejects age below the reference range',
      () => {
        expect(
          service.evaluate({
            biologicalSex:
              'MALE',
            ageYears:
              17,
          }),
        ).toMatchObject({
          eligible:
            false,
          reason:
            'BELOW_REFERENCE_AGE',
        });
      },
    );

    it(
      'rejects male age above the reference range',
      () => {
        expect(
          service.evaluate({
            biologicalSex:
              'MALE',
            ageYears:
              62,
          }),
        ).toMatchObject({
          eligible:
            false,
          reason:
            'ABOVE_REFERENCE_AGE',
        });
      },
    );

    it(
      'rejects female age above the reference range',
      () => {
        expect(
          service.evaluate({
            biologicalSex:
              'FEMALE',
            ageYears:
              56,
          }),
        ).toMatchObject({
          eligible:
            false,
          reason:
            'ABOVE_REFERENCE_AGE',
        });
      },
    );

    it(
      'rejects missing age',
      () => {
        expect(
          service.evaluate({
            biologicalSex:
              'MALE',
            ageYears:
              null,
          }),
        ).toMatchObject({
          eligible:
            false,
          reason:
            'MISSING_AGE',
        });
      },
    );

    it(
      'rejects missing biological sex',
      () => {
        expect(
          service.evaluate({
            biologicalSex:
              null,
            ageYears:
              36,
          }),
        ).toEqual({
          eligible:
            false,
          reason:
            'MISSING_BIOLOGICAL_SEX',
          referenceAgeRange:
            null,
        });
      },
    );

    it(
      'includes the reference boundaries',
      () => {
        expect(
          service.evaluate({
            biologicalSex:
              'MALE',
            ageYears:
              18,
          }).eligible,
        ).toBe(
          true,
        );

        expect(
          service.evaluate({
            biologicalSex:
              'MALE',
            ageYears:
              61,
          }).eligible,
        ).toBe(
          true,
        );

        expect(
          service.evaluate({
            biologicalSex:
              'FEMALE',
            ageYears:
              18,
          }).eligible,
        ).toBe(
          true,
        );

        expect(
          service.evaluate({
            biologicalSex:
              'FEMALE',
            ageYears:
              55,
          }).eligible,
        ).toBe(
          true,
        );
      },
    );
  },
);