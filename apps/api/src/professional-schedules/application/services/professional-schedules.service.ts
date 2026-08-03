import { Injectable } from '@nestjs/common';
import { randomUUID } from 'node:crypto';

import {
  MembershipRole,
  MembershipStatus,
} from '../../../users/domain/entities/membership.entity';
import { MembershipsRepository } from '../../../users/domain/repositories/memberships.repository';
import {
  ProfessionalAvailabilityWindow,
  Weekday,
} from '../../domain/entities/professional-availability-window.entity';
import {
  ProfessionalSchedule,
  ProfessionalScheduleStatus,
} from '../../domain/entities/professional-schedule.entity';
import { InvalidAvailabilityWindowError } from '../../domain/errors/invalid-availability-window.error';
import { InvalidSlotIntervalError } from '../../domain/errors/invalid-slot-interval.error';
import { InvalidTimeZoneError } from '../../domain/errors/invalid-time-zone.error';
import { OverlappingAvailabilityWindowError } from '../../domain/errors/overlapping-availability-window.error';
import { ProfessionalScheduleAlreadyExistsError } from '../../domain/errors/professional-schedule-already-exists.error';
import { ProfessionalScheduleNotFoundError } from '../../domain/errors/professional-schedule-not-found.error';
import { ProfessionalAvailabilityWindowsRepository } from '../../domain/repositories/professional-availability-windows.repository';
import { ProfessionalSchedulesRepository } from '../../domain/repositories/professional-schedules.repository';

export interface CreateProfessionalScheduleInput {
  professionalMembershipId: string;
  timeZone: string;
  slotIntervalMinutes: number;
}

export interface UpdateProfessionalScheduleInput {
  timeZone?: string;
  slotIntervalMinutes?: number;
  status?: ProfessionalScheduleStatus;
}

export interface AvailabilityWindowInput {
  weekday: Weekday;
  startMinute: number;
  endMinute: number;
}

export interface ProfessionalScheduleDetails {
  schedule: ProfessionalSchedule;
  availabilityWindows:
    ProfessionalAvailabilityWindow[];
}

@Injectable()
export class ProfessionalSchedulesService {
  constructor(
    private readonly professionalSchedulesRepository:
      ProfessionalSchedulesRepository,
    private readonly availabilityWindowsRepository:
      ProfessionalAvailabilityWindowsRepository,
    private readonly membershipsRepository:
      MembershipsRepository,
  ) {}

  async createSchedule(
    organizationId: string,
    input: CreateProfessionalScheduleInput,
  ): Promise<ProfessionalSchedule> {
    await this.ensureProfessionalIsValid(
      organizationId,
      input.professionalMembershipId,
    );

    const existingSchedule =
      await this.professionalSchedulesRepository.findByProfessional(
        organizationId,
        input.professionalMembershipId,
      );

    if (existingSchedule) {
      throw new ProfessionalScheduleAlreadyExistsError();
    }

    this.ensureTimeZoneIsValid(
      input.timeZone,
    );

    this.ensureSlotIntervalIsValid(
      input.slotIntervalMinutes,
    );

    const timestamp =
      new Date().toISOString();

    const schedule: ProfessionalSchedule = {
      id: randomUUID(),
      organizationId,
      professionalMembershipId:
        input.professionalMembershipId,
      timeZone:
        input.timeZone.trim(),
      slotIntervalMinutes:
        input.slotIntervalMinutes,
      status:
        ProfessionalScheduleStatus.ACTIVE,
      createdAt: timestamp,
      updatedAt: timestamp,
    };

    return this.professionalSchedulesRepository.create(
      schedule,
    );
  }

  async getScheduleById(
    organizationId: string,
    scheduleId: string,
  ): Promise<ProfessionalScheduleDetails> {
    const schedule =
      await this.professionalSchedulesRepository.findById(
        organizationId,
        scheduleId,
      );

    if (!schedule) {
      throw new ProfessionalScheduleNotFoundError();
    }

    const availabilityWindows =
      await this.availabilityWindowsRepository.listBySchedule(
        organizationId,
        schedule.id,
      );

    return {
      schedule,
      availabilityWindows,
    };
  }

  async getScheduleByProfessional(
    organizationId: string,
    professionalMembershipId: string,
  ): Promise<ProfessionalScheduleDetails> {
    const schedule =
      await this.professionalSchedulesRepository.findByProfessional(
        organizationId,
        professionalMembershipId,
      );

    if (!schedule) {
      throw new ProfessionalScheduleNotFoundError();
    }

    const availabilityWindows =
      await this.availabilityWindowsRepository.listBySchedule(
        organizationId,
        schedule.id,
      );

    return {
      schedule,
      availabilityWindows,
    };
  }

  async updateSchedule(
    organizationId: string,
    scheduleId: string,
    input: UpdateProfessionalScheduleInput,
  ): Promise<ProfessionalSchedule> {
    const schedule =
      await this.getExistingSchedule(
        organizationId,
        scheduleId,
      );

    if (input.timeZone !== undefined) {
      this.ensureTimeZoneIsValid(
        input.timeZone,
      );
    }

    if (
      input.slotIntervalMinutes !==
      undefined
    ) {
      this.ensureSlotIntervalIsValid(
        input.slotIntervalMinutes,
      );
    }

    const updatedSchedule: ProfessionalSchedule = {
      ...schedule,
      timeZone:
        input.timeZone !== undefined
          ? input.timeZone.trim()
          : schedule.timeZone,
      slotIntervalMinutes:
        input.slotIntervalMinutes ??
        schedule.slotIntervalMinutes,
      status:
        input.status ??
        schedule.status,
      updatedAt:
        new Date().toISOString(),
    };

    return this.professionalSchedulesRepository.update(
      updatedSchedule,
    );
  }

