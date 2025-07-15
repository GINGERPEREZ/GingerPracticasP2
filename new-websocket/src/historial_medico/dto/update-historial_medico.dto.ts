import { PartialType } from '@nestjs/mapped-types'; // Import PartialType
import { CreateHistorialMedicoDto } from './create-historial_medico.dto';
import { IsNotEmpty, IsInt } from 'class-validator';

// PartialType makes all properties of CreateHistorialMedicoDto optional
export class UpdateHistorialMedicoDto extends PartialType(CreateHistorialMedicoDto) {
  // The ID of the medical record is mandatory to know which one to update
  @IsInt()
  @IsNotEmpty()
  id: number;
}