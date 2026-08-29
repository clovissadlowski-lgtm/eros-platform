import {
  AnthropometricAssessment,
} from '../entities/anthropometric-assessment.entity';

export abstract class AnthropometricAssessmentsRepository {
  abstract create(
    assessment:
      AnthropometricAssessment,
  ): Promise<AnthropometricAssessment>;

  abstract findById(
    organizationId: string,
    assessmentId: string,
  ): Promise<AnthropometricAssessment | null>;

  abstract listByMedicalRecordId(
    organizationId: string,
    medicalRecordId: string,
  ): Promise<AnthropometricAssessment[]>;

  abstract update(
    assessment:
      AnthropometricAssessment,
  ): Promise<AnthropometricAssessment>;

  abstract delete(
    organizationId: string,
    assessmentId: string,
  ): Promise<void>;
}