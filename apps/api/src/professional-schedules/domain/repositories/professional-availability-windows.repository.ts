import {
  ProfessionalAvailabilityWindow,
  Weekday,
} from '../entities/professional-availability-window.entity';

export abstract class ProfessionalAvailabilityWindowsRepository {
  abstract createMany(
    windows: ProfessionalAvailabilityWindow[],
  ): Promise<ProfessionalAvailabilityWindow[]>;

  abstract listBySchedule(
    organizationId: string,
    professionalScheduleId: string,
  ): Promise<ProfessionalAvailabilityWindow[]>;

  abstract listByScheduleAndWeekday(
    organizationId: string,
    professionalScheduleId: string,
    weekday: Weekday,
  ): Promise<ProfessionalAvailabilityWindow[]>;

  abstract replaceForSchedule(
    organizationId: string,
    professionalScheduleId: string,
    windows: ProfessionalAvailabilityWindow[],
  ): Promise<ProfessionalAvailabilityWindow[]>;
}