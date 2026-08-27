import {
  BadRequestException,
  ConflictException,
  Injectable,
} from '@nestjs/common';

import {
  randomUUID,
} from 'node:crypto';

import {
  Patient,
  PatientStatus,
} from '../../domain/entities/patient.entity';

import {
  PatientEmailAlreadyExistsError,
} from '../../domain/errors/patient-email-already-exists.error';

import {
  PatientNotFoundError,
} from '../../domain/errors/patient-not-found.error';

import {
  PatientsRepository,
} from '../../domain/repositories/patients.repository';

import {
  CreatePatientDto,
} from '../../presentation/dto/create-patient.dto';

import {
  UpdatePatientDto,
} from '../../presentation/dto/update-patient.dto';

@Injectable()
export class PatientsService {
  constructor(
    private readonly patientsRepository:
      PatientsRepository,
  ) {}

  async createPatient(
    dto: CreatePatientDto,
    organizationId: string,
  ): Promise<Patient> {
    const normalizedCpf =
      this.normalizeCpf(
        dto.cpf,
      );

    const normalizedEmail =
      this.normalizeEmail(
        dto.email,
      );

    this.ensureCpfIsValid(
      normalizedCpf,
    );

    await this.ensureCpfIsAvailable(
      organizationId,
      normalizedCpf,
    );

    await this.ensureEmailIsAvailable(
      organizationId,
      normalizedEmail,
    );

    const timestamp =
      new Date().toISOString();

    const patient:
      Patient = {
      id:
        randomUUID(),

      organizationId,

      name:
        dto.name.trim(),

      cpf:
        normalizedCpf,

      email:
        normalizedEmail,

      phone:
        this.normalizeOptionalText(
          dto.phone,
        ),

      birthDate:
        dto.birthDate ??
        null,

      biologicalSex:
        dto.biologicalSex ??
        null,

      status:
        PatientStatus.ACTIVE,

      createdAt:
        timestamp,

      updatedAt:
        timestamp,
    };

    return this
      .patientsRepository
      .create(
        patient,
      );
  }

  async listPatients(
    organizationId: string,
  ): Promise<Patient[]> {
    return this
      .patientsRepository
      .listByOrganization(
        organizationId,
      );
  }

  async getPatientById(
    patientId: string,
    organizationId: string,
  ): Promise<Patient> {
    const patient =
      await this
        .patientsRepository
        .findById(
          organizationId,
          patientId,
        );

    if (
      !patient
    ) {
      throw new PatientNotFoundError();
    }

    return patient;
  }

  async updatePatient(
    patientId: string,
    organizationId: string,
    dto: UpdatePatientDto,
  ): Promise<Patient> {
    const patient =
      await this.getPatientById(
        patientId,
        organizationId,
      );

    const normalizedCpf =
      dto.cpf !== undefined
        ? this.normalizeCpf(
            dto.cpf,
          )
        : patient.cpf;

    const normalizedEmail =
      dto.email !== undefined
        ? this.normalizeEmail(
            dto.email,
          )
        : patient.email;

    this.ensureCpfIsValid(
      normalizedCpf,
    );

    await this.ensureCpfIsAvailable(
      organizationId,
      normalizedCpf,
      patient.id,
    );

    await this.ensureEmailIsAvailable(
      organizationId,
      normalizedEmail,
      patient.id,
    );

    const updatedPatient:
      Patient = {
      ...patient,

      name:
        dto.name !== undefined
          ? dto.name.trim()
          : patient.name,

      cpf:
        normalizedCpf,

      email:
        normalizedEmail,

      phone:
        dto.phone !== undefined
          ? this.normalizeOptionalText(
              dto.phone,
            )
          : patient.phone,

      birthDate:
        dto.birthDate !== undefined
          ? dto.birthDate
          : patient.birthDate,

      biologicalSex:
        dto.biologicalSex !== undefined
          ? dto.biologicalSex
          : patient.biologicalSex,

      updatedAt:
        new Date().toISOString(),
    };

    return this
      .patientsRepository
      .update(
        updatedPatient,
      );
  }

