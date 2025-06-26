import { Test, TestingModule } from '@nestjs/testing';
import { DatosMascotaController } from './datos_mascota.controller';
import { DatosMascotaService } from './datos_mascota.service';

describe('DatosMascotaController', () => {
  let controller: DatosMascotaController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DatosMascotaController],
      providers: [DatosMascotaService],
    }).compile();

    controller = module.get<DatosMascotaController>(DatosMascotaController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
