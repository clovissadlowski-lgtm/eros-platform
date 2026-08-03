export enum ProfessionalScheduleStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
}

export class ProfessionalSchedule {
  id!: string;
  organizationId!: string;
  professionalMembershipId!: string;
  timeZone!: string;
  slotIntervalMinutes!: number;
  status!: ProfessionalScheduleStatus;
  createdAt!: string;
  updatedAt!: string;
}