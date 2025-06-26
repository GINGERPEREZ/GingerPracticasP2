import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DatosMascotaModule } from './datos_mascota/datos_mascota.module';
import { HistorialMedicoModule } from './historial_medico/historial_medico.module';
import { DietaModule } from './dieta/dieta.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'db.sqlite',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true, // Solo para desarrollo
    }),
    DatosMascotaModule,
    HistorialMedicoModule,
    DietaModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
