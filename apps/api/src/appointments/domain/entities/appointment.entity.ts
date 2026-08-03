export enum AppointmentType {
  INITIAL = 'INITIAL',
  FOLLOW_UP = 'FOLLOW_UP',
  REVIEW = 'REVIEW',
  OTHER = 'OTHER',
}

export enum AppointmentStatus {
  SCHEDULED = 'SCHEDULED',
  CONFIRMED = 'CONFIRMED',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
  NO_SHOW = 'NO_SHOW',
}

export class Appointment {
  id!: string;
  organizationId!: string;
  patientId!: string;
  professionalMembershipId!: string;

  type!: AppointmentType;
  status!: AppointmentStatus;

  scheduledAt!: string;
  durationMinutes!: number;

  reason!: string | null;
  notes!: string | null;

  completedAt!: string | null;
  cancelledAt!: string | null;
  cancellationReason!: string | null;

  createdAt!: string;
  updatedAt!: string;
}