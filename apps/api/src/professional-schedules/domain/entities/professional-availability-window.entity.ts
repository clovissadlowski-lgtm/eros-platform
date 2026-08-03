export enum Weekday {
  MONDAY = 'MONDAY',
  TUESDAY = 'TUESDAY',
  WEDNESDAY = 'WEDNESDAY',
  THURSDAY = 'THURSDAY',
  FRIDAY = 'FRIDAY',
  SATURDAY = 'SATURDAY',
  SUNDAY = 'SUNDAY',
}

export class ProfessionalAvailabilityWindow {
  id!: string;
  organizationId!: string;
  professionalScheduleId!: string;
  weekday!: Weekday;
  startMinute!: number;
  endMinute!: number;
  createdAt!: string;
  updatedAt!: string;
}