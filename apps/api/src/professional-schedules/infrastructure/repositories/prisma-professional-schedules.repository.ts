import { Injectable } from '@nestjs/common';

import { PrismaService } from '../../../common/database/prisma.service';
import {
  ProfessionalSchedule as PrismaProfessionalSchedule,
  ProfessionalScheduleStatus as PrismaProfessionalScheduleStatus,
} from '../../../generated/prisma/client';
import {
  ProfessionalSchedule,
  ProfessionalScheduleStatus,
} from '../../domain/entities/professional-schedule.entity';
import { ProfessionalSchedulesRepository } from '../../domain/repositories/professional-schedules.repository';

@Injectable()
export class PrismaProfessionalSchedulesRepository
  implements ProfessionalSchedulesRepository
{
  constructor(
    private readonly prisma: PrismaService,
  ) {}

  async create(
    schedule: ProfessionalSchedule,
  ): Promise<ProfessionalSchedule> {
    const createdSchedule =
      await this.prisma.professionalSchedule.create({
        data: {
          id: schedule.id,
          organizationId:
            schedule.organizationId,
          professionalMembershipId:
            schedule.professionalMembershipId,
          timeZone: schedule.timeZone,
          slotIntervalMinutes:
            schedule.slotIntervalMinutes,
          status:
            schedule.status as PrismaProfessionalScheduleStatus,
          createdAt: new Date(
            schedule.createdAt,
          ),
          updatedAt: new Date(
            schedule.updatedAt,
          ),
        },
      });

    return this.toDomain(
      createdSchedule,
    );
  }

  async findById(
    organizationId: string,
    scheduleId: string,
  ): Promise<ProfessionalSchedule | null> {
    const schedule =
      await this.prisma.professionalSchedule.findFirst({
        where: {
          id: scheduleId,
          organizationId,
        },
      });

    return schedule
      ? this.toDomain(schedule)
      : null;
  }

  async findByProfessional(
    organizationId: string,
    professionalMembershipId: string,
  ): Promise<ProfessionalSchedule | null> {
    const schedule =
      await this.prisma.professionalSchedule.findUnique({
        where: {
          organizationId_professionalMembershipId: {
            organizationId,
            professionalMembershipId,
          },
        },
      });

    return schedule
      ? this.toDomain(schedule)
      : null;
  }

  async update(
    schedule: ProfessionalSchedule,
  ): Promise<ProfessionalSchedule> {
    const updatedSchedule =
      await this.prisma.professionalSchedule.update({
        where: {
          id: schedule.id,
        },
        data: {
          timeZone: schedule.timeZone,
          slotIntervalMinutes:
            schedule.slotIntervalMinutes,
          status:
            schedule.status as PrismaProfessionalScheduleStatus,
          updatedAt: new Date(
            schedule.updatedAt,
          ),
        },
      });

    return this.toDomain(
      updatedSchedule,
    );
  }

  private toDomain(
    schedule: PrismaProfessionalSchedule,
  ): ProfessionalSchedule {
    return {
      id: schedule.id,
      organizationId:
        schedule.organizationId,
      professionalMembershipId:
        schedule.professionalMembershipId,
      timeZone: schedule.timeZone,
      slotIntervalMinutes:
        schedule.slotIntervalMinutes,
      status:
        schedule.status as ProfessionalScheduleStatus,
      createdAt:
        schedule.createdAt.toISOString(),
      updatedAt:
        schedule.updatedAt.toISOString(),
    };
  }
}