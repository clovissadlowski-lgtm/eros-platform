import {
  ApiPropertyOptional,
} from '@nestjs/swagger';
import {
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

export class UpdateMedicalRecordDto {
  @ApiPropertyOptional({
    description:
      'Nova queixa principal do paciente. Texto vazio será normalizado para null.',
    example:
      'Paciente relata melhora da compulsão, porém dificuldade com o café da tarde.',
    maxLength: 5000,
  })
  @IsOptional()
  @IsString()
  @MaxLength(5000)
  chiefComplaint?: string;

  @ApiPropertyOptional({
    description:
      'Atualização do histórico clínico.',
    example:
      'Exames recentes demonstram melhora da glicemia de jejum.',
    maxLength: 10000,
  })
  @IsOptional()
  @IsString()
  @MaxLength(10000)
  clinicalHistory?: string;

  @ApiPropertyOptional({
    description:
      'Atualização do histórico familiar.',
    example:
      'Incluído histórico de doença cardiovascular em avô materno.',
    maxLength: 10000,
  })
  @IsOptional()
  @IsString()
  @MaxLength(10000)
  familyHistory?: string;

  @ApiPropertyOptional({
    description:
      'Atualização das alergias conhecidas.',
    example:
      'Sem novas alergias relatadas.',
    maxLength: 5000,
  })
  @IsOptional()
  @IsString()
  @MaxLength(5000)
  allergies?: string;

  @ApiPropertyOptional({
    description:
      'Atualização dos medicamentos em uso.',
    example:
      'Metformina 850 mg uma vez ao dia.',
    maxLength: 5000,
  })
  @IsOptional()
  @IsString()
  @MaxLength(5000)
  currentMedications?: string;

  @ApiPropertyOptional({
    description:
      'Atualização das condições de saúde.',
    example:
      'Resistência à insulina em acompanhamento.',
    maxLength: 5000,
  })
  @IsOptional()
  @IsString()
  @MaxLength(5000)
  healthConditions?: string;

  @ApiPropertyOptional({
    description:
      'Novas anotações clínicas.',
    example:
      'Paciente apresentou boa evolução e maior regularidade nas refeições.',
    maxLength: 10000,
  })
  @IsOptional()
  @IsString()
  @MaxLength(10000)
  clinicalNotes?: string;

  @ApiPropertyOptional({
    description:
      'Atualização dos objetivos do tratamento.',
    example:
      'Manter redução gradual de gordura e consolidar rotina alimentar.',
    maxLength: 5000,
  })
  @IsOptional()
  @IsString()
  @MaxLength(5000)
  treatmentGoals?: string;
}