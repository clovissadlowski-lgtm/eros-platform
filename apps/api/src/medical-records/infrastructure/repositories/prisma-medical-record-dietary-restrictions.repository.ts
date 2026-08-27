import {
  Injectable,
} from '@nestjs/common';

import {
  PrismaService,
} from '../../../common/database/prisma.service';

import {
  DietaryRestrictionAction as PrismaDietaryRestrictionAction,
  DietaryRestrictionRisk as PrismaDietaryRestrictionRisk,
  DietaryRestrictionSource as PrismaDietaryRestrictionSource,
  DietaryRestrictionStatus as PrismaDietaryRestrictionStatus,
  DietaryRestrictionType as PrismaDietaryRestrictionType,
} from '../../../generated/prisma/enums';

import {
  DietaryRestrictionAction,
  DietaryRestrictionRisk,
  DietaryRestrictionSource,
  DietaryRestrictionStatus,
  DietaryRestrictionType,
  MedicalRecordDietaryRestriction,
} from '../../domain/entities/medical-record-dietary-restriction.entity';

import {
  MedicalRecordDietaryRestrictionsRepository,
} from '../../domain/repositories/medical-record-dietary-restrictions.repository';

interface PrismaDietaryRestrictionRecord {
  id: string;
  organizationId: string;
  medicalRecordId: string;
  patientId: string;

  dietaryItemCatalogId: string | null;

  item: string;
  type: PrismaDietaryRestrictionType;
  action: PrismaDietaryRestrictionAction;
  risk: PrismaDietaryRestrictionRisk;
  source: PrismaDietaryRestrictionSource;

  reason: string | null;
  identifiedAt: Date | null;

  status: PrismaDietaryRestrictionStatus;

  notes: string | null;

  createdAt: Date;
  updatedAt: Date;
}

@Injectable()
export class PrismaMedicalRecordDietaryRestrictionsRepository
  implements MedicalRecordDietaryRestrictionsRepository
{
  constructor(
    private readonly prisma:
      PrismaService,
  ) {}

  async create(
    restriction:
      MedicalRecordDietaryRestriction,
  ): Promise<MedicalRecordDietaryRestriction> {
    const created =
      await this.prisma
        .medicalRecordDietaryRestriction
        .create({
          data: {
            id:
              restriction.id,

            organizationId:
              restriction.organizationId,

            medicalRecordId:
              restriction.medicalRecordId,

            patientId:
              restriction.patientId,

            dietaryItemCatalogId:
              restriction.dietaryItemCatalogId,

            item:
              restriction.item,

            type:
              restriction.type as PrismaDietaryRestrictionType,

            action:
              restriction.action as PrismaDietaryRestrictionAction,

            risk:
              restriction.risk as PrismaDietaryRestrictionRisk,

            source:
              restriction.source as PrismaDietaryRestrictionSource,

            reason:
              restriction.reason,

            identifiedAt:
              restriction.identifiedAt
                ? new Date(
                    restriction.identifiedAt,
                  )
                : null,

            status:
              restriction.status as PrismaDietaryRestrictionStatus,

            notes:
              restriction.notes,

            createdAt:
              new Date(
                restriction.createdAt,
              ),

            updatedAt:
              new Date(
                restriction.updatedAt,
              ),
          },
        });

    return this.toDomain(
      created,
    );
  }

  async findById(
    organizationId: string,
    restrictionId: string,
  ): Promise<MedicalRecordDietaryRestriction | null> {
    const restriction =
      await this.prisma
        .medicalRecordDietaryRestriction
        .findFirst({
          where: {
            id:
              restrictionId,

            organizationId,
          },
        });

    return restriction
      ? this.toDomain(
          restriction,
        )
      : null;
  }

  async listByMedicalRecordId(
    organizationId: string,
    medicalRecordId: string,
  ): Promise<MedicalRecordDietaryRestriction[]> {
    const restrictions =
      await this.prisma
        .medicalRecordDietaryRestriction
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

    return restrictions.map(
      (
        restriction,
      ) =>
        this.toDomain(
          restriction,
        ),
    );
  }

  async update(
    restriction:
      MedicalRecordDietaryRestriction,
  ): Promise<MedicalRecordDietaryRestriction> {
    const updated =
      await this.prisma
        .medicalRecordDietaryRestriction
        .update({
          where: {
            id:
              restriction.id,
          },

          data: {
            dietaryItemCatalogId:
              restriction.dietaryItemCatalogId,

            item:
              restriction.item,

            type:
              restriction.type as PrismaDietaryRestrictionType,

            action:
              restriction.action as PrismaDietaryRestrictionAction,

            risk:
              restriction.risk as PrismaDietaryRestrictionRisk,

            source:
              restriction.source as PrismaDietaryRestrictionSource,

            reason:
              restriction.reason,

            identifiedAt:
              restriction.identifiedAt
                ? new Date(
                    restriction.identifiedAt,
                  )
                : null,

            status:
              restriction.status as PrismaDietaryRestrictionStatus,

            notes:
              restriction.notes,

            updatedAt:
              new Date(
                restriction.updatedAt,
              ),
          },
        });

    return this.toDomain(
      updated,
    );
  }

  async delete(
    organizationId: string,
    restrictionId: string,
  ): Promise<void> {
    await this.prisma
      .medicalRecordDietaryRestriction
      .deleteMany({
        where: {
          id:
            restrictionId,

          organizationId,
        },
      });
  }

  private toDomain(
    restriction:
      PrismaDietaryRestrictionRecord,
  ): MedicalRecordDietaryRestriction {
    return {
      id:
        restriction.id,

      organizationId:
        restriction.organizationId,

      medicalRecordId:
        restriction.medicalRecordId,

      patientId:
        restriction.patientId,

      dietaryItemCatalogId:
        restriction.dietaryItemCatalogId,

      item:
        restriction.item,

      type:
        restriction.type as DietaryRestrictionType,

      action:
        restriction.action as DietaryRestrictionAction,

      risk:
        restriction.risk as DietaryRestrictionRisk,

      source:
        restriction.source as DietaryRestrictionSource,

      reason:
        restriction.reason,

      identifiedAt:
        restriction.identifiedAt
          ?.toISOString()
          .slice(
            0,
            10,
          ) ??
        null,

      status:
        restriction.status as DietaryRestrictionStatus,

      notes:
        restriction.notes,

      createdAt:
        restriction.createdAt
          .toISOString(),

      updatedAt:
        restriction.updatedAt
          .toISOString(),
    };
  }
}