  async replaceAvailability(
    organizationId: string,
    scheduleId: string,
    inputWindows: AvailabilityWindowInput[],
  ): Promise<ProfessionalAvailabilityWindow[]> {
    const schedule =
      await this.getExistingSchedule(
        organizationId,
        scheduleId,
      );

    this.ensureAvailabilityWindowsAreValid(
      inputWindows,
    );

    const timestamp =
      new Date().toISOString();

    const windows =
      inputWindows.map(
        (
          inputWindow,
        ): ProfessionalAvailabilityWindow => ({
          id: randomUUID(),
          organizationId,
          professionalScheduleId:
            schedule.id,
          weekday:
            inputWindow.weekday,
          startMinute:
            inputWindow.startMinute,
          endMinute:
            inputWindow.endMinute,
          createdAt: timestamp,
          updatedAt: timestamp,
        }),
      );

    return this.availabilityWindowsRepository.replaceForSchedule(
      organizationId,
      schedule.id,
      windows,
    );
  }

  async listAvailability(
    organizationId: string,
    scheduleId: string,
  ): Promise<ProfessionalAvailabilityWindow[]> {
    const schedule =
      await this.getExistingSchedule(
        organizationId,
        scheduleId,
      );

    return this.availabilityWindowsRepository.listBySchedule(
      organizationId,
      schedule.id,
    );
  }

  async listAvailabilityForWeekday(
    organizationId: string,
    scheduleId: string,
    weekday: Weekday,
  ): Promise<ProfessionalAvailabilityWindow[]> {
    const schedule =
      await this.getExistingSchedule(
        organizationId,
        scheduleId,
      );

    return this.availabilityWindowsRepository.listByScheduleAndWeekday(
      organizationId,
      schedule.id,
      weekday,
    );
  }

  private async getExistingSchedule(
    organizationId: string,
    scheduleId: string,
  ): Promise<ProfessionalSchedule> {
    const schedule =
      await this.professionalSchedulesRepository.findById(
        organizationId,
        scheduleId,
      );

    if (!schedule) {
      throw new ProfessionalScheduleNotFoundError();
    }

    return schedule;
  }

  private async ensureProfessionalIsValid(
    organizationId: string,
    professionalMembershipId: string,
  ): Promise<void> {
    const membership =
      await this.membershipsRepository.findById(
        professionalMembershipId,
      );

    const allowedRoles: MembershipRole[] = [
      MembershipRole.OWNER,
      MembershipRole.ADMIN,
      MembershipRole.NUTRITIONIST,
    ];

    const isValid =
      membership !== null &&
      membership.organizationId ===
        organizationId &&
      membership.status ===
        MembershipStatus.ACTIVE &&
      allowedRoles.includes(
        membership.role,
      );

    if (!isValid) {
      throw new ProfessionalScheduleNotFoundError();
    }
  }

  private ensureTimeZoneIsValid(
    timeZone: string,
  ): void {
    const normalizedTimeZone =
      timeZone.trim();

    if (
      normalizedTimeZone.length === 0
    ) {
      throw new InvalidTimeZoneError();
    }

    try {
      new Intl.DateTimeFormat(
        'en-US',
        {
          timeZone:
            normalizedTimeZone,
        },
      ).format();
    } catch {
      throw new InvalidTimeZoneError();
    }
  }

  private ensureSlotIntervalIsValid(
    slotIntervalMinutes: number,
  ): void {
    const isValid =
      Number.isInteger(
        slotIntervalMinutes,
      ) &&
      slotIntervalMinutes >= 5 &&
      slotIntervalMinutes <= 240;

    if (!isValid) {
      throw new InvalidSlotIntervalError();
    }
  }

  private ensureAvailabilityWindowsAreValid(
    windows: AvailabilityWindowInput[],
  ): void {
    for (const window of windows) {
      this.ensureAvailabilityWindowIsValid(
        window,
      );
    }

    const windowsByWeekday =
      new Map<
        Weekday,
        AvailabilityWindowInput[]
      >();

    for (const window of windows) {
      const weekdayWindows =
        windowsByWeekday.get(
          window.weekday,
        ) ?? [];

      weekdayWindows.push(
        window,
      );

      windowsByWeekday.set(
        window.weekday,
        weekdayWindows,
      );
    }

    for (
      const weekdayWindows of
      windowsByWeekday.values()
    ) {
      const sortedWindows = [
        ...weekdayWindows,
      ].sort(
        (
          firstWindow,
          secondWindow,
        ) =>
          firstWindow.startMinute -
          secondWindow.startMinute,
      );

      for (
        let index = 1;
        index <
        sortedWindows.length;
        index += 1
      ) {
        const previousWindow =
          sortedWindows[index - 1];

        const currentWindow =
          sortedWindows[index];

        if (
          currentWindow.startMinute <
          previousWindow.endMinute
        ) {
          throw new OverlappingAvailabilityWindowError();
        }
      }
    }
  }

  private ensureAvailabilityWindowIsValid(
    window: AvailabilityWindowInput,
  ): void {
    const isStartValid =
      Number.isInteger(
        window.startMinute,
      ) &&
      window.startMinute >= 0 &&
      window.startMinute < 1440;

    const isEndValid =
      Number.isInteger(
        window.endMinute,
      ) &&
      window.endMinute > 0 &&
      window.endMinute <= 1440;

    const hasPositiveDuration =
      window.startMinute <
      window.endMinute;

    const isWeekdayValid =
      Object.values(
        Weekday,
      ).includes(
        window.weekday,
      );

    if (
      !isStartValid ||
      !isEndValid ||
      !hasPositiveDuration ||
      !isWeekdayValid
    ) {
      throw new InvalidAvailabilityWindowError();
    }
  }
}