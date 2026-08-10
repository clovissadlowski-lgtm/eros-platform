import {
  IsDateString,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

export class UpdateLaboratoryExamDto {
  @IsOptional()
  @IsString()
  @MaxLength(200)
  name?: string;

  @IsOptional()
  @IsString()
  @MaxLength(200)
  laboratoryName?: string | null;

  @IsOptional()
  @IsDateString()
  collectedAt?: string | null;

  @IsOptional()
  @IsDateString()
  resultedAt?: string | null;

  @IsOptional()
  @IsString()
  @MaxLength(5000)
  notes?: string | null;
}