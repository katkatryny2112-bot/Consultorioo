import { SpecialistsService } from './specialists.service';
import { CreateSpecialistDto } from './dto/create-specialist.dto';
import { UpdateSpecialistDto } from './dto/update-specialist.dto';
export declare class SpecialistsController {
    private readonly specialistsService;
    constructor(specialistsService: SpecialistsService);
    create(createSpecialistDto: CreateSpecialistDto): Promise<import("./entities/specialist.entity").Specialist>;
    findAll(): Promise<import("./entities/specialist.entity").Specialist[]>;
    findOne(id: string): Promise<import("./entities/specialist.entity").Specialist>;
    update(id: string, updateSpecialistDto: UpdateSpecialistDto): Promise<import("./entities/specialist.entity").Specialist>;
    remove(id: string): Promise<void>;
}
