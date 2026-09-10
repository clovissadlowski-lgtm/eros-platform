import {
  Injectable,
} from '@nestjs/common';

import {
  PrismaService,
} from '../../../common/database/prisma.service';

import {
  AnthropometricAssessment,
  AnthropometricCircumferenceMeasurement,
  AnthropometricCircumferenceSite,
  AnthropometricCircumferenceState,
  AnthropometricMeasurementSide,
  AnthropometricSkinfoldMeasurement,
  BodyCompositionMethod,
  SkinfoldMeasurementSide,
  SkinfoldProtocol,
  SkinfoldSite,
} from '../../domain/entities/anthropometric-assessment.entity';

import {
  AnthropometricAssessmentsRepository,
} from '../../domain/repositories/anthropometric-assessments.repository';

import type {
  AnthropometricAssessment as PrismaAnthropometricAssessment,
  AnthropometricCircumferenceMeasurement as PrismaAnthropometricCircumferenceMeasurement,
  AnthropometricSkinfoldMeasurement as PrismaAnthropometricSkinfoldMeasurement,
} from '../../../generated/prisma/client';

type PrismaAssessmentWithMeasurements =
  PrismaAnthropometricAssessment & {
    skinfoldMeasurements:
      PrismaAnthropometricSkinfoldMeasurement[];

    circumferenceMeasurements:
      PrismaAnthropometricCircumferenceMeasurement[];
  };

