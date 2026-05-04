import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Specialist } from './entities/specialist.entity';
import { CreateSpecialistDto } from './dto/create-specialist.dto';
import { UpdateSpecialistDto } from './dto/update-specialist.dto';

@Injectable()
export class SpecialistsService {
  constructor(
    @InjectRepository(Specialist)
    private specialistsRepository: Repository<Specialist>,
  ) {}

  async create(createSpecialistDto: CreateSpecialistDto): Promise<Specialist> {
    const specialist = this.specialistsRepository.create(createSpecialistDto);
    return this.specialistsRepository.save(specialist);
  }

  async findAll(): Promise<Specialist[]> {
    return this.specialistsRepository.find();
  }

  async findOne(id: number): Promise<Specialist> {
    const specialist = await this.specialistsRepository.findOne({ where: { id } });
    if (!specialist) {
      throw new NotFoundException(`Specialist #${id} not found`);
    }
    return specialist;
  }

  async update(id: number, updateSpecialistDto: UpdateSpecialistDto): Promise<Specialist> {
    const specialist = await this.findOne(id);
    Object.assign(specialist, updateSpecialistDto);
    return this.specialistsRepository.save(specialist);
  }

  async remove(id: number): Promise<void> {
    const specialist = await this.findOne(id);
    await this.specialistsRepository.remove(specialist);
  }
}
