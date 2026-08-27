import {
  BadRequestException,
  Injectable,
} from '@nestjs/common';

import {
  randomUUID,
} from 'node:crypto';

import {
  BiomarkerCatalogRepository,
} from '../../../biomarker-catalog/domain/repositories/biomarker-catalog.repository';

import {
  BiomarkerReferenceRangeResolverService,
} from '../../../biomarker-catalog/application/services/biomarker-reference-range-resolver.service';

import {
  LaboratoryResultInterpreterService,
} from '../../../biomarker-catalog/application/services/laboratory-result-interpreter.service';

import {
  BiomarkerReferenceSex,
} from '../../../biomarker-catalog/domain/entities/biomarker-reference-range.entity';

import type {
  BiomarkerReferenceContext,
  BiomarkerReferenceRange,
} from '../../../biomarker-catalog/domain/entities/biomarker-reference-range.entity';

import {
  PatientBiologicalSex,
} from '../../../patients/domain/entities/patient.entity';

import {
  PatientsRepository,
} from '../../../patients/domain/repositories/patients.repository';

import {
  LaboratoryExam,
} from '../../domain/entities/laboratory-exam.entity';

import {
  LaboratoryResult,
  LaboratoryResultInterpretation,
} from '../../domain/entities/laboratory-result.entity';

import {
  MedicalRecordNotFoundError,
} from '../../domain/errors/medical-record-not-found.error';

import {
  LaboratoryExamsRepository,
  LaboratoryExamWithResults,
} from '../../domain/repositories/laboratory-exams.repository';

import {
  MedicalRecordsRepository,
} from '../../domain/repositories/medical-records.repository';

export interface CreateLaboratoryExamInput {
  name: string;

  laboratoryName?: string;

  collectedAt?: string;

  resultedAt?: string;

  collectionContext?: BiomarkerReferenceContext;

  notes?: string;
}

export interface UpdateLaboratoryExamInput {
  name?: string;

  laboratoryName?: string | null;

  collectedAt?: string | null;

  resultedAt?: string | null;

  collectionContext?: BiomarkerReferenceContext | null;

  notes?: string | null;
}

export interface CreateLaboratoryResultInput {
  biomarkerCatalogId?: string;

  /*
   * Compatibilidade temporária com entrada
   * manual antes da obrigatoriedade de catálogo.
   */
  name?: string;

  value?: string;

  textValue?: string;

  unit?: string;

  referenceRange?: string;

  interpretation?:
    LaboratoryResultInterpretation;
}

export interface UpdateLaboratoryResultInput {
  biomarkerCatalogId?: string;

  name?: string;

  value?: string | null;

  textValue?: string | null;

  unit?: string | null;

  referenceRange?: string | null;

  interpretation?:
    LaboratoryResultInterpretation | null;
}

@Injectable()
export class LaboratoryExamsService {
  constructor(
    private readonly laboratoryExamsRepository:
      LaboratoryExamsRepository,

    private readonly medicalRecordsRepository:
      MedicalRecordsRepository,

    private readonly biomarkerCatalogRepository:
      BiomarkerCatalogRepository,

    private readonly patientsRepository:
      PatientsRepository,

    private readonly referenceRangeResolver:
      BiomarkerReferenceRangeResolverService,

    private readonly resultInterpreter:
      LaboratoryResultInterpreterService,
  ) {}

  async createExam(
    patientId: string,
    organizationId: string,
    input: CreateLaboratoryExamInput,
  ): Promise<LaboratoryExam> {
    const medicalRecord =
      await this.getMedicalRecord(
        organizationId,
        patientId,
      );

    const name =
      this.normalizeRequiredText(
        input.name,
      );

    if (!name) {
      throw new BadRequestException(
        'Laboratory exam name is required.',
      );
    }

    const timestamp =
      new Date().toISOString();

    const exam:
      LaboratoryExam = {
        id:
          randomUUID(),

        organizationId,

        medicalRecordId:
          medicalRecord.id,

        patientId,

        name,

        laboratoryName:
          this.normalizeOptionalText(
            input.laboratoryName,
          ),

        collectedAt:
          this.normalizeOptionalDate(
            input.collectedAt,
          ),

        resultedAt:
          this.normalizeOptionalDate(
            input.resultedAt,
          ),

        collectionContext:
          input.collectionContext ??
          null,

        notes:
          this.normalizeOptionalText(
            input.notes,
          ),

        createdAt:
          timestamp,

        updatedAt:
          timestamp,
      };

    return this
      .laboratoryExamsRepository
      .createExam(
        exam,
      );
  }

