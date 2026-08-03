import { Injectable } from '@nestjs/common';

import { PrismaService } from '../../../common/database/prisma.service';
import {
  Patient as PrismaPatient,
  PatientStatus as PrismaPatientStatus,
} from '../../../generated/prisma/client';
import {
  Patient,
  PatientStatus,
} from '../../domain/entities/patient.entity';
import { PatientsRepository } from '../../domain/repositories/patients.repository';

@Injectable()
export class PrismaPatientsRepository
  implements PatientsRepository
{
  constructor(
    private readonly prisma: PrismaService,
  ) {}

  async create(
    patient: Patient,
  ): Promise<Patient> {
    const createdPatient =
      await this.prisma.patient.create({
        data: {
          id: patient.id,
          organizationId:
            patient.organizationId,
          name: patient.name,
          email: patient.email,
          phone: patient.phone,
          birthDate:
            this.toDatabaseDate(
              patient.birthDate,
            ),
          status:
            patient.status as PrismaPatientStatus,
          createdAt: new Date(
            patient.createdAt,
          ),
          updatedAt: new Date(
            patient.updatedAt,
          ),
        },
      });

    return this.toDomain(createdPatient);
  }

  async listByOrganization(
    organizationId: string,
  ): Promise<Patient[]> {
    const patients =
      await this.prisma.patient.findMany({
        where: {
          organizationId,
        },
        orderBy: {
          createdAt: 'asc',
        },
      });

    return patients.map((patient) =>
      this.toDomain(patient),
    );
  }

  async findById(
    organizationId: string,
    patientId: string,
  ): Promise<Patient | null> {
    const patient =
      await this.prisma.patient.findFirst({
        where: {
          id: patientId,
          organizationId,
        },
      });

    return patient
      ? this.toDomain(patient)
      : null;
  }


    async findByEmail(
    organizationId: string,
    email: string,
  ): Promise<Patient | null> {
    const patient =
      await this.prisma.patient.findFirst({
        where: {
          organizationId,
          email:
            email.trim().toLowerCase(),
        },
      });

    return patient
      ? this.toDomain(patient)
      : null;
  } 
  
  async update(
    patient: Patient,
  ): Promise<Patient> {
    const updatedPatient =
      await this.prisma.patient.update({
        where: {
          id: patient.id,
        },
        data: {
          name: patient.name,
          email: patient.email,
          phone: patient.phone,
          birthDate:
            this.toDatabaseDate(
              patient.birthDate,
            ),
          status:
            patient.status as PrismaPatientStatus,
          updatedAt: new Date(
            patient.updatedAt,
          ),
        },
      });

    return this.toDomain(updatedPatient);
  }

  private toDomain(
    patient: PrismaPatient,
  ): Patient {
    return {
      id: patient.id,
      organizationId:
        patient.organizationId,
      name: patient.name,
      email: patient.email,
      phone: patient.phone,
      birthDate: patient.birthDate
        ? patient.birthDate
            .toISOString()
            .slice(0, 10)
        : null,
      status:
        patient.status as PatientStatus,
      createdAt:
        patient.createdAt.toISOString(),
      updatedAt:
        patient.updatedAt.toISOString(),
    };
  }

  private toDatabaseDate(
    value: string | null,
  ): Date | null {
    if (!value) {
      return null;
    }

    return new Date(
      `${value}T00:00:00.000Z`,
    );
  }
}