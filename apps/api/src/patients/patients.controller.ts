import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Post,
} from '@nestjs/common';
import { CreatePatientDto } from './dto/create-patient.dto';
import { PatientNotFoundError } from './errors/patient-not-found.error';
import { PatientsService } from './patients.service';

@Controller('patients')
export class PatientsController {
  constructor(private readonly patientsService: PatientsService) {}

  @Post()
  create(@Body() dto: CreatePatientDto) {
    return this.patientsService.createPatient(dto);
  }

  @Get()
  list() {
    return this.patientsService.listPatients();
  }

  @Get(':patientId')
  getById(@Param('patientId') patientId: string) {
    try {
      return this.patientsService.getPatientById(patientId);
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
