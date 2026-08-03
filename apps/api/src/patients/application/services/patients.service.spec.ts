import { randomUUID } from 'node:crypto';

import {
  Patient,
  PatientStatus,
} from '../../domain/entities/patient.entity';
import { PatientEmailAlreadyExistsError } from '../../domain/errors/patient-email-already-exists.error';
import { PatientNotFoundError } from '../../domain/errors/patient-not-found.error';
import { InMemoryPatientsRepository } from '../../infrastructure/repositories/in-memory-patients.repository';
import { PatientsService } from './patients.service';

describe('PatientsService', () => {
  let patientsRepository:
    InMemoryPatientsRepository;

  let service: PatientsService;

  beforeEach(() => {
    patientsRepository =
      new InMemoryPatientsRepository();

    service = new PatientsService(
      patientsRepository,
    );
  });

  it('creates a patient inside the requested organization', async () => {
    const organizationId = randomUUID();

    const patient =
      await service.createPatient(
        {
          name:
            '  Integration Patient  ',
          email:
            '  PATIENT@HIGEIA.TEST  ',
          phone: '+5547999999999',
          birthDate: '1990-05-10',
        },
        organizationId,
      );

    expect(patient.organizationId).toBe(
      organizationId,
    );

    expect(patient.name).toBe(
      'Integration Patient',
    );

    expect(patient.email).toBe(
      'patient@higeia.test',
    );

    expect(patient.status).toBe(
      PatientStatus.ACTIVE,
    );
  });

  it('creates patients without an email', async () => {
    const organizationId = randomUUID();

    const firstPatient =
      await service.createPatient(
        {
          name:
            'Patient Without Email One',
        },
        organizationId,
      );

    const secondPatient =
      await service.createPatient(
        {
          name:
            'Patient Without Email Two',
        },
        organizationId,
      );

    expect(firstPatient.email).toBeNull();
    expect(secondPatient.email).toBeNull();
  });

  it('rejects a duplicate email inside the same organization', async () => {
    const organizationId = randomUUID();

    await service.createPatient(
      {
        name: 'First Patient',
        email:
          'patient@higeia.test',
      },
      organizationId,
    );

    await expect(
      service.createPatient(
        {
          name: 'Second Patient',
          email:
            'PATIENT@HIGEIA.TEST',
        },
        organizationId,
      ),
    ).rejects.toBeInstanceOf(
      PatientEmailAlreadyExistsError,
    );
  });

  it('allows the same email in different organizations', async () => {
    const firstOrganizationId =
      randomUUID();

    const secondOrganizationId =
      randomUUID();

    const firstPatient =
      await service.createPatient(
        {
          name: 'First Patient',
          email:
            'patient@higeia.test',
        },
        firstOrganizationId,
      );

    const secondPatient =
      await service.createPatient(
        {
          name: 'Second Patient',
          email:
            'patient@higeia.test',
        },
        secondOrganizationId,
      );

    expect(
      firstPatient.organizationId,
    ).toBe(firstOrganizationId);

    expect(
      secondPatient.organizationId,
    ).toBe(secondOrganizationId);
  });

  it('lists only patients from the requested organization', async () => {
    const organizationId = randomUUID();

    const anotherOrganizationId =
      randomUUID();

    const firstPatient =
      createPatient({
        organizationId,
        name: 'First Patient',
      });

    const secondPatient =
      createPatient({
        organizationId,
        name: 'Second Patient',
      });

    const anotherOrganizationPatient =
      createPatient({
        organizationId:
          anotherOrganizationId,
        name:
          'Another Organization Patient',
      });

    await patientsRepository.create(
      firstPatient,
    );

    await patientsRepository.create(
      secondPatient,
    );

    await patientsRepository.create(
      anotherOrganizationPatient,
    );

    const patients =
      await service.listPatients(
        organizationId,
      );

    expect(patients).toEqual([
      firstPatient,
      secondPatient,
    ]);
  });

  it('finds a patient only inside the requested organization', async () => {
    const organizationId = randomUUID();

    const patient = createPatient({
      organizationId,
    });

    await patientsRepository.create(
      patient,
    );

    const result =
      await service.getPatientById(
        patient.id,
        organizationId,
      );

    expect(result).toEqual(patient);
  });

  it('does not return a patient from another organization', async () => {
    const patient = createPatient({
      organizationId: randomUUID(),
    });

    await patientsRepository.create(
      patient,
    );

    await expect(
      service.getPatientById(
        patient.id,
        randomUUID(),
      ),
    ).rejects.toBeInstanceOf(
      PatientNotFoundError,
    );
  });

  it('throws when the patient does not exist', async () => {
    await expect(
      service.getPatientById(
        randomUUID(),
        randomUUID(),
      ),
    ).rejects.toBeInstanceOf(
      PatientNotFoundError,
    );
  });

  it('updates only the supplied patient fields', async () => {
    const patient =
      createPatient({
        name: 'Original Name',
        email:
          'original@higeia.test',
        phone: '+5547111111111',
        birthDate: '1990-05-10',
      });

    await patientsRepository.create(
      patient,
    );

    const updatedPatient =
      await service.updatePatient(
        patient.id,
        patient.organizationId,
        {
          name: '  Updated Name  ',
          email:
            '  UPDATED@HIGEIA.TEST  ',
        },
      );

    expect(updatedPatient).toMatchObject({
      id: patient.id,
      organizationId:
        patient.organizationId,
      name: 'Updated Name',
      email:
        'updated@higeia.test',
      phone: '+5547111111111',
      birthDate: '1990-05-10',
      status: PatientStatus.ACTIVE,
      createdAt: patient.createdAt,
    });

    expect(
      updatedPatient.updatedAt,
    ).not.toBe(patient.updatedAt);
  });

  it('allows a patient to keep its own email during update', async () => {
    const patient = createPatient({
      email: 'patient@higeia.test',
    });

    await patientsRepository.create(
      patient,
    );

    const updatedPatient =
      await service.updatePatient(
        patient.id,
        patient.organizationId,
        {
          email:
            'PATIENT@HIGEIA.TEST',
        },
      );

    expect(updatedPatient.email).toBe(
      'patient@higeia.test',
    );
  });

  it('rejects changing a patient email to another patient email', async () => {
    const organizationId = randomUUID();

    const firstPatient =
      createPatient({
        organizationId,
        email:
          'first@higeia.test',
      });

    const secondPatient =
      createPatient({
        organizationId,
        email:
          'second@higeia.test',
      });

    await patientsRepository.create(
      firstPatient,
    );

    await patientsRepository.create(
      secondPatient,
    );

    await expect(
      service.updatePatient(
        secondPatient.id,
        organizationId,
        {
          email:
            'FIRST@HIGEIA.TEST',
        },
      ),
    ).rejects.toBeInstanceOf(
      PatientEmailAlreadyExistsError,
    );
  });

  it('updates the patient status', async () => {
    const patient = createPatient();

    await patientsRepository.create(
      patient,
    );

    const updatedPatient =
      await service.updatePatientStatus(
        patient.id,
        patient.organizationId,
        PatientStatus.INACTIVE,
      );

    expect(updatedPatient.status).toBe(
      PatientStatus.INACTIVE,
    );

    expect(updatedPatient.name).toBe(
      patient.name,
    );

    expect(updatedPatient.email).toBe(
      patient.email,
    );
  });

  function createPatient(
    overrides: Partial<Patient> = {},
  ): Patient {
    const timestamp =
      '2026-08-01T12:00:00.000Z';

    return {
      id: randomUUID(),
      organizationId: randomUUID(),
      name: 'Test Patient',
      email:
        `patient-${randomUUID()}@higeia.test`,
      phone: '+5547999999999',
      birthDate: '1990-05-10',
      status: PatientStatus.ACTIVE,
      createdAt: timestamp,
      updatedAt: timestamp,
      ...overrides,
    };
  }
});