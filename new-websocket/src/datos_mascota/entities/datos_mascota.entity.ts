import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { HistorialMedico } from '../../historial_medico/entities/historial_medico.entity';
import { Dieta } from '../../dieta/entities/dieta.entity'; // Importa Dieta si la relación inversa se define aquí

@Entity('datos_mascota')
export class DatosMascota {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 100 })
  nombre: string;

  @Column({ type: 'varchar', length: 50 })
  especie: string;

  @Column({ type: 'varchar', length: 50 })
  raza: string;

  @Column({ type: 'int' })
  edad: number;

  @Column({ type: 'varchar', length: 10 })
  sexo: string;

  @Column({ type: 'varchar', length: 50 })
  color: string;

  @Column({ type: 'date' })
  fecha_ingreso: Date;

  @OneToMany(() => HistorialMedico, historial => historial.mascota)
  historiales: HistorialMedico[];

  @OneToMany(() => Dieta, dieta => dieta.mascota) // Si quieres la relación inversa en DatosMascota
  dietas: Dieta[];
}