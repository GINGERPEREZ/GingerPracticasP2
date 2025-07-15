import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DietaModule } from './dieta/dieta.module';
import { HistorialMedicoModule } from './historial_medico/historial_medico.module';
import { DatosMascotaModule } from './datos_mascota/datos_mascota.module';
import { TypeOrmModule } from '@nestjs/typeorm';
// Importa TypeOrmModule para la conexión a la base de datos

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'db.sqlite',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true,
      logging: true,
    }),
    DietaModule,
    HistorialMedicoModule,
    DatosMascotaModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}