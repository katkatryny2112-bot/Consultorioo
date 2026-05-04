import { Specialist } from './entities/specialist.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Test, TestingModule } from '@nestjs/testing';
import { SpecialistsService } from './specialists.service';

describe('SpecialistsService', () => {
  let service: SpecialistsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [, { provide: getRepositoryToken(Specialist), useValue: {} }],
    }).compile();

    service = module.get<SpecialistsService>(SpecialistsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
