import {
  Appointment,
  AppointmentStatus,
} from '../entities/appointment.entity';

export interface ListAppointmentsFilters {
  patientId?: string;
  professionalMembershipId?: string;
  status?: AppointmentStatus;
  scheduledFrom?: string;
  scheduledTo?: string;
}

export interface FindScheduleConflictInput {
  organizationId: string;
  professionalMembershipId: string;
  scheduledStart: string;
  scheduledEnd: string;
  ignoredAppointmentId?: string;
}

export interface ListProfessionalAppointmentsInput {
  organizationId: string;
  professionalMembershipId: string;
  scheduledFrom: string;
  scheduledTo: string;
}

export abstract class AppointmentsRepository {
  abstract create(
    appointment: Appointment,
  ): Promise<Appointment>;

  abstract findById(
    organizationId: string,
    appointmentId: string,
  ): Promise<Appointment | null>;

  abstract listByOrganization(
    organizationId: string,
    filters?: ListAppointmentsFilters,
  ): Promise<Appointment[]>;

  abstract listBlockingProfessionalAppointments(
    input: ListProfessionalAppointmentsInput,
  ): Promise<Appointment[]>;

  abstract findScheduleConflict(
    input: FindScheduleConflictInput,
  ): Promise<Appointment | null>;

  abstract update(
    appointment: Appointment,
  ): Promise<Appointment>;
}