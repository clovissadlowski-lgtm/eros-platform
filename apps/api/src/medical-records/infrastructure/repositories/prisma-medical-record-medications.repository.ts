import {
  Injectable,
} from '@nestjs/common';

import {
  PrismaService,
} from '../../../common/database/prisma.service';

import {
  MedicationRoute as PrismaMedicationRoute,
  MedicationStatus as PrismaMedicationStatus,
} from '../../../generated/prisma/enums';

import {
  MedicationRoute,
  MedicationStatus,
  MedicalRecordMedication,
} from '../../domain/entities/medical-record-medication.entity';

import {
  MedicalRecordMedicationsRepository,
} from '../../domain/repositories/medical-record-medications.repository';

interface PrismaMedicationRecord {
  id: string;
  organizationId: string;
  medicalRecordId: string;
  patientId: string;

  medicationCatalogId: string | null;

  name: string;
  dosage: string | null;
  frequency: string | null;
  route: PrismaMedicationRoute | null;
  indication: string | null;

  startedAt: Date | null;
  endedAt: Date | null;

  status: PrismaMedicationStatus;

  notes: string | null;

  createdAt: Date;
  updatedAt: Date;
}

@Injectable()
export class PrismaMedicalRecordMedicationsRepository
  implements MedicalRecordMedicationsRepository
{
  constructor(
    private readonly prisma:
      PrismaService,
  ) {}

  async create(
    medication:
      MedicalRecordMedication,
  ): Promise<MedicalRecordMedication> {
    const created =
      await this.prisma
        .medicalRecordMedication
        .create({
          data: {
            id:
              medication.id,

            organizationId:
              medication.organizationId,

            medicalRecordId:
              medication.medicalRecordId,

            patientId:
              medication.patientId,

            medicationCatalogId:
              medication.medicationCatalogId,

            name:
              medication.name,

            dosage:
              medication.dosage,

            frequency:
              medication.frequency,

            route:
              medication.route
                ? medication.route as PrismaMedicationRoute
                : null,

            indication:
              medication.indication,

            startedAt:
              medication.startedAt
                ? new Date(
                    medication.startedAt,
                  )
                : null,

            endedAt:
              medication.endedAt
                ? new Date(
                    medication.endedAt,
                  )
                : null,

            status:
              medication.status as PrismaMedicationStatus,

            notes:
              medication.notes,

            createdAt:
              new Date(
                medication.createdAt,
              ),

            updatedAt:
              new Date(
                medication.updatedAt,
              ),
          },
        });

    return this.toDomain(
      created,
    );
  }

  async findById(
    organizationId: string,
    medicationId: string,
  ): Promise<MedicalRecordMedication | null> {
    const medication =
      await this.prisma
        .medicalRecordMedication
        .findFirst({
          where: {
            id:
              medicationId,

            organizationId,
          },
        });

    return medication
      ? this.toDomain(
          medication,
        )
      : null;
  }

  async listByMedicalRecordId(
    organizationId: string,
    medicalRecordId: string,
  ): Promise<MedicalRecordMedication[]> {
    const medications =
      await this.prisma
        .medicalRecordMedication
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

    return medications.map(
      (
        medication,
      ) =>
        this.toDomain(
          medication,
        ),
    );
  }

  async update(
    medication:
      MedicalRecordMedication,
  ): Promise<MedicalRecordMedication> {
    const updated =
      await this.prisma
        .medicalRecordMedication
        .update({
          where: {
            id:
              medication.id,
          },

          data: {
            medicationCatalogId:
              medication.medicationCatalogId,

            name:
              medication.name,

            dosage:
              medication.dosage,

            frequency:
              medication.frequency,

            route:
              medication.route
                ? medication.route as PrismaMedicationRoute
                : null,

            indication:
              medication.indication,

            startedAt:
              medication.startedAt
                ? new Date(
                    medication.startedAt,
                  )
                : null,

            endedAt:
              medication.endedAt
                ? new Date(
                    medication.endedAt,
                  )
                : null,

            status:
              medication.status as PrismaMedicationStatus,

            notes:
              medication.notes,

            updatedAt:
              new Date(
                medication.updatedAt,
              ),
          },
        });

    return this.toDomain(
      updated,
    );
  }

  async delete(
    organizationId: string,
    medicationId: string,
  ): Promise<void> {
    await this.prisma
      .medicalRecordMedication
      .deleteMany({
        where: {
          id:
            medicationId,

          organizationId,
        },
      });
  }

  private toDomain(
    medication:
      PrismaMedicationRecord,
  ): MedicalRecordMedication {
    return {
      id:
        medication.id,

      organizationId:
        medication.organizationId,

      medicalRecordId:
        medication.medicalRecordId,

      patientId:
        medication.patientId,

      medicationCatalogId:
        medication.medicationCatalogId,

      name:
        medication.name,

      dosage:
        medication.dosage,

      frequency:
        medication.frequency,

      route:
        medication.route
          ? medication.route as MedicationRoute
          : null,

      indication:
        medication.indication,

      startedAt:
        medication.startedAt
          ?.toISOString() ??
        null,

      endedAt:
        medication.endedAt
          ?.toISOString() ??
        null,

      status:
        medication.status as MedicationStatus,

      notes:
        medication.notes,

      createdAt:
        medication.createdAt
          .toISOString(),

      updatedAt:
        medication.updatedAt
          .toISOString(),
    };
  }
}