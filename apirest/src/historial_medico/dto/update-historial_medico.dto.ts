import { PartialType } from '@nestjs/mapped-types';
import { CreateHistorialMedicoDto } from './create-historial_medico.dto';
import { IsInt } from 'class-validator';

export class UpdateHistorialMedicoDto extends PartialType(CreateHistorialMedicoDto) {
  @IsInt()
  id: number;
}
