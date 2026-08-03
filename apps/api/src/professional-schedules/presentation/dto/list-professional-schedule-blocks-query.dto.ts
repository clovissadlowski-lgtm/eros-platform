import {
  IsISO8601,
  IsOptional,
} from 'class-validator';

export class ListProfessionalScheduleBlocksQueryDto {
  @IsOptional()
  @IsISO8601({
    strict: true,
  })
  startsBefore?: string;

  @IsOptional()
  @IsISO8601({
    strict: true,
  })
  endsAfter?: string;
}