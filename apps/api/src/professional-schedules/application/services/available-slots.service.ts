import { Injectable } from '@nestjs/common';

import { Appointment } from '../../../appointments/domain/entities/appointment.entity';
import { AppointmentsRepository } from '../../../appointments/domain/repositories/appointments.repository';
import { AvailableSlot } from '../../domain/entities/available-slot.entity';
import { ProfessionalScheduleBlock } from '../../domain/entities/professional-schedule-block.entity';
import { Weekday } from '../../domain/entities/professional-availability-window.entity';
import { ProfessionalScheduleStatus } from '../../domain/entities/professional-schedule.entity';
import { InvalidAvailabilityDateError } from '../../domain/errors/invalid-availability-date.error';
import { InvalidSlotDurationError } from '../../domain/errors/invalid-slot-duration.error';
import { ProfessionalScheduleNotFoundError } from '../../domain/errors/professional-schedule-not-found.error';
import { ProfessionalAvailabilityWindowsRepository } from '../../domain/repositories/professional-availability-windows.repository';
import { ProfessionalScheduleBlocksRepository } from '../../domain/repositories/professional-schedule-blocks.repository';
import { ProfessionalSchedulesRepository } from '../../domain/repositories/professional-schedules.repository';

export interface GetAvailableSlotsInput {
  organizationId: string;
  scheduleId: string;
  date: string;
  durationMinutes: number;
}

export interface AvailableSlotsResult {
  date: string;
  timeZone: string;
  durationMinutes: number;
  slots: AvailableSlot[];
}

interface LocalDateParts {
  year: number;
  month: number;
  day: number;
}

interface ZonedDateTimeParts extends LocalDateParts {
  hour: number;
  minute: number;
  second: number;
}

@Injectable()
export class AvailableSlotsService {
  constructor(
    private readonly professionalSchedulesRepository:
      ProfessionalSchedulesRepository,
    private readonly availabilityWindowsRepository:
      ProfessionalAvailabilityWindowsRepository,
    private readonly appointmentsRepository:
      AppointmentsRepository,
    private readonly scheduleBlocksRepository:
      ProfessionalScheduleBlocksRepository,
  ) {}

