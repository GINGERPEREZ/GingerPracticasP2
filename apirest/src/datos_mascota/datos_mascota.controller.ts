import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { DatosMascotaService } from './datos_mascota.service';
import { CreateDatosMascotaDto } from './dto/create-datos_mascota.dto';
import { UpdateDatosMascotaDto } from './dto/update-datos_mascota.dto';

@Controller('datos-mascota')
export class DatosMascotaController {
  constructor(private readonly datosMascotaService: DatosMascotaService) {}

  @Post()
  create(@Body() createDatosMascotaDto: CreateDatosMascotaDto) {
    return this.datosMascotaService.create(createDatosMascotaDto);
  }

  @Get()
  findAll() {
    return this.datosMascotaService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.datosMascotaService.findOne(+id);
  }

  @Patch()
  update(@Body() updateDatosMascotaDto: UpdateDatosMascotaDto) {
    return this.datosMascotaService.update(updateDatosMascotaDto.id, updateDatosMascotaDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.datosMascotaService.remove(+id);
  }
}
