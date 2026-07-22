import { PatientStatus } from './entities/patient.entity';
import { PatientNotFoundError } from './errors/patient-not-found.error';
import {
  DEVELOPMENT_ORGANIZATION_ID,
  PatientsService,
} from './patients.service';

describe('PatientsService', () => {
  let service: PatientsService;

  beforeEach(() => {
    service = new PatientsService();
  });

  it('creates a patient for the current organization', () => {
    const patient = service.createPatient({
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

  it('lists only patients from the requested organization', () => {
    service.createPatient(
      { name: 'Patient A' },
      'organization-a',
    );

    service.createPatient(
      { name: 'Patient B' },
      'organization-b',
    );

    const patients = service.listPatients('organization-a');

    expect(patients).toHaveLength(1);
    expect(patients[0].name).toBe('Patient A');
  });

  it('returns a patient by id and organization', () => {
    const created = service.createPatient(
      { name: 'Patient A' },
      'organization-a',
    );

    const patient = service.getPatientById(
      created.id,
      'organization-a',
    );

    expect(patient.id).toBe(created.id);
  });

  it('throws when the patient does not exist', () => {
    expect(() =>
      service.getPatientById('missing-id'),
    ).toThrow(PatientNotFoundError);
  });

  it('does not return a patient from another organization', () => {
    const created = service.createPatient(
      { name: 'Patient A' },
      'organization-a',
    );

    expect(() =>
      service.getPatientById(created.id, 'organization-b'),
    ).toThrow(PatientNotFoundError);
  });
});
