import { Injectable } from '@nestjs/common';

import { PrismaService } from '../../../common/database/prisma.service';
import {
  ProfessionalAvailabilityWindow as PrismaProfessionalAvailabilityWindow,
  Weekday as PrismaWeekday,
} from '../../../generated/prisma/client';
import {
  ProfessionalAvailabilityWindow,
  Weekday,
} from '../../domain/entities/professional-availability-window.entity';
import { ProfessionalAvailabilityWindowsRepository } from '../../domain/repositories/professional-availability-windows.repository';

@Injectable()
export class PrismaProfessionalAvailabilityWindowsRepository
  implements ProfessionalAvailabilityWindowsRepository
{
  constructor(
    private readonly prisma: PrismaService,
  ) {}

  async createMany(
    windows: ProfessionalAvailabilityWindow[],
  ): Promise<ProfessionalAvailabilityWindow[]> {
    if (windows.length === 0) {
      return [];
    }

    await this.prisma.professionalAvailabilityWindow.createMany({
      data: windows.map((window) => ({
        id: window.id,
        organizationId:
          window.organizationId,
        professionalScheduleId:
          window.professionalScheduleId,
        weekday:
          window.weekday as PrismaWeekday,
        startMinute:
          window.startMinute,
        endMinute:
          window.endMinute,
        createdAt: new Date(
          window.createdAt,
        ),
        updatedAt: new Date(
          window.updatedAt,
        ),
      })),
    });

    const createdWindows =
      await this.prisma.professionalAvailabilityWindow.findMany({
        where: {
          id: {
            in: windows.map(
              (window) => window.id,
            ),
          },
        },
      });

    return this.sortAndMap(
      createdWindows,
    );
  }

  async listBySchedule(
    organizationId: string,
    professionalScheduleId: string,
  ): Promise<ProfessionalAvailabilityWindow[]> {
    const windows =
      await this.prisma.professionalAvailabilityWindow.findMany({
        where: {
          organizationId,
          professionalScheduleId,
        },
      });

    return this.sortAndMap(
      windows,
    );
  }

  async listByScheduleAndWeekday(
    organizationId: string,
    professionalScheduleId: string,
    weekday: Weekday,
  ): Promise<ProfessionalAvailabilityWindow[]> {
    const windows =
      await this.prisma.professionalAvailabilityWindow.findMany({
        where: {
          organizationId,
          professionalScheduleId,
          weekday:
            weekday as PrismaWeekday,
        },
        orderBy: {
          startMinute: 'asc',
        },
      });

    return windows.map(
      (window) =>
        this.toDomain(window),
    );
  }

  async replaceForSchedule(
    organizationId: string,
    professionalScheduleId: string,
    windows: ProfessionalAvailabilityWindow[],
  ): Promise<ProfessionalAvailabilityWindow[]> {
    return this.prisma.$transaction(
      async (transaction) => {
        await transaction.professionalAvailabilityWindow.deleteMany({
          where: {
            organizationId,
            professionalScheduleId,
          },
        });

        if (windows.length === 0) {
          return [];
        }

        await transaction.professionalAvailabilityWindow.createMany({
          data: windows.map((window) => ({
            id: window.id,
            organizationId:
              window.organizationId,
            professionalScheduleId:
              window.professionalScheduleId,
            weekday:
              window.weekday as PrismaWeekday,
            startMinute:
              window.startMinute,
            endMinute:
              window.endMinute,
            createdAt: new Date(
              window.createdAt,
            ),
            updatedAt: new Date(
              window.updatedAt,
            ),
          })),
        });

        const createdWindows =
          await transaction.professionalAvailabilityWindow.findMany({
            where: {
              organizationId,
              professionalScheduleId,
            },
          });

        return this.sortAndMap(
          createdWindows,
        );
      },
    );
  }

  private sortAndMap(
    windows: PrismaProfessionalAvailabilityWindow[],
  ): ProfessionalAvailabilityWindow[] {
    return [...windows]
      .sort(
        (
          firstWindow,
          secondWindow,
        ) => {
          const weekdayDifference =
            this.getWeekdayOrder(
              firstWindow.weekday,
            ) -
            this.getWeekdayOrder(
              secondWindow.weekday,
            );

          if (weekdayDifference !== 0) {
            return weekdayDifference;
          }

          return (
            firstWindow.startMinute -
            secondWindow.startMinute
          );
        },
      )
      .map((window) =>
        this.toDomain(window),
      );
  }

  private getWeekdayOrder(
    weekday: PrismaWeekday,
  ): number {
    const weekdayOrder: Record<
      PrismaWeekday,
      number
    > = {
      [PrismaWeekday.MONDAY]: 1,
      [PrismaWeekday.TUESDAY]: 2,
      [PrismaWeekday.WEDNESDAY]: 3,
      [PrismaWeekday.THURSDAY]: 4,
      [PrismaWeekday.FRIDAY]: 5,
      [PrismaWeekday.SATURDAY]: 6,
      [PrismaWeekday.SUNDAY]: 7,
    };

    return weekdayOrder[weekday];
  }

  private toDomain(
    window: PrismaProfessionalAvailabilityWindow,
  ): ProfessionalAvailabilityWindow {
    return {
      id: window.id,
      organizationId:
        window.organizationId,
      professionalScheduleId:
        window.professionalScheduleId,
      weekday:
        window.weekday as Weekday,
      startMinute:
        window.startMinute,
      endMinute:
        window.endMinute,
      createdAt:
        window.createdAt.toISOString(),
      updatedAt:
        window.updatedAt.toISOString(),
    };
  }
}