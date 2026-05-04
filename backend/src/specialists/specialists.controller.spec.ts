import { SpecialistsService } from './specialists.service';
import { Test, TestingModule } from '@nestjs/testing';
import { SpecialistsController } from './specialists.controller';

describe('SpecialistsController', () => {
  let controller: SpecialistsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [],
      providers: [{ provide: SpecialistsService, useValue: {} }],
    }).compile();

    controller = module.get<SpecialistsController>(SpecialistsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
