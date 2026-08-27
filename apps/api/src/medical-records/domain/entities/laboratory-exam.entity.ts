import type {
  BiomarkerReferenceContext,
} from '../../../biomarker-catalog/domain/entities/biomarker-reference-range.entity';

export class LaboratoryExam {
  id!: string;

  organizationId!: string;

  medicalRecordId!: string;

  patientId!: string;

  name!: string;

  laboratoryName!: string | null;

  collectedAt!: string | null;

  resultedAt!: string | null;

  collectionContext!:
    BiomarkerReferenceContext | null;

  notes!: string | null;

  createdAt!: string;

  updatedAt!: string;
}