import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
  Matches,
} from 'class-validator';

export class CreatePatientDto {
  @IsString()
  @IsNotEmpty()
  @Length(2, 120)
  name!: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  @Matches(/^\+?[0-9]{8,20}$/, {
    message: 'phone must contain between 8 and 20 digits',
  })
  phone?: string;

  @IsOptional()
  @IsString()
  @Matches(/^\d{4}-\d{2}-\d{2}$/, {
    message: 'birthDate must use the YYYY-MM-DD format',
  })
  birthDate?: string;
}
