import {
  Injectable,
} from '@nestjs/common';

import {
  PrismaService,
} from '../../../common/database/prisma.service';

import {
  AllergySeverity as PrismaAllergySeverity,
  AllergyStatus as PrismaAllergyStatus,
  AllergyType as PrismaAllergyType,
} from '../../../generated/prisma/enums';

import {
  AllergySeverity,
  AllergyStatus,
  AllergyType,
  MedicalRecordAllergy,
} from '../../domain/entities/medical-record-allergy.entity';

import {
  MedicalRecordAllergiesRepository,
} from '../../domain/repositories/medical-record-allergies.repository';

interface PrismaAllergyRecord {
  id: string;
  organizationId: string;
  medicalRecordId: string;
  patientId: string;

  allergenCatalogId: string | null;

  substance: string;
  type: PrismaAllergyType;

  reaction: string | null;
  severity: PrismaAllergySeverity | null;

  status: PrismaAllergyStatus;

  identifiedAt: Date | null;

  notes: string | null;

  createdAt: Date;
  updatedAt: Date;
}

@Injectable()
export class PrismaMedicalRecordAllergiesRepository
  implements MedicalRecordAllergiesRepository
{
  constructor(
    private readonly prisma:
      PrismaService,
  ) {}

  async create(
    allergy:
      MedicalRecordAllergy,
  ): Promise<MedicalRecordAllergy> {
    const created =
      await this.prisma
        .medicalRecordAllergy
        .create({
          data: {
            id:
              allergy.id,

            organizationId:
              allergy.organizationId,

            medicalRecordId:
              allergy.medicalRecordId,

            patientId:
              allergy.patientId,

            allergenCatalogId:
              allergy.allergenCatalogId,

            substance:
              allergy.substance,

            type:
              allergy.type as PrismaAllergyType,

            reaction:
              allergy.reaction,

            severity:
              allergy.severity
                ? allergy.severity as PrismaAllergySeverity
                : null,

            status:
              allergy.status as PrismaAllergyStatus,

            identifiedAt:
              allergy.identifiedAt
                ? new Date(
                    allergy.identifiedAt,
                  )
                : null,

            notes:
              allergy.notes,

            createdAt:
              new Date(
                allergy.createdAt,
              ),

            updatedAt:
              new Date(
                allergy.updatedAt,
              ),
          },
        });

    return this.toDomain(
      created,
    );
  }

  async findById(
    organizationId: string,
    allergyId: string,
  ): Promise<MedicalRecordAllergy | null> {
    const allergy =
      await this.prisma
        .medicalRecordAllergy
        .findFirst({
          where: {
            id:
              allergyId,

            organizationId,
          },
        });

    return allergy
      ? this.toDomain(
          allergy,
        )
      : null;
  }

  async listByMedicalRecordId(
    organizationId: string,
    medicalRecordId: string,
  ): Promise<MedicalRecordAllergy[]> {
    const allergies =
      await this.prisma
        .medicalRecordAllergy
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

    return allergies.map(
      (
        allergy,
      ) =>
        this.toDomain(
          allergy,
        ),
    );
  }

  async update(
    allergy:
      MedicalRecordAllergy,
  ): Promise<MedicalRecordAllergy> {
    const updated =
      await this.prisma
        .medicalRecordAllergy
        .update({
          where: {
            id:
              allergy.id,
          },

          data: {
            allergenCatalogId:
              allergy.allergenCatalogId,

            substance:
              allergy.substance,

            type:
              allergy.type as PrismaAllergyType,

            reaction:
              allergy.reaction,

            severity:
              allergy.severity
                ? allergy.severity as PrismaAllergySeverity
                : null,

            status:
              allergy.status as PrismaAllergyStatus,

            identifiedAt:
              allergy.identifiedAt
                ? new Date(
                    allergy.identifiedAt,
                  )
                : null,

            notes:
              allergy.notes,

            updatedAt:
              new Date(
                allergy.updatedAt,
              ),
          },
        });

    return this.toDomain(
      updated,
    );
  }

  async delete(
    organizationId: string,
    allergyId: string,
  ): Promise<void> {
    await this.prisma
      .medicalRecordAllergy
      .deleteMany({
        where: {
          id:
            allergyId,

          organizationId,
        },
      });
  }

  private toDomain(
    allergy:
      PrismaAllergyRecord,
  ): MedicalRecordAllergy {
    return {
      id:
        allergy.id,

      organizationId:
        allergy.organizationId,

      medicalRecordId:
        allergy.medicalRecordId,

      patientId:
        allergy.patientId,

      allergenCatalogId:
        allergy.allergenCatalogId,

      substance:
        allergy.substance,

      type:
        allergy.type as AllergyType,

      reaction:
        allergy.reaction,

      severity:
        allergy.severity
          ? allergy.severity as AllergySeverity
          : null,

      status:
        allergy.status as AllergyStatus,

      identifiedAt:
        allergy.identifiedAt
          ?.toISOString() ??
        null,

      notes:
        allergy.notes,

      createdAt:
        allergy.createdAt
          .toISOString(),

      updatedAt:
        allergy.updatedAt
          .toISOString(),
    };
  }
}