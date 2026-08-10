export class LaboratoryExam {
  id!: string;

  organizationId!: string;

  medicalRecordId!: string;

  patientId!: string;

  name!: string;

  laboratoryName!: string | null;

  collectedAt!: string | null;

  resultedAt!: string | null;

  notes!: string | null;

  createdAt!: string;

  updatedAt!: string;
}
