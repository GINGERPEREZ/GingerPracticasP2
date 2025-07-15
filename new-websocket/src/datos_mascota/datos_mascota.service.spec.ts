import { Test, TestingModule } from '@nestjs/testing';
import { DatosMascotaService } from './datos_mascota.service';

describe('DatosMascotaService', () => {
  let service: DatosMascotaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DatosMascotaService],
    }).compile();

    service = module.get<DatosMascotaService>(DatosMascotaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
