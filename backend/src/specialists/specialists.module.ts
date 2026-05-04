import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SpecialistsService } from './specialists.service';
import { SpecialistsController } from './specialists.controller';
import { Specialist } from './entities/specialist.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Specialist])],
  controllers: [SpecialistsController],
  providers: [SpecialistsService],
  exports: [SpecialistsService]
})
export class SpecialistsModule {}
