import {
  Injectable,
} from '@nestjs/common';

import {
  PrismaService,
} from '../../../common/database/prisma.service';

import {
  HealthConditionStatus as PrismaHealthConditionStatus,
  MedicalRecordHealthCondition as PrismaMedicalRecordHealthCondition,
} from '../../../generated/prisma/client';

import {
  HealthConditionStatus,
  MedicalRecordHealthCondition,
} from '../../domain/entities/medical-record-health-condition.entity';

import {
  MedicalRecordHealthConditionsRepository,
} from '../../domain/repositories/medical-record-health-conditions.repository';

@Injectable()
export class PrismaMedicalRecordHealthConditionsRepository
  implements MedicalRecordHealthConditionsRepository
{
  constructor(
    private readonly prisma:
      PrismaService,
  ) {}

  async create(
    healthCondition:
      MedicalRecordHealthCondition,
  ): Promise<MedicalRecordHealthCondition> {
    const created =
      await this.prisma
        .medicalRecordHealthCondition
        .create({
          data: {
            id:
              healthCondition.id,

            organizationId:
              healthCondition.organizationId,

            medicalRecordId:
              healthCondition.medicalRecordId,

            patientId:
              healthCondition.patientId,

            clinicalConditionId:
              healthCondition
                .clinicalConditionId,

            name:
              healthCondition.name,

            status:
              healthCondition.status as PrismaHealthConditionStatus,

            diagnosedAt:
              healthCondition.diagnosedAt
                ? new Date(
                    healthCondition
                      .diagnosedAt,
                  )
                : null,

            resolvedAt:
              healthCondition.resolvedAt
                ? new Date(
                    healthCondition
                      .resolvedAt,
                  )
                : null,

            notes:
              healthCondition.notes,

            createdAt:
              new Date(
                healthCondition.createdAt,
              ),

            updatedAt:
              new Date(
                healthCondition.updatedAt,
              ),
          },
        });

    return this.toDomain(
      created,
    );
  }

  async findById(
    organizationId: string,
    healthConditionId: string,
  ): Promise<
    MedicalRecordHealthCondition | null
  > {
    const healthCondition =
      await this.prisma
        .medicalRecordHealthCondition
        .findFirst({
          where: {
            id:
              healthConditionId,

            organizationId,
          },
        });

    return healthCondition
      ? this.toDomain(
          healthCondition,
        )
      : null;
  }

  async listByMedicalRecordId(
    organizationId: string,
    medicalRecordId: string,
  ): Promise<
    MedicalRecordHealthCondition[]
  > {
    const healthConditions =
      await this.prisma
        .medicalRecordHealthCondition
        .findMany({
          where: {
            organizationId,
            medicalRecordId,
          },

          orderBy: [
            {
              status:
                'asc',
            },
            {
              createdAt:
                'desc',
            },
          ],
        });

    return healthConditions.map(
      (healthCondition) =>
        this.toDomain(
          healthCondition,
        ),
    );
  }

  async update(
    healthCondition:
      MedicalRecordHealthCondition,
  ): Promise<MedicalRecordHealthCondition> {
    const updated =
      await this.prisma
        .medicalRecordHealthCondition
        .update({
          where: {
            id:
              healthCondition.id,
          },

          data: {
            clinicalConditionId:
              healthCondition
                .clinicalConditionId,

            name:
              healthCondition.name,

            status:
              healthCondition.status as PrismaHealthConditionStatus,

            diagnosedAt:
              healthCondition.diagnosedAt
                ? new Date(
                    healthCondition
                      .diagnosedAt,
                  )
                : null,

            resolvedAt:
              healthCondition.resolvedAt
                ? new Date(
                    healthCondition
                      .resolvedAt,
                  )
                : null,

            notes:
              healthCondition.notes,

            updatedAt:
              new Date(
                healthCondition
                  .updatedAt,
              ),
          },
        });

    return this.toDomain(
      updated,
    );
  }

  async delete(
    organizationId: string,
    healthConditionId: string,
  ): Promise<void> {
    await this.prisma
      .medicalRecordHealthCondition
      .deleteMany({
        where: {
          id:
            healthConditionId,

          organizationId,
        },
      });
  }

  private toDomain(
    healthCondition:
      PrismaMedicalRecordHealthCondition,
  ): MedicalRecordHealthCondition {
    return {
      id:
        healthCondition.id,

      organizationId:
        healthCondition.organizationId,

      medicalRecordId:
        healthCondition.medicalRecordId,

      patientId:
        healthCondition.patientId,

      clinicalConditionId:
        healthCondition
          .clinicalConditionId,

      name:
        healthCondition.name,

      status:
        healthCondition.status as HealthConditionStatus,

      diagnosedAt:
        healthCondition
          .diagnosedAt
          ?.toISOString() ??
        null,

      resolvedAt:
        healthCondition
          .resolvedAt
          ?.toISOString() ??
        null,

      notes:
        healthCondition.notes,

      createdAt:
        healthCondition
          .createdAt
          .toISOString(),

      updatedAt:
        healthCondition
          .updatedAt
          .toISOString(),
    };
  }
}