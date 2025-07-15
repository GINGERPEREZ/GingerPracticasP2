import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DatosMascotaService } from './datos_mascota.service';
import { DatosMascotaGateway } from './datos_mascota.gateway'; // Importa el Gateway
import { DatosMascota } from './entities/datos_mascota.entity';
import { HistorialMedico } from '../historial_medico/entities/historial_medico.entity'; // Necesario para la relación inversa
import { Dieta } from '../dieta/entities/dieta.entity'; // Necesario para la relación inversa

@Module({
  imports: [
    // Registra las entidades que este módulo va a manejar con TypeORM
    // Incluye HistorialMedico y Dieta porque DatosMascotaService las carga en sus relaciones
    TypeOrmModule.forFeature([DatosMascota, HistorialMedico, Dieta]),
  ],
  providers: [DatosMascotaService, DatosMascotaGateway], // Provee el servicio y el Gateway
  exports: [DatosMascotaService], // Opcional: exporta el servicio si otros módulos necesitan inyectarlo
})
export class DatosMascotaModule {}