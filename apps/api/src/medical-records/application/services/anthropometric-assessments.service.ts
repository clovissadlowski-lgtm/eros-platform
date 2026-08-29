import {
  BadRequestException,
  Injectable,
} from '@nestjs/common';

import {
  randomUUID,
} from 'node:crypto';

import {
  AnthropometricAssessment,
  AnthropometricSkinfoldMeasurement,
  BodyCompositionMethod,
  SkinfoldMeasurementSide,
  SkinfoldProtocol,
  SkinfoldSite,
} from '../../domain/entities/anthropometric-assessment.entity';

import {
  MedicalRecordNotFoundError,
} from '../../domain/errors/medical-record-not-found.error';

import {
  AnthropometricAssessmentsRepository,
} from '../../domain/repositories/anthropometric-assessments.repository';

import {
  MedicalRecordsRepository,
} from '../../domain/repositories/medical-records.repository';

export interface AnthropometricSkinfoldMeasurementInput {
  site:
    SkinfoldSite;

  side?:
    SkinfoldMeasurementSide;

  readingNumber:
    number;

  valueMm:
    number;
}

export interface CreateAnthropometricAssessmentInput {
  measuredAt:
    string;

  weightKg?:
    number;

  heightCm?:
    number;

  bodyFatPercentage?:
    number;

  fatMassKg?:
    number;

  leanMassKg?:
    number;

  muscleMassKg?:
    number;

  waistCircumferenceCm?:
    number;

  hipCircumferenceCm?:
    number;

  abdomenCircumferenceCm?:
    number;

  chestCircumferenceCm?:
    number;

  armCircumferenceCm?:
    number;

  thighCircumferenceCm?:
    number;

  calfCircumferenceCm?:
    number;

  bodyCompositionMethod?:
    BodyCompositionMethod;

  skinfoldProtocol?:
    SkinfoldProtocol;

  skinfoldMeasurements?:
    AnthropometricSkinfoldMeasurementInput[];

  notes?:
    string;
}

export interface UpdateAnthropometricAssessmentInput {
  measuredAt?:
    string;

  weightKg?:
    number | null;

  heightCm?:
    number | null;

  bodyFatPercentage?:
    number | null;

  fatMassKg?:
    number | null;

  leanMassKg?:
    number | null;

  muscleMassKg?:
    number | null;

  waistCircumferenceCm?:
    number | null;

  hipCircumferenceCm?:
    number | null;

  abdomenCircumferenceCm?:
    number | null;

  chestCircumferenceCm?:
    number | null;

  armCircumferenceCm?:
    number | null;

  thighCircumferenceCm?:
    number | null;

  calfCircumferenceCm?:
    number | null;

  bodyCompositionMethod?:
    BodyCompositionMethod | null;

  skinfoldProtocol?:
    SkinfoldProtocol | null;

  skinfoldMeasurements?:
    AnthropometricSkinfoldMeasurementInput[];

  notes?:
    string | null;
}

@Injectable()
export class AnthropometricAssessmentsService {
  constructor(
    private readonly anthropometricAssessmentsRepository:
      AnthropometricAssessmentsRepository,

    private readonly medicalRecordsRepository:
      MedicalRecordsRepository,
  ) {}

