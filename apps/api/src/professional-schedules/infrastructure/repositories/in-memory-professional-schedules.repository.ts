import { ProfessionalSchedule } from '../../domain/entities/professional-schedule.entity';
import { ProfessionalSchedulesRepository } from '../../domain/repositories/professional-schedules.repository';

export class InMemoryProfessionalSchedulesRepository
  implements ProfessionalSchedulesRepository
{
  private readonly schedules:
    ProfessionalSchedule[] = [];

  async create(
    schedule: ProfessionalSchedule,
  ): Promise<ProfessionalSchedule> {
    const storedSchedule = {
      ...schedule,
    };

    this.schedules.push(
      storedSchedule,
    );

    return {
      ...storedSchedule,
    };
  }

  async findById(
    organizationId: string,
    scheduleId: string,
  ): Promise<ProfessionalSchedule | null> {
    const schedule =
      this.schedules.find(
        (storedSchedule) =>
          storedSchedule.id ===
            scheduleId &&
          storedSchedule.organizationId ===
            organizationId,
      );

    return schedule
      ? {
          ...schedule,
        }
      : null;
  }

  async findByProfessional(
    organizationId: string,
    professionalMembershipId: string,
  ): Promise<ProfessionalSchedule | null> {
    const schedule =
      this.schedules.find(
        (storedSchedule) =>
          storedSchedule.organizationId ===
            organizationId &&
          storedSchedule
            .professionalMembershipId ===
            professionalMembershipId,
      );

    return schedule
      ? {
          ...schedule,
        }
      : null;
  }

  async update(
    schedule: ProfessionalSchedule,
  ): Promise<ProfessionalSchedule> {
    const scheduleIndex =
      this.schedules.findIndex(
        (storedSchedule) =>
          storedSchedule.id ===
            schedule.id &&
          storedSchedule.organizationId ===
            schedule.organizationId,
      );

    if (scheduleIndex < 0) {
      throw new Error(
        'Professional schedule not found in memory repository.',
      );
    }

    const updatedSchedule = {
      ...schedule,
    };

    this.schedules[
      scheduleIndex
    ] = updatedSchedule;

    return {
      ...updatedSchedule,
    };
  }
}