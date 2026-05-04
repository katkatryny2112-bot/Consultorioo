import { AppointmentsService } from './appointments.service';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';
export declare class AppointmentsController {
    private readonly appointmentsService;
    constructor(appointmentsService: AppointmentsService);
    create(createAppointmentDto: CreateAppointmentDto): Promise<import("./entities/appointment.entity").Appointment>;
    findAll(): Promise<import("./entities/appointment.entity").Appointment[]>;
    findOne(id: string): Promise<import("./entities/appointment.entity").Appointment>;
    update(id: string, updateAppointmentDto: UpdateAppointmentDto): Promise<import("./entities/appointment.entity").Appointment>;
    remove(id: string): Promise<void>;
}
