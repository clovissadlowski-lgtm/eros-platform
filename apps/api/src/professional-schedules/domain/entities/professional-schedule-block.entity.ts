export enum ProfessionalScheduleBlockType {
  PERSONAL = 'PERSONAL',
  MEETING = 'MEETING',
  VACATION = 'VACATION',
  HOLIDAY = 'HOLIDAY',
  OTHER = 'OTHER',
}

export class ProfessionalScheduleBlock {
  id!: string;
  organizationId!: string;
  professionalScheduleId!: string;

  type!: ProfessionalScheduleBlockType;

  startsAt!: string;
  endsAt!: string;

  reason!: string | null;

  createdAt!: string;
  updatedAt!: string;
}