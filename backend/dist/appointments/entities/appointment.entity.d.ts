import { Patient } from '../../patients/entities/patient.entity';
import { Specialist } from '../../specialists/entities/specialist.entity';
export declare class Appointment {
    id: number;
    patient: Patient;
    specialist: Specialist;
    appointmentDate: Date;
    status: string;
    notes: string;
    createdAt: Date;
    updatedAt: Date;
}
