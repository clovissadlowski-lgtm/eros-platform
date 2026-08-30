import {
  Injectable,
} from '@nestjs/common';

import {
  Patient,
  PatientBiologicalSex,
} from '../../../patients/domain/entities/patient.entity';

import {
  AnthropometricAssessment,
  SkinfoldProtocol,
} from '../../domain/entities/anthropometric-assessment.entity';

import {
  AnthropometricCalculationResult,
} from '../../domain/services/anthropometric-calculation-result';

import {
  AnthropometricCalculationsService,
  JacksonPollockBiologicalSex,
  JacksonPollockProtocol,
} from '../../domain/services/anthropometric-calculations.service';

import {
  AnthropometricClinicalContext,
  AnthropometricClinicalContextService,
} from '../../domain/services/anthropometric-clinical-context.service';

import {
  AnthropometricSkinfoldProtocolService,
} from '../../domain/services/anthropometric-skinfold-protocol.service';

export interface AnthropometricAssessmentResults {
  assessment:
    AnthropometricAssessment;

  clinicalContext:
    AnthropometricClinicalContext;

  calculations:
    AnthropometricCalculationResult[];
}

@Injectable()
export class AnthropometricAssessmentResultsService {
  private readonly calculationsService =
    new AnthropometricCalculationsService();

  private readonly clinicalContextService =
    new AnthropometricClinicalContextService();

  private readonly skinfoldProtocolService =
    new AnthropometricSkinfoldProtocolService();

  build(
    assessment:
      AnthropometricAssessment,

    patient:
      Patient,
  ): AnthropometricAssessmentResults {
    const clinicalContext =
      this.clinicalContextService.build({
        birthDate:
          patient.birthDate,

        biologicalSex:
          patient.biologicalSex,

        assessmentDate:
          assessment.measuredAt,
      });

    const calculations:
      AnthropometricCalculationResult[] =
        [];

    if (
      assessment.weightKg !== null &&
      assessment.heightCm !== null
    ) {
      calculations.push(
        this.calculationsService
          .calculateBmi({
            weightKg:
              assessment.weightKg,

            heightCm:
              assessment.heightCm,
          }),
      );
    }

    this.appendJacksonPollockCalculations(
      calculations,
      assessment,
      clinicalContext,
    );

    return {
      assessment,
      clinicalContext,
      calculations,
    };
  }

  private appendJacksonPollockCalculations(
    calculations:
      AnthropometricCalculationResult[],

    assessment:
      AnthropometricAssessment,

    clinicalContext:
      AnthropometricClinicalContext,
  ): void {
    const biologicalSex =
      this.resolveJacksonPollockBiologicalSex(
        clinicalContext.biologicalSex,
      );

    const protocol =
      this.resolveJacksonPollockProtocol(
        assessment.skinfoldProtocol,
      );

    if (
      !biologicalSex ||
      !protocol ||
      !clinicalContext.age
    ) {
      return;
    }

    const preparation =
      this.skinfoldProtocolService.prepare({
        biologicalSex,

        protocol:
          assessment.skinfoldProtocol,

        measurements:
          assessment.skinfoldMeasurements,
      });

    if (
      !preparation.eligible ||
      preparation.sumSkinfoldsMm === null
    ) {
      return;
    }

    const bodyDensity =
      this.calculationsService
        .calculateJacksonPollockBodyDensity({
          biologicalSex,

          protocol,

          ageYears:
            clinicalContext.age.years,

          sumSkinfoldsMm:
            preparation.sumSkinfoldsMm,
        });

    calculations.push(
      bodyDensity,
    );

    const bodyFat =
      this.calculationsService
        .calculateBodyFatFromDensity({
          bodyDensity:
            bodyDensity.value,
        });

    calculations.push(
      bodyFat,
    );

    if (
      assessment.weightKg === null
    ) {
      return;
    }

    calculations.push(
      this.calculationsService
        .calculateFatMass({
          weightKg:
            assessment.weightKg,

          bodyFatPercentage:
            bodyFat.value,
        }),
    );

    calculations.push(
      this.calculationsService
        .calculateLeanMass({
          weightKg:
            assessment.weightKg,

          bodyFatPercentage:
            bodyFat.value,
        }),
    );
  }

  private resolveJacksonPollockBiologicalSex(
    biologicalSex:
      PatientBiologicalSex | null,
  ): JacksonPollockBiologicalSex | null {
    if (
      biologicalSex ===
      PatientBiologicalSex.MALE
    ) {
      return 'MALE';
    }

    if (
      biologicalSex ===
      PatientBiologicalSex.FEMALE
    ) {
      return 'FEMALE';
    }

    return null;
  }

  private resolveJacksonPollockProtocol(
    protocol:
      SkinfoldProtocol | null,
  ): JacksonPollockProtocol | null {
    if (
      protocol ===
      SkinfoldProtocol.JACKSON_POLLOCK_3
    ) {
      return 'JACKSON_POLLOCK_3';
    }

    if (
      protocol ===
      SkinfoldProtocol.JACKSON_POLLOCK_7
    ) {
      return 'JACKSON_POLLOCK_7';
    }

    return null;
  }
}