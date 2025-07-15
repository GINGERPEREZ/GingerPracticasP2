import { PartialType } from '@nestjs/mapped-types'; // Import PartialType
import { CreateDietaDto } from './create-dieta.dto';
import { IsNotEmpty, IsInt } from 'class-validator';

// PartialType makes all properties of CreateDietaDto optional
export class UpdateDietaDto extends PartialType(CreateDietaDto) {
  // The ID of the diet is mandatory to know which one to update
  @IsInt()
  @IsNotEmpty()
  id: number;
}