  async listExamsByPatient(
    patientId: string,
    organizationId: string,
  ): Promise<LaboratoryExam[]> {
    const medicalRecord =
      await this.getMedicalRecord(
        organizationId,
        patientId,
      );

    return this
      .laboratoryExamsRepository
      .listExamsByMedicalRecordId(
        organizationId,
        medicalRecord.id,
      );
  }

  async getExamWithResults(
    patientId: string,
    organizationId: string,
    examId: string,
  ): Promise<LaboratoryExamWithResults> {
    await this.getMedicalRecord(
      organizationId,
      patientId,
    );

    const exam =
      await this
        .laboratoryExamsRepository
        .findExamWithResults(
          organizationId,
          examId,
        );

    if (
      !exam ||
      exam.exam.patientId !==
        patientId
    ) {
      throw new MedicalRecordNotFoundError();
    }

    return exam;
  }

  async updateExam(
    patientId: string,
    organizationId: string,
    examId: string,
    input: UpdateLaboratoryExamInput,
  ): Promise<LaboratoryExam> {
    await this.getMedicalRecord(
      organizationId,
      patientId,
    );

    const exam =
      await this
        .laboratoryExamsRepository
        .findExamById(
          organizationId,
          examId,
        );

    if (
      !exam ||
      exam.patientId !== patientId
    ) {
      throw new MedicalRecordNotFoundError();
    }

    const updated:
      LaboratoryExam = {
        ...exam,

        name:
          input.name !== undefined
            ? this.normalizeRequiredText(
                input.name,
              )
            : exam.name,

        laboratoryName:
          input.laboratoryName !== undefined
            ? this.normalizeOptionalText(
                input.laboratoryName,
              )
            : exam.laboratoryName,

        collectedAt:
          input.collectedAt !== undefined
            ? this.normalizeOptionalDate(
                input.collectedAt,
              )
            : exam.collectedAt,

        resultedAt:
          input.resultedAt !== undefined
            ? this.normalizeOptionalDate(
                input.resultedAt,
              )
            : exam.resultedAt,

        collectionContext:
          input.collectionContext !== undefined
            ? input.collectionContext
            : exam.collectionContext,

        notes:
          input.notes !== undefined
            ? this.normalizeOptionalText(
                input.notes,
              )
            : exam.notes,

        updatedAt:
          new Date().toISOString(),
      };

    if (!updated.name) {
      throw new BadRequestException(
        'Laboratory exam name is required.',
      );
    }

    return this
      .laboratoryExamsRepository
      .updateExam(
        updated,
      );
  }

  async removeExam(
    patientId: string,
    organizationId: string,
    examId: string,
  ): Promise<void> {
    await this.getMedicalRecord(
      organizationId,
      patientId,
    );

    const exam =
      await this
        .laboratoryExamsRepository
        .findExamById(
          organizationId,
          examId,
        );

    if (
      !exam ||
      exam.patientId !== patientId
    ) {
      throw new MedicalRecordNotFoundError();
    }

    await this
      .laboratoryExamsRepository
      .deleteExam(
        organizationId,
        examId,
      );
  }

  async createResult(
    patientId: string,
    organizationId: string,
    examId: string,
    input: CreateLaboratoryResultInput,
  ): Promise<LaboratoryResult> {
    await this.getMedicalRecord(
      organizationId,
      patientId,
    );

    const exam =
      await this
        .laboratoryExamsRepository
        .findExamById(
          organizationId,
          examId,
        );

    if (
      !exam ||
      exam.patientId !== patientId
    ) {
      throw new MedicalRecordNotFoundError();
    }

    const canonicalBiomarker =
      input.biomarkerCatalogId
        ? await this.getBiomarkerCatalogItem(
            input.biomarkerCatalogId,
          )
        : null;

    const name =
      canonicalBiomarker?.name ??
      (
        input.name
          ? this.normalizeRequiredText(
              input.name,
            )
          : null
      );

    if (!name) {
      throw new BadRequestException(
        'A biomarker from the canonical catalog or a result name is required.',
      );
    }

    const timestamp =
      new Date().toISOString();

    const result:
      LaboratoryResult = {
        id:
          randomUUID(),

        laboratoryExamId:
          exam.id,

        biomarkerCatalogId:
          canonicalBiomarker?.id ??
          null,

        name,

        value:
          this.normalizeOptionalText(
            input.value,
          ),

        textValue:
          this.normalizeOptionalText(
            input.textValue,
          ),

        unit:
          this.normalizeOptionalText(
            input.unit,
          ) ??
          canonicalBiomarker?.defaultUnit ??
          null,

        referenceRange:
          this.normalizeOptionalText(
            input.referenceRange,
          ),

        interpretation:
          input.interpretation ??
          null,

        createdAt:
          timestamp,

        updatedAt:
          timestamp,
      };

    this.validateResultValue(
      result,
    );

    const enrichedResult =
      await this.applyAutomaticReferenceData(
        patientId,
        organizationId,
        exam,
        result,
      );

    return this
      .laboratoryExamsRepository
      .createResult(
        enrichedResult,
      );
  }

