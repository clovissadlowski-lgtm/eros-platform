import {
  IsDateString,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

export class CreateLaboratoryExamDto {
  @IsString()
  @MaxLength(200)
  name!: string;

  @IsOptional()
  @IsString()
  @MaxLength(200)
  laboratoryName?: string;

  @IsOptional()
  @IsDateString()
  collectedAt?: string;

  @IsOptional()
  @IsDateString()
  resultedAt?: string;

  @IsOptional()
  @IsString()
  @MaxLength(5000)
  notes?: string;
}