  async updatePatientStatus(
    patientId: string,
    organizationId: string,
    status: PatientStatus,
  ): Promise<Patient> {
    const patient =
      await this.getPatientById(
        patientId,
        organizationId,
      );

    const updatedPatient:
      Patient = {
      ...patient,

      status,

      updatedAt:
        new Date().toISOString(),
    };

    return this
      .patientsRepository
      .update(
        updatedPatient,
      );
  }

  private normalizeCpf(
    cpf:
      string |
      null |
      undefined,
  ): string | null {
    if (
      cpf === undefined ||
      cpf === null
    ) {
      return null;
    }

    const normalized =
      cpf.replace(
        /\D/g,
        '',
      );

    return normalized.length > 0
      ? normalized
      : null;
  }

  private ensureCpfIsValid(
    cpf: string | null,
  ): void {
    if (
      !cpf
    ) {
      return;
    }

    if (
      !this.isValidCpf(
        cpf,
      )
    ) {
      throw new BadRequestException(
        'CPF inválido.',
      );
    }
  }

  private isValidCpf(
    cpf: string,
  ): boolean {
    if (
      !/^\d{11}$/.test(
        cpf,
      )
    ) {
      return false;
    }

    if (
      /^(\d)\1{10}$/.test(
        cpf,
      )
    ) {
      return false;
    }

    const digits =
      cpf
        .split(
          '',
        )
        .map(
          Number,
        );

    let firstSum =
      0;

    for (
      let index = 0;
      index < 9;
      index += 1
    ) {
      firstSum +=
        digits[index] *
        (
          10 -
          index
        );
    }

    const firstRemainder =
      (
        firstSum *
        10
      ) %
      11;

    const firstVerifier =
      firstRemainder === 10
        ? 0
        : firstRemainder;

    if (
      firstVerifier !==
      digits[9]
    ) {
      return false;
    }

    let secondSum =
      0;

    for (
      let index = 0;
      index < 10;
      index += 1
    ) {
      secondSum +=
        digits[index] *
        (
          11 -
          index
        );
    }

    const secondRemainder =
      (
        secondSum *
        10
      ) %
      11;

    const secondVerifier =
      secondRemainder === 10
        ? 0
        : secondRemainder;

    return (
      secondVerifier ===
      digits[10]
    );
  }

  private async ensureCpfIsAvailable(
    organizationId: string,
    cpf: string | null,
    currentPatientId?: string,
  ): Promise<void> {
    if (
      !cpf
    ) {
      return;
    }

    const existingPatient =
      await this
        .patientsRepository
        .findByCpf(
          organizationId,
          cpf,
        );

    if (
      existingPatient &&
      existingPatient.id !==
        currentPatientId
    ) {
      throw new ConflictException(
        'Já existe um paciente com este CPF nesta organização.',
      );
    }
  }

  private normalizeEmail(
    email:
      string |
      null |
      undefined,
  ): string | null {
    if (
      email === undefined ||
      email === null
    ) {
      return null;
    }

    const normalized =
      email
        .trim()
        .toLowerCase();

    return normalized.length > 0
      ? normalized
      : null;
  }

  private normalizeOptionalText(
    value:
      string |
      null |
      undefined,
  ): string | null {
    if (
      value === undefined ||
      value === null
    ) {
      return null;
    }

    const normalized =
      value.trim();

    return normalized.length > 0
      ? normalized
      : null;
  }

  private async ensureEmailIsAvailable(
    organizationId: string,
    email: string | null,
    currentPatientId?: string,
  ): Promise<void> {
    if (
      !email
    ) {
      return;
    }

    const existingPatient =
      await this
        .patientsRepository
        .findByEmail(
          organizationId,
          email,
        );

    if (
      existingPatient &&
      existingPatient.id !==
        currentPatientId
    ) {
      throw new PatientEmailAlreadyExistsError();
    }
  }
}