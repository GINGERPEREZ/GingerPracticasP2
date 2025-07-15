import { IsNotEmpty, IsString, IsInt, IsDate } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateHistorialMedicoDto {
  // The ID of the pet to which the medical history is associated
  @IsInt()
  @IsNotEmpty()
  mascotaId: number;

  @IsString()
  @IsNotEmpty()
  diagnosticos: string;

  @IsString()
  @IsNotEmpty()
  tratamientos: string;

  @IsDate()
  @IsNotEmpty()
  @Type(() => Date) // Important for transforming date strings to Date objects
  fecha_registro: Date;

  @IsString()
  @IsNotEmpty()
  veterinario: string;
}
