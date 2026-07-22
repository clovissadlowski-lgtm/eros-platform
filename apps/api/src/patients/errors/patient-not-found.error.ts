export class PatientNotFoundError extends Error {
  readonly code = 'PATIENT_NOT_FOUND';

  constructor() {
    super('Patient not found.');
    this.name = 'PatientNotFoundError';
  }
}
