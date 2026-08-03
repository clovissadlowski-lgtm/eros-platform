import { Injectable } from '@nestjs/common';

import { PrismaService } from '../../../common/database/prisma.service';
import {
  MedicalRecord as PrismaMedicalRecord,
  MedicalRecordStatus as PrismaMedicalRecordStatus,
} from '../../../generated/prisma/client';
import {
  MedicalRecord,
  MedicalRecordStatus,
} from '../../domain/entities/medical-record.entity';
import { MedicalRecordsRepository } from '../../domain/repositories/medical-records.repository';

@Injectable()
export class PrismaMedicalRecordsRepository
  implements MedicalRecordsRepository
{
  constructor(
    private readonly prisma: PrismaService,
  ) {}

  async create(
    medicalRecord: MedicalRecord,
  ): Promise<MedicalRecord> {
    const createdMedicalRecord =
      await this.prisma.medicalRecord.create({
        data: {
          id: medicalRecord.id,
          organizationId:
            medicalRecord.organizationId,
          patientId:
            medicalRecord.patientId,
          chiefComplaint:
            medicalRecord.chiefComplaint,
          clinicalHistory:
            medicalRecord.clinicalHistory,
          familyHistory:
            medicalRecord.familyHistory,
          allergies:
            medicalRecord.allergies,
          currentMedications:
            medicalRecord.currentMedications,
          healthConditions:
            medicalRecord.healthConditions,
          clinicalNotes:
            medicalRecord.clinicalNotes,
          treatmentGoals:
            medicalRecord.treatmentGoals,
          status:
            medicalRecord.status as PrismaMedicalRecordStatus,
          createdAt: new Date(
            medicalRecord.createdAt,
          ),
          updatedAt: new Date(
            medicalRecord.updatedAt,
          ),
        },
      });

    return this.toDomain(
      createdMedicalRecord,
    );
  }

  async findById(
    organizationId: string,
    medicalRecordId: string,
  ): Promise<MedicalRecord | null> {
    const medicalRecord =
      await this.prisma.medicalRecord.findFirst({
        where: {
          id: medicalRecordId,
          organizationId,
        },
      });

    return medicalRecord
      ? this.toDomain(medicalRecord)
      : null;
  }

  async findByPatientId(
    organizationId: string,
    patientId: string,
  ): Promise<MedicalRecord | null> {
    const medicalRecord =
      await this.prisma.medicalRecord.findFirst({
        where: {
          organizationId,
          patientId,
        },
      });

    return medicalRecord
      ? this.toDomain(medicalRecord)
      : null;
  }

  async update(
    medicalRecord: MedicalRecord,
  ): Promise<MedicalRecord> {
    const updatedMedicalRecord =
      await this.prisma.medicalRecord.update({
        where: {
          id: medicalRecord.id,
        },
        data: {
          chiefComplaint:
            medicalRecord.chiefComplaint,
          clinicalHistory:
            medicalRecord.clinicalHistory,
          familyHistory:
            medicalRecord.familyHistory,
          allergies:
            medicalRecord.allergies,
          currentMedications:
            medicalRecord.currentMedications,
          healthConditions:
            medicalRecord.healthConditions,
          clinicalNotes:
            medicalRecord.clinicalNotes,
          treatmentGoals:
            medicalRecord.treatmentGoals,
          status:
            medicalRecord.status as PrismaMedicalRecordStatus,
          updatedAt: new Date(
            medicalRecord.updatedAt,
          ),
        },
      });

    return this.toDomain(
      updatedMedicalRecord,
    );
  }

  private toDomain(
    medicalRecord: PrismaMedicalRecord,
  ): MedicalRecord {
    return {
      id: medicalRecord.id,
      organizationId:
        medicalRecord.organizationId,
      patientId:
        medicalRecord.patientId,
      chiefComplaint:
        medicalRecord.chiefComplaint,
      clinicalHistory:
        medicalRecord.clinicalHistory,
      familyHistory:
        medicalRecord.familyHistory,
      allergies:
        medicalRecord.allergies,
      currentMedications:
        medicalRecord.currentMedications,
      healthConditions:
        medicalRecord.healthConditions,
      clinicalNotes:
        medicalRecord.clinicalNotes,
      treatmentGoals:
        medicalRecord.treatmentGoals,
      status:
        medicalRecord.status as MedicalRecordStatus,
      createdAt:
        medicalRecord.createdAt.toISOString(),
      updatedAt:
        medicalRecord.updatedAt.toISOString(),
    };
  }
}