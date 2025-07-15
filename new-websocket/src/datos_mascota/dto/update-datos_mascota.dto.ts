import { PartialType } from '@nestjs/mapped-types'; // Import PartialType
import { CreateDatosMascotaDto } from './create-datos_mascota.dto';
import { IsNotEmpty, IsInt } from 'class-validator';

// PartialType makes all properties of CreateDatosMascotaDto optional
export class UpdateDatosMascotaDto extends PartialType(CreateDatosMascotaDto) {
  // The ID of the pet is mandatory to know which one to update
  @IsInt()
  @IsNotEmpty()
  id: number;
}
