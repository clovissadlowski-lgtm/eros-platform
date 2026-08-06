import {
  ApiPropertyOptional,
} from '@nestjs/swagger';
import {
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

export class CreateMedicalRecordDto {
  @ApiPropertyOptional({
    description:
      'Queixa principal relatada pelo paciente.',
    example:
      'Dificuldade para perder peso e episódios de compulsão alimentar à noite.',
    maxLength: 5000,
  })
  @IsOptional()
  @IsString()
  @MaxLength(5000)
  chiefComplaint?: string;

  @ApiPropertyOptional({
    description:
      'Histórico clínico relevante do paciente.',
    example:
      'Paciente com histórico de resistência à insulina e acompanhamento endocrinológico.',
    maxLength: 10000,
  })
  @IsOptional()
  @IsString()
  @MaxLength(10000)
  clinicalHistory?: string;

  @ApiPropertyOptional({
    description:
      'Histórico familiar de doenças e condições de saúde.',
    example:
      'Pai com hipertensão arterial e mãe com diabetes tipo 2.',
    maxLength: 10000,
  })
  @IsOptional()
  @IsString()
  @MaxLength(10000)
  familyHistory?: string;

  @ApiPropertyOptional({
    description:
      'Alergias conhecidas do paciente.',
    example:
      'Alergia a amendoim.',
    maxLength: 5000,
  })
  @IsOptional()
  @IsString()
  @MaxLength(5000)
  allergies?: string;

  @ApiPropertyOptional({
    description:
      'Medicamentos atualmente utilizados pelo paciente.',
    example:
      'Metformina 850 mg, duas vezes ao dia.',
    maxLength: 5000,
  })
  @IsOptional()
  @IsString()
  @MaxLength(5000)
  currentMedications?: string;

  @ApiPropertyOptional({
    description:
      'Condições de saúde diagnosticadas ou relatadas.',
    example:
      'Resistência à insulina e hipertensão controlada.',
    maxLength: 5000,
  })
  @IsOptional()
  @IsString()
  @MaxLength(5000)
  healthConditions?: string;

  @ApiPropertyOptional({
    description:
      'Anotações clínicas do profissional responsável.',
    example:
      'Paciente demonstra boa compreensão das orientações e motivação para mudança de hábitos.',
    maxLength: 10000,
  })
  @IsOptional()
  @IsString()
  @MaxLength(10000)
  clinicalNotes?: string;

  @ApiPropertyOptional({
    description:
      'Objetivos definidos para o tratamento.',
    example:
      'Reduzir gordura corporal, melhorar controle glicêmico e aumentar adesão alimentar.',
    maxLength: 5000,
  })
  @IsOptional()
  @IsString()
  @MaxLength(5000)
  treatmentGoals?: string;
}