  async create(
    patientId: string,
    organizationId: string,
    input:
      CreateAnthropometricAssessmentInput,
  ): Promise<AnthropometricAssessment> {
    const medicalRecord =
      await this.getMedicalRecord(
        organizationId,
        patientId,
      );

    const measuredAt =
      this.normalizeRequiredDate(
        input.measuredAt,
      );

    const timestamp =
      new Date().toISOString();

    const assessmentId =
      randomUUID();

    const skinfoldMeasurements =
      this.createSkinfoldMeasurements(
        assessmentId,
        input.skinfoldMeasurements ??
          [],
        timestamp,
      );

    this.validateSkinfoldConfiguration(
      input.skinfoldProtocol ??
        null,
      skinfoldMeasurements,
    );

    const assessment:
      AnthropometricAssessment = {
        id:
          assessmentId,

        organizationId,

        medicalRecordId:
          medicalRecord.id,

        patientId,

        measuredAt,

        weightKg:
          this.normalizeOptionalPositiveNumber(
            input.weightKg,
            'Weight',
          ),

        heightCm:
          this.normalizeOptionalPositiveNumber(
            input.heightCm,
            'Height',
          ),

        bodyFatPercentage:
          this.normalizeOptionalPercentage(
            input.bodyFatPercentage,
            'Body fat percentage',
          ),

        fatMassKg:
          this.normalizeOptionalNonNegativeNumber(
            input.fatMassKg,
            'Fat mass',
          ),

        leanMassKg:
          this.normalizeOptionalNonNegativeNumber(
            input.leanMassKg,
            'Lean mass',
          ),

        muscleMassKg:
          this.normalizeOptionalNonNegativeNumber(
            input.muscleMassKg,
            'Muscle mass',
          ),

        waistCircumferenceCm:
          this.normalizeOptionalPositiveNumber(
            input.waistCircumferenceCm,
            'Waist circumference',
          ),

        hipCircumferenceCm:
          this.normalizeOptionalPositiveNumber(
            input.hipCircumferenceCm,
            'Hip circumference',
          ),

        abdomenCircumferenceCm:
          this.normalizeOptionalPositiveNumber(
            input.abdomenCircumferenceCm,
            'Abdomen circumference',
          ),

        chestCircumferenceCm:
          this.normalizeOptionalPositiveNumber(
            input.chestCircumferenceCm,
            'Chest circumference',
          ),

        armCircumferenceCm:
          this.normalizeOptionalPositiveNumber(
            input.armCircumferenceCm,
            'Arm circumference',
          ),

        thighCircumferenceCm:
          this.normalizeOptionalPositiveNumber(
            input.thighCircumferenceCm,
            'Thigh circumference',
          ),

        calfCircumferenceCm:
          this.normalizeOptionalPositiveNumber(
            input.calfCircumferenceCm,
            'Calf circumference',
          ),

        bodyCompositionMethod:
          input.bodyCompositionMethod ??
          null,

        skinfoldProtocol:
          input.skinfoldProtocol ??
          null,

        skinfoldMeasurements,

        notes:
          this.normalizeOptionalText(
            input.notes,
          ),

        createdAt:
          timestamp,

        updatedAt:
          timestamp,
      };

    this.validateAssessment(
      assessment,
    );

    return this
      .anthropometricAssessmentsRepository
      .create(
        assessment,
      );
  }

  async listByPatient(
    patientId: string,
    organizationId: string,
  ): Promise<AnthropometricAssessment[]> {
    const medicalRecord =
      await this.getMedicalRecord(
        organizationId,
        patientId,
      );

    return this
      .anthropometricAssessmentsRepository
      .listByMedicalRecordId(
        organizationId,
        medicalRecord.id,
      );
  }

  async findById(
    patientId: string,
    organizationId: string,
    assessmentId: string,
  ): Promise<AnthropometricAssessment> {
    await this.getMedicalRecord(
      organizationId,
      patientId,
    );

    const assessment =
      await this
        .anthropometricAssessmentsRepository
        .findById(
          organizationId,
          assessmentId,
        );

    if (
      !assessment ||
      assessment.patientId !==
        patientId
    ) {
      throw new MedicalRecordNotFoundError();
    }

    return assessment;
  }

