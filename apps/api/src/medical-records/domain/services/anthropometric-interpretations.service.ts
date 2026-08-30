import {
  AnthropometricPopulation,
} from './anthropometric-interpretation-result';

import {
  ClinicalAgeService,
} from './clinical-age.service';

export interface ResolvePopulationInput {
  birthDate: string;
  assessmentDate: string;
}

export class AnthropometricInterpretationsService {
  constructor(
    private readonly clinicalAgeService =
      new ClinicalAgeService(),
  ) {}

  resolvePopulation(
    input: ResolvePopulationInput,
  ): AnthropometricPopulation {
    const age =
      this.clinicalAgeService.calculate({
        birthDate:
          input.birthDate,

        referenceDate:
          input.assessmentDate,
      });

    if (
      age.totalMonths < 120
    ) {
      return 'CHILD';
    }

    if (
      age.totalMonths < 240
    ) {
      return 'ADOLESCENT';
    }

    if (
      age.years < 60
    ) {
      return 'ADULT';
    }

    return 'OLDER_ADULT';
  }
}