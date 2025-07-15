import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HistorialMedicoService } from './historial_medico.service';
import { HistorialMedicoGateway } from './historial_medico.gateway'; // Importa el Gateway
import { HistorialMedico } from './entities/historial_medico.entity';
import { DatosMascota } from '../datos_mascota/entities/datos_mascota.entity'; // Necesario porque HistorialMedicoService usa DatosMascota

@Module({
  imports: [
    // Registra las entidades que este módulo va a manejar con TypeORM
    TypeOrmModule.forFeature([HistorialMedico, DatosMascota]),
  ],
  providers: [HistorialMedicoService, HistorialMedicoGateway], // Provee el servicio y el Gateway
  exports: [HistorialMedicoService], // Opcional: exporta el servicio si otros módulos necesitan inyectarlo
})
export class HistorialMedicoModule {}