  async update(
    patientId: string,
    organizationId: string,
    assessmentId: string,
    input:
      UpdateAnthropometricAssessmentInput,
  ): Promise<AnthropometricAssessment> {
    await this.getMedicalRecord(
      organizationId,
      patientId,
    );

    const assessment =
      await this
        .anthropometricAssessmentsRepository
        .findById(
          organizationId,
          assessmentId,
        );

    if (
      !assessment ||
      assessment.patientId !==
        patientId
    ) {
      throw new MedicalRecordNotFoundError();
    }

    const timestamp =
      new Date().toISOString();

    const skinfoldMeasurements =
      input.skinfoldMeasurements !==
      undefined
        ? this.createSkinfoldMeasurements(
            assessment.id,
            input.skinfoldMeasurements,
            timestamp,
          )
        : assessment.skinfoldMeasurements;

    const skinfoldProtocol =
      input.skinfoldProtocol !==
      undefined
        ? input.skinfoldProtocol
        : assessment.skinfoldProtocol;

    this.validateSkinfoldConfiguration(
      skinfoldProtocol,
      skinfoldMeasurements,
    );

    const updated:
      AnthropometricAssessment = {
        ...assessment,

        measuredAt:
          input.measuredAt !==
          undefined
            ? this.normalizeRequiredDate(
                input.measuredAt,
              )
            : assessment.measuredAt,

        weightKg:
          input.weightKg !==
          undefined
            ? this.normalizeNullablePositiveNumber(
                input.weightKg,
                'Weight',
              )
            : assessment.weightKg,

        heightCm:
          input.heightCm !==
          undefined
            ? this.normalizeNullablePositiveNumber(
                input.heightCm,
                'Height',
              )
            : assessment.heightCm,

        bodyFatPercentage:
          input.bodyFatPercentage !==
          undefined
            ? this.normalizeNullablePercentage(
                input.bodyFatPercentage,
                'Body fat percentage',
              )
            : assessment.bodyFatPercentage,

        fatMassKg:
          input.fatMassKg !==
          undefined
            ? this.normalizeNullableNonNegativeNumber(
                input.fatMassKg,
                'Fat mass',
              )
            : assessment.fatMassKg,

        leanMassKg:
          input.leanMassKg !==
          undefined
            ? this.normalizeNullableNonNegativeNumber(
                input.leanMassKg,
                'Lean mass',
              )
            : assessment.leanMassKg,

        muscleMassKg:
          input.muscleMassKg !==
          undefined
            ? this.normalizeNullableNonNegativeNumber(
                input.muscleMassKg,
                'Muscle mass',
              )
            : assessment.muscleMassKg,

        waistCircumferenceCm:
          input.waistCircumferenceCm !==
          undefined
            ? this.normalizeNullablePositiveNumber(
                input.waistCircumferenceCm,
                'Waist circumference',
              )
            : assessment.waistCircumferenceCm,

        hipCircumferenceCm:
          input.hipCircumferenceCm !==
          undefined
            ? this.normalizeNullablePositiveNumber(
                input.hipCircumferenceCm,
                'Hip circumference',
              )
            : assessment.hipCircumferenceCm,

        abdomenCircumferenceCm:
          input.abdomenCircumferenceCm !==
          undefined
            ? this.normalizeNullablePositiveNumber(
                input.abdomenCircumferenceCm,
                'Abdomen circumference',
              )
            : assessment.abdomenCircumferenceCm,

        chestCircumferenceCm:
          input.chestCircumferenceCm !==
          undefined
            ? this.normalizeNullablePositiveNumber(
                input.chestCircumferenceCm,
                'Chest circumference',
              )
            : assessment.chestCircumferenceCm,

        armCircumferenceCm:
          input.armCircumferenceCm !==
          undefined
            ? this.normalizeNullablePositiveNumber(
                input.armCircumferenceCm,
                'Arm circumference',
              )
            : assessment.armCircumferenceCm,

        thighCircumferenceCm:
          input.thighCircumferenceCm !==
          undefined
            ? this.normalizeNullablePositiveNumber(
                input.thighCircumferenceCm,
                'Thigh circumference',
              )
            : assessment.thighCircumferenceCm,

        calfCircumferenceCm:
          input.calfCircumferenceCm !==
          undefined
            ? this.normalizeNullablePositiveNumber(
                input.calfCircumferenceCm,
                'Calf circumference',
              )
            : assessment.calfCircumferenceCm,

        bodyCompositionMethod:
          input.bodyCompositionMethod !==
          undefined
            ? input.bodyCompositionMethod
            : assessment.bodyCompositionMethod,

        skinfoldProtocol,

        skinfoldMeasurements,

        notes:
          input.notes !==
          undefined
            ? this.normalizeOptionalText(
                input.notes,
              )
            : assessment.notes,

        updatedAt:
          timestamp,
      };

    this.validateAssessment(
      updated,
    );

    return this
      .anthropometricAssessmentsRepository
      .update(
        updated,
      );
  }

