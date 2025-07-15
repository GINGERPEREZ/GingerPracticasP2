import { IsNotEmpty, IsString, IsInt, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateDietaDto {
  // The ID of the pet to which the diet is associated
  @IsInt()
  @IsNotEmpty()
  mascotaId: number;

  @IsString()
  @IsNotEmpty()
  tipo_alimento: string;

  @IsString()
  @IsNotEmpty()
  cantidad_diaria: string;

  @IsString()
  @IsNotEmpty()
  horario_comidas: string;

  @IsString()
  @IsNotEmpty()
  restricciones: string;
}
