export enum LaboratoryResultInterpretation {
  LOW = 'LOW',

  NORMAL = 'NORMAL',

  HIGH = 'HIGH',

  CRITICAL_LOW = 'CRITICAL_LOW',

  CRITICAL_HIGH = 'CRITICAL_HIGH',

  ABNORMAL = 'ABNORMAL',

  INCONCLUSIVE = 'INCONCLUSIVE',
}

export class LaboratoryResult {
  id!: string;

  laboratoryExamId!: string;

  biomarkerCatalogId!: string | null;

  name!: string;

  value!: string | null;

  textValue!: string | null;

  unit!: string | null;

  referenceRange!: string | null;

  interpretation!:
    LaboratoryResultInterpretation | null;

  createdAt!: string;

  updatedAt!: string;
}