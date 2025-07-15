import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DietaService } from './dieta.service';
import { DietaGateway } from './dieta.gateway'; // Importa el Gateway
import { Dieta } from './entities/dieta.entity';
import { DatosMascota } from '../datos_mascota/entities/datos_mascota.entity'; // Necesario porque DietaService usa DatosMascota

@Module({
  imports: [
    // Registra las entidades que este módulo va a manejar con TypeORM
    TypeOrmModule.forFeature([Dieta, DatosMascota]),
  ],
  providers: [DietaService, DietaGateway], // Provee el servicio y el Gateway
  exports: [DietaService], // Opcional: exporta el servicio si otros módulos necesitan inyectarlo
})
export class DietaModule {}