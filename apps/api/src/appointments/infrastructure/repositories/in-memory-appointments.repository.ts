import {
  Appointment,
  AppointmentStatus,
} from '../../domain/entities/appointment.entity';
import {
  AppointmentsRepository,
  FindScheduleConflictInput,
  ListAppointmentsFilters,
  ListProfessionalAppointmentsInput,
} from '../../domain/repositories/appointments.repository';

export class InMemoryAppointmentsRepository
  implements AppointmentsRepository
{
  private readonly appointments:
    Appointment[] = [];

  async create(
    appointment: Appointment,
  ): Promise<Appointment> {
    const storedAppointment = {
      ...appointment,
    };

    this.appointments.push(
      storedAppointment,
    );

    return {
      ...storedAppointment,
    };
  }

  async findById(
    organizationId: string,
    appointmentId: string,
  ): Promise<Appointment | null> {
    const appointment =
      this.appointments.find(
        (storedAppointment) =>
          storedAppointment.id ===
            appointmentId &&
          storedAppointment.organizationId ===
            organizationId,
      );

    return appointment
      ? {
          ...appointment,
        }
      : null;
  }

  async listByOrganization(
    organizationId: string,
    filters: ListAppointmentsFilters = {},
  ): Promise<Appointment[]> {
    return this.appointments
      .filter(
        (appointment) =>
          appointment.organizationId ===
          organizationId,
      )
      .filter(
        (appointment) =>
          !filters.patientId ||
          appointment.patientId ===
            filters.patientId,
      )
      .filter(
        (appointment) =>
          !filters.professionalMembershipId ||
          appointment
            .professionalMembershipId ===
            filters.professionalMembershipId,
      )
      .filter(
        (appointment) =>
          !filters.status ||
          appointment.status ===
            filters.status,
      )
      .filter(
        (appointment) =>
          !filters.scheduledFrom ||
          new Date(
            appointment.scheduledAt,
          ).getTime() >=
            new Date(
              filters.scheduledFrom,
            ).getTime(),
      )
      .filter(
        (appointment) =>
          !filters.scheduledTo ||
          new Date(
            appointment.scheduledAt,
          ).getTime() <=
            new Date(
              filters.scheduledTo,
            ).getTime(),
      )
      .sort(
        (
          firstAppointment,
          secondAppointment,
        ) =>
          new Date(
            firstAppointment.scheduledAt,
          ).getTime() -
          new Date(
            secondAppointment.scheduledAt,
          ).getTime(),
      )
      .map((appointment) => ({
        ...appointment,
      }));
  }

async listBlockingProfessionalAppointments(
  input: ListProfessionalAppointmentsInput,
): Promise<Appointment[]> {
  const scheduledFrom =
    new Date(
      input.scheduledFrom,
    ).getTime();

  const scheduledTo =
    new Date(
      input.scheduledTo,
    ).getTime();

  return this.appointments
    .filter(
      (appointment) =>
        appointment.organizationId ===
          input.organizationId &&
        appointment
          .professionalMembershipId ===
          input.professionalMembershipId,
    )
    .filter(
      (appointment) =>
        appointment.status !==
          AppointmentStatus.CANCELLED &&
        appointment.status !==
          AppointmentStatus.NO_SHOW,
    )
    .filter((appointment) => {
      const scheduledAt =
        new Date(
          appointment.scheduledAt,
        ).getTime();

      return (
        scheduledAt >= scheduledFrom &&
        scheduledAt < scheduledTo
      );
    })
    .sort(
      (
        firstAppointment,
        secondAppointment,
      ) =>
        new Date(
          firstAppointment.scheduledAt,
        ).getTime() -
        new Date(
          secondAppointment.scheduledAt,
        ).getTime(),
    )
    .map((appointment) => ({
      ...appointment,
    }));
  }

  async findScheduleConflict(
    input: FindScheduleConflictInput,
  ): Promise<Appointment | null> {
    const requestedStart =
      new Date(
        input.scheduledStart,
      ).getTime();

    const requestedEnd =
      new Date(
        input.scheduledEnd,
      ).getTime();

    const conflictingAppointment =
      this.appointments.find(
        (storedAppointment) => {
          const belongsToOrganization =
            storedAppointment.organizationId ===
            input.organizationId;

          const belongsToProfessional =
            storedAppointment
              .professionalMembershipId ===
            input.professionalMembershipId;

          if (
            !belongsToOrganization ||
            !belongsToProfessional
          ) {
            return false;
          }

          if (
            input.ignoredAppointmentId &&
            storedAppointment.id ===
              input.ignoredAppointmentId
          ) {
            return false;
          }

          const doesNotBlockSchedule =
            storedAppointment.status ===
              AppointmentStatus.CANCELLED ||
            storedAppointment.status ===
              AppointmentStatus.NO_SHOW;

          if (doesNotBlockSchedule) {
            return false;
          }

          const storedStart =
            new Date(
              storedAppointment.scheduledAt,
            ).getTime();

          const storedEnd =
            storedStart +
            storedAppointment.durationMinutes *
              60_000;

          return (
            storedStart < requestedEnd &&
            storedEnd > requestedStart
          );
        },
      );

    return conflictingAppointment
      ? {
          ...conflictingAppointment,
        }
      : null;
  }

  async update(
    appointment: Appointment,
  ): Promise<Appointment> {
    const appointmentIndex =
      this.appointments.findIndex(
        (storedAppointment) =>
          storedAppointment.id ===
            appointment.id &&
          storedAppointment.organizationId ===
            appointment.organizationId,
      );

    if (appointmentIndex < 0) {
      throw new Error(
        'Appointment not found in memory repository.',
      );
    }

    const updatedAppointment = {
      ...appointment,
    };

    this.appointments[
      appointmentIndex
    ] = updatedAppointment;

    return {
      ...updatedAppointment,
    };
  }
}