  async getAvailableSlots(
    input: GetAvailableSlotsInput,
  ): Promise<AvailableSlotsResult> {
    this.ensureDateIsValid(input.date);
    this.ensureDurationIsValid(
      input.durationMinutes,
    );

    const schedule =
      await this.professionalSchedulesRepository.findById(
        input.organizationId,
        input.scheduleId,
      );

    if (!schedule) {
      throw new ProfessionalScheduleNotFoundError();
    }

    if (
      schedule.status !==
      ProfessionalScheduleStatus.ACTIVE
    ) {
      return {
        date: input.date,
        timeZone: schedule.timeZone,
        durationMinutes:
          input.durationMinutes,
        slots: [],
      };
    }

    const weekday =
      this.getWeekday(input.date);

    const windows =
      await this.availabilityWindowsRepository.listByScheduleAndWeekday(
        input.organizationId,
        schedule.id,
        weekday,
      );

    if (windows.length === 0) {
      return {
        date: input.date,
        timeZone: schedule.timeZone,
        durationMinutes:
          input.durationMinutes,
        slots: [],
      };
    }

    const nextDate =
      this.addDays(input.date, 1);

    const scheduledFrom =
      this.localDateTimeToUtc(
        input.date,
        0,
        schedule.timeZone,
      );

    const scheduledTo =
      this.localDateTimeToUtc(
        nextDate,
        0,
        schedule.timeZone,
      );

    const [
      blockingAppointments,
      scheduleBlocks,
    ] = await Promise.all([
      this.appointmentsRepository.listBlockingProfessionalAppointments(
        {
          organizationId:
            input.organizationId,
          professionalMembershipId:
            schedule.professionalMembershipId,
          scheduledFrom:
            scheduledFrom.toISOString(),
          scheduledTo:
            scheduledTo.toISOString(),
        },
      ),
      this.scheduleBlocksRepository.list({
        organizationId:
          input.organizationId,
        professionalScheduleId:
          schedule.id,
        startsBefore:
          scheduledTo.toISOString(),
        endsAfter:
          scheduledFrom.toISOString(),
      }),
    ]);

    const slots: AvailableSlot[] = [];

    for (const window of windows) {
      for (
        let startMinute =
          window.startMinute;
        startMinute +
          input.durationMinutes <=
        window.endMinute;
        startMinute +=
          schedule.slotIntervalMinutes
      ) {
        const endMinute =
          startMinute +
          input.durationMinutes;

        const startsAt =
          this.localDateTimeToUtc(
            input.date,
            startMinute,
            schedule.timeZone,
          );

        const endsAt =
          this.localDateTimeToUtc(
            input.date,
            endMinute,
            schedule.timeZone,
          );

        if (
          startsAt.getTime() <=
          Date.now()
        ) {
          continue;
        }

        const hasAppointmentConflict =
          blockingAppointments.some(
            (appointment) =>
              this.overlapsAppointment(
                startsAt,
                endsAt,
                appointment,
              ),
          );

        if (hasAppointmentConflict) {
          continue;
        }

        const hasBlockConflict =
          scheduleBlocks.some(
            (block) =>
              this.overlapsScheduleBlock(
                startsAt,
                endsAt,
                block,
              ),
          );

        if (hasBlockConflict) {
          continue;
        }

        slots.push({
          startMinute,
          endMinute,
          startTime:
            this.minuteToTime(
              startMinute,
            ),
          endTime:
            this.minuteToTime(
              endMinute,
            ),
          startsAt:
            startsAt.toISOString(),
          endsAt:
            endsAt.toISOString(),
        });
      }
    }

    return {
      date: input.date,
      timeZone: schedule.timeZone,
      durationMinutes:
        input.durationMinutes,
      slots,
    };
  }

  private overlapsAppointment(
    candidateStart: Date,
    candidateEnd: Date,
    appointment: Appointment,
  ): boolean {
    const appointmentStart =
      new Date(
        appointment.scheduledAt,
      ).getTime();

    const appointmentEnd =
      appointmentStart +
      appointment.durationMinutes *
        60_000;

    return this.intervalsOverlap(
      candidateStart.getTime(),
      candidateEnd.getTime(),
      appointmentStart,
      appointmentEnd,
    );
  }

  private overlapsScheduleBlock(
    candidateStart: Date,
    candidateEnd: Date,
    block: ProfessionalScheduleBlock,
  ): boolean {
    return this.intervalsOverlap(
      candidateStart.getTime(),
      candidateEnd.getTime(),
      new Date(
        block.startsAt,
      ).getTime(),
      new Date(
        block.endsAt,
      ).getTime(),
    );
  }

  private intervalsOverlap(
    firstStart: number,
    firstEnd: number,
    secondStart: number,
    secondEnd: number,
  ): boolean {
    return (
      firstStart < secondEnd &&
      firstEnd > secondStart
    );
  }

  private ensureDateIsValid(
    value: string,
  ): void {
    const match =
      /^(\d{4})-(\d{2})-(\d{2})$/.exec(
        value,
      );

    if (!match) {
      throw new InvalidAvailabilityDateError();
    }

    const year = Number(match[1]);
    const month = Number(match[2]);
    const day = Number(match[3]);

    const date =
      new Date(
        Date.UTC(
          year,
          month - 1,
          day,
        ),
      );

    const isValid =
      date.getUTCFullYear() ===
        year &&
      date.getUTCMonth() ===
        month - 1 &&
      date.getUTCDate() ===
        day;

    if (!isValid) {
      throw new InvalidAvailabilityDateError();
    }
  }

  private ensureDurationIsValid(
    durationMinutes: number,
  ): void {
    const isValid =
      Number.isInteger(
        durationMinutes,
      ) &&
      durationMinutes >= 5 &&
      durationMinutes <= 480;

    if (!isValid) {
      throw new InvalidSlotDurationError();
    }
  }

