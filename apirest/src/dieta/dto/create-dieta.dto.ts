import { IsInt, IsString } from 'class-validator';

export class CreateDietaDto {
  @IsInt()
  mascota_id: number;

  @IsString()
  tipo_alimento: string;

  @IsString()
  cantidad_diaria: string;

  @IsString()
  horario_comidas: string;

  @IsString()
  restricciones: string;
}