  async remove(
    patientId: string,
    organizationId: string,
    assessmentId: string,
  ): Promise<void> {
    await this.getMedicalRecord(
      organizationId,
      patientId,
    );

    const assessment =
      await this
        .anthropometricAssessmentsRepository
        .findById(
          organizationId,
          assessmentId,
        );

    if (
      !assessment ||
      assessment.patientId !==
        patientId
    ) {
      throw new MedicalRecordNotFoundError();
    }

    await this
      .anthropometricAssessmentsRepository
      .delete(
        organizationId,
        assessmentId,
      );
  }

  private async getMedicalRecord(
    organizationId: string,
    patientId: string,
  ) {
    const medicalRecord =
      await this
        .medicalRecordsRepository
        .findByPatientId(
          organizationId,
          patientId,
        );

    if (!medicalRecord) {
      throw new MedicalRecordNotFoundError();
    }

    return medicalRecord;
  }

  private createSkinfoldMeasurements(
    assessmentId: string,
    inputs:
      AnthropometricSkinfoldMeasurementInput[],
    timestamp: string,
  ): AnthropometricSkinfoldMeasurement[] {
    const uniqueKeys =
      new Set<string>();

    return inputs.map(
      (
        input,
      ) => {
        const side =
          input.side ??
          SkinfoldMeasurementSide.RIGHT;

        if (
          !Number.isInteger(
            input.readingNumber,
          ) ||
          input.readingNumber <
            1
        ) {
          throw new BadRequestException(
            'Skinfold reading number must be an integer greater than or equal to 1.',
          );
        }

        if (
          !Number.isFinite(
            input.valueMm,
          ) ||
          input.valueMm <=
            0
        ) {
          throw new BadRequestException(
            'Skinfold measurement must be greater than 0 mm.',
          );
        }

        const key =
          `${input.site}:${side}:${input.readingNumber}`;

        if (
          uniqueKeys.has(
            key,
          )
        ) {
          throw new BadRequestException(
            'Duplicate skinfold measurement for the same site, side and reading number.',
          );
        }

        uniqueKeys.add(
          key,
        );

        return {
          id:
            randomUUID(),

          anthropometricAssessmentId:
            assessmentId,

          site:
            input.site,

          side,

          readingNumber:
            input.readingNumber,

          valueMm:
            input.valueMm,

          createdAt:
            timestamp,

          updatedAt:
            timestamp,
        };
      },
    );
  }

  private validateSkinfoldConfiguration(
    protocol:
      SkinfoldProtocol | null,
    measurements:
      AnthropometricSkinfoldMeasurement[],
  ): void {
    if (
      measurements.length >
        0 &&
      protocol ===
        null
    ) {
      throw new BadRequestException(
        'Skinfold protocol is required when skinfold measurements are provided.',
      );
    }

    if (
      protocol !==
        null &&
      measurements.length ===
        0
    ) {
      throw new BadRequestException(
        'At least one skinfold measurement is required when a skinfold protocol is provided.',
      );
    }
  }

  private validateAssessment(
    assessment:
      AnthropometricAssessment,
  ): void {
    const hasPrimaryMeasurement =
      assessment.weightKg !==
        null ||
      assessment.heightCm !==
        null ||
      assessment.bodyFatPercentage !==
        null ||
      assessment.fatMassKg !==
        null ||
      assessment.leanMassKg !==
        null ||
      assessment.muscleMassKg !==
        null ||
      assessment.waistCircumferenceCm !==
        null ||
      assessment.hipCircumferenceCm !==
        null ||
      assessment.abdomenCircumferenceCm !==
        null ||
      assessment.chestCircumferenceCm !==
        null ||
      assessment.armCircumferenceCm !==
        null ||
      assessment.thighCircumferenceCm !==
        null ||
      assessment.calfCircumferenceCm !==
        null ||
      assessment.skinfoldMeasurements.length >
        0;

    if (
      !hasPrimaryMeasurement
    ) {
      throw new BadRequestException(
        'Anthropometric assessment must contain at least one measurement.',
      );
    }

    if (
      assessment.fatMassKg !==
        null &&
      assessment.weightKg !==
        null &&
      assessment.fatMassKg >
        assessment.weightKg
    ) {
      throw new BadRequestException(
        'Fat mass cannot be greater than body weight.',
      );
    }

    if (
      assessment.leanMassKg !==
        null &&
      assessment.weightKg !==
        null &&
      assessment.leanMassKg >
        assessment.weightKg
    ) {
      throw new BadRequestException(
        'Lean mass cannot be greater than body weight.',
      );
    }

    if (
      assessment.muscleMassKg !==
        null &&
      assessment.weightKg !==
        null &&
      assessment.muscleMassKg >
        assessment.weightKg
    ) {
      throw new BadRequestException(
        'Muscle mass cannot be greater than body weight.',
      );
    }
  }