  private getWeekday(
    date: string,
  ): Weekday {
    const {
      year,
      month,
      day,
    } = this.parseDate(date);

    const weekdayNumber =
      new Date(
        Date.UTC(
          year,
          month - 1,
          day,
        ),
      ).getUTCDay();

    const weekdays: Record<
      number,
      Weekday
    > = {
      0: Weekday.SUNDAY,
      1: Weekday.MONDAY,
      2: Weekday.TUESDAY,
      3: Weekday.WEDNESDAY,
      4: Weekday.THURSDAY,
      5: Weekday.FRIDAY,
      6: Weekday.SATURDAY,
    };

    return weekdays[
      weekdayNumber
    ];
  }

  private localDateTimeToUtc(
    date: string,
    minuteOfDay: number,
    timeZone: string,
  ): Date {
    const baseDate =
      minuteOfDay === 1440
        ? this.addDays(date, 1)
        : date;

    const normalizedMinute =
      minuteOfDay === 1440
        ? 0
        : minuteOfDay;

    const {
      year,
      month,
      day,
    } = this.parseDate(
      baseDate,
    );

    const hour =
      Math.floor(
        normalizedMinute / 60,
      );

    const minute =
      normalizedMinute % 60;

    const desiredLocalAsUtc =
      Date.UTC(
        year,
        month - 1,
        day,
        hour,
        minute,
        0,
        0,
      );

    let utcTimestamp =
      desiredLocalAsUtc;

    for (
      let attempt = 0;
      attempt < 4;
      attempt += 1
    ) {
      const actualLocal =
        this.getZonedParts(
          new Date(
            utcTimestamp,
          ),
          timeZone,
        );

      const actualLocalAsUtc =
        Date.UTC(
          actualLocal.year,
          actualLocal.month - 1,
          actualLocal.day,
          actualLocal.hour,
          actualLocal.minute,
          actualLocal.second,
          0,
        );

      const difference =
        desiredLocalAsUtc -
        actualLocalAsUtc;

      if (difference === 0) {
        break;
      }

      utcTimestamp +=
        difference;
    }

    return new Date(
      utcTimestamp,
    );
  }

  private getZonedParts(
    date: Date,
    timeZone: string,
  ): ZonedDateTimeParts {
    const formatter =
      new Intl.DateTimeFormat(
        'en-US',
        {
          timeZone,
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hourCycle: 'h23',
        },
      );

    const parts =
      formatter.formatToParts(
        date,
      );

    const values =
      new Map(
        parts.map((part) => [
          part.type,
          part.value,
        ]),
      );

    return {
      year:
        Number(
          values.get('year'),
        ),
      month:
        Number(
          values.get('month'),
        ),
      day:
        Number(
          values.get('day'),
        ),
      hour:
        Number(
          values.get('hour'),
        ),
      minute:
        Number(
          values.get('minute'),
        ),
      second:
        Number(
          values.get('second'),
        ),
    };
  }

  private parseDate(
    date: string,
  ): LocalDateParts {
    const [
      year,
      month,
      day,
    ] = date
      .split('-')
      .map(Number);

    return {
      year,
      month,
      day,
    };
  }

  private addDays(
    date: string,
    amount: number,
  ): string {
    const {
      year,
      month,
      day,
    } = this.parseDate(date);

    const result =
      new Date(
        Date.UTC(
          year,
          month - 1,
          day + amount,
        ),
      );

    return [
      result
        .getUTCFullYear()
        .toString()
        .padStart(4, '0'),
      (
        result.getUTCMonth() +
        1
      )
        .toString()
        .padStart(2, '0'),
      result
        .getUTCDate()
        .toString()
        .padStart(2, '0'),
    ].join('-');
  }

  private minuteToTime(
    minuteOfDay: number,
  ): string {
    const hours =
      Math.floor(
        minuteOfDay / 60,
      );

    const minutes =
      minuteOfDay % 60;

    return `${hours
      .toString()
      .padStart(2, '0')}:${minutes
      .toString()
      .padStart(2, '0')}`;
  }
}
