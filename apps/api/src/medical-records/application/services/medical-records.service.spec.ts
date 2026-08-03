import { randomUUID } from 'node:crypto';

import {
  Patient,
  PatientStatus,
} from '../../../patients/domain/entities/patient.entity';
import { PatientNotFoundError } from '../../../patients/domain/errors/patient-not-found.error';
import { InMemoryPatientsRepository } from '../../../patients/infrastructure/repositories/in-memory-patients.repository';
import {
  MedicalRecord,
  MedicalRecordStatus,
} from '../../domain/entities/medical-record.entity';
import { MedicalRecordAlreadyExistsError } from '../../domain/errors/medical-record-already-exists.error';
import { MedicalRecordNotFoundError } from '../../domain/errors/medical-record-not-found.error';
import { InMemoryMedicalRecordsRepository } from '../../infrastructure/repositories/in-memory-medical-records.repository';
import { MedicalRecordsService } from './medical-records.service';

describe('MedicalRecordsService', () => {
  let medicalRecordsRepository:
    InMemoryMedicalRecordsRepository;

  let patientsRepository:
    InMemoryPatientsRepository;

  let service:
    MedicalRecordsService;

  beforeEach(() => {
    medicalRecordsRepository =
      new InMemoryMedicalRecordsRepository();

    patientsRepository =
      new InMemoryPatientsRepository();

    service =
      new MedicalRecordsService(
        medicalRecordsRepository,
        patientsRepository,
      );
  });

  it('creates a medical record for an existing patient', async () => {
    const patient =
      createPatient();

    await patientsRepository.create(
      patient,
    );

    const medicalRecord =
      await service.createMedicalRecord(
        patient.id,
        patient.organizationId,
        {
          chiefComplaint:
            '  Difficulty losing weight.  ',
          clinicalNotes:
            '  Patient motivated.  ',
        },
      );

    expect(medicalRecord).toMatchObject({
      organizationId:
        patient.organizationId,
      patientId: patient.id,
      chiefComplaint:
        'Difficulty losing weight.',
      clinicalNotes:
        'Patient motivated.',
      status:
        MedicalRecordStatus.ACTIVE,
    });

    expect(
      typeof medicalRecord.id,
    ).toBe('string');
  });

  it('creates a medical record with nullable fields', async () => {
    const patient =
      createPatient();

    await patientsRepository.create(
      patient,
    );

    const medicalRecord =
      await service.createMedicalRecord(
        patient.id,
        patient.organizationId,
        {},
      );

    expect(medicalRecord).toMatchObject({
      chiefComplaint: null,
      clinicalHistory: null,
      familyHistory: null,
      allergies: null,
      currentMedications: null,
      healthConditions: null,
      clinicalNotes: null,
      treatmentGoals: null,
    });
  });

  it('normalizes empty clinical text to null', async () => {
    const patient =
      createPatient();

    await patientsRepository.create(
      patient,
    );

    const medicalRecord =
      await service.createMedicalRecord(
        patient.id,
        patient.organizationId,
        {
          allergies: '   ',
        },
      );

    expect(
      medicalRecord.allergies,
    ).toBeNull();
  });

  it('rejects creation when the patient does not exist', async () => {
    await expect(
      service.createMedicalRecord(
        randomUUID(),
        randomUUID(),
        {
          chiefComplaint:
            'Test complaint.',
        },
      ),
    ).rejects.toBeInstanceOf(
      PatientNotFoundError,
    );
  });

  it('does not create a record for a patient from another organization', async () => {
    const patient =
      createPatient();

    await patientsRepository.create(
      patient,
    );

    await expect(
      service.createMedicalRecord(
        patient.id,
        randomUUID(),
        {},
      ),
    ).rejects.toBeInstanceOf(
      PatientNotFoundError,
    );
  });

  it('rejects a second medical record for the same patient', async () => {
    const patient =
      createPatient();

    await patientsRepository.create(
      patient,
    );

    await service.createMedicalRecord(
      patient.id,
      patient.organizationId,
      {
        chiefComplaint:
          'First medical record.',
      },
    );

    await expect(
      service.createMedicalRecord(
        patient.id,
        patient.organizationId,
        {
          chiefComplaint:
            'Second medical record.',
        },
      ),
    ).rejects.toBeInstanceOf(
      MedicalRecordAlreadyExistsError,
    );
  });

  it('gets a medical record by patient id', async () => {
    const patient =
      createPatient();

    await patientsRepository.create(
      patient,
    );

    const created =
      await service.createMedicalRecord(
        patient.id,
        patient.organizationId,
        {
          chiefComplaint:
            'Clinical complaint.',
        },
      );

    const result =
      await service.getMedicalRecordByPatientId(
        patient.id,
        patient.organizationId,
      );

    expect(result).toEqual(created);
  });

  it('throws when the medical record does not exist', async () => {
    const patient =
      createPatient();

    await patientsRepository.create(
      patient,
    );

    await expect(
      service.getMedicalRecordByPatientId(
        patient.id,
        patient.organizationId,
      ),
    ).rejects.toBeInstanceOf(
      MedicalRecordNotFoundError,
    );
  });

  it('does not expose a medical record from another organization', async () => {
    const patient =
      createPatient();

    await patientsRepository.create(
      patient,
    );

    await service.createMedicalRecord(
      patient.id,
      patient.organizationId,
      {},
    );

    await expect(
      service.getMedicalRecordByPatientId(
        patient.id,
        randomUUID(),
      ),
    ).rejects.toBeInstanceOf(
      PatientNotFoundError,
    );
  });

  it('updates only the supplied fields', async () => {
  jest.useFakeTimers();

  try {
    jest.setSystemTime(
      new Date(
        '2026-08-01T12:00:00.000Z',
      ),
    );

    const patient =
      createPatient();

    await patientsRepository.create(
      patient,
    );

    const created =
      await service.createMedicalRecord(
        patient.id,
        patient.organizationId,
        {
          chiefComplaint:
            'Original complaint.',
          allergies:
            'No known allergies.',
          clinicalNotes:
            'Original notes.',
        },
      );

    jest.setSystemTime(
      new Date(
        '2026-08-01T12:05:00.000Z',
      ),
    );

    const updated =
      await service.updateMedicalRecord(
        patient.id,
        patient.organizationId,
        {
          clinicalNotes:
            '  Updated notes.  ',
          treatmentGoals:
            '  Reduce body fat.  ',
        },
      );

    expect(updated).toMatchObject({
      id: created.id,
      organizationId:
        patient.organizationId,
      patientId: patient.id,
      chiefComplaint:
        'Original complaint.',
      allergies:
        'No known allergies.',
      clinicalNotes:
        'Updated notes.',
      treatmentGoals:
        'Reduce body fat.',
      status:
        MedicalRecordStatus.ACTIVE,
      createdAt: created.createdAt,
    });

    expect(created.updatedAt).toBe(
      '2026-08-01T12:00:00.000Z',
    );

    expect(updated.updatedAt).toBe(
      '2026-08-01T12:05:00.000Z',
    );
  } finally {
    jest.useRealTimers();
  }
});

  it('updates the medical record status', async () => {
    const patient =
      createPatient();

    await patientsRepository.create(
      patient,
    );

    const created =
      await service.createMedicalRecord(
        patient.id,
        patient.organizationId,
        {
          clinicalNotes:
            'Important clinical note.',
        },
      );

    const archived =
      await service.updateMedicalRecordStatus(
        patient.id,
        patient.organizationId,
        MedicalRecordStatus.ARCHIVED,
      );

    expect(archived).toMatchObject({
      id: created.id,
      status:
        MedicalRecordStatus.ARCHIVED,
      clinicalNotes:
        'Important clinical note.',
      organizationId:
        patient.organizationId,
      patientId: patient.id,
    });
  });

  it('reactivates an archived medical record', async () => {
    const patient =
      createPatient();

    await patientsRepository.create(
      patient,
    );

    const medicalRecord =
      createMedicalRecord({
        organizationId:
          patient.organizationId,
        patientId: patient.id,
        status:
          MedicalRecordStatus.ARCHIVED,
      });

    await medicalRecordsRepository.create(
      medicalRecord,
    );

    const reactivated =
      await service.updateMedicalRecordStatus(
        patient.id,
        patient.organizationId,
        MedicalRecordStatus.ACTIVE,
      );

    expect(reactivated.status).toBe(
      MedicalRecordStatus.ACTIVE,
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
      name: 'Medical Record Patient',
      email:
        `medical-record-${randomUUID()}@higeia.test`,
      phone: '+5547999999999',
      birthDate: '1990-05-10',
      status: PatientStatus.ACTIVE,
      createdAt: timestamp,
      updatedAt: timestamp,
      ...overrides,
    };
  }

  function createMedicalRecord(
    overrides:
      Partial<MedicalRecord> = {},
  ): MedicalRecord {
    const timestamp =
      '2026-08-01T12:00:00.000Z';

    return {
      id: randomUUID(),
      organizationId: randomUUID(),
      patientId: randomUUID(),
      chiefComplaint: null,
      clinicalHistory: null,
      familyHistory: null,
      allergies: null,
      currentMedications: null,
      healthConditions: null,
      clinicalNotes: null,
      treatmentGoals: null,
      status:
        MedicalRecordStatus.ACTIVE,
      createdAt: timestamp,
      updatedAt: timestamp,
      ...overrides,
    };
  }
});