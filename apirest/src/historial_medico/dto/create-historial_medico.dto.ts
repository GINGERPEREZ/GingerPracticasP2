import { IsString, IsDateString, IsInt } from 'class-validator';

export class CreateHistorialMedicoDto {
  @IsInt()
  mascota_id: number;

  @IsString()
  diagnosticos: string;

  @IsString()
  tratamientos: string;

  @IsDateString()
  fecha_registro: Date;

  @IsString()
  veterinario: string;
}
