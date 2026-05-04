import { Repository } from 'typeorm';
import { Specialist } from './entities/specialist.entity';
import { CreateSpecialistDto } from './dto/create-specialist.dto';
import { UpdateSpecialistDto } from './dto/update-specialist.dto';
export declare class SpecialistsService {
    private specialistsRepository;
    constructor(specialistsRepository: Repository<Specialist>);
    create(createSpecialistDto: CreateSpecialistDto): Promise<Specialist>;
    findAll(): Promise<Specialist[]>;
    findOne(id: number): Promise<Specialist>;
    update(id: number, updateSpecialistDto: UpdateSpecialistDto): Promise<Specialist>;
    remove(id: number): Promise<void>;
}
