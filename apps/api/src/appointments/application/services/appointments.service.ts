import { Injectable } from '@nestjs/common';
import { randomUUID } from 'node:crypto';

import { PatientNotFoundError } from '../../../patients/domain/errors/patient-not-found.error';
import { PatientsRepository } from '../../../patients/domain/repositories/patients.repository';
import {
  MembershipRole,
  MembershipStatus,
} from '../../../users/domain/entities/membership.entity';
import { MembershipsRepository } from '../../../users/domain/repositories/memberships.repository';
import {
  Appointment,
  AppointmentStatus,
  AppointmentType,
} from '../../domain/entities/appointment.entity';
import { AppointmentCancellationReasonRequiredError } from '../../domain/errors/appointment-cancellation-reason-required.error';
import { AppointmentNotFoundError } from '../../domain/errors/appointment-not-found.error';
import { AppointmentScheduleConflictError } from '../../domain/errors/appointment-schedule-conflict.error';
import { InvalidAppointmentDateError } from '../../domain/errors/invalid-appointment-date.error';
import { InvalidAppointmentDurationError } from '../../domain/errors/invalid-appointment-duration.error';
import { InvalidAppointmentProfessionalError } from '../../domain/errors/invalid-appointment-professional.error';
import { InvalidAppointmentStatusTransitionError } from '../../domain/errors/invalid-appointment-status-transition.error';
import {
  AppointmentsRepository,
  ListAppointmentsFilters,
} from '../../domain/repositories/appointments.repository';

export interface CreateAppointmentInput {
  patientId: string;
  professionalMembershipId: string;
  type: AppointmentType;
  scheduledAt: string;
  durationMinutes: number;
  reason?: string;
  notes?: string;
}

export interface UpdateAppointmentInput {
  patientId?: string;
  professionalMembershipId?: string;
  type?: AppointmentType;
  scheduledAt?: string;
  durationMinutes?: number;
  reason?: string;
  notes?: string;
}

export interface UpdateAppointmentStatusInput {
  status: AppointmentStatus;
  cancellationReason?: string;
}

interface EnsureScheduleIsAvailableInput {
  organizationId: string;
  professionalMembershipId: string;
  scheduledAt: string;
  durationMinutes: number;
  ignoredAppointmentId?: string;
}

@Injectable()
export class AppointmentsService {
  constructor(
    private readonly appointmentsRepository:
      AppointmentsRepository,
    private readonly patientsRepository:
      PatientsRepository,
    private readonly membershipsRepository:
      MembershipsRepository,
  ) {}

  async createAppointment(
    organizationId: string,
    input: CreateAppointmentInput,
  ): Promise<Appointment> {
    await this.ensurePatientExists(
      organizationId,
      input.patientId,
    );

    await this.ensureProfessionalIsValid(
      organizationId,
      input.professionalMembershipId,
    );

    this.ensureScheduledAtIsValid(
      input.scheduledAt,
    );

    this.ensureDurationIsValid(
      input.durationMinutes,
    );

    await this.ensureScheduleIsAvailable({
      organizationId,
      professionalMembershipId:
        input.professionalMembershipId,
      scheduledAt:
        input.scheduledAt,
      durationMinutes:
        input.durationMinutes,
    });

    const timestamp =
      new Date().toISOString();

    const appointment: Appointment = {
      id: randomUUID(),
      organizationId,
      patientId: input.patientId,
      professionalMembershipId:
        input.professionalMembershipId,
      type: input.type,
      status:
        AppointmentStatus.SCHEDULED,
      scheduledAt: new Date(
        input.scheduledAt,
      ).toISOString(),
      durationMinutes:
        input.durationMinutes,
      reason:
        this.normalizeOptionalText(
          input.reason,
        ),
      notes:
        this.normalizeOptionalText(
          input.notes,
        ),
      completedAt: null,
      cancelledAt: null,
      cancellationReason: null,
      createdAt: timestamp,
      updatedAt: timestamp,
    };

    return this.appointmentsRepository.create(
      appointment,
    );
  }

