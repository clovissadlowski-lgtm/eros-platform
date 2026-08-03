import { IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SelectOrganizationDto {
  @ApiProperty({
    description:
      'Identificador UUID da organização que o usuário deseja acessar.',
    example:
      '7181fc2f-7a27-462e-aa75-16565a036509',
    format: 'uuid',
  })
  @IsUUID()
  organizationId!: string;
}