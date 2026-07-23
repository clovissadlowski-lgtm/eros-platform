import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Post,
} from '@nestjs/common';
import { PatientsService } from '../../application/services/patients.service';
import { PatientNotFoundError } from '../../domain/errors/patient-not-found.error';
import { CreatePatientDto } from '../dto/create-patient.dto';

@Controller('patients')
export class PatientsController {
  constructor(
    private readonly patientsService: PatientsService,
  ) {}

  @Post()
  async create(@Body() dto: CreatePatientDto) {
    return this.patientsService.createPatient(dto);
  }

  @Get()
  async list() {
    return this.patientsService.listPatients();
  }

  @Get(':patientId')
  async getById(
    @Param('patientId') patientId: string,
  ) {
    try {
      return await this.patientsService.getPatientById(
        patientId,
      );
    } catch (error: unknown) {
      if (error instanceof PatientNotFoundError) {
        throw new NotFoundException({
          code: error.code,
          message: error.message,
        });
      }

      throw error;
    }
  }
}