  async getAppointmentById(
    appointmentId: string,
    organizationId: string,
  ): Promise<Appointment> {
    const appointment =
      await this.appointmentsRepository.findById(
        organizationId,
        appointmentId,
      );

    if (!appointment) {
      throw new AppointmentNotFoundError();
    }

    return appointment;
  }

  async listAppointments(
    organizationId: string,
    filters: ListAppointmentsFilters = {},
  ): Promise<Appointment[]> {
    return this.appointmentsRepository.listByOrganization(
      organizationId,
      filters,
    );
  }

  async updateAppointment(
    appointmentId: string,
    organizationId: string,
    input: UpdateAppointmentInput,
  ): Promise<Appointment> {
    const appointment =
      await this.getAppointmentById(
        appointmentId,
        organizationId,
      );

    this.ensureAppointmentCanBeEdited(
      appointment,
    );

    const patientId =
      input.patientId ??
      appointment.patientId;

    const professionalMembershipId =
      input.professionalMembershipId ??
      appointment.professionalMembershipId;

    const scheduledAt =
      input.scheduledAt ??
      appointment.scheduledAt;

    const durationMinutes =
      input.durationMinutes ??
      appointment.durationMinutes;

    if (
      input.patientId !== undefined
    ) {
      await this.ensurePatientExists(
        organizationId,
        patientId,
      );
    }

    if (
      input.professionalMembershipId !==
      undefined
    ) {
      await this.ensureProfessionalIsValid(
        organizationId,
        professionalMembershipId,
      );
    }

    if (
      input.scheduledAt !== undefined
    ) {
      this.ensureScheduledAtIsValid(
        scheduledAt,
      );
    }

    if (
      input.durationMinutes !== undefined
    ) {
      this.ensureDurationIsValid(
        durationMinutes,
      );
    }

    await this.ensureScheduleIsAvailable({
      organizationId,
      professionalMembershipId,
      scheduledAt,
      durationMinutes,
      ignoredAppointmentId:
        appointment.id,
    });

    const updatedAppointment: Appointment = {
      ...appointment,
      patientId,
      professionalMembershipId,
      type:
        input.type ??
        appointment.type,
      scheduledAt: new Date(
        scheduledAt,
      ).toISOString(),
      durationMinutes,
      reason:
        input.reason !== undefined
          ? this.normalizeOptionalText(
              input.reason,
            )
          : appointment.reason,
      notes:
        input.notes !== undefined
          ? this.normalizeOptionalText(
              input.notes,
            )
          : appointment.notes,
      updatedAt:
        new Date().toISOString(),
    };

    return this.appointmentsRepository.update(
      updatedAppointment,
    );
  }

  async updateAppointmentStatus(
    appointmentId: string,
    organizationId: string,
    input: UpdateAppointmentStatusInput,
  ): Promise<Appointment> {
    const appointment =
      await this.getAppointmentById(
        appointmentId,
        organizationId,
      );

    this.ensureStatusTransitionIsValid(
      appointment.status,
      input.status,
    );

    const timestamp =
      new Date().toISOString();

    const cancellationReason =
      this.normalizeOptionalText(
        input.cancellationReason,
      );

    if (
      input.status ===
        AppointmentStatus.CANCELLED &&
      !cancellationReason
    ) {
      throw new AppointmentCancellationReasonRequiredError();
    }

    const updatedAppointment: Appointment = {
      ...appointment,
      status: input.status,
      completedAt:
        input.status ===
        AppointmentStatus.COMPLETED
          ? timestamp
          : appointment.completedAt,
      cancelledAt:
        input.status ===
        AppointmentStatus.CANCELLED
          ? timestamp
          : appointment.cancelledAt,
      cancellationReason:
        input.status ===
        AppointmentStatus.CANCELLED
          ? cancellationReason
          : appointment.cancellationReason,
      updatedAt: timestamp,
    };

    return this.appointmentsRepository.update(
      updatedAppointment,
    );
  }

  private async ensurePatientExists(
    organizationId: string,
    patientId: string,
  ): Promise<void> {
    const patient =
      await this.patientsRepository.findById(
        organizationId,
        patientId,
      );

    if (!patient) {
      throw new PatientNotFoundError();
    }
  }

