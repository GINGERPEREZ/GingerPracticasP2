import { Test, TestingModule } from '@nestjs/testing';
import { HistorialMedicoGateway } from './historial_medico.gateway';
import { HistorialMedicoService } from './historial_medico.service';

describe('HistorialMedicoGateway', () => {
  let gateway: HistorialMedicoGateway;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [HistorialMedicoGateway, HistorialMedicoService],
    }).compile();

    gateway = module.get<HistorialMedicoGateway>(HistorialMedicoGateway);
  });

  it('should be defined', () => {
    expect(gateway).toBeDefined();
  });
});
