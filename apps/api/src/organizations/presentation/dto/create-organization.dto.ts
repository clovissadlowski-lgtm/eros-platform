import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  Length,
} from 'class-validator';

export class CreateOrganizationDto {
  @ApiProperty({
    description:
      'Nome público da organização ou clínica.',
    example: 'Clínica Higeia',
    minLength: 2,
    maxLength: 150,
  })
  @IsString()
  @IsNotEmpty()
  @Length(2, 150)
  name!: string;

  @ApiProperty({
    description:
      'Identificador amigável usado em URLs. O serviço normaliza letras maiúsculas, acentos, espaços e caracteres especiais.',
    example: 'clinica-higeia',
    minLength: 2,
    maxLength: 80,
  })
  @IsString()
  @IsNotEmpty()
  @Length(2, 80)
  slug!: string;
}