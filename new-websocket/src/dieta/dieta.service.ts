import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Dieta } from './entities/dieta.entity';
import { CreateDietaDto } from './dto/create-dieta.dto'; // Usamos el DTO de WebSockets
import { UpdateDietaDto } from './dto/update-dieta.dto'; // Usamos el DTO de WebSockets
import { DatosMascota } from '../datos_mascota/entities/datos_mascota.entity'; // Importa la entidad DatosMascota

@Injectable()
export class DietaService {
  constructor(
    @InjectRepository(Dieta)
    private readonly dietaRepository: Repository<Dieta>,
    @InjectRepository(DatosMascota) // Inyectamos el repositorio de DatosMascota para manejar la relación
    private readonly datosMascotaRepository: Repository<DatosMascota>,
  ) {}

  /**
   * Crea un nuevo registro de dieta.
   * @param createDietaDto Los datos para crear la dieta.
   * @returns La dieta creada.
   */
  async create(createDietaDto: CreateDietaDto): Promise<Dieta> {
    const { mascotaId, ...rest } = createDietaDto;

    // Verificar si la mascota existe usando findOneBy
    const mascota = await this.datosMascotaRepository.findOneBy({ id: mascotaId });
    if (!mascota) {
      throw new NotFoundException(`Mascota con ID ${mascotaId} no encontrada.`);
    }

    const newDieta = this.dietaRepository.create({
      ...rest,
      mascota: mascota, // Asignamos el objeto mascota completo
    });

    return this.dietaRepository.save(newDieta);
  }

  /**
   * Encuentra todas las dietas.
   * @returns Un arreglo de dietas.
   */
  async findAll(): Promise<Dieta[]> {
    return this.dietaRepository.find({ relations: ['mascota'] }); // Carga la relación 'mascota'
  }

  /**
   * Encuentra una dieta por su ID.
   * @param id El ID de la dieta.
   * @returns La dieta encontrada.
   * @throws NotFoundException si la dieta no existe.
   */
  async findOne(id: number): Promise<Dieta> {
    const dieta = await this.dietaRepository.findOne({
      where: { id },
      relations: ['mascota'], // Carga la relación 'mascota'
    });
    if (!dieta) {
      throw new NotFoundException(`Dieta con ID ${id} no encontrada.`);
    }
    return dieta;
  }

  /**
   * Actualiza un registro de dieta existente.
   * @param updateDietaDto Los datos para actualizar la dieta, incluyendo su ID.
   * @returns La dieta actualizada.
   * @throws NotFoundException si la dieta no existe.
   */
  async update(updateDietaDto: UpdateDietaDto): Promise<Dieta> {
    const { id, mascotaId, ...rest } = updateDietaDto;

    const dieta = await this.dietaRepository.preload({
      id: id,
      ...rest,
    });

    if (!dieta) {
      throw new NotFoundException(`Dieta con ID ${id} no encontrada.`);
    }

    // Si se proporciona un nuevo mascotaId, buscar y asignar la nueva mascota
    if (mascotaId) {
      const newMascota = await this.datosMascotaRepository.findOneBy({ id: mascotaId }); // Usamos findOneBy
      if (!newMascota) {
        throw new NotFoundException(`Nueva mascota con ID ${mascotaId} no encontrada.`);
      }
      dieta.mascota = newMascota;
    }

    return this.dietaRepository.save(dieta);
  }

  /**
   * Elimina un registro de dieta por su ID.
   * @param id El ID de la dieta a eliminar.
   * @returns Verdadero si se eliminó exitosamente.
   * @throws NotFoundException si la dieta no existe.
   */
  async remove(id: number): Promise<boolean> {
    const result = await this.dietaRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Dieta con ID ${id} no encontrada.`);
    }
    return true;
  }
}
