import {
  LaboratoryExam,
} from '../entities/laboratory-exam.entity';

import {
  LaboratoryResult,
} from '../entities/laboratory-result.entity';

export interface LaboratoryExamWithResults {
  exam: LaboratoryExam;

  results: LaboratoryResult[];
}

export abstract class LaboratoryExamsRepository {
  abstract createExam(
    exam: LaboratoryExam,
  ): Promise<LaboratoryExam>;

  abstract findExamById(
    organizationId: string,
    examId: string,
  ): Promise<LaboratoryExam | null>;

  abstract listExamsByMedicalRecordId(
    organizationId: string,
    medicalRecordId: string,
  ): Promise<LaboratoryExam[]>;

  abstract findExamWithResults(
    organizationId: string,
    examId: string,
  ): Promise<LaboratoryExamWithResults | null>;

  abstract updateExam(
    exam: LaboratoryExam,
  ): Promise<LaboratoryExam>;

  abstract deleteExam(
    organizationId: string,
    examId: string,
  ): Promise<void>;

  abstract createResult(
    result: LaboratoryResult,
  ): Promise<LaboratoryResult>;

  abstract findResultById(
    organizationId: string,
    resultId: string,
  ): Promise<LaboratoryResult | null>;

  abstract listResultsByExamId(
    organizationId: string,
    examId: string,
  ): Promise<LaboratoryResult[]>;

  abstract updateResult(
    result: LaboratoryResult,
  ): Promise<LaboratoryResult>;

  abstract deleteResult(
    organizationId: string,
    resultId: string,
  ): Promise<void>;
}