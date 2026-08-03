import { Injectable } from '@nestjs/common';

import { PrismaService } from '../../../common/database/prisma.service';
import {
  Appointment as PrismaAppointment,
  AppointmentStatus as PrismaAppointmentStatus,
  AppointmentType as PrismaAppointmentType,
} from '../../../generated/prisma/client';
import {
  Appointment,
  AppointmentStatus,
  AppointmentType,
} from '../../domain/entities/appointment.entity';
import {
  AppointmentsRepository,
  FindScheduleConflictInput,
  ListAppointmentsFilters,
  ListProfessionalAppointmentsInput,
} from '../../domain/repositories/appointments.repository';

@Injectable()
export class PrismaAppointmentsRepository
  implements AppointmentsRepository
{
  constructor(
    private readonly prisma: PrismaService,
  ) {}

  async create(
    appointment: Appointment,
  ): Promise<Appointment> {
    const createdAppointment =
      await this.prisma.appointment.create({
        data: {
          id: appointment.id,
          organizationId:
            appointment.organizationId,
          patientId:
            appointment.patientId,
          professionalMembershipId:
            appointment.professionalMembershipId,
          type:
            appointment.type as PrismaAppointmentType,
          status:
            appointment.status as PrismaAppointmentStatus,
          scheduledAt: new Date(
            appointment.scheduledAt,
          ),
          durationMinutes:
            appointment.durationMinutes,
          reason: appointment.reason,
          notes: appointment.notes,
          completedAt:
            this.toDatabaseDate(
              appointment.completedAt,
            ),
          cancelledAt:
            this.toDatabaseDate(
              appointment.cancelledAt,
            ),
          cancellationReason:
            appointment.cancellationReason,
          createdAt: new Date(
            appointment.createdAt,
          ),
          updatedAt: new Date(
            appointment.updatedAt,
          ),
        },
      });

    return this.toDomain(
      createdAppointment,
    );
  }

  async findById(
    organizationId: string,
    appointmentId: string,
  ): Promise<Appointment | null> {
    const appointment =
      await this.prisma.appointment.findFirst({
        where: {
          id: appointmentId,
          organizationId,
        },
      });

    return appointment
      ? this.toDomain(appointment)
      : null;
  }

  async listByOrganization(
    organizationId: string,
    filters: ListAppointmentsFilters = {},
  ): Promise<Appointment[]> {
    const scheduledAtFilter =
      filters.scheduledFrom ||
      filters.scheduledTo
        ? {
            gte: filters.scheduledFrom
              ? new Date(
                  filters.scheduledFrom,
                )
              : undefined,
            lte: filters.scheduledTo
              ? new Date(
                  filters.scheduledTo,
                )
              : undefined,
          }
        : undefined;

    const appointments =
      await this.prisma.appointment.findMany({
        where: {
          organizationId,
          patientId:
            filters.patientId,
          professionalMembershipId:
            filters.professionalMembershipId,
          status: filters.status
            ? (filters.status as PrismaAppointmentStatus)
            : undefined,
          scheduledAt:
            scheduledAtFilter,
        },
        orderBy: {
          scheduledAt: 'asc',
        },
      });

    return appointments.map(
      (appointment) =>
        this.toDomain(appointment),
    );
  }

  async listBlockingProfessionalAppointments(
  input: ListProfessionalAppointmentsInput,
): Promise<Appointment[]> {
  const appointments =
    await this.prisma.appointment.findMany({
      where: {
        organizationId:
          input.organizationId,
        professionalMembershipId:
          input.professionalMembershipId,
        status: {
          notIn: [
            PrismaAppointmentStatus.CANCELLED,
            PrismaAppointmentStatus.NO_SHOW,
          ],
        },
        scheduledAt: {
          gte: new Date(
            input.scheduledFrom,
          ),
          lt: new Date(
            input.scheduledTo,
          ),
        },
      },
      orderBy: {
        scheduledAt: 'asc',
      },
    });

  return appointments.map(
    (appointment) =>
      this.toDomain(appointment),
  );
}

  async findScheduleConflict(
    input: FindScheduleConflictInput,
  ): Promise<Appointment | null> {
    const requestedStart =
      new Date(
        input.scheduledStart,
      );

    const requestedEnd =
      new Date(
        input.scheduledEnd,
      );

    const possibleAppointments =
      await this.prisma.appointment.findMany({
        where: {
          organizationId:
            input.organizationId,
          professionalMembershipId:
            input.professionalMembershipId,
          id: input.ignoredAppointmentId
            ? {
                not:
                  input.ignoredAppointmentId,
              }
            : undefined,
          status: {
            notIn: [
              PrismaAppointmentStatus.CANCELLED,
              PrismaAppointmentStatus.NO_SHOW,
            ],
          },
          scheduledAt: {
            lt: requestedEnd,
          },
        },
        orderBy: {
          scheduledAt: 'asc',
        },
      });

    const conflictingAppointment =
      possibleAppointments.find(
        (appointment) => {
          const existingStart =
            appointment.scheduledAt.getTime();

          const existingEnd =
            existingStart +
            appointment.durationMinutes *
              60_000;

          return (
            existingStart <
              requestedEnd.getTime() &&
            existingEnd >
              requestedStart.getTime()
          );
        },
      );

    return conflictingAppointment
      ? this.toDomain(
          conflictingAppointment,
        )
      : null;
  }

  async update(
    appointment: Appointment,
  ): Promise<Appointment> {
    const updatedAppointment =
      await this.prisma.appointment.update({
        where: {
          id: appointment.id,
        },
        data: {
          patientId:
            appointment.patientId,
          professionalMembershipId:
            appointment.professionalMembershipId,
          type:
            appointment.type as PrismaAppointmentType,
          status:
            appointment.status as PrismaAppointmentStatus,
          scheduledAt: new Date(
            appointment.scheduledAt,
          ),
          durationMinutes:
            appointment.durationMinutes,
          reason: appointment.reason,
          notes: appointment.notes,
          completedAt:
            this.toDatabaseDate(
              appointment.completedAt,
            ),
          cancelledAt:
            this.toDatabaseDate(
              appointment.cancelledAt,
            ),
          cancellationReason:
            appointment.cancellationReason,
          updatedAt: new Date(
            appointment.updatedAt,
          ),
        },
      });

    return this.toDomain(
      updatedAppointment,
    );
  }

  private toDomain(
    appointment: PrismaAppointment,
  ): Appointment {
    return {
      id: appointment.id,
      organizationId:
        appointment.organizationId,
      patientId:
        appointment.patientId,
      professionalMembershipId:
        appointment.professionalMembershipId,
      type:
        appointment.type as AppointmentType,
      status:
        appointment.status as AppointmentStatus,
      scheduledAt:
        appointment.scheduledAt.toISOString(),
      durationMinutes:
        appointment.durationMinutes,
      reason: appointment.reason,
      notes: appointment.notes,
      completedAt:
        appointment.completedAt
          ?.toISOString() ?? null,
      cancelledAt:
        appointment.cancelledAt
          ?.toISOString() ?? null,
      cancellationReason:
        appointment.cancellationReason,
      createdAt:
        appointment.createdAt.toISOString(),
      updatedAt:
        appointment.updatedAt.toISOString(),
    };
  }

  private toDatabaseDate(
    value: string | null,
  ): Date | null {
    return value
      ? new Date(value)
      : null;
  }
}