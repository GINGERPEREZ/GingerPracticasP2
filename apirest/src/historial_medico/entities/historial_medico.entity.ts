import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { DatosMascota } from '../../datos_mascota/entities/datos_mascota.entity';
  
  @Entity('historial_medico')
  export class HistorialMedico {
    @PrimaryGeneratedColumn()
    id: number;
  
    @ManyToOne(() => DatosMascota, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'mascota_id' })
    mascota: DatosMascota;
  
    @Column({ type: 'text' })
    diagnosticos: string;
  
    @Column({ type: 'text' })
    tratamientos: string;
  
    @Column({ type: 'date' })
    fecha_registro: Date;
  
    @Column({ type: 'varchar', length: 100 })
    veterinario: string;
  }
  