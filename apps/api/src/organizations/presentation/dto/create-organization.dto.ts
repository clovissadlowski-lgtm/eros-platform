import {
  IsNotEmpty,
  IsString,
  Length,
} from 'class-validator';

export class CreateOrganizationDto {
  @IsString()
  @IsNotEmpty()
  @Length(2, 150)
  name!: string;

  @IsString()
  @IsNotEmpty()
  @Length(2, 80)
  slug!: string;
}
