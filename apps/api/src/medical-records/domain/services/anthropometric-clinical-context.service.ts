import {
  PatientBiologicalSex,
} from '../../../patients/domain/entities/patient.entity';

import {
  AnthropometricPopulation,
} from './anthropometric-interpretation-result';

import {
  AnthropometricInterpretationsService,
} from './anthropometric-interpretations.service';

import {
  ClinicalAgeResult,
  ClinicalAgeService,
} from './clinical-age.service';

export interface AnthropometricClinicalContextInput {
  birthDate: string | null;

  biologicalSex:
    PatientBiologicalSex | null;

  assessmentDate: string;
}

export interface AnthropometricClinicalContext {
  assessmentDate: string;

  biologicalSex:
    PatientBiologicalSex | null;

  age:
    ClinicalAgeResult | null;

  population:
    AnthropometricPopulation;

  hasBirthDate: boolean;

  hasBiologicalSex: boolean;
}

export class AnthropometricClinicalContextService {
  constructor(
    private readonly clinicalAgeService =
      new ClinicalAgeService(),

    private readonly interpretationsService =
      new AnthropometricInterpretationsService(),
  ) {}

  build(
    input:
      AnthropometricClinicalContextInput,
  ): AnthropometricClinicalContext {
    const {
      birthDate,
      biologicalSex,
      assessmentDate,
    } = input;

    if (!birthDate) {
      return {
        assessmentDate,

        biologicalSex,

        age: null,

        population:
          'UNKNOWN',

        hasBirthDate: false,

        hasBiologicalSex:
          biologicalSex !== null,
      };
    }

    const age =
      this.clinicalAgeService.calculate({
        birthDate,

        referenceDate:
          assessmentDate,
      });

    const population =
      this.interpretationsService
        .resolvePopulation({
          birthDate,

          assessmentDate,
        });

    return {
      assessmentDate,

      biologicalSex,

      age,

      population,

      hasBirthDate: true,

      hasBiologicalSex:
        biologicalSex !== null,
    };
  }
}