  async listResults(
    patientId: string,
    organizationId: string,
    examId: string,
  ): Promise<LaboratoryResult[]> {
    await this.getMedicalRecord(
      organizationId,
      patientId,
    );

    const exam =
      await this
        .laboratoryExamsRepository
        .findExamById(
          organizationId,
          examId,
        );

    if (
      !exam ||
      exam.patientId !== patientId
    ) {
      throw new MedicalRecordNotFoundError();
    }

    return this
      .laboratoryExamsRepository
      .listResultsByExamId(
        organizationId,
        examId,
      );
  }

  async updateResult(
    patientId: string,
    organizationId: string,
    examId: string,
    resultId: string,
    input: UpdateLaboratoryResultInput,
  ): Promise<LaboratoryResult> {
    await this.getMedicalRecord(
      organizationId,
      patientId,
    );

    const exam =
      await this
        .laboratoryExamsRepository
        .findExamById(
          organizationId,
          examId,
        );

    if (
      !exam ||
      exam.patientId !== patientId
    ) {
      throw new MedicalRecordNotFoundError();
    }

    const result =
      await this
        .laboratoryExamsRepository
        .findResultById(
          organizationId,
          resultId,
        );

    if (
      !result ||
      result.laboratoryExamId !==
        examId
    ) {
      throw new MedicalRecordNotFoundError();
    }

    const canonicalBiomarker =
      input.biomarkerCatalogId !== undefined
        ? await this.getBiomarkerCatalogItem(
            input.biomarkerCatalogId,
          )
        : null;

    const updated:
      LaboratoryResult = {
        ...result,

        biomarkerCatalogId:
          canonicalBiomarker
            ? canonicalBiomarker.id
            : result.biomarkerCatalogId,

        name:
          canonicalBiomarker
            ? canonicalBiomarker.name
            : input.name !== undefined
              ? this.normalizeRequiredText(
                  input.name,
                )
              : result.name,

        value:
          input.value !== undefined
            ? this.normalizeOptionalText(
                input.value,
              )
            : result.value,

        textValue:
          input.textValue !== undefined
            ? this.normalizeOptionalText(
                input.textValue,
              )
            : result.textValue,

        unit:
          input.unit !== undefined
            ? this.normalizeOptionalText(
                input.unit,
              )
            : canonicalBiomarker
              ? canonicalBiomarker.defaultUnit
              : result.unit,

        referenceRange:
          input.referenceRange !== undefined
            ? this.normalizeOptionalText(
                input.referenceRange,
              )
            : result.referenceRange,

        interpretation:
          input.interpretation !== undefined
            ? input.interpretation
            : result.interpretation,

        updatedAt:
          new Date().toISOString(),
      };

    if (!updated.name) {
      throw new BadRequestException(
        'Laboratory result name is required.',
      );
    }

    this.validateResultValue(
      updated,
    );

    const enrichedResult =
      await this.applyAutomaticReferenceData(
        patientId,
        organizationId,
        exam,
        updated,
      );

    return this
      .laboratoryExamsRepository
      .updateResult(
        enrichedResult,
      );
  }

  async removeResult(
    patientId: string,
    organizationId: string,
    examId: string,
    resultId: string,
  ): Promise<void> {
    await this.getMedicalRecord(
      organizationId,
      patientId,
    );

    const exam =
      await this
        .laboratoryExamsRepository
        .findExamById(
          organizationId,
          examId,
        );

    if (
      !exam ||
      exam.patientId !== patientId
    ) {
      throw new MedicalRecordNotFoundError();
    }

    const result =
      await this
        .laboratoryExamsRepository
        .findResultById(
          organizationId,
          resultId,
        );

    if (
      !result ||
      result.laboratoryExamId !==
        examId
    ) {
      throw new MedicalRecordNotFoundError();
    }

    await this
      .laboratoryExamsRepository
      .deleteResult(
        organizationId,
        resultId,
      );
  }

