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

  notes?: string;
}

export interface UpdateLaboratoryExamInput {
  name?: string;

  laboratoryName?: string | null;

  collectedAt?: string | null;

  resultedAt?: string | null;

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

    return this
      .laboratoryExamsRepository
      .createResult(
        result,
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

    return this
      .laboratoryExamsRepository
      .updateResult(
        updated,
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