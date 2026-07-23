import { PatientStatus } from '../../domain/entities/patient.entity';
import { PatientNotFoundError } from '../../domain/errors/patient-not-found.error';
import { InMemoryPatientsRepository } from '../../infrastructure/repositories/in-memory-patients.repository';
import {
  DEVELOPMENT_ORGANIZATION_ID,
  PatientsService,
} from './patients.service';

describe('PatientsService', () => {
  let service: PatientsService;
  let repository: InMemoryPatientsRepository;

  beforeEach(() => {
    repository = new InMemoryPatientsRepository();
    service = new PatientsService(repository);
  });

  it('creates a patient for the current organization', async () => {
    const patient = await service.createPatient({
      name: 'Maria da Silva',
      email: 'maria@example.com',
      phone: '+5547999999999',
      birthDate: '1990-05-14',
    });

    expect(patient.id).toBeDefined();
    expect(patient.organizationId).toBe(
      DEVELOPMENT_ORGANIZATION_ID,
    );
    expect(patient.name).toBe('Maria da Silva');
    expect(patient.status).toBe(PatientStatus.ACTIVE);
    expect(patient.createdAt).toBeDefined();
    expect(patient.updatedAt).toBeDefined();
  });

  it('lists only patients from the requested organization', async () => {
    await service.createPatient(
      { name: 'Patient A' },
      'organization-a',
    );

    await service.createPatient(
      { name: 'Patient B' },
      'organization-b',
    );

    const patients = await service.listPatients(
      'organization-a',
    );

    expect(patients).toHaveLength(1);
    expect(patients[0].name).toBe('Patient A');
  });

  it('returns a patient by id and organization', async () => {
    const created = await service.createPatient(
      { name: 'Patient A' },
      'organization-a',
    );

    const patient = await service.getPatientById(
      created.id,
      'organization-a',
    );

    expect(patient.id).toBe(created.id);
  });

  it('throws when the patient does not exist', async () => {
    await expect(
      service.getPatientById('missing-id'),
    ).rejects.toBeInstanceOf(PatientNotFoundError);
  });

  it('does not return a patient from another organization', async () => {
    const created = await service.createPatient(
      { name: 'Patient A' },
      'organization-a',
    );

    await expect(
      service.getPatientById(
        created.id,
        'organization-b',
      ),
    ).rejects.toBeInstanceOf(PatientNotFoundError);
  });
});
