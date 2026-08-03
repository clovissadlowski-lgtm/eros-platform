import { ProfessionalSchedule } from '../entities/professional-schedule.entity';

export abstract class ProfessionalSchedulesRepository {
  abstract create(
    schedule: ProfessionalSchedule,
  ): Promise<ProfessionalSchedule>;

  abstract findById(
    organizationId: string,
    scheduleId: string,
  ): Promise<ProfessionalSchedule | null>;

  abstract findByProfessional(
    organizationId: string,
    professionalMembershipId: string,
  ): Promise<ProfessionalSchedule | null>;

  abstract update(
    schedule: ProfessionalSchedule,
  ): Promise<ProfessionalSchedule>;
}