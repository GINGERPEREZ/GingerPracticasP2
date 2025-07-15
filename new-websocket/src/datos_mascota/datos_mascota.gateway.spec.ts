import { Test, TestingModule } from '@nestjs/testing';
import { DatosMascotaGateway } from './datos_mascota.gateway';
import { DatosMascotaService } from './datos_mascota.service';

describe('DatosMascotaGateway', () => {
  let gateway: DatosMascotaGateway;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DatosMascotaGateway, DatosMascotaService],
    }).compile();

    gateway = module.get<DatosMascotaGateway>(DatosMascotaGateway);
  });

  it('should be defined', () => {
    expect(gateway).toBeDefined();
  });
});
