import { AppointmentsService } from './appointments.service';
import { Test, TestingModule } from '@nestjs/testing';
import { AppointmentsController } from './appointments.controller';

describe('AppointmentsController', () => {
  let controller: AppointmentsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [],
      providers: [{ provide: AppointmentsService, useValue: {} }],
    }).compile();

    controller = module.get<AppointmentsController>(AppointmentsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
