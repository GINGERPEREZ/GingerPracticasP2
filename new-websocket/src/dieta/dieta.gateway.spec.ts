import { Test, TestingModule } from '@nestjs/testing';
import { DietaGateway } from './dieta.gateway';
import { DietaService } from './dieta.service';

describe('DietaGateway', () => {
  let gateway: DietaGateway;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DietaGateway, DietaService],
    }).compile();

    gateway = module.get<DietaGateway>(DietaGateway);
  });

  it('should be defined', () => {
    expect(gateway).toBeDefined();
  });
});
