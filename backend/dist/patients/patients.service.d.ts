import { Repository } from 'typeorm';
import { Patient } from './entities/patient.entity';
import { CreatePatientDto } from './dto/create-patient.dto';
import { UpdatePatientDto } from './dto/update-patient.dto';
export declare class PatientsService {
    private patientsRepository;
    constructor(patientsRepository: Repository<Patient>);
    create(createPatientDto: CreatePatientDto): Promise<Patient>;
    findAll(): Promise<Patient[]>;
    findOne(id: number): Promise<Patient>;
    update(id: number, updatePatientDto: UpdatePatientDto): Promise<Patient>;
    remove(id: number): Promise<void>;
}