@Injectable()
export class PrismaAnthropometricAssessmentsRepository
  implements AnthropometricAssessmentsRepository
{
  constructor(
    private readonly prisma:
      PrismaService,
  ) {}

  async create(
    assessment:
      AnthropometricAssessment,
  ): Promise<AnthropometricAssessment> {
    const created =
      await this.prisma
        .anthropometricAssessment
        .create({
          data: {
            id:
              assessment.id,

            organizationId:
              assessment.organizationId,

            medicalRecordId:
              assessment.medicalRecordId,

            patientId:
              assessment.patientId,

            measuredAt:
              new Date(
                assessment.measuredAt,
              ),

            weightKg:
              assessment.weightKg,

            heightCm:
              assessment.heightCm,

            bodyFatPercentage:
              assessment.bodyFatPercentage,

            fatMassKg:
              assessment.fatMassKg,

            leanMassKg:
              assessment.leanMassKg,

            muscleMassKg:
              assessment.muscleMassKg,

            waistCircumferenceCm:
              assessment.waistCircumferenceCm,

            hipCircumferenceCm:
              assessment.hipCircumferenceCm,

            abdomenCircumferenceCm:
              assessment.abdomenCircumferenceCm,

            chestCircumferenceCm:
              assessment.chestCircumferenceCm,

            armCircumferenceCm:
              assessment.armCircumferenceCm,

            thighCircumferenceCm:
              assessment.thighCircumferenceCm,

            calfCircumferenceCm:
              assessment.calfCircumferenceCm,

            bodyCompositionMethod:
              assessment.bodyCompositionMethod,

            skinfoldProtocol:
              assessment.skinfoldProtocol,


            notes:
              assessment.notes,

            createdAt:
              new Date(
                assessment.createdAt,
              ),

            updatedAt:
              new Date(
                assessment.updatedAt,
              ),

            skinfoldMeasurements: {
              create:
                assessment.skinfoldMeasurements.map(
                  (
                    measurement,
                  ) => ({
                    id:
                      measurement.id,

                    site:
                      measurement.site,

                    side:
                      measurement.side,

                    readingNumber:
                      measurement.readingNumber,

                    valueMm:
                      measurement.valueMm,

                    createdAt:
                      new Date(
                        measurement.createdAt,
                      ),

                    updatedAt:
                      new Date(
                        measurement.updatedAt,
                      ),
                  }),
                ),
            },

            circumferenceMeasurements: {
              create:
                assessment.circumferenceMeasurements.map(
                  (
                    measurement,
                  ) => ({
                    id:
                      measurement.id,

                    site:
                      measurement.site,

                    side:
                      measurement.side,

                    state:
                      measurement.state,

                    valueCm:
                      measurement.valueCm,

                    createdAt:
                      new Date(
                        measurement.createdAt,
                      ),

                    updatedAt:
                      new Date(
                        measurement.updatedAt,
                      ),
                  }),
                ),
            },
          },

          include: {
            skinfoldMeasurements:
              true,

            circumferenceMeasurements:
              true,
          },
        });

    return this.toDomain(
      created,
    );
  }

  async findById(
    organizationId: string,
    assessmentId: string,
  ): Promise<AnthropometricAssessment | null> {
    const assessment =
      await this.prisma
        .anthropometricAssessment
        .findFirst({
          where: {
            id:
              assessmentId,

            organizationId,
          },

          include: {
            skinfoldMeasurements:
              true,

            circumferenceMeasurements:
              true,
          },
        });

    return assessment
      ? this.toDomain(
          assessment,
        )
      : null;
  }

  async listByMedicalRecordId(
    organizationId: string,
    medicalRecordId: string,
  ): Promise<AnthropometricAssessment[]> {
    const assessments =
      await this.prisma
        .anthropometricAssessment
        .findMany({
          where: {
            organizationId,
            medicalRecordId,
          },

          include: {
            skinfoldMeasurements:
              true,

            circumferenceMeasurements:
              true,
          },

          orderBy: [
            {
              measuredAt:
                'desc',
            },
            {
              createdAt:
                'desc',
            },
          ],
        });

    return assessments.map(
      (
        assessment,
      ) =>
        this.toDomain(
          assessment,
        ),
    );
  }

  async update(
    assessment:
      AnthropometricAssessment,
  ): Promise<AnthropometricAssessment> {
    const updated =
      await this.prisma
        .$transaction(
          async (
            transaction,
          ) => {
            await transaction
              .anthropometricSkinfoldMeasurement
              .deleteMany({
                where: {
                  anthropometricAssessmentId:
                    assessment.id,
                },
              });

            await transaction
              .anthropometricCircumferenceMeasurement
              .deleteMany({
                where: {
                  anthropometricAssessmentId:
                    assessment.id,
                },
              });

            return transaction
              .anthropometricAssessment
              .update({
                where: {
                  id:
                    assessment.id,
                },

                data: {
                  measuredAt:
                    new Date(
                      assessment.measuredAt,
                    ),

                  weightKg:
                    assessment.weightKg,

                  heightCm:
                    assessment.heightCm,

                  bodyFatPercentage:
                    assessment.bodyFatPercentage,

                  fatMassKg:
                    assessment.fatMassKg,

                  leanMassKg:
                    assessment.leanMassKg,

                  muscleMassKg:
                    assessment.muscleMassKg,

                  waistCircumferenceCm:
                    assessment.waistCircumferenceCm,

                  hipCircumferenceCm:
                    assessment.hipCircumferenceCm,

                  abdomenCircumferenceCm:
                    assessment.abdomenCircumferenceCm,

                  chestCircumferenceCm:
                    assessment.chestCircumferenceCm,

                  armCircumferenceCm:
                    assessment.armCircumferenceCm,

                  thighCircumferenceCm:
                    assessment.thighCircumferenceCm,

                  calfCircumferenceCm:
                    assessment.calfCircumferenceCm,

                  bodyCompositionMethod:
                    assessment.bodyCompositionMethod,

                  skinfoldProtocol:
                    assessment.skinfoldProtocol,

                  notes:
                    assessment.notes,

                  updatedAt:
                    new Date(
                      assessment.updatedAt,
                    ),

                  skinfoldMeasurements: {
                    create:
                      assessment.skinfoldMeasurements.map(
                        (
                          measurement,
                        ) => ({
                          id:
                            measurement.id,

                          site:
                            measurement.site,

                          side:
                            measurement.side,

                          readingNumber:
                            measurement.readingNumber,

                          valueMm:
                            measurement.valueMm,

                          createdAt:
                            new Date(
                              measurement.createdAt,
                            ),

                          updatedAt:
                            new Date(
                              measurement.updatedAt,
                            ),
                        }),
                      ),
                  },

                  circumferenceMeasurements: {
                    create:
                      assessment.circumferenceMeasurements.map(
                        (
                          measurement,
                        ) => ({
                          id:
                            measurement.id,

                          site:
                            measurement.site,

                          side:
                            measurement.side,

                          state:
                            measurement.state,

                          valueCm:
                            measurement.valueCm,

                          createdAt:
                            new Date(
                              measurement.createdAt,
                            ),

                          updatedAt:
                            new Date(
                              measurement.updatedAt,
                            ),
                        }),
                      ),
                  },
                },

                include: {
                  skinfoldMeasurements:
                    true,

                  circumferenceMeasurements:
                    true,
                },
              });
          },
        );

    return this.toDomain(
      updated,
    );
  }

  async delete(
    organizationId: string,
    assessmentId: string,
  ): Promise<void> {
    await this.prisma
      .anthropometricAssessment
      .deleteMany({
        where: {
          id:
            assessmentId,

          organizationId,
        },
      });
  }

  private toDomain(
    assessment:
      PrismaAssessmentWithMeasurements,
  ): AnthropometricAssessment {
    return {
      id:
        assessment.id,

      organizationId:
        assessment.organizationId,

      medicalRecordId:
        assessment.medicalRecordId,

      patientId:
        assessment.patientId,

      measuredAt:
        assessment.measuredAt
          .toISOString()
          .slice(
            0,
            10,
          ),

      weightKg:
        assessment.weightKg !==
        null
          ? Number(
              assessment.weightKg,
            )
          : null,

      heightCm:
        assessment.heightCm !==
        null
          ? Number(
              assessment.heightCm,
            )
          : null,

      bodyFatPercentage:
        assessment.bodyFatPercentage !==
        null
          ? Number(
              assessment.bodyFatPercentage,
            )
          : null,

      fatMassKg:
        assessment.fatMassKg !==
        null
          ? Number(
              assessment.fatMassKg,
            )
          : null,

      leanMassKg:
        assessment.leanMassKg !==
        null
          ? Number(
              assessment.leanMassKg,
            )
          : null,

      muscleMassKg:
        assessment.muscleMassKg !==
        null
          ? Number(
              assessment.muscleMassKg,
            )
          : null,

      waistCircumferenceCm:
        assessment.waistCircumferenceCm !==
        null
          ? Number(
              assessment.waistCircumferenceCm,
            )
          : null,

      hipCircumferenceCm:
        assessment.hipCircumferenceCm !==
        null
          ? Number(
              assessment.hipCircumferenceCm,
            )
          : null,

      abdomenCircumferenceCm:
        assessment.abdomenCircumferenceCm !==
        null
          ? Number(
              assessment.abdomenCircumferenceCm,
            )
          : null,

      chestCircumferenceCm:
        assessment.chestCircumferenceCm !==
        null
          ? Number(
              assessment.chestCircumferenceCm,
            )
          : null,

      armCircumferenceCm:
        assessment.armCircumferenceCm !==
        null
          ? Number(
              assessment.armCircumferenceCm,
            )
          : null,

      thighCircumferenceCm:
        assessment.thighCircumferenceCm !==
        null
          ? Number(
              assessment.thighCircumferenceCm,
            )
          : null,

      calfCircumferenceCm:
        assessment.calfCircumferenceCm !==
        null
          ? Number(
              assessment.calfCircumferenceCm,
            )
          : null,

      bodyCompositionMethod:
        assessment.bodyCompositionMethod
          ? assessment.bodyCompositionMethod as BodyCompositionMethod
          : null,

      skinfoldProtocol:
        assessment.skinfoldProtocol
          ? assessment.skinfoldProtocol as SkinfoldProtocol
          : null,

      skinfoldMeasurements:
        assessment.skinfoldMeasurements.map(
          (
            measurement,
          ) =>
            this.toSkinfoldDomain(
              measurement,
            ),
        ),

      circumferenceMeasurements:
        assessment.circumferenceMeasurements.map(
          (
            measurement,
          ) =>
            this.toCircumferenceDomain(
              measurement,
            ),
        ),

      notes:
        assessment.notes,

      createdAt:
        assessment.createdAt
          .toISOString(),

      updatedAt:
        assessment.updatedAt
          .toISOString(),
    };
  }

  private toCircumferenceDomain(
    measurement:
      PrismaAnthropometricCircumferenceMeasurement,
  ): AnthropometricCircumferenceMeasurement {
    return {
      id:
        measurement.id,

      anthropometricAssessmentId:
        measurement.anthropometricAssessmentId,

      site:
        measurement.site as AnthropometricCircumferenceSite,

      side:
        measurement.side as AnthropometricMeasurementSide,

      state:
        measurement.state as AnthropometricCircumferenceState,

      valueCm:
        Number(
          measurement.valueCm,
        ),

      createdAt:
        measurement.createdAt
          .toISOString(),

      updatedAt:
        measurement.updatedAt
          .toISOString(),
    };
  }

  private toSkinfoldDomain(
    measurement:
      PrismaAnthropometricSkinfoldMeasurement,
  ): AnthropometricSkinfoldMeasurement {
    return {
      id:
        measurement.id,

      anthropometricAssessmentId:
        measurement.anthropometricAssessmentId,

      site:
        measurement.site as SkinfoldSite,

      side:
        measurement.side as SkinfoldMeasurementSide,

      readingNumber:
        measurement.readingNumber,

      valueMm:
        Number(
          measurement.valueMm,
        ),

      createdAt:
        measurement.createdAt
          .toISOString(),

      updatedAt:
        measurement.updatedAt
          .toISOString(),
    };
  }
}
