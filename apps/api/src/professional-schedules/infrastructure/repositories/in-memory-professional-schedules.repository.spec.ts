import { randomUUID } from 'node:crypto';

import {
  ProfessionalSchedule,
  ProfessionalScheduleStatus,
} from '../../domain/entities/professional-schedule.entity';
import { InMemoryProfessionalSchedulesRepository } from './in-memory-professional-schedules.repository';

describe(
  'InMemoryProfessionalSchedulesRepository',
  () => {
    let repository:
      InMemoryProfessionalSchedulesRepository;

    beforeEach(() => {
      repository =
        new InMemoryProfessionalSchedulesRepository();
    });

    it('creates and finds a schedule by id', async () => {
      const schedule =
        createSchedule();

      await repository.create(
        schedule,
      );

      const result =
        await repository.findById(
          schedule.organizationId,
          schedule.id,
        );

      expect(result).toEqual(
        schedule,
      );
    });

    it('finds a schedule by professional', async () => {
      const schedule =
        createSchedule();

      await repository.create(
        schedule,
      );

      const result =
        await repository.findByProfessional(
          schedule.organizationId,
          schedule.professionalMembershipId,
        );

      expect(result).toEqual(
        schedule,
      );
    });

    it('does not expose a schedule from another organization', async () => {
      const schedule =
        createSchedule();

      await repository.create(
        schedule,
      );

      const result =
        await repository.findById(
          randomUUID(),
          schedule.id,
        );

      expect(result).toBeNull();
    });

    it('updates a schedule', async () => {
      const schedule =
        createSchedule();

      await repository.create(
        schedule,
      );

      const updatedSchedule: ProfessionalSchedule = {
        ...schedule,
        timeZone:
          'America/Manaus',
        slotIntervalMinutes: 15,
        status:
          ProfessionalScheduleStatus.INACTIVE,
        updatedAt:
          '2026-08-02T12:00:00.000Z',
      };

      const result =
        await repository.update(
          updatedSchedule,
        );

      expect(result).toEqual(
        updatedSchedule,
      );

      const persisted =
        await repository.findById(
          schedule.organizationId,
          schedule.id,
        );

      expect(persisted).toEqual(
        updatedSchedule,
      );
    });

    it('throws when updating an unknown schedule', async () => {
      await expect(
        repository.update(
          createSchedule(),
        ),
      ).rejects.toThrow(
        'Professional schedule not found in memory repository.',
      );
    });

    function createSchedule(
      overrides:
        Partial<ProfessionalSchedule> = {},
    ): ProfessionalSchedule {
      const timestamp =
        '2026-08-01T12:00:00.000Z';

      return {
        id: randomUUID(),
        organizationId:
          randomUUID(),
        professionalMembershipId:
          randomUUID(),
        timeZone:
          'America/Sao_Paulo',
        slotIntervalMinutes: 30,
        status:
          ProfessionalScheduleStatus.ACTIVE,
        createdAt: timestamp,
        updatedAt: timestamp,
        ...overrides,
      };
    }
  },
);