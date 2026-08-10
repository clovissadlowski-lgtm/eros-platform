import {
  Injectable,
} from '@nestjs/common';

import {
  PrismaService,
} from '../../../common/database/prisma.service';

import {
  LaboratoryResultInterpretation as PrismaLaboratoryResultInterpretation,
} from '../../../generated/prisma/enums';

import {
  LaboratoryExam,
} from '../../domain/entities/laboratory-exam.entity';

import {
  LaboratoryResult,
  LaboratoryResultInterpretation,
} from '../../domain/entities/laboratory-result.entity';

import {
  LaboratoryExamsRepository,
  LaboratoryExamWithResults,
} from '../../domain/repositories/laboratory-exams.repository';

interface PrismaLaboratoryExamRecord {
  id: string;

  organizationId: string;

  medicalRecordId: string;

  patientId: string;

  name: string;

  laboratoryName: string | null;

  collectedAt: Date | null;

  resultedAt: Date | null;

  notes: string | null;

  createdAt: Date;

  updatedAt: Date;
}

interface PrismaDecimalLike {
  toString(): string;
}

interface PrismaLaboratoryResultRecord {
  id: string;

  laboratoryExamId: string;

  biomarkerCatalogId: string | null;

  name: string;

  value: PrismaDecimalLike | null;

  textValue: string | null;

  unit: string | null;

  referenceRange: string | null;

  interpretation:
    PrismaLaboratoryResultInterpretation | null;

  createdAt: Date;

  updatedAt: Date;
}