  private async ensureProfessionalIsValid(
    organizationId: string,
    professionalMembershipId: string,
  ): Promise<void> {
    const membership =
      await this.membershipsRepository.findById(
        professionalMembershipId,
      );

    const allowedRoles: MembershipRole[] = [
      MembershipRole.OWNER,
      MembershipRole.ADMIN,
      MembershipRole.NUTRITIONIST,
    ];

    const isValid =
      membership !== null &&
      membership.organizationId ===
        organizationId &&
      membership.status ===
        MembershipStatus.ACTIVE &&
      allowedRoles.includes(
        membership.role,
      );

    if (!isValid) {
      throw new InvalidAppointmentProfessionalError();
    }
  }

  private ensureScheduledAtIsValid(
    scheduledAt: string,
  ): void {
    const scheduledTimestamp =
      new Date(
        scheduledAt,
      ).getTime();

    const isValid =
      Number.isFinite(
        scheduledTimestamp,
      ) &&
      scheduledTimestamp > Date.now();

    if (!isValid) {
      throw new InvalidAppointmentDateError();
    }
  }

  private ensureDurationIsValid(
    durationMinutes: number,
  ): void {
    const isValid =
      Number.isInteger(
        durationMinutes,
      ) &&
      durationMinutes >= 15 &&
      durationMinutes <= 480;

    if (!isValid) {
      throw new InvalidAppointmentDurationError();
    }
  }

  private ensureAppointmentCanBeEdited(
    appointment: Appointment,
  ): void {
    const finalStatuses:
      AppointmentStatus[] = [
        AppointmentStatus.COMPLETED,
        AppointmentStatus.CANCELLED,
        AppointmentStatus.NO_SHOW,
      ];

    if (
      finalStatuses.includes(
        appointment.status,
      )
    ) {
      throw new InvalidAppointmentStatusTransitionError();
    }
  }

  private ensureStatusTransitionIsValid(
    currentStatus: AppointmentStatus,
    nextStatus: AppointmentStatus,
  ): void {
    const allowedTransitions: Record<
      AppointmentStatus,
      AppointmentStatus[]
    > = {
      [AppointmentStatus.SCHEDULED]: [
        AppointmentStatus.CONFIRMED,
        AppointmentStatus.CANCELLED,
        AppointmentStatus.NO_SHOW,
      ],

      [AppointmentStatus.CONFIRMED]: [
        AppointmentStatus.IN_PROGRESS,
        AppointmentStatus.CANCELLED,
        AppointmentStatus.NO_SHOW,
      ],

      [AppointmentStatus.IN_PROGRESS]: [
        AppointmentStatus.COMPLETED,
        AppointmentStatus.CANCELLED,
      ],

      [AppointmentStatus.COMPLETED]: [],

      [AppointmentStatus.CANCELLED]: [],

      [AppointmentStatus.NO_SHOW]: [],
    };

    const isAllowed =
      allowedTransitions[
        currentStatus
      ].includes(
        nextStatus,
      );

    if (!isAllowed) {
      throw new InvalidAppointmentStatusTransitionError();
    }
  }

  private async ensureScheduleIsAvailable(
    input: EnsureScheduleIsAvailableInput,
  ): Promise<void> {
    const scheduledStart =
      new Date(
        input.scheduledAt,
      );

    const scheduledEnd =
      new Date(
        scheduledStart.getTime() +
          input.durationMinutes *
            60_000,
      );

    const conflict =
      await this.appointmentsRepository.findScheduleConflict(
        {
          organizationId:
            input.organizationId,
          professionalMembershipId:
            input.professionalMembershipId,
          scheduledStart:
            scheduledStart.toISOString(),
          scheduledEnd:
            scheduledEnd.toISOString(),
          ignoredAppointmentId:
            input.ignoredAppointmentId,
        },
      );

    if (conflict) {
      throw new AppointmentScheduleConflictError();
    }
  }

  private normalizeOptionalText(
    value: string | undefined,
  ): string | null {
    if (value === undefined) {
      return null;
    }

    const normalizedValue =
      value.trim();

    return normalizedValue.length > 0
      ? normalizedValue
      : null;
  }
}