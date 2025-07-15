import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { DatosMascota } from '../../datos_mascota/entities/datos_mascota.entity'; // Asegúrate de que esta ruta sea correcta

@Entity('dieta')
export class Dieta {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => DatosMascota, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'mascota_id' })
  mascota: DatosMascota;

  @Column({ type: 'varchar', length: 100 })
  tipo_alimento: string;

  @Column({ type: 'varchar', length: 100 })
  cantidad_diaria: string;

  @Column({ type: 'varchar', length: 100 })
  horario_comidas: string;

  @Column({ type: 'text' })
  restricciones: string;
}