@Injectable()
export class PrismaLaboratoryExamsRepository
  implements LaboratoryExamsRepository
{
  constructor(
    private readonly prisma:
      PrismaService,
  ) {}

  async createExam(
    exam: LaboratoryExam,
  ): Promise<LaboratoryExam> {
    const created =
      await this.prisma.laboratoryExam.create({
        data: {
          id:
            exam.id,

          organizationId:
            exam.organizationId,

          medicalRecordId:
            exam.medicalRecordId,

          patientId:
            exam.patientId,

          name:
            exam.name,

          laboratoryName:
            exam.laboratoryName,

          collectedAt:
            exam.collectedAt
              ? new Date(
                  exam.collectedAt,
                )
              : null,

          resultedAt:
            exam.resultedAt
              ? new Date(
                  exam.resultedAt,
                )
              : null,

          notes:
            exam.notes,

          createdAt:
            new Date(
              exam.createdAt,
            ),

          updatedAt:
            new Date(
              exam.updatedAt,
            ),
        },
      });

    return this.toExamDomain(
      created,
    );
  }

  async findExamById(
    organizationId: string,
    examId: string,
  ): Promise<LaboratoryExam | null> {
    const exam =
      await this.prisma.laboratoryExam.findFirst({
        where: {
          id:
            examId,

          organizationId,
        },
      });

    return exam
      ? this.toExamDomain(
          exam,
        )
      : null;
  }

  async listExamsByMedicalRecordId(
    organizationId: string,
    medicalRecordId: string,
  ): Promise<LaboratoryExam[]> {
    const exams =
      await this.prisma.laboratoryExam.findMany({
        where: {
          organizationId,

          medicalRecordId,
        },

        orderBy: [
          {
            collectedAt:
              'desc',
          },

          {
            createdAt:
              'desc',
          },
        ],
      });

    return exams.map(
      (
        exam,
      ) =>
        this.toExamDomain(
          exam,
        ),
    );
  }

  async findExamWithResults(
    organizationId: string,
    examId: string,
  ): Promise<LaboratoryExamWithResults | null> {
    const exam =
      await this.prisma.laboratoryExam.findFirst({
        where: {
          id:
            examId,

          organizationId,
        },

        include: {
          results: {
            orderBy: {
              name:
                'asc',
            },
          },
        },
      });

    if (!exam) {
      return null;
    }

    return {
      exam:
        this.toExamDomain(
          exam,
        ),

      results:
        exam.results.map(
          (
            result,
          ) =>
            this.toResultDomain(
              result,
            ),
        ),
    };
  }

  async updateExam(
    exam: LaboratoryExam,
  ): Promise<LaboratoryExam> {
    const updated =
      await this.prisma.laboratoryExam.update({
        where: {
          id:
            exam.id,
        },

        data: {
          name:
            exam.name,

          laboratoryName:
            exam.laboratoryName,

          collectedAt:
            exam.collectedAt
              ? new Date(
                  exam.collectedAt,
                )
              : null,

          resultedAt:
            exam.resultedAt
              ? new Date(
                  exam.resultedAt,
                )
              : null,

          notes:
            exam.notes,

          updatedAt:
            new Date(
              exam.updatedAt,
            ),
        },
      });

    return this.toExamDomain(
      updated,
    );
  }

  async deleteExam(
    organizationId: string,
    examId: string,
  ): Promise<void> {
    await this.prisma.laboratoryExam.deleteMany({
      where: {
        id:
          examId,

        organizationId,
      },
    });
  }

  async createResult(
    result: LaboratoryResult,
  ): Promise<LaboratoryResult> {
    const created =
      await this.prisma.laboratoryResult.create({
        data: {
          id:
            result.id,

          laboratoryExamId:
            result.laboratoryExamId,

          biomarkerCatalogId:
            result.biomarkerCatalogId,

          name:
            result.name,

          value:
            result.value,

          textValue:
            result.textValue,

          unit:
            result.unit,

          referenceRange:
            result.referenceRange,

          interpretation:
            result.interpretation
              ? result.interpretation as PrismaLaboratoryResultInterpretation
              : null,

          createdAt:
            new Date(
              result.createdAt,
            ),

          updatedAt:
            new Date(
              result.updatedAt,
            ),
        },
      });

    return this.toResultDomain(
      created,
    );
  }

  async findResultById(
    organizationId: string,
    resultId: string,
  ): Promise<LaboratoryResult | null> {
    const result =
      await this.prisma.laboratoryResult.findFirst({
        where: {
          id:
            resultId,

          laboratoryExam: {
            organizationId,
          },
        },
      });

    return result
      ? this.toResultDomain(
          result,
        )
      : null;
  }

  async listResultsByExamId(
    organizationId: string,
    examId: string,
  ): Promise<LaboratoryResult[]> {
    const results =
      await this.prisma.laboratoryResult.findMany({
        where: {
          laboratoryExamId:
            examId,

          laboratoryExam: {
            organizationId,
          },
        },

        orderBy: {
          name:
            'asc',
        },
      });

    return results.map(
      (
        result,
      ) =>
        this.toResultDomain(
          result,
        ),
    );
  }

  async updateResult(
    result: LaboratoryResult,
  ): Promise<LaboratoryResult> {
    const updated =
      await this.prisma.laboratoryResult.update({
        where: {
          id:
            result.id,
        },

        data: {
          biomarkerCatalogId:
            result.biomarkerCatalogId,

          name:
            result.name,

          value:
            result.value,

          textValue:
            result.textValue,

          unit:
            result.unit,

          referenceRange:
            result.referenceRange,

          interpretation:
            result.interpretation
              ? result.interpretation as PrismaLaboratoryResultInterpretation
              : null,

          updatedAt:
            new Date(
              result.updatedAt,
            ),
        },
      });

    return this.toResultDomain(
      updated,
    );
  }

  async deleteResult(
    organizationId: string,
    resultId: string,
  ): Promise<void> {
    await this.prisma.laboratoryResult.deleteMany({
      where: {
        id:
          resultId,

        laboratoryExam: {
          organizationId,
        },
      },
    });
  }

  private toExamDomain(
    exam:
      PrismaLaboratoryExamRecord,
  ): LaboratoryExam {
    return {
      id:
        exam.id,

      organizationId:
        exam.organizationId,

      medicalRecordId:
        exam.medicalRecordId,

      patientId:
        exam.patientId,

      name:
        exam.name,

      laboratoryName:
        exam.laboratoryName,

      collectedAt:
        exam.collectedAt
          ?.toISOString() ??
        null,

      resultedAt:
        exam.resultedAt
          ?.toISOString() ??
        null,

      notes:
        exam.notes,

      createdAt:
        exam.createdAt
          .toISOString(),

      updatedAt:
        exam.updatedAt
          .toISOString(),
    };
  }

  private toResultDomain(
    result:
      PrismaLaboratoryResultRecord,
  ): LaboratoryResult {
    return {
      id:
        result.id,

      laboratoryExamId:
        result.laboratoryExamId,

      biomarkerCatalogId:
        result.biomarkerCatalogId,

      name:
        result.name,

      value:
        result.value
          ?.toString() ??
        null,

      textValue:
        result.textValue,

      unit:
        result.unit,

      referenceRange:
        result.referenceRange,

      interpretation:
        result.interpretation
          ? result.interpretation as LaboratoryResultInterpretation
          : null,

      createdAt:
        result.createdAt
          .toISOString(),

      updatedAt:
        result.updatedAt
          .toISOString(),
    };
  }
}