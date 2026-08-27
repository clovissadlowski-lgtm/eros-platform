import {
  Injectable,
} from '@nestjs/common';

import type {
  BiomarkerReferenceRange,
} from '../../domain/entities/biomarker-reference-range.entity';

export type AutomaticLaboratoryInterpretation =
  | 'LOW'
  | 'NORMAL'
  | 'HIGH';

export interface InterpretLaboratoryResultInput {
  value: string | number;

  referenceRange:
    BiomarkerReferenceRange;
}

@Injectable()
export class LaboratoryResultInterpreterService {
  interpret(
    input:
      InterpretLaboratoryResultInput,
  ): AutomaticLaboratoryInterpretation | null {
    const value =
      typeof input.value ===
      'number'
        ? input.value
        : Number(
            input.value,
          );

    if (
      !Number.isFinite(
        value,
      )
    ) {
      return null;
    }

    const lowerBound =
      input.referenceRange.lowerBound !==
      null
        ? Number(
            input.referenceRange.lowerBound,
          )
        : null;

    const upperBound =
      input.referenceRange.upperBound !==
      null
        ? Number(
            input.referenceRange.upperBound,
          )
        : null;

    const validLowerBound =
      lowerBound !== null &&
      Number.isFinite(
        lowerBound,
      );

    const validUpperBound =
      upperBound !== null &&
      Number.isFinite(
        upperBound,
      );

    if (
      !validLowerBound &&
      !validUpperBound
    ) {
      return null;
    }

    if (
      validLowerBound &&
      lowerBound !== null &&
      value <
        lowerBound
    ) {
      return 'LOW';
    }

    if (
      validUpperBound &&
      upperBound !== null &&
      value >
        upperBound
    ) {
      return 'HIGH';
    }

    return 'NORMAL';
  }
}