  private normalizeRequiredDate(
    value: string,
  ): string {
    const normalized =
      value.trim();

    if (
      normalized.length ===
      0
    ) {
      throw new BadRequestException(
        'Measurement date is required.',
      );
    }

    const parsed =
      new Date(
        `${normalized}T00:00:00.000Z`,
      );

    if (
      Number.isNaN(
        parsed.getTime(),
      )
    ) {
      throw new BadRequestException(
        'Measurement date is invalid.',
      );
    }

    return normalized;
  }

  private normalizeOptionalPositiveNumber(
    value:
      number | undefined,
    fieldName: string,
  ): number | null {
    if (
      value ===
      undefined
    ) {
      return null;
    }

    return this.validatePositiveNumber(
      value,
      fieldName,
    );
  }

  private normalizeNullablePositiveNumber(
    value:
      number | null,
    fieldName: string,
  ): number | null {
    if (
      value ===
      null
    ) {
      return null;
    }

    return this.validatePositiveNumber(
      value,
      fieldName,
    );
  }

  private validatePositiveNumber(
    value: number,
    fieldName: string,
  ): number {
    if (
      !Number.isFinite(
        value,
      ) ||
      value <=
        0
    ) {
      throw new BadRequestException(
        `${fieldName} must be greater than 0.`,
      );
    }

    return value;
  }

  private normalizeOptionalNonNegativeNumber(
    value:
      number | undefined,
    fieldName: string,
  ): number | null {
    if (
      value ===
      undefined
    ) {
      return null;
    }

    return this.validateNonNegativeNumber(
      value,
      fieldName,
    );
  }

  private normalizeNullableNonNegativeNumber(
    value:
      number | null,
    fieldName: string,
  ): number | null {
    if (
      value ===
      null
    ) {
      return null;
    }

    return this.validateNonNegativeNumber(
      value,
      fieldName,
    );
  }

  private validateNonNegativeNumber(
    value: number,
    fieldName: string,
  ): number {
    if (
      !Number.isFinite(
        value,
      ) ||
      value <
        0
    ) {
      throw new BadRequestException(
        `${fieldName} cannot be negative.`,
      );
    }

    return value;
  }

  private normalizeOptionalPercentage(
    value:
      number | undefined,
    fieldName: string,
  ): number | null {
    if (
      value ===
      undefined
    ) {
      return null;
    }

    return this.validatePercentage(
      value,
      fieldName,
    );
  }

  private normalizeNullablePercentage(
    value:
      number | null,
    fieldName: string,
  ): number | null {
    if (
      value ===
      null
    ) {
      return null;
    }

    return this.validatePercentage(
      value,
      fieldName,
    );
  }

  private validatePercentage(
    value: number,
    fieldName: string,
  ): number {
    if (
      !Number.isFinite(
        value,
      ) ||
      value <
        0 ||
      value >
        100
    ) {
      throw new BadRequestException(
        `${fieldName} must be between 0 and 100.`,
      );
    }

    return value;
  }

  private normalizeOptionalText(
    value:
      | string
      | null
      | undefined,
  ): string | null {
    if (
      value ===
        undefined ||
      value ===
        null
    ) {
      return null;
    }

    const normalized =
      value.trim();

    return normalized.length >
      0
      ? normalized
      : null;
  }
}