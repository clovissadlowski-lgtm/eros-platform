import {
  Patient,
  PatientStatus,
} from '../../domain/entities/patient.entity';
import { InMemoryPatientsRepository } from './in-memory-patients.repository';

describe('InMemoryPatientsRepository', () => {
  let repository: InMemoryPatientsRepository;

  beforeEach(() => {
    repository = new InMemoryPatientsRepository();
  });

  function createPatient(
    id: string,
    organizationId: string,
  ): Patient {
    const timestamp = new Date().toISOString();

    return {
      id,
      organizationId,
      name: `Patient ${id}`,
      email: null,
      phone: null,
      birthDate: null,
      status: PatientStatus.ACTIVE,
      createdAt: timestamp,
      updatedAt: timestamp,
    };
  }

  it('stores and returns a patient', async () => {
    const patient = createPatient(
      'patient-1',
      'organization-a',
    );

    await repository.create(patient);

    const result = await repository.findById(
      'organization-a',
      'patient-1',
    );

    expect(result).toEqual(patient);
  });

  it('lists only patients from the requested organization', async () => {
    await repository.create(
      createPatient('patient-1', 'organization-a'),
    );

    await repository.create(
      createPatient('patient-2', 'organization-b'),
    );

    const result = await repository.listByOrganization(
      'organization-a',
    );

    expect(result).toHaveLength(1);
    expect(result[0].id).toBe('patient-1');
  });

  it('returns null for a patient from another organization', async () => {
    await repository.create(
      createPatient('patient-1', 'organization-a'),
    );

    const result = await repository.findById(
      'organization-b',
      'patient-1',
    );

    expect(result).toBeNull();
  });
});
