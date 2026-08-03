import {
  ProfessionalAvailabilityWindow,
  Weekday,
} from '../../domain/entities/professional-availability-window.entity';
import { ProfessionalAvailabilityWindowsRepository } from '../../domain/repositories/professional-availability-windows.repository';

export class InMemoryProfessionalAvailabilityWindowsRepository
  implements ProfessionalAvailabilityWindowsRepository
{
  private windows:
    ProfessionalAvailabilityWindow[] = [];

  async createMany(
    windows: ProfessionalAvailabilityWindow[],
  ): Promise<ProfessionalAvailabilityWindow[]> {
    const storedWindows =
      windows.map((window) => ({
        ...window,
      }));

    this.windows.push(
      ...storedWindows,
    );

    return this.sortWindows(
      storedWindows,
    );
  }

  async listBySchedule(
    organizationId: string,
    professionalScheduleId: string,
  ): Promise<ProfessionalAvailabilityWindow[]> {
    const windows =
      this.windows.filter(
        (window) =>
          window.organizationId ===
            organizationId &&
          window.professionalScheduleId ===
            professionalScheduleId,
      );

    return this.sortWindows(
      windows,
    );
  }

  async listByScheduleAndWeekday(
    organizationId: string,
    professionalScheduleId: string,
    weekday: Weekday,
  ): Promise<ProfessionalAvailabilityWindow[]> {
    return this.windows
      .filter(
        (window) =>
          window.organizationId ===
            organizationId &&
          window.professionalScheduleId ===
            professionalScheduleId &&
          window.weekday === weekday,
      )
      .sort(
        (firstWindow, secondWindow) =>
          firstWindow.startMinute -
          secondWindow.startMinute,
      )
      .map((window) => ({
        ...window,
      }));
  }

  async replaceForSchedule(
    organizationId: string,
    professionalScheduleId: string,
    windows: ProfessionalAvailabilityWindow[],
  ): Promise<ProfessionalAvailabilityWindow[]> {
    this.windows =
      this.windows.filter(
        (window) =>
          !(
            window.organizationId ===
              organizationId &&
            window.professionalScheduleId ===
              professionalScheduleId
          ),
      );

    const storedWindows =
      windows.map((window) => ({
        ...window,
      }));

    this.windows.push(
      ...storedWindows,
    );

    return this.sortWindows(
      storedWindows,
    );
  }

  private sortWindows(
    windows: ProfessionalAvailabilityWindow[],
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
      .map((window) => ({
        ...window,
      }));
  }

  private getWeekdayOrder(
    weekday: Weekday,
  ): number {
    const weekdayOrder: Record<
      Weekday,
      number
    > = {
      [Weekday.MONDAY]: 1,
      [Weekday.TUESDAY]: 2,
      [Weekday.WEDNESDAY]: 3,
      [Weekday.THURSDAY]: 4,
      [Weekday.FRIDAY]: 5,
      [Weekday.SATURDAY]: 6,
      [Weekday.SUNDAY]: 7,
    };

    return weekdayOrder[
      weekday
    ];
  }
}