  private async applyAutomaticReferenceData(
    patientId: string,
    organizationId: string,
    exam: LaboratoryExam,
    result: LaboratoryResult,
  ): Promise<LaboratoryResult> {
    if (
      !result.biomarkerCatalogId ||
      !result.value ||
      !result.unit
    ) {
      return result;
    }

    const patient =
      await this.patientsRepository.findById(
        organizationId,
        patientId,
      );

    if (!patient) {
      return result;
    }

    const ageYears =
      patient.birthDate
        ? this.calculateAgeYears(
            patient.birthDate,
            exam.collectedAt ??
              exam.resultedAt ??
              new Date().toISOString(),
          )
        : undefined;

    const range =
      await this.referenceRangeResolver.resolve({
        biomarkerCatalogId:
          result.biomarkerCatalogId,

        unit:
          result.unit,

        ageYears,

        sex:
          this.mapPatientBiologicalSex(
            patient.biologicalSex,
          ),

        context:
          exam.collectionContext ??
          undefined,
      });

    if (!range) {
      return result;
    }

    const automaticInterpretation =
      this.resultInterpreter.interpret({
        value:
          result.value,

        referenceRange:
          range,
      });

    return {
      ...result,

      referenceRange:
        result.referenceRange ??
        this.formatReferenceRange(
          range,
        ),

      interpretation:
        result.interpretation ??
        (
          automaticInterpretation
            ? automaticInterpretation as
              LaboratoryResultInterpretation
            : null
        ),
    };
  }

  private mapPatientBiologicalSex(
    biologicalSex:
      PatientBiologicalSex | null,
  ): BiomarkerReferenceSex | undefined {
    if (
      biologicalSex ===
      PatientBiologicalSex.MALE
    ) {
      return BiomarkerReferenceSex.MALE;
    }

    if (
      biologicalSex ===
      PatientBiologicalSex.FEMALE
    ) {
      return BiomarkerReferenceSex.FEMALE;
    }

    return undefined;
  }

  private calculateAgeYears(
    birthDate: string,
    referenceDate: string,
  ): number {
    const birth =
      new Date(
        birthDate,
      );

    const reference =
      new Date(
        referenceDate,
      );

    let age =
      reference.getUTCFullYear() -
      birth.getUTCFullYear();

    const monthDifference =
      reference.getUTCMonth() -
      birth.getUTCMonth();

    const birthdayNotReached =
      monthDifference < 0 ||
      (
        monthDifference === 0 &&
        reference.getUTCDate() <
          birth.getUTCDate()
      );

    if (
      birthdayNotReached
    ) {
      age -= 1;
    }

    return Math.max(
      age,
      0,
    );
  }

  private formatReferenceRange(
    range:
      BiomarkerReferenceRange,
  ): string | null {
    const lower =
      range.lowerBound;

    const upper =
      range.upperBound;

    if (
      lower !== null &&
      upper !== null
    ) {
      return `${lower} - ${upper} ${range.unit}`;
    }

    if (
      lower !== null
    ) {
      return `>= ${lower} ${range.unit}`;
    }

    if (
      upper !== null
    ) {
      return `<= ${upper} ${range.unit}`;
    }

    return null;
  }

  private async getBiomarkerCatalogItem(
    biomarkerCatalogId: string,
  ) {
    const biomarker =
      await this
        .biomarkerCatalogRepository
        .findActiveById(
          biomarkerCatalogId,
        );

    if (!biomarker) {
      throw new BadRequestException(
        'Biomarker does not exist or is inactive.',
      );
    }

    return biomarker;
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

  private validateResultValue(
    result: LaboratoryResult,
  ): void {
    if (
      !result.value &&
      !result.textValue
    ) {
      throw new BadRequestException(
        'Laboratory result must contain either a numeric value or a text value.',
      );
    }

    if (
      result.value &&
      result.textValue
    ) {
      throw new BadRequestException(
        'Laboratory result cannot contain both numeric value and text value.',
      );
    }

    if (
      result.value &&
      Number.isNaN(
        Number(
          result.value,
        ),
      )
    ) {
      throw new BadRequestException(
        'Laboratory numeric value must be a valid number.',
      );
    }
  }

  private normalizeRequiredText(
    value: string,
  ): string {
    return value.trim();
  }

  private normalizeOptionalText(
    value:
      | string
      | null
      | undefined,
  ): string | null {
    if (
      value === undefined ||
      value === null
    ) {
      return null;
    }

    const normalized =
      value.trim();

    return normalized.length > 0
      ? normalized
      : null;
  }

  private normalizeOptionalDate(
    value:
      | string
      | null
      | undefined,
  ): string | null {
    if (
      value === undefined ||
      value === null ||
      value.trim().length === 0
    ) {
      return null;
    }

    